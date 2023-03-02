# Integrate Me
[![ci Status](https://github.com/Zagorodnyi/integrate-me/workflows/Test%20&%20Build/badge.svg)](https://github.com/Zagorodnyi/integrate-me/actions?query=workflow%3A%22Test+Build%22+branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/Zagorodnyi/integrate-me/badge.svg?branch=main)](https://coveralls.io/github/Zagorodnyi/integrate-me?branch=main)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Zagorodnyi/integrate-me/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/integrate-me.svg)](https://www.npmjs.com/package/integrate-me)

Simple integration checker for your API services and external modules when it is crucial for your app.


## Install

``` bash
npm i integrate-me
```

## Usage
Package provides a simple builder with methods that take integration name and a async callback.
If callback throws then an integration would be considered as failed. Otherwise it is OK.

It designed to use at application start by simply awaiting `integrateMeChecker.check()` to check all services availability before all application logic.

``` typescript
import { IntegrationCheckBuilder } from 'integrate-me';

const config = {
  retry: 4,            // Retry attemts before failing the check
  throwOnError: false, // default true
};

const integrateMeChecker = new IntegrationCheckBuilder(config)
  .addModuleIntegration('DatabaseConnection', async () => {
    await prisma.$connect(); 
  })
  .addModuleIntegration('myOtherModule', async () => {
    if (1 === 1) {
      Promise.resolve();
    }
  });


const res: IntegrationCheckResult = await integrateMeChecker.check();

```

If `{ throwOnError: false }` integrateMeChecker will not throw an error if some of the integrations were not successful. The `IntegrationCheckResult` will be returned instead for manual handling.

``` ts
interface IntegrationError {
  integrationName: string;
  error: string;
  status: IntegrationStatus.ERROR;
  errObj?: Error;
}

interface IntegrationSuccess {
  integrationName: string;
  status: IntegrationStatus.OK;
}

type IntegrationCheckResult = IntegrationSuccess | IntegrationError;
```