import {
  mergeConfigWithDefaults,
  PartialCircuitConfig,
} from './circuitCreation/circuitConfig';
import { createCircuit } from './circuitCreation/circuit';
import { OutwardCircuit, composeCircuitResult } from './circuitCore';
import { anyArray, funcType } from './globalTypes';

export const applyCircuit = <P extends anyArray, R>(
  operation: funcType<P, R>,
  config?: PartialCircuitConfig
): OutwardCircuit<P, R> => {
  const circuitConfig = mergeConfigWithDefaults(config);
  const circuit = createCircuit(operation, circuitConfig);

  return composeCircuitResult(circuit);
};
