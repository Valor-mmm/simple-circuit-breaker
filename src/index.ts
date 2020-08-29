import { mergeConfigWithDefaults, PartialCircuitConfig } from './circuitConfig';
import { createCircuit } from './circuit';
import { composeCircuitResult } from './circuitLogic';

export const applyCircuit = <T>(
  operation: Promise<T>,
  config?: PartialCircuitConfig
): Promise<T> => {
  const circuitConfig = mergeConfigWithDefaults(config);
  const circuit = createCircuit(operation, circuitConfig);

  return composeCircuitResult(circuit);
};
