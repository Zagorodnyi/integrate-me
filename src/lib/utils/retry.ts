export const retry = async (
  fn: any,
  attemts: number,
  onNextAttempt: (attempt: number) => void
) => {
  let error: any;

  for (let i = 0; i < attemts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      onNextAttempt(i + 1);
      error = err;
    }
  }

  throw error;
};
