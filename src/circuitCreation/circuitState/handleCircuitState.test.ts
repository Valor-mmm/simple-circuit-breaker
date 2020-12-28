import { PrivateCircuit } from '../circuit';
import { CircuitState } from './circuitState';
import { createExecutionCounter } from '../executionCounter';
import { handleCircuitChange } from './handleCircuitState';

describe('Test handleCircuitChange', () => {
  let circuit: PrivateCircuit<[], unknown>;
  let halfOpenTimeoutHandler: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();

    halfOpenTimeoutHandler = jest.fn();
    circuit = {
      state: CircuitState.CLOSED,
      operation: jest.fn(),
      executionCounters: {
        failureCounter: createExecutionCounter('failureCounter'),
        successCounter: createExecutionCounter('successCounter'),
      },
      config: {
        timeout: 100,
        failureCounterResetInterval: 200,
        failureThreshold: 2,
        successThreshold: 2,
      },
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('change to closed', () => {
    it('should do nothing, if state is already closed', () => {
      // Setup
      circuit.state = CircuitState.CLOSED;

      const result = handleCircuitChange(
        circuit,
        CircuitState.CLOSED,
        halfOpenTimeoutHandler
      );

      expect(result).toEqual(circuit);
    });

    it('should throw an error, if the previous state was OPEN', () => {
      // Setup
      circuit.state = CircuitState.OPEN;

      expect(() => {
        handleCircuitChange(
          circuit,
          CircuitState.CLOSED,
          halfOpenTimeoutHandler
        );
      }).toThrowError(
        expect.objectContaining({
          previousState: CircuitState.OPEN,
          nextState: CircuitState.CLOSED,
        })
      );
    });

    it('should reset the counters and change the state, if the previous state was HALF_OPEN', () => {
      // Setup
      circuit.state = CircuitState.HALF_OPEN;
      circuit.executionCounters.successCounter.increase();
      circuit.executionCounters.failureCounter.increase();

      // verify setup
      expect(circuit.executionCounters.successCounter.getValue()).toEqual(1);
      expect(circuit.executionCounters.failureCounter.getValue()).toEqual(1);

      const result = handleCircuitChange(
        circuit,
        CircuitState.CLOSED,
        halfOpenTimeoutHandler
      );

      // State should be *CLOSED* and counters should be reset
      expect(result.state).toEqual(CircuitState.CLOSED);
      expect(circuit.executionCounters.successCounter.getValue()).toEqual(0);
      expect(circuit.executionCounters.failureCounter.getValue()).toEqual(0);
    });
  });

  describe('change to open', () => {
    it('should change state and add the half-open-timeout, if previous state is closed', () => {
      // Setup
      circuit.state = CircuitState.CLOSED;

      const result = handleCircuitChange(
        circuit,
        CircuitState.OPEN,
        halfOpenTimeoutHandler
      );

      expect(result.state).toEqual(CircuitState.OPEN);
      expect(result.halfOpenTimeoutRef).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );
      expect(halfOpenTimeoutHandler).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(150);

      expect(halfOpenTimeoutHandler).toHaveBeenCalledTimes(1);
    });

    it('should change nothing, if state is already open', () => {
      // Setup
      circuit.state = CircuitState.OPEN;

      const result = handleCircuitChange(
        circuit,
        CircuitState.OPEN,
        halfOpenTimeoutHandler
      );

      expect(result).toEqual(circuit);
    });

    it('should handle state change correctly on half-open state', () => {
      // Setup
      circuit.state = CircuitState.HALF_OPEN;
      circuit.executionCounters.successCounter.increase();
      expect(circuit.executionCounters.successCounter.getValue()).toEqual(1);

      const result = handleCircuitChange(
        circuit,
        CircuitState.OPEN,
        halfOpenTimeoutHandler
      );

      expect(result.state).toEqual(CircuitState.OPEN);
      expect(result.executionCounters.successCounter.getValue()).toEqual(0);
      expect(result.halfOpenTimeoutRef).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
        })
      );
      expect(halfOpenTimeoutHandler).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(150);

      expect(halfOpenTimeoutHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('change to half-open', () => {
    it('should throw error, if previous state was closed', () => {
      // Setup
      circuit.state = CircuitState.CLOSED;
      circuit.executionCounters.successCounter.increase();
      expect(circuit.executionCounters.successCounter.getValue()).toEqual(1);

      expect(() => {
        handleCircuitChange(
          circuit,
          CircuitState.HALF_OPEN,
          halfOpenTimeoutHandler
        );
      }).toThrowError(
        expect.objectContaining({
          previousState: CircuitState.CLOSED,
          nextState: CircuitState.HALF_OPEN,
        })
      );
    });

    it('should change the state and reset the success counter, if previous state was OPEN', () => {
      // Setup
      circuit.state = CircuitState.OPEN;

      const result = handleCircuitChange(
        circuit,
        CircuitState.HALF_OPEN,
        halfOpenTimeoutHandler
      );

      expect(result.state).toEqual(CircuitState.HALF_OPEN);
      expect(result.executionCounters.successCounter.getValue()).toEqual(0);
    });

    it('should do nothing, if state is already half-open', () => {
      // Setup
      circuit.state = CircuitState.HALF_OPEN;

      const result = handleCircuitChange(
        circuit,
        CircuitState.HALF_OPEN,
        halfOpenTimeoutHandler
      );

      expect(result).toEqual(circuit);
    });
  });
});
