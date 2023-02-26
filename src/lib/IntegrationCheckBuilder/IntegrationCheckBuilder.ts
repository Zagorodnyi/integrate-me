import { Integration, IntegrationCheckResult } from '../Integration';
import { StatusLogger } from 'utils';

const logger = new StatusLogger();

interface IntegrationBuilderConfig {
  retry?: number;
  throwOnError?: boolean;
}

export class IntegrationCheckBuilder {
  constructor(config?: IntegrationBuilderConfig) {
    this.config = {
      throwOnError: true,
      ...config,
    };
  }

  private config?: IntegrationBuilderConfig;
  private integrations: Array<Integration> = [];

  addModuleIntegration = (name: string, integrationFn: () => Promise<void>) => {
    const integration = new Integration(name, integrationFn);

    this.integrations.push(integration);

    logger.registerIntegration(integration.name);

    integration.onStateChange((state) => {
      logger.updateState(integration.name, state);

      if (this.config?.throwOnError && state.status === 'ERROR') {
        throw state.errObj || new Error(state.error);
      }
    });

    return this;
  };

  async check(): Promise<IntegrationCheckResult[]> {
    logger.start();

    const results = await Promise.all(
      this.integrations.map((i) => i.check(this.config?.retry))
    );

    return results;
  }
}
