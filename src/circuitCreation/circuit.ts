import { CircuitState } from './circuitState/circuitState';
import {
  CircuitConfig,
  mergeConfigs,
  PartialCircuitConfig,
} from './circuitConfig';
import { anyArray, funcType } from '../globalTypes';
import { createExecutionCounter, ExecutionCounter } from './executionCounter';
import { handleCircuitChange } from './circuitState/handleCircuitState';

interface ExecutionCounters {
  failureCounter: ExecutionCounter;
  successCounter: ExecutionCounter;
}

export interface PrivateCircuit<P extends anyArray, R> {
  operation: funcType<P, R>;
  state: CircuitState;
  config: CircuitConfig;
  executionCounters: ExecutionCounters;
  halfOpenTimeoutRef?: NodeJS.Timeout;
}

export interface Circuit<P extends anyArray, R> {
  updateConfig: (newConfig: PartialCircuitConfig) => void;
  getConfig: () => Readonly<CircuitConfig>;
  changeState: (newState: CircuitState) => void;
  getState: () => Readonly<CircuitState>;
  getOperation: () => funcType<P, R>;
  executionCounters: ExecutionCounters;
}

export const createCircuit = <P extends anyArray, R>(
  operation: funcType<P, R>,
  config: CircuitConfig
): Circuit<P, R> => {
  let privateCircuit: PrivateCircuit<P, R> = {
    operation,
    state: CircuitState.CLOSED,
    config: config,
    executionCounters: {
      failureCounter: createExecutionCounter('failureCounter'),
      successCounter: createExecutionCounter('successCounter'),
    },
  };

  const halfOpenTimeoutHandler = () => {
    if (privateCircuit.state !== CircuitState.OPEN) {
      throw new Error(
        'Implementation error: Timeout should only resolve during open state'
      );
    }
    privateCircuit = handleCircuitChange(
      privateCircuit,
      CircuitState.HALF_OPEN,
      () => {
        throw new Error(
          'Implementation error: should never call this function while handling the current state switch.'
        );
      }
    );
  };

  return {
    updateConfig: (newConfig) => {
      privateCircuit.config = mergeConfigs(newConfig, privateCircuit.config);
    },
    getConfig: () => ({ ...privateCircuit.config }),
    changeState: (newState) => {
      privateCircuit = handleCircuitChange(
        privateCircuit,
        newState,
        halfOpenTimeoutHandler
      );
    },
    getState: () => privateCircuit.state,
    getOperation: () => (...args: P) => privateCircuit.operation(...args),
    executionCounters: privateCircuit.executionCounters,
  };
};
