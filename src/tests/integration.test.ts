import {
  IntegrationError,
  IntegrationStatus,
  IntegrationSuccess,
  IntegrationCheckBuilder,
} from '../lib';

jest.useFakeTimers();

jest.mock('../lib/utils/delay', () => ({
  delay: jest.fn(() => Promise.resolve()),
}));

describe('Test IntegrationCheckBuilder', () => {
  it('Builder should exist', () => {
    const builder = new IntegrationCheckBuilder();
    expect(builder).toBeDefined();
  });

  it('Check success result of module integration', async () => {
    const integrationFn = jest.fn(() => Promise.resolve());
    const res = await new IntegrationCheckBuilder({ throwOnError: false })
      .addModuleIntegration('successfulIntegration', integrationFn)
      .check();

    expect(integrationFn).toHaveBeenCalledTimes(1);
    expect(res).toEqual<Array<IntegrationSuccess>>([
      {
        integrationName: 'successfulIntegration',
        status: IntegrationStatus.OK,
      },
    ]);
  });

  it('Check error result of module integration', async () => {
    const rejectionError = new Error('error');
    const integrationFn = jest.fn(() => Promise.reject(rejectionError));

    const res = await new IntegrationCheckBuilder({ throwOnError: false })
      .addModuleIntegration('errorIntegration', integrationFn)
      .check();

    expect(integrationFn).toHaveBeenCalledTimes(1);
    expect(res).toEqual<Array<IntegrationError>>([
      {
        integrationName: 'errorIntegration',
        error: 'Integration failed',
        errObj: rejectionError,
        status: IntegrationStatus.ERROR,
      },
    ]);
  });

  it('Expect to throw an exeption if not { throwOnError: false }', async () => {
    const rejectionError = new Error('Error thrown by test');
    const integrationFn = jest.fn(() => Promise.reject(rejectionError));

    const checkFn = async () =>
      new IntegrationCheckBuilder()
        .addModuleIntegration('throwOnError', integrationFn)
        .check();

    await expect(checkFn).rejects.toThrowError(rejectionError);
    expect(integrationFn).toHaveBeenCalledTimes(1);
  });

  it('Expect to call integration function multiple times if retry is specified', async () => {
    const rejectionError = new Error('error');
    const integrationFn = jest.fn(() => Promise.reject(rejectionError));

    const res = await new IntegrationCheckBuilder({
      retry: 5,
      throwOnError: false,
    })
      .addModuleIntegration('RetryWithError', integrationFn)
      .check();

    expect(res).toEqual<Array<IntegrationError>>([
      {
        integrationName: 'RetryWithError',
        error: 'Integration failed',
        errObj: rejectionError,
        status: IntegrationStatus.ERROR,
      },
    ]);
    expect(integrationFn).toHaveBeenCalledTimes(5);
  });
});
