import { Circuit } from './circuitCreation/circuit';
import { executeOperation } from './circuitExecution/executeOperation';
import { isCircuitExecutionError } from './circuitExecution/circuitExecutionError';
import { funcType } from './index';

export interface AppliedCircuit<T extends never[], U> {
  execute: funcType<T, U>;
}

export const composeCircuitResult = <T extends never[], U>(
  initialCircuit: Circuit<T, U>
): AppliedCircuit<T, U> => {
  let circuitState = { ...initialCircuit };

  return {
    execute: async (...args: T) => {
      const { result, circuit } = await executeOperation(circuitState, ...args);
      circuitState = circuit;
      if (isCircuitExecutionError(result)) {
        throw result.error;
      }
      return result;
    },
  };
};
