export class CircuitExecutionError extends Error {
  private readonly error: any;

  constructor(message: string, error: any) {
    super(message);
    this.error = error;
  }
}
