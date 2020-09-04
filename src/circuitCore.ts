import { Circuit } from './circuitCreation/circuit';
import { isCircuitExecutionError } from './circuitExecution/errors/circuitExecutionError';
import { anyArray, funcType } from './globalTypes';
import { executeCircuit } from './circuitExecution/executeCircuit';

export interface AppliedCircuit<P extends anyArray, R> {
  execute: funcType<P, R>;
}

export const composeCircuitResult = <P extends anyArray, R>(
  initialCircuit: Circuit<P, R>
): AppliedCircuit<P, R> => {
  let circuitState = { ...initialCircuit };

  return {
    execute: async (...args: P) => {
      const { result, circuit } = await executeCircuit(circuitState, ...args);
      circuitState = circuit;
      if (isCircuitExecutionError(result)) {
        throw result.error ? result.error : result;
      }
      return result;
    },
  };
};
