/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CircuitExecutionError } from "./circuitExecutionError";

export class OperationExecutionError extends CircuitExecutionError {
  constructor(message: string, error: any) {
    super(message, error);
  }
}

export const isOperationExecutionError = (
  error: any
): error is OperationExecutionError => {
  return error instanceof OperationExecutionError;
};
