// TODO: rename circuitLogic to circuitCore

import { PartialCircuitConfig } from './circuitCreation/circuitConfig';
import * as mockedExecuteOperation from './circuitExecution/executeOperation';
import { Circuit } from './circuitCreation/circuit';
import { CircuitState } from './circuitCreation/circuitState';
import { CircuitExecutionError } from './circuitExecution/circuitExecutionError';
import { composeCircuitResult } from './circuitCore';

describe('Test circuitLogic', () => {
  const createCircuit = (
    partialConfig?: PartialCircuitConfig
  ): Circuit<never[], string> => ({
    operation: async () => 'result',
    config: {
      successThreshold: 1,
      failureThreshold: 2,
      timeout: 5,
      ...partialConfig,
    },
    failureCounter: 0,
    successCounter: 0,
    state: CircuitState.CLOSED,
  });

  let executeOperationSpy: jest.SpyInstance;

  beforeAll(() => {
    executeOperationSpy = jest.spyOn(
      mockedExecuteOperation,
      'executeOperation'
    );
  });

  describe('Test composeCircuitResult', () => {
    // TODO: write test, that checks that the circuit state is updated and maintained

    describe('Test execute', () => {
      it('should throw an error, if the executed operation fails', async () => {
        const circuit = createCircuit();
        executeOperationSpy.mockImplementation(() => ({
          result: new CircuitExecutionError('some message', 'error'),
          circuit: circuit,
        }));

        await expect(composeCircuitResult(circuit).execute()).rejects.toEqual(
          'error'
        );
        expect(executeOperationSpy).toHaveBeenCalledTimes(1);
      });

      it('should return the result', async () => {
        const circuit = createCircuit();
        executeOperationSpy.mockImplementation(() => ({
          result: 'some result',
          circuit: circuit,
        }));

        await expect(composeCircuitResult(circuit).execute()).resolves.toEqual(
          'some result'
        );
        expect(executeOperationSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
