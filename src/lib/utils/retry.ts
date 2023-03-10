import { delay } from './delay';

export const retry = async (
  fn: any,
  attemts: number,
  onNextAttempt: (attempt: number, err?: any) => void
) => {
  let error: any;

  for (let i = 0; i < attemts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      onNextAttempt(i + 1, err);
      error = err;
    }

    await delay(1500);
  }

  throw error;
};
