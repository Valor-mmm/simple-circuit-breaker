/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CircuitExecutionError } from "./circuitExecutionError";

export class CircuitOpenedError extends CircuitExecutionError {
  constructor(message: string) {
    super(message);
  }
}

export const isCircuitOpenedError = (
  error: any
): error is CircuitOpenedError => {
  return error instanceof CircuitOpenedError;
};
