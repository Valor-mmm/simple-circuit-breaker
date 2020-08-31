import {
  CircuitExecutionError,
  isCircuitExecutionError,
} from './circuitExecutionError';

describe('Test CircuitExecutionError', () => {
  it('should store the given parameters in properties', () => {
    const error = new CircuitExecutionError('test message', 6);
    expect(error.message).toEqual('test message');
    expect(error.error).toEqual(6);
  });

  it('should store the given parameters in properties without error', () => {
    const error = new CircuitExecutionError('test message');
    expect(error.message).toEqual('test message');
    expect(error.error).toBeUndefined();
  });

  describe('Test isCircuitExecutionError', () => {
    it('should return true if, the type is circuitExecutionError', () => {
      const error = new CircuitExecutionError('a', 'b');
      expect(isCircuitExecutionError(error)).toEqual(true);
    });

    it('should return false, if the type is not circuitExecutionError', () => {
      const error = new Error();
      expect(isCircuitExecutionError(error)).toEqual(false);
    });
  });
});
