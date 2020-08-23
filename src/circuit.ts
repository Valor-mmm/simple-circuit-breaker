import { CircuitState } from "./circuitState";
import { CircuitConfig } from "./circuitConfig";

export interface Circuit<T> {
  operation: Promise<T>,
  failureCounter: number,
  successCounter: number,
  state: CircuitState,
  config: CircuitConfig,
}

export const createCircuit = <T> (operation: Promise<T>, config: CircuitConfig): Circuit<T> => ({
  operation,
  failureCounter: 0,
  successCounter: 0,
  state: CircuitState.CLOSED,
  config: config,
})