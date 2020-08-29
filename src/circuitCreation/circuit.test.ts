import { createCircuit } from './circuit';
import { CircuitConfig } from './circuitConfig';
import { CircuitState } from './circuitState';

describe('Test createCircuit', () => {
  it('should create a default circuit', () => {
    const config: CircuitConfig = {
      successThreshold: 1,
      failureThreshold: 4,
      timeout: 40,
    };
    expect(createCircuit(Promise.resolve('a'), config)).toEqual({
      failureCounter: 0,
      successCounter: 0,
      state: CircuitState.CLOSED,
      operation: expect.anything(),
      config,
    });
  });
});
