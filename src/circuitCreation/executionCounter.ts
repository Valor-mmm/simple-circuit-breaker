export interface ExecutionCounter {
  name: string;
  getValue: () => number;
  increase: () => number;
  reset: () => void;
}

export const createExecutionCounter = (name: string): ExecutionCounter => {
  let counter = 0;

  return {
    name,
    getValue: () => counter,
    increase: () => ++counter,
    reset: () => {
      counter = 0;
    },
  };
};
