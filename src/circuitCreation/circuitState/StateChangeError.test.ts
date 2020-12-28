import { StateChangeError } from './StateChangeError';
import { CircuitState } from './circuitState';

describe('Test StateChangeError', () => {
  it('should store the given parameters in properties', () => {
    const error = new StateChangeError(
      CircuitState.CLOSED,
      CircuitState.OPEN,
      'someMessage'
    );
    expect(error.previousState).toEqual(CircuitState.CLOSED);
    expect(error.nextState).toEqual(CircuitState.OPEN);
    expect(error.message).toEqual('someMessage');
  });
});
