export class CircuitExecutionError extends Error {
  public readonly error: any;

  constructor(message: string, error: any) {
    super(message);
    this.error = error;
  }
}

export const isCircuitExecutionError = (
  error: any
): error is CircuitExecutionError => {
  return error instanceof CircuitExecutionError;
};
