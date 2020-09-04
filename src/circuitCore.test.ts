import * as mockedExecuteCircuit from './circuitExecution/executeCircuit';
import { CircuitExecutionError } from './circuitExecution/errors/circuitExecutionError';
import { composeCircuitResult } from './circuitCore';
import { CircuitOpenedError } from './circuitExecution/errors/circuitOpenedError';
import { createTestCircuit } from './utils/test.utils';

describe('Test circuitLogic', () => {
  let executeCircuitSpy: jest.SpyInstance;

  beforeAll(() => {
    executeCircuitSpy = jest.spyOn(mockedExecuteCircuit, 'executeCircuit');
  });

  describe('Test composeCircuitResult', () => {
    describe('Test execute', () => {
      it('should throw the underlying error, if the executed operation fails', async () => {
        const circuit = createTestCircuit(Promise.resolve('result'));
        executeCircuitSpy.mockImplementation(() => ({
          result: new CircuitExecutionError('some message', 'error'),
          circuit: circuit,
        }));

        await expect(composeCircuitResult(circuit).execute()).rejects.toEqual(
          'error'
        );
        expect(executeCircuitSpy).toHaveBeenCalledTimes(1);
      });

      it('should throw the underlying error, if the circuit is closed', async () => {
        const circuit = createTestCircuit(Promise.resolve('result'));
        executeCircuitSpy.mockImplementation(() => ({
          result: new CircuitOpenedError('some message', circuit),
          circuit: circuit,
        }));

        await expect(
          composeCircuitResult(circuit).execute()
        ).rejects.toBeInstanceOf(CircuitOpenedError);
        expect(executeCircuitSpy).toHaveBeenCalledTimes(1);
      });

      it('should return the result', async () => {
        const circuit = createTestCircuit(Promise.resolve('result'));
        executeCircuitSpy.mockImplementation(() => ({
          result: 'some result',
          circuit: circuit,
        }));

        await expect(composeCircuitResult(circuit).execute()).resolves.toEqual(
          'some result'
        );
        expect(executeCircuitSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
