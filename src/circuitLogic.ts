import { Circuit } from './circuitCreation/circuit';
import { executeOperation } from './circuitExecution/executeOperation';
import { CircuitExecutionError } from './circuitExecution/circuitExecutionError';

export const composeCircuitResult = async <T extends never[], U>(
  circuit: Circuit<T, U>,
  ...args: T
): Promise<U | CircuitExecutionError> => {
  const executionResult = await executeOperation(circuit, ...args);

  return executionResult.result;
};
