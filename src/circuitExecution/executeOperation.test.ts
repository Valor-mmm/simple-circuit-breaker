import {
  CircuitConfig,
  PartialCircuitConfig,
} from '../circuitCreation/circuitConfig';
import { Circuit } from '../circuitCreation/circuit';
import { CircuitState } from '../circuitCreation/circuitState';
import { executeOperation } from './executeOperation';
import {
  CircuitExecutionError,
  isCircuitExecutionError,
} from './errors/circuitExecutionError';

describe('Test executeOperation', () => {
  const retrieveConfig = (
    partialConfig?: PartialCircuitConfig
  ): CircuitConfig => {
    const config: CircuitConfig = {
      successThreshold: 2,
      failureThreshold: 2,
      timeout: 5,
    };
    return { ...config, ...partialConfig };
  };

  const createCircuit = (
    operation: Promise<string>,
    partialConfig?: PartialCircuitConfig,
    state = CircuitState.CLOSED
  ): Circuit<never[], string> => ({
    successCounter: 0,
    failureCounter: 0,
    state,
    config: retrieveConfig(partialConfig),
    operation: () => operation,
  });

  it('should return the correct error, if the operation fails', async () => {
    expect.assertions(2);

    const operation = Promise.reject('some reason');
    const circuit = createCircuit(operation);

    const result = await executeOperation(circuit);
    expect(result.result).toBeInstanceOf(CircuitExecutionError);
    if (isCircuitExecutionError(result.result)) {
      expect(result.result.error).toEqual('some reason');
    }
  });

  it('should return the result, if the operation succeeds', async () => {
    expect.assertions(2);

    const operation = Promise.resolve('some result');
    const circuit = createCircuit(operation);

    const result = await executeOperation(circuit);
    expect(result.result).not.toBeInstanceOf(CircuitExecutionError);
    if (!isCircuitExecutionError(result.result)) {
      expect(result.result).toEqual('some result');
    }
  });

  describe('Test success handling', () => {
    it('should do nothing, if the circuit state is closed', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createCircuit(operation);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit,
        })
      );
    });

    it('should do nothing, if the circuit state is unknown', async () => {
      const operation = Promise.resolve('some result');
      const unknownCircuitState: CircuitState = (1000 as unknown) as CircuitState;
      const circuit = createCircuit(operation, {}, unknownCircuitState);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit,
        })
      );
    });

    it('should increase the successCounter, if the circuit state is half-open', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createCircuit(operation, {}, CircuitState.HALF_OPEN);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: { ...circuit, successCounter: 1 },
        })
      );
    });

    it('should keep the circuit at half-open, if the successThreshold is NOT reached', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createCircuit(operation, {}, CircuitState.HALF_OPEN);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: {
            ...circuit,
            successCounter: 1,
            state: CircuitState.HALF_OPEN,
          },
        })
      );
    });

    it('should close the circuit, it the successThreshold is reached', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createCircuit(
        operation,
        { successThreshold: 1 },
        CircuitState.HALF_OPEN
      );

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: {
            ...circuit,
            successCounter: 0,
            failureCounter: 0,
            state: CircuitState.CLOSED,
          },
        })
      );
    });
  });

  describe('Test failure handling', () => {
    it('should increase the errorCounter', async () => {
      const operation = Promise.reject('some error');
      const circuit = createCircuit(operation);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: { ...circuit, failureCounter: 1 },
        })
      );
    });

    it('should keep the circuit closed, if the errorThreshold is NOT reached', async () => {
      const operation = Promise.reject('some error');
      const circuit = createCircuit(operation);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: {
            ...circuit,
            failureCounter: 1,
            state: CircuitState.CLOSED,
          },
        })
      );
    });

    it('should open the circuit, if the errorThreshold is reached', async () => {
      const operation = Promise.reject('some error');
      const circuit = createCircuit(operation, { failureThreshold: 1 });

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: { ...circuit, failureCounter: 0, state: CircuitState.OPEN },
        })
      );
    });
  });
});
