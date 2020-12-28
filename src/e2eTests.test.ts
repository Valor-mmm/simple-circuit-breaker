import { applyCircuit } from './index';
import { OutwardCircuit } from './circuitCore';

describe('Test End to End', () => {
  const operationControl = jest.fn(() => false);
  const operation = () =>
    new Promise((resolve, reject) => {
      if (operationControl()) {
        resolve(0);
      }
      reject(1);
    });

  const performSuccesfullExecution = async (
    testCircuit: OutwardCircuit<[], unknown>
  ): Promise<boolean> => {
    operationControl.mockImplementation(() => true);
    await expect(testCircuit.execute()).resolves.toEqual(0);
    return true;
  };

  const performFailingExecution = async (
    testCircuit: OutwardCircuit<[], unknown>
  ): Promise<boolean> => {
    operationControl.mockImplementation(() => false);
    await expect(testCircuit.execute()).rejects.toEqual(
      expect.objectContaining({
        message: 'Error during execution of operation',
        error: 1,
      })
    );
    return true;
  };

  const checkForOpenState = async (
    testCircuit: OutwardCircuit<[], unknown>
  ): Promise<boolean> => {
    await expect(testCircuit.execute()).rejects.toEqual(
      expect.objectContaining({
        message:
          'CircuitOpenedError: Circuit is in state "OPEN". Underlying operation wont be executed.',
      })
    );
    return true;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    operationControl.mockImplementation(() => false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should close circuit after failureThreshold is reached', async () => {
    const testCircuit = applyCircuit(operation, {
      failureThreshold: 2,
      successThreshold: 2,
    });

    // Execute successfully
    await expect(performSuccesfullExecution(testCircuit)).resolves;

    // Execute with failure two times
    await expect(performFailingExecution(testCircuit)).resolves;
    await expect(performFailingExecution(testCircuit)).resolves;

    // Expect circuit to be closed
    await expect(checkForOpenState(testCircuit)).resolves;
  });

  describe('Half Open handling', () => {
    let testCircuit: OutwardCircuit<[], unknown>;

    beforeEach(async () => {
      testCircuit = applyCircuit(operation, {
        failureThreshold: 2,
        successThreshold: 2,
        timeout: 200,
      });

      // PREPARE: Close Circuit
      await expect(performFailingExecution(testCircuit)).resolves;
      await expect(performFailingExecution(testCircuit)).resolves;
      await expect(checkForOpenState(testCircuit)).resolves;
    });

    it('should switch from closed to half-open, after timeout is reached', async () => {
      // prepare for successful call after time should have switched to half-open
      jest.advanceTimersByTime(250);

      // Expect call to be successful -> Half open
      await expect(performSuccesfullExecution(testCircuit)).resolves;
    });

    it('should switch from half-open to closed, if failure occurs again', async () => {
      // PREPARE: switch to half open
      jest.advanceTimersByTime(250); // switch to half-open after timer

      // Execute one request, which is successful -> should still be in *half-open*
      await expect(performSuccesfullExecution(testCircuit)).resolves;

      // Execute the operation, which fails
      await expect(performFailingExecution(testCircuit)).resolves;

      // Expect circuit to be closed again
      await expect(checkForOpenState(testCircuit)).resolves;
    });

    it('should switch from half-open to open, if success counter is reached', async () => {
      // PREPARE: switch to half open
      jest.advanceTimersByTime(250); // switch to half-open after timer

      // Execute successfully two times: should now be in closed state
      await expect(performSuccesfullExecution(testCircuit)).resolves;
      await expect(performSuccesfullExecution(testCircuit)).resolves;

      // Do one request resulting in error
      await expect(performFailingExecution(testCircuit)).resolves;

      // If the state has been *open* before the falsy request, another request should be possible
      await expect(performSuccesfullExecution(testCircuit)).resolves;
    });
  });
});
