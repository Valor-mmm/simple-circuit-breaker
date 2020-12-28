import { anyArray } from '../../globalTypes';
import { CircuitState } from './circuitState';
import { PrivateCircuit } from '../circuit';
import { StateChangeError } from './StateChangeError';

export const handleCircuitChange = <P extends anyArray, R>(
  circuit: PrivateCircuit<P, R>,
  newState: CircuitState,
  halfOpenTimeoutHandler: () => void
): PrivateCircuit<P, R> => {
  switch (newState) {
    case CircuitState.CLOSED:
      return handleStateToClosed(circuit);
    case CircuitState.OPEN:
      return handleStateToOpen(circuit, halfOpenTimeoutHandler);
    case CircuitState.HALF_OPEN:
      return handleStateToHalfOpen(circuit);
  }
};

const handleStateToClosed = <P extends anyArray, R>(
  circuit: PrivateCircuit<P, R>
) => {
  const changedCircuit = { ...circuit, state: CircuitState.CLOSED };

  switch (circuit.state) {
    case CircuitState.CLOSED:
      return changedCircuit;
    case CircuitState.OPEN:
      throw new StateChangeError(CircuitState.OPEN, CircuitState.CLOSED);
    case CircuitState.HALF_OPEN:
      changedCircuit.executionCounters.successCounter.reset();
      changedCircuit.executionCounters.failureCounter.reset();
      return changedCircuit;
  }
};

const addHalfOpenTimeout = <P extends anyArray, R>(
  circuit: PrivateCircuit<P, R>,
  halfOpenTimeoutHandler: () => void
) => {
  const result = { ...circuit };
  result.halfOpenTimeoutRef?.unref();
  result.halfOpenTimeoutRef = setTimeout(
    halfOpenTimeoutHandler,
    circuit.config.timeout
  );
  return result;
};

const handleStateToOpen = <P extends anyArray, R>(
  circuit: PrivateCircuit<P, R>,
  halfOpenTimeoutHandler: () => void
) => {
  const changedCircuit = { ...circuit, state: CircuitState.OPEN };

  switch (circuit.state) {
    case CircuitState.CLOSED:
      return addHalfOpenTimeout(changedCircuit, halfOpenTimeoutHandler);
    case CircuitState.OPEN:
      return circuit;
    case CircuitState.HALF_OPEN:
      changedCircuit.executionCounters.successCounter.reset();
      return addHalfOpenTimeout(changedCircuit, halfOpenTimeoutHandler);
  }
};

const handleStateToHalfOpen = <P extends anyArray, R>(
  circuit: PrivateCircuit<P, R>
) => {
  const changedCircuit = { ...circuit, state: CircuitState.HALF_OPEN };

  switch (circuit.state) {
    case CircuitState.CLOSED:
      throw new StateChangeError(CircuitState.CLOSED, CircuitState.HALF_OPEN);
    case CircuitState.OPEN:
      changedCircuit.executionCounters.successCounter.reset();
      return changedCircuit;
    case CircuitState.HALF_OPEN:
      return changedCircuit;
  }
};
