import { Circuit } from '../circuitCreation/circuit';
import { CircuitExecutionError } from './errors/circuitExecutionError';
import { CircuitState } from '../circuitCreation/circuitState';
import { anyArray } from '../globalTypes';
import { OperationExecutionError } from './errors/operationExecutionError';

export interface ExecutionResult<P extends anyArray, R> {
  result: R | CircuitExecutionError;
  circuit: Circuit<P, R>;
}

export const executeOperation = async <P extends anyArray, R>(
  circuit: Circuit<P, R>,
  ...args: P
): Promise<ExecutionResult<P, R>> => {
  try {
    const result = await circuit.getOperation()(...args);
    return { result, circuit: handleSuccess(circuit) };
  } catch (error) {
    const executionError = new OperationExecutionError(
      'Error during execution of operation',
      error
    );
    return { result: executionError, circuit: handleFailure(circuit) };
  }
};

const handleHalfOpenSuccess = <P extends anyArray, R>(
  circuit: Circuit<P, R>
): Circuit<P, R> => {
  const result = { ...circuit };
  result.successCounter += 1;
  if (result.successCounter >= result.getConfig().successThreshold) {
    result.changeState(CircuitState.CLOSED);
    result.successCounter = 0;
    result.failureCounter = 0;
  }
  return result;
};

const handleSuccess = <P extends anyArray, R>(
  circuit: Circuit<P, R>
): Circuit<P, R> => {
  switch (circuit.getState()) {
    case CircuitState.CLOSED:
      return circuit;
    case CircuitState.HALF_OPEN:
      return handleHalfOpenSuccess(circuit);
    default:
      return circuit;
  }
};

const handleFailure = <P extends anyArray, R>(
  circuit: Circuit<P, R>
): Circuit<P, R> => {
  const result = { ...circuit };
  result.failureCounter += 1;
  if (result.failureCounter >= result.getConfig().failureThreshold) {
    result.changeState(CircuitState.OPEN);
    result.failureCounter = 0;
    result.successCounter = 0;
  }
  return result;
};
