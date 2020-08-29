import { CircuitState } from './circuitState';
import { CircuitConfig } from './circuitConfig';
import { funcType } from '../index';

export interface Circuit<T extends never[], U> {
  operation: funcType<T, U>;
  failureCounter: number;
  successCounter: number;
  state: CircuitState;
  config: CircuitConfig;
}

export const createCircuit = <T extends never[], U>(
  operation: funcType<T, U>,
  config: CircuitConfig
): Circuit<T, U> => ({
  operation,
  failureCounter: 0,
  successCounter: 0,
  state: CircuitState.CLOSED,
  config: config,
});
