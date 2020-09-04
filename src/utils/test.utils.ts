import { anyArray } from '../globalTypes';
import {
  CircuitConfig,
  PartialCircuitConfig,
} from '../circuitCreation/circuitConfig';
import { CircuitState } from '../circuitCreation/circuitState';
import { Circuit } from '../circuitCreation/circuit';

const retrieveConfig = (
  partialConfig?: PartialCircuitConfig
): CircuitConfig => {
  const config: CircuitConfig = {
    successThreshold: 2,
    failureThreshold: 2,
    timeout: 5,
  };
  return { ...config, ...partialConfig };
};

export const createTestCircuit = <P extends anyArray, R>(
  operation: Promise<R>,
  partialConfig?: PartialCircuitConfig,
  state = CircuitState.CLOSED
): Circuit<P, R> => ({
  successCounter: 0,
  failureCounter: 0,
  state,
  config: retrieveConfig(partialConfig),
  operation: () => operation,
});
