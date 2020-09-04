/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export class CircuitExecutionError extends Error {
  public readonly error?: any;

  constructor(message: string, error?: any) {
    super(message);
    this.error = error;
  }
}

export const isCircuitExecutionError = (
  error: any
): error is CircuitExecutionError => {
  return error instanceof CircuitExecutionError;
};
