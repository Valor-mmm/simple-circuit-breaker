import { CircuitOpenedError, isCircuitOpenedError } from './circuitOpenedError';
import { createTestCircuit } from '../../utils/test.utils';
import { CircuitState } from '../../circuitCreation/circuitState/circuitState';

describe('Test CircuitOpenedError', () => {
  it('should store the given parameters in properties', () => {
    const circuit = createTestCircuit(Promise.resolve('a'));
    circuit.changeState(CircuitState.OPEN);
    const error = new CircuitOpenedError(circuit, 'test message');
    expect(error.message).toEqual('test message');
    expect(error.currentCircuitState).toEqual(CircuitState.OPEN);
  });

  it('should set a default message, if no message is provided', () => {
    const circuit = createTestCircuit(Promise.resolve('a'));
    circuit.changeState(CircuitState.OPEN);
    const error = new CircuitOpenedError(circuit);
    expect(error.message).toEqual(
      'CircuitOpenedError: Circuit is in state "OPEN". Underlying operation wont be executed.'
    );
  });

  describe('Test isCircuitOpenedError', () => {
    it('should return true if, the type is circuitExecutionError', () => {
      const circuit = createTestCircuit(Promise.resolve('a'));
      circuit.changeState(CircuitState.OPEN);
      const error = new CircuitOpenedError(circuit, 'test message');
      expect(isCircuitOpenedError(error)).toEqual(true);
    });

    it('should return false, if the type is not CircuitOpenedError', () => {
      const error = new Error();
      expect(isCircuitOpenedError(error)).toEqual(false);
    });
  });
});
