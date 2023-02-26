import { Integration } from './Integration';

export const createModuleIntegration = (
  name: string,
  integrationFn: () => Promise<void>
) => {
  return new Integration(name, integrationFn);
};
