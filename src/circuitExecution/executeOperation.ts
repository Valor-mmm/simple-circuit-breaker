import { Circuit } from '../circuitCreation/circuit';
import { CircuitExecutionError } from './circuitExecutionError';
import { CircuitState } from '../circuitCreation/circuitState';

export interface ExecutionResult<T> {
  result: T | CircuitExecutionError;
  circuit: Circuit<T>;
}

export const executeOperation = async <T>(
  circuit: Circuit<T>
): Promise<ExecutionResult<T>> => {
  try {
    const result = await circuit.operation;
    return { result, circuit: handleSuccess(circuit) };
  } catch (error) {
    const executionError = new CircuitExecutionError(
      'Error during execution of operation',
      error
    );
    return { result: executionError, circuit: handleFailure(circuit) };
  }
};

const handleHalfOpenSuccess = <T>(circuit: Circuit<T>): Circuit<T> => {
  const result = { ...circuit };
  result.successCounter += 1;
  if (result.successCounter >= result.config.successThreshold) {
    result.state = CircuitState.CLOSED;
    result.successCounter = 0;
    result.failureCounter = 0;
  }
  return result;
};

const handleSuccess = <T>(circuit: Circuit<T>): Circuit<T> => {
  switch (circuit.state) {
    case CircuitState.CLOSED:
      return circuit;
    case CircuitState.HALF_OPEN:
      return handleHalfOpenSuccess(circuit);
    default:
      return circuit;
  }
};

const handleFailure = <T>(circuit: Circuit<T>): Circuit<T> => {
  const result = { ...circuit };
  result.failureCounter += 1;
  if (result.failureCounter >= result.config.failureThreshold) {
    result.state = CircuitState.OPEN;
    result.failureCounter = 0;
    result.successCounter = 0;
  }
  return result;
};
