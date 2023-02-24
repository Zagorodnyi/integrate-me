import { Integration } from './Integration';

export const createModuleIntegration = (
  name: string,
  callback: () => Promise<void>
) => {
  return new Integration(name, callback);
};
