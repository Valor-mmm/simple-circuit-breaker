import {
  mergeConfigWithDefaults,
  PartialCircuitConfig,
} from './circuitCreation/circuitConfig';
import { createCircuit } from './circuitCreation/circuit';
import { AppliedCircuit, composeCircuitResult } from './circuitLogic';

export type funcType<T extends never[], U> = (...args: T) => Promise<U>;

export const applyCircuit = <T extends never[], U>(
  operation: funcType<T, U>,
  config?: PartialCircuitConfig
): AppliedCircuit<T, U> => {
  const circuitConfig = mergeConfigWithDefaults(config);
  const circuit = createCircuit(operation, circuitConfig);

  return composeCircuitResult(circuit);
};