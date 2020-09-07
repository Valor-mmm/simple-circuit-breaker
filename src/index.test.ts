import { applyCircuit } from './index';
import * as mockedMergeConfigWithDefaults from './circuitCreation/circuitConfig';
import * as mockedCreateCircuit from './circuitCreation/circuit';
import * as mockedComposeCircuitResult from './circuitCore';
import { CircuitConfig } from './circuitCreation/circuitConfig';
import { createTestCircuit, createTestConfig } from './utils/test.utils';

describe('Test index', () => {
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
      (): CircuitConfig => createTestConfig()
    );
  });

  spiedCreateCircuit.mockImplementationOnce(() =>
    createTestCircuit(Promise.resolve(0))
  );

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
