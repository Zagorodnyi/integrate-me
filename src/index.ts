import { IntegrationBuilder, createModuleIntegration } from './lib';

const integrations = new IntegrationBuilder({ retry: 4 })
  .next(
    createModuleIntegration('Google', async () => {
      await new Promise((resolve) => setTimeout(resolve, 8000));
    })
  )
  .next(
    createModuleIntegration('Redis', async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    })
  )
  .next(
    createModuleIntegration('Database', async () => {
      await new Promise((_, reject) =>
        setTimeout(() => reject('Something here'), 1000)
      );
    })
  );

const start = async () => {
  await integrations.check();

  // console.table(res);
};

start();
