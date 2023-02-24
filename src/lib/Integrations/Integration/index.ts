import { retry } from 'utils';
import {
  IntegrationCheckResult,
  IntegrationState,
  IntegrationStatus,
} from './types';

export * from './types';

export class Integration {
  private callback: () => Promise<void>;
  private onStateChangeCb: (state: IntegrationState) => void = () => {};
  name: string;
  private integrationState: IntegrationState = {
    status: IntegrationStatus.LOADING,
  };

  constructor(name: string, callback: () => Promise<void>) {
    this.name = name;
    this.callback = callback;
  }

  set state(state: IntegrationState) {
    this.integrationState = state;
    this.onStateChangeCb(state);
  }

  get state(): IntegrationState {
    return this.integrationState;
  }

  onStateChange(callback: (state: IntegrationState) => void) {
    this.onStateChangeCb = callback;
  }

  async check(retryCount: number = 1): Promise<IntegrationCheckResult> {
    const onNextAttempt = (attempt: number) => {
      this.state = {
        status: IntegrationStatus.RETRY,
        integrationName: this.name,
        attempt: attempt,
      };
    };

    try {
      await retry(async () => this.callback(), retryCount, onNextAttempt);

      this.state = { status: IntegrationStatus.OK, integrationName: this.name };
    } catch (err: any) {
      this.state = {
        integrationName: this.name,
        status: IntegrationStatus.ERROR,
        error: err?.messate || 'Integration failed',
        errObj: err,
      };
    }

    return this.state;
  }
}
