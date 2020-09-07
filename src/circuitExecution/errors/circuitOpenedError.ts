/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CircuitExecutionError } from './circuitExecutionError';
import { Circuit } from '../../circuitCreation/circuit';
import { anyArray } from '../../globalTypes';
import { CircuitState } from '../../circuitCreation/circuitState';

export class CircuitOpenedError<
  P extends anyArray,
  R
> extends CircuitExecutionError {
  private readonly circuit: Circuit<P, R>;
  public readonly currentCircuitState: CircuitState;

  constructor(message: string, circuit: Circuit<P, R>) {
    super(message);
    this.circuit = circuit;
    this.currentCircuitState = circuit.getState();
  }

  public toString() {
    return `CircuitOpenedError: Circuit is in state "${this.currentCircuitState}". Underlying promise wont be executed.`;
  }
}

export const isCircuitOpenedError = <P extends anyArray, R>(
  error: any
): error is CircuitOpenedError<P, R> => {
  return error instanceof CircuitOpenedError;
};
