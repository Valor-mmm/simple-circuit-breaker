import * as mockedExecuteOperation from './executeOperation';
import { createTestCircuit } from '../utils/test.utils';
import { executeCircuit } from './executeCircuit';
import { CircuitState } from '../circuitCreation/circuitState';
import { CircuitOpenedError } from './errors/circuitOpenedError';
import { CircuitExecutionError } from './errors/circuitExecutionError';

describe('Test executeCircuit', () => {
  let executeOperationSpy: jest.SpyInstance;

  beforeAll(() => {
    executeOperationSpy = jest.spyOn(
      mockedExecuteOperation,
      'executeOperation'
    );
  });

  it('CLOSED: should call and return the execute operation result', async () => {
    const circuit = createTestCircuit(Promise.resolve('result'));
    executeOperationSpy.mockImplementationOnce(() => 'execution result');
    await expect(executeCircuit(circuit, 'a', 'b', 0)).resolves.toEqual(
      'execution result'
    );
    expect(executeOperationSpy).toHaveBeenCalledTimes(1);
    expect(executeOperationSpy).toHaveBeenCalledWith(circuit, 'a', 'b', 0);
  });

  it('CLOSED: should return a CircuitOpenedError', async () => {
    expect.assertions(2);
    const testCircuit = createTestCircuit(Promise.resolve('result'));
    testCircuit.changeState(CircuitState.OPEN);
    const { result, circuit } = await executeCircuit(testCircuit);
    expect(result).toBeInstanceOf(CircuitOpenedError);
    expect(circuit).toEqual(testCircuit);
  });

  it('DEFAULT: should return a CircuitExecutionError', async () => {
    expect.assertions(2);
    const testCircuit = createTestCircuit(Promise.resolve('result'));
    testCircuit.changeState(
      ('some state which is not valid' as unknown) as CircuitState
    );
    const { result, circuit } = await executeCircuit(testCircuit);
    expect(result).toBeInstanceOf(CircuitExecutionError);
    expect(circuit).toEqual(testCircuit);
  });
});
