import { createExecutionCounter } from './executionCounter';

describe('Test ExecutionCounter', () => {
  it('should create a counter with initial value 0', () => {
    const counter = createExecutionCounter('');
    expect(counter.getValue()).toEqual(0);
  });

  it('should have the name provided as parameter', () => {
    const counter = createExecutionCounter('someName');
    expect(counter.name).toEqual('someName');
  });

  it('should increase the counter by 1 using the increase function', () => {
    const counter = createExecutionCounter('');
    expect(counter.getValue()).toEqual(0);

    expect(counter.increase()).toEqual(1);
    expect(counter.getValue()).toEqual(1);
  });

  it('should reset the counter using the reset function', () => {
    const counter = createExecutionCounter('');
    counter.increase();
    counter.increase();
    expect(counter.getValue()).toEqual(2);

    counter.reset();

    expect(counter.getValue()).toEqual(0);
  });
});
