import { applyCircuit } from './index';

describe('Test End to End', () => {
  it('should perform a positive execution without changes', async () => {
    const operation = Promise.resolve(0);
    const test = applyCircuit(operation);
    await expect(test).resolves.toEqual(0);
  });
});
