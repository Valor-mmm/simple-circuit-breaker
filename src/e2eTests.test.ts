import { applyCircuit } from './index';

describe('Test End to End', () => {
  it('should close circuit after failureThreshold is reached', async () => {
    const operationControl = jest.fn(() => true);
    const operation = () =>
      new Promise((resolve, reject) => {
        if (operationControl()) {
          resolve(0);
        }
        reject(1);
      });

    const test = applyCircuit(operation, {
      failureThreshold: 2,
      successThreshold: 2,
    });
    await expect(test.execute()).resolves.toEqual(0);

    operationControl.mockImplementation(() => false);
    await expect(test.execute()).rejects.toEqual(1);
    await expect(test.execute()).rejects.toEqual(1);

    // TODO: check for closed after implementation
  });
});
