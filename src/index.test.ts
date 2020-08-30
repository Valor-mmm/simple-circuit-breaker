import { applyCircuit } from './index';
import * as mockedMergeConfigWithDefaults from './circuitCreation/circuitConfig';
import * as mockedCreateCircuit from './circuitCreation/circuit';
import * as mockedComposeCircuitResult from './circuitLogic';
import { CircuitConfig } from './circuitCreation/circuitConfig';
import { CircuitState } from './circuitCreation/circuitState';

describe('Test index', () => {
  const config: CircuitConfig = {
    failureThreshold: 1,
    successThreshold: 0,
    timeout: 5,
  };

  const operation: () => Promise<
    string
  > = (jest.fn() as unknown) as () => Promise<string>;

  const spiedMergeConfigWithDefaults = jest.spyOn(
    mockedMergeConfigWithDefaults,
    'mergeConfigWithDefaults'
  );
  const spiedCreateCircuit = jest.spyOn(mockedCreateCircuit, 'createCircuit');
  const spiedComposeCircuitResult = jest.spyOn(
    mockedComposeCircuitResult,
    'composeCircuitResult'
  );

  it('should call functions with correct parameters', () => {
    spiedMergeConfigWithDefaults.mockImplementationOnce(
      (): CircuitConfig => config
    );
  });

  spiedCreateCircuit.mockImplementationOnce(() => ({
    failureCounter: 10,
    operation,
    config,
    state: CircuitState.CLOSED,
    successCounter: 0,
  }));

  spiedComposeCircuitResult.mockImplementationOnce(() => ({
    execute: () => Promise.resolve('test'),
  }));

  expect(applyCircuit(() => Promise.resolve('a')).execute()).resolves.toEqual(
    'test'
  );
  expect(spiedMergeConfigWithDefaults).toHaveBeenCalledTimes(1);
  expect(spiedCreateCircuit).toHaveBeenCalledTimes(1);
  expect(spiedComposeCircuitResult).toHaveBeenCalledTimes(1);
});
