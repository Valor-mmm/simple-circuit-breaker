import { CircuitState } from './circuitState';
import {
  CircuitConfig,
  mergeConfigs,
  PartialCircuitConfig,
} from './circuitConfig';
import { anyArray, funcType } from '../globalTypes';

interface PrivateCircuit<P extends anyArray, R> {
  operation: funcType<P, R>;
  state: CircuitState;
  config: CircuitConfig;
}

export interface Circuit<P extends anyArray, R> {
  updateConfig: (newConfig: PartialCircuitConfig) => void;
  getConfig: () => Readonly<CircuitConfig>;
  changeState: (newState: CircuitState) => void;
  getState: () => Readonly<CircuitState>;
  getOperation: () => funcType<P, R>;
  failureCounter: number;
  successCounter: number;
}

export const createCircuit = <P extends anyArray, R>(
  operation: funcType<P, R>,
  config: CircuitConfig
): Circuit<P, R> => {
  const circuitState: PrivateCircuit<P, R> = {
    operation,
    state: CircuitState.CLOSED,
    config: config,
  };

  return {
    updateConfig: (newConfig) => {
      circuitState.config = mergeConfigs(newConfig, circuitState.config);
    },
    getConfig: () => ({ ...circuitState.config }),
    changeState: (newState) => {
      circuitState.state = newState;
    },
    getState: () => circuitState.state.valueOf(),
    getOperation: () => (...args: P) => circuitState.operation(...args),
    failureCounter: 0,
    successCounter: 0,
  };
};
