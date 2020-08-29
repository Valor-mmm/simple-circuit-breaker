import {
  mergeConfigWithDefaults,
  PartialCircuitConfig,
} from './circuitCreation/circuitConfig';
import { createCircuit } from './circuitCreation/circuit';
import { composeCircuitResult } from './circuitLogic';
import { isCircuitExecutionError } from './circuitExecution/circuitExecutionError';

export interface AppliedCircuit<T> {
  execute: T;
}

export type funcType<T extends never[], U> = (...args: T) => Promise<U>;

export const applyCircuit = <T extends never[], U>(
  operation: funcType<T, U>,
  config?: PartialCircuitConfig
): AppliedCircuit<funcType<T, U>> => {
  const circuitConfig = mergeConfigWithDefaults(config);
  const circuit = createCircuit(operation, circuitConfig);

  return {
    execute: async (...args: T) => {
      const result = await composeCircuitResult(circuit, ...args);
      if (isCircuitExecutionError(result)) {
        throw result;
      }
      return result;
    },
  };
};
