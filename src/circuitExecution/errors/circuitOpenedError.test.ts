import { CircuitOpenedError, isCircuitOpenedError } from './circuitOpenedError';
import { createTestCircuit } from '../../utils/test.utils';
import { CircuitState } from '../../circuitCreation/circuitState';

describe('Test CircuitOpenedError', () => {
  it('should store the given parameters in properties', () => {
    const circuit = createTestCircuit(Promise.resolve('a'));
    circuit.state = CircuitState.OPEN;
    const error = new CircuitOpenedError('test message', circuit);
    expect(error.message).toEqual('test message');
    expect(error.currentCircuitState).toEqual(CircuitState.OPEN);
  });

  it('should print a user centered message on toString', () => {
    const circuit = createTestCircuit(Promise.resolve('a'));
    circuit.state = CircuitState.OPEN;
    const error = new CircuitOpenedError('test message', circuit);
    expect(error.toString()).toEqual(
      `CircuitOpenedError: Circuit is in state "${CircuitState.OPEN}". Underlying promise wont be executed.`
    );
  });

  describe('Test isCircuitOpenedError', () => {
    it('should return true if, the type is circuitExecutionError', () => {
      const circuit = createTestCircuit(Promise.resolve('a'));
      circuit.state = CircuitState.OPEN;
      const error = new CircuitOpenedError('test message', circuit);
      expect(isCircuitOpenedError(error)).toEqual(true);
    });

    it('should return false, if the type is not CircuitOpenedError', () => {
      const error = new Error();
      expect(isCircuitOpenedError(error)).toEqual(false);
    });
  });
});
