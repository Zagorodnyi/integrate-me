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
  private state: IntegrationState = {
    status: IntegrationStatus.LOADING,
  };

  constructor(name: string, callback: () => Promise<void>) {
    this.name = name;
    this.callback = callback;
  }

  private setState(state: IntegrationState) {
    this.state = state;
    this.onStateChangeCb(state);
  }

  onStateChange(callback: (state: IntegrationState) => void) {
    this.onStateChangeCb = callback;
  }

  async check(retryCount: number = 1): Promise<IntegrationCheckResult> {
    const onNextAttempt = (attempt: number, error: any = {}) => {
      this.setState({
        status: IntegrationStatus.RETRY,
        integrationName: this.name,
        lastError: error?.message || JSON.stringify(error),
        attempt: attempt,
      });
    };

    try {
      await retry(async () => this.callback(), retryCount, onNextAttempt);

      this.setState({ status: IntegrationStatus.OK, integrationName: this.name });
    } catch (err: any) {
      this.setState({
        integrationName: this.name,
        status: IntegrationStatus.ERROR,
        error: err?.messate || 'Integration failed',
        errObj: err,
      });
    }

    return this.state as IntegrationCheckResult;
  }
}
