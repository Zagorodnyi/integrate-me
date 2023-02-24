import { Integration, IntegrationCheckResult } from '../Integrations';
import { StatusLogger } from 'utils';

const logger = new StatusLogger();

interface IntegrationBuilderConfig {
  retry?: number;
  throwOnError?: boolean;
}

export class IntegrationBuilder {
  constructor(config?: IntegrationBuilderConfig) {
    this.config = config;
  }

  private config?: IntegrationBuilderConfig;
  private integrations: Array<Integration> = [];

  next<T extends Integration>(integration: T) {
    this.integrations.push(integration);

    logger.registerIntegration(integration.name);

    integration.onStateChange((state) => {
      logger.updateState(integration.name, state);

      if (this.config?.throwOnError && state.status === 'ERROR') {
        throw new Error(state.error);
      }
    });

    return this;
  }

  async check(): Promise<IntegrationCheckResult[]> {
    logger.start();

    const results = await Promise.all(
      this.integrations.map((i) => i.check(this.config?.retry))
    );

    return results;
  }
}
