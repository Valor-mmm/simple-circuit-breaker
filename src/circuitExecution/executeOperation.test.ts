import { CircuitState } from '../circuitCreation/circuitState';
import { executeOperation } from './executeOperation';
import {
  CircuitExecutionError,
  isCircuitExecutionError,
} from './errors/circuitExecutionError';
import { createTestCircuit } from '../utils/test.utils';

describe('Test executeOperation', () => {
  it('should return the correct error, if the operation fails', async () => {
    expect.assertions(2);

    const operation = Promise.reject('some reason');
    const circuit = createTestCircuit(operation);

    const result = await executeOperation(circuit);
    expect(result.result).toBeInstanceOf(CircuitExecutionError);
    if (isCircuitExecutionError(result.result)) {
      expect(result.result.error).toEqual('some reason');
    }
  });

  it('should return the result, if the operation succeeds', async () => {
    expect.assertions(2);

    const operation = Promise.resolve('some result');
    const circuit = createTestCircuit(operation);

    const result = await executeOperation(circuit);
    expect(result.result).not.toBeInstanceOf(CircuitExecutionError);
    if (!isCircuitExecutionError(result.result)) {
      expect(result.result).toEqual('some result');
    }
  });

  describe('Test success handling', () => {
    it('should do nothing, if the circuit state is closed', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createTestCircuit(operation);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit,
        })
      );
    });

    it('should do nothing, if the circuit state is unknown', async () => {
      const operation = Promise.resolve('some result');
      const unknownCircuitState: CircuitState = (1000 as unknown) as CircuitState;
      const circuit = createTestCircuit(operation, {}, unknownCircuitState);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit,
        })
      );
    });

    it('should increase the successCounter, if the circuit state is half-open', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createTestCircuit(operation, {}, CircuitState.HALF_OPEN);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: { ...circuit, successCounter: 1 },
        })
      );
    });

    it('should keep the circuit at half-open, if the successThreshold is NOT reached', async () => {
      const operation = Promise.resolve('some result');
      const circuit = createTestCircuit(operation, {}, CircuitState.HALF_OPEN);

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
      const circuit = createTestCircuit(
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
      const circuit = createTestCircuit(operation);

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: { ...circuit, failureCounter: 1 },
        })
      );
    });

    it('should keep the circuit closed, if the errorThreshold is NOT reached', async () => {
      const operation = Promise.reject('some error');
      const circuit = createTestCircuit(operation);

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
      const circuit = createTestCircuit(operation, { failureThreshold: 1 });

      await expect(executeOperation(circuit)).resolves.toEqual(
        expect.objectContaining({
          circuit: { ...circuit, failureCounter: 0, state: CircuitState.OPEN },
        })
      );
    });
  });
});
