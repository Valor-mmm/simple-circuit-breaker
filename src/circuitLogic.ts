import { Circuit } from './circuitCreation/circuit';
import { executeOperation } from './circuitExecution/executeOperation';
import { CircuitExecutionError } from './circuitExecution/circuitExecutionError';

export const composeCircuitResult = async <T>(
  circuit: Circuit<T>
): Promise<T | CircuitExecutionError> => {
  const executionResult = await executeOperation(circuit);
  return executionResult.result;
};
