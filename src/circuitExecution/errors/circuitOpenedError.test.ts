import { CircuitOpenedError, isCircuitOpenedError } from "./circuitOpenedError";

describe('Test CircuitOpenedError', () => {
  it('should store the given parameters in properties', () => {
    const error = new CircuitOpenedError('test message');
    expect(error.message).toEqual('test message');
  });

  describe('Test isCircuitOpenedError', () => {
    it('should return true if, the type is circuitExecutionError', () => {
      const error = new CircuitOpenedError('a');
      expect(isCircuitOpenedError(error)).toEqual(true);
    });

    it('should return false, if the type is not CircuitOpenedError', () => {
      const error = new Error();
      expect(isCircuitOpenedError(error)).toEqual(false);
    });
  });
});
