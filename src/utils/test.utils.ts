import { anyArray } from '../globalTypes';
import {
  CircuitConfig,
  PartialCircuitConfig,
} from '../circuitCreation/circuitConfig';
import { CircuitState } from '../circuitCreation/circuitState/circuitState';
import { Circuit } from '../circuitCreation/circuit';
import { createExecutionCounter } from '../circuitCreation/executionCounter';

export const createTestConfig = (
  partialConfig?: PartialCircuitConfig
): CircuitConfig => {
  const config: CircuitConfig = {
    successThreshold: 2,
    failureThreshold: 2,
    timeout: 5,
    failureCounterResetInterval: 10,
  };
  return { ...config, ...partialConfig };
};

export const createTestCircuit = <P extends anyArray, R>(
  operation: Promise<R>,
  partialConfig?: PartialCircuitConfig,
  state = CircuitState.CLOSED
): Circuit<P, R> => {
  let circuitState: CircuitState = state;

  return {
    executionCounters: {
      successCounter: createExecutionCounter('successCounter'),
      failureCounter: createExecutionCounter('failureCounter'),
    },
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    updateConfig: (_config) => undefined,
    getConfig: () => createTestConfig(partialConfig),
    getState: () => circuitState,
    changeState: (newState) => {
      circuitState = newState;
    },
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    getOperation: () => (..._args: P) => operation,
  };
};
