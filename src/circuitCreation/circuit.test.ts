import { Circuit, createCircuit } from './circuit';
import { CircuitState } from './circuitState/circuitState';
import { createTestConfig } from '../utils/test.utils';

describe('Test createCircuit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should reset the failure counter after the defined time', () => {
    const config = createTestConfig({ failureCounterResetInterval: 100 });
    const circuit = createCircuit(() => Promise.reject('a'), config);
    expect(circuit.executionCounters.failureCounter.getValue()).toEqual(0);

    // Does nothing, if failure counter is already 0
    jest.advanceTimersByTime(150);
    expect(circuit.executionCounters.failureCounter.getValue()).toEqual(0);

    // Increase failure timer
    circuit.executionCounters.failureCounter.increase();
    expect(circuit.executionCounters.failureCounter.getValue()).toEqual(1);

    // Expect timer to be reset after specified number of times
    jest.advanceTimersByTime(150);
    expect(circuit.executionCounters.failureCounter.getValue()).toEqual(0);
  });

  it('should create a default circuit', async () => {
    const config = createTestConfig();
    const circuit = createCircuit(() => Promise.resolve('a'), config);

    expect(circuit.getState()).toEqual(CircuitState.CLOSED);
    expect(circuit.getConfig()).toEqual(config);
    expect(circuit.executionCounters.successCounter.getValue()).toEqual(0);
    expect(circuit.executionCounters.failureCounter.getValue()).toEqual(0);
    await expect(circuit.getOperation()()).resolves.toEqual('a');
  });

  describe('getState', () => {
    it('should return the current state', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);
      expect(circuit.getState()).toEqual(CircuitState.CLOSED);
    });
  });

  describe('changeState', () => {
    describe('half-open timeout handler', () => {
      const config = createTestConfig({ timeout: 100 });
      let circuit: Circuit<[], string>;

      beforeEach(() => {
        circuit = createCircuit(() => Promise.resolve('a'), config);
        circuit.changeState(CircuitState.OPEN);
      });

      it('should switch the state from OPEN to HALF-OPEN', () => {
        jest.advanceTimersByTime(150);

        expect(circuit.getState()).toEqual(CircuitState.HALF_OPEN);
      });
    });

    it('should update the circuit state from CLOSED to OPEN', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      expect(circuit.getState()).toEqual(CircuitState.CLOSED);
      circuit.changeState(CircuitState.OPEN);
      expect(circuit.getState()).toEqual(CircuitState.OPEN);
    });

    it('should update the circuit state from OPEN to HALF_OPEN', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      circuit.changeState(CircuitState.OPEN);
      expect(circuit.getState()).not.toEqual(CircuitState.HALF_OPEN);
      circuit.changeState(CircuitState.HALF_OPEN);
      expect(circuit.getState()).toEqual(CircuitState.HALF_OPEN);
    });

    it('should update the circuit state from HALF_OPEN to CLOSED', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      circuit.changeState(CircuitState.OPEN);
      circuit.changeState(CircuitState.HALF_OPEN);
      expect(circuit.getState()).not.toEqual(CircuitState.CLOSED);
      circuit.changeState(CircuitState.CLOSED);
      expect(circuit.getState()).toEqual(CircuitState.CLOSED);
    });

    it('should update the circuit state from HALF_OPEN to OPEN', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      circuit.changeState(CircuitState.OPEN);
      circuit.changeState(CircuitState.HALF_OPEN);
      expect(circuit.getState()).not.toEqual(CircuitState.OPEN);
      circuit.changeState(CircuitState.OPEN);
      expect(circuit.getState()).toEqual(CircuitState.OPEN);
    });

    it('should NOT update the circuit state from CLOSED to HALF_OPEN', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      expect(circuit.getState()).toEqual(CircuitState.CLOSED);

      expect(() => {
        circuit.changeState(CircuitState.HALF_OPEN);
      }).toThrowError(
        expect.objectContaining({
          previousState: CircuitState.CLOSED,
          nextState: CircuitState.HALF_OPEN,
        })
      );
    });

    it('should NOT update the circuit state from OPEN to CLOSED', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      circuit.changeState(CircuitState.OPEN);
      expect(circuit.getState()).toEqual(CircuitState.OPEN);

      expect(() => {
        circuit.changeState(CircuitState.CLOSED);
      }).toThrowError(
        expect.objectContaining({
          previousState: CircuitState.OPEN,
          nextState: CircuitState.CLOSED,
        })
      );
    });
  });

  describe('updateConfig', () => {
    it('should update the existing config with the provided values', () => {
      const config = createTestConfig({ failureCounterResetInterval: 10 });
      const circuit = createCircuit(() => Promise.resolve('a'), config);

      expect(circuit.getConfig()).toEqual(config);
      circuit.updateConfig({ failureCounterResetInterval: 2 });
      expect(circuit.getConfig()).toEqual({
        ...config,
        failureCounterResetInterval: 2,
      });
    });
  });

  describe('getConfig', () => {
    it('should return the current config', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);
      expect(circuit.getConfig()).toEqual(config);
    });

    it('should not be able to change the config properties using the returned config', () => {
      const config = createTestConfig({ successThreshold: 4 });
      const circuit = createCircuit(() => Promise.resolve('a'), config);
      const retrievedConfig = circuit.getConfig();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // noinspection JSConstantReassignment
      retrievedConfig.successThreshold = 5;
      expect(circuit.getConfig().successThreshold).toEqual(4);
    });
  });

  describe('getOperation', () => {
    it('should return the operation function', () => {
      const config = createTestConfig();
      const circuit = createCircuit(() => Promise.resolve('a'), config);
      expect(circuit.getOperation()()).resolves.toEqual('a');
    });
  });
});
