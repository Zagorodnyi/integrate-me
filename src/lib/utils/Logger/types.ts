import { IntegrationState } from '../../Integration';

export type StatusesMap = Record<string, IntegrationState>;

export type ConsoleStream = NodeJS.Process['stdout'] | NodeJS.Process['stderr'];
