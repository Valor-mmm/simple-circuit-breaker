import { anyArray } from '../globalTypes';
import { Circuit } from '../circuitCreation/circuit';
import { CircuitExecutionError } from './errors/circuitExecutionError';
import { CircuitState } from '../circuitCreation/circuitState';
import { CircuitOpenedError } from './errors/circuitOpenedError';
import { executeOperation } from './executeOperation';

export interface ExecutionResult<P extends anyArray, R> {
  result: R | CircuitExecutionError;
  circuit: Circuit<P, R>;
}

export const executeCircuit = async <P extends anyArray, R>(
  circuit: Circuit<P, R>,
  ...args: P
): Promise<ExecutionResult<P, R>> => {
  switch (circuit.getState()) {
    case CircuitState.CLOSED:
      return executeOperation(circuit, ...args);
    case CircuitState.OPEN:
      return {
        circuit,
        result: new CircuitOpenedError('Circuit already opened', circuit),
      };
    default:
      return {
        circuit,
        result: new CircuitExecutionError(
          `Cannot execute circuit in state: ` + circuit.getState()
        ),
      };
  }
};
