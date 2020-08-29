import { Circuit } from '../circuitCreation/circuit';
import { CircuitExecutionError } from './circuitExecutionError';
import { CircuitState } from '../circuitCreation/circuitState';

export interface ExecutionResult<T extends never[], U> {
  result: U | CircuitExecutionError;
  circuit: Circuit<T, U>;
}

export const executeOperation = async <T extends never[], U>(
  circuit: Circuit<T, U>,
  ...args: T
): Promise<ExecutionResult<T, U>> => {
  try {
    const result = await circuit.operation(...args);
    return { result, circuit: handleSuccess(circuit) };
  } catch (error) {
    const executionError = new CircuitExecutionError(
      'Error during execution of operation',
      error
    );
    return { result: executionError, circuit: handleFailure(circuit) };
  }
};

const handleHalfOpenSuccess = <T extends never[], U>(
  circuit: Circuit<T, U>
): Circuit<T, U> => {
  const result = { ...circuit };
  result.successCounter += 1;
  if (result.successCounter >= result.config.successThreshold) {
    result.state = CircuitState.CLOSED;
    result.successCounter = 0;
    result.failureCounter = 0;
  }
  return result;
};

const handleSuccess = <T extends never[], U>(
  circuit: Circuit<T, U>
): Circuit<T, U> => {
  switch (circuit.state) {
    case CircuitState.CLOSED:
      return circuit;
    case CircuitState.HALF_OPEN:
      return handleHalfOpenSuccess(circuit);
    default:
      return circuit;
  }
};

const handleFailure = <T extends never[], U>(
  circuit: Circuit<T, U>
): Circuit<T, U> => {
  const result = { ...circuit };
  result.failureCounter += 1;
  if (result.failureCounter >= result.config.failureThreshold) {
    result.state = CircuitState.OPEN;
    result.failureCounter = 0;
    result.successCounter = 0;
  }
  return result;
};
