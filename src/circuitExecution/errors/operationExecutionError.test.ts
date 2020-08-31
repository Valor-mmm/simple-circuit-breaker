import { isOperationExecutionError, OperationExecutionError } from "./operationExecutionError";

describe('Test OperationExecutionError', () => {
  it('should store the given parameters in properties', () => {
    const error = new OperationExecutionError('test message', 6);
    expect(error.message).toEqual('test message');
    expect(error.error).toEqual(6);
  });

  describe('Test isOperationExecutionError', () => {
    it('should return true if, the type is OperationExecutionError', () => {
      const error = new OperationExecutionError('a', 'b');
      expect(isOperationExecutionError(error)).toEqual(true);
    });

    it('should return false, if the type is not OperationExecutionError', () => {
      const error = new Error();
      expect(isOperationExecutionError(error)).toEqual(false);
    });
  });
});
