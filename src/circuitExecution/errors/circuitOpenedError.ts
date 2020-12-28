/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CircuitExecutionError } from './circuitExecutionError';
import { Circuit } from '../../circuitCreation/circuit';
import { anyArray } from '../../globalTypes';
import { CircuitState } from '../../circuitCreation/circuitState/circuitState';

export class CircuitOpenedError<
  P extends anyArray,
  R
> extends CircuitExecutionError {
  private readonly circuit: Circuit<P, R>;
  public readonly currentCircuitState: CircuitState;
  public readonly failureThreshold: number;
  public readonly failureCount: number;

  constructor(circuit: Circuit<P, R>, message?: string) {
    super(
      message
        ? message
        : `CircuitOpenedError: Circuit is in state "${circuit.getState()}". Underlying operation wont be executed.`
    );
    this.circuit = circuit;
    this.currentCircuitState = circuit.getState();
    this.failureCount = circuit.executionCounters.failureCounter.getValue();
    this.failureThreshold = circuit.getConfig().failureThreshold;
  }
}

export const isCircuitOpenedError = <P extends anyArray, R>(
  error: any
): error is CircuitOpenedError<P, R> => {
  return error instanceof CircuitOpenedError;
};
