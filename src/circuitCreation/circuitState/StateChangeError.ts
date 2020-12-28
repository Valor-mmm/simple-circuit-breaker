import { CircuitState } from './circuitState';

export class StateChangeError extends Error {
  public readonly previousState: CircuitState;
  public readonly nextState: CircuitState;

  constructor(
    previousState: CircuitState,
    nextState: CircuitState,
    message?: string
  ) {
    super(message);

    this.previousState = previousState;
    this.nextState = nextState;
  }
}
