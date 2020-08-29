import { Circuit } from './circuitCreation/circuit';

export const composeCircuitResult = <T>(circuit: Circuit<T>): Promise<T> => {
  return circuit.operation; // TODO: implement logic in later pull request
};
