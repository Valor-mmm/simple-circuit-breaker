import { createCircuit } from './circuit';
import { CircuitState } from './circuitState';
import { createTestConfig } from '../utils/test.utils';

describe('Test createCircuit', () => {
  it('should create a default circuit', () => {
    const config = createTestConfig();
    expect(createCircuit(() => Promise.resolve('a'), config)).toEqual({
      failureCounter: 0,
      successCounter: 0,
      state: CircuitState.CLOSED,
      operation: expect.anything(),
      config,
    });
  });
});
