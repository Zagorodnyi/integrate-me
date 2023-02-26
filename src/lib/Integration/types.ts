export enum IntegrationStatus {
  OK = 'OK',
  ERROR = 'ERROR',
  RETRY = 'RETRY',
  LOADING = 'LOADING',
}

export interface IntegrationError {
  integrationName: string;
  error: string;
  status: IntegrationStatus.ERROR;
  errObj?: Error;
}

export interface IntegrationSuccess {
  integrationName: string;
  status: IntegrationStatus.OK;
}

export interface IntegrationRetry {
  integrationName: string;
  status: IntegrationStatus.RETRY;
  attempt: number;
}

export type IntegrationCheckResult = IntegrationSuccess | IntegrationError;

export const integrationTypes = ['url', 'module', 'none'] as const;

export type IntegrationType = (typeof integrationTypes)[number];

export type IntegrationState =
  | IntegrationError
  | IntegrationRetry
  | IntegrationSuccess
  | { status: IntegrationStatus.LOADING };
