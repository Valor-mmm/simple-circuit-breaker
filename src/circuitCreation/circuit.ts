import { CircuitState } from './circuitState';
import { CircuitConfig } from './circuitConfig';
import { anyArray, funcType } from '../globalTypes';

export interface Circuit<P extends anyArray, R> {
  operation: funcType<P, R>;
  failureCounter: number;
  successCounter: number;
  state: CircuitState;
  config: CircuitConfig;
}

export const createCircuit = <P extends anyArray, R>(
  operation: funcType<P, R>,
  config: CircuitConfig
): Circuit<P, R> => ({
  operation,
  failureCounter: 0,
  successCounter: 0,
  state: CircuitState.CLOSED,
  config: config,
});
