import { Circuit } from './circuit';

export const composeCircuitResult = <T>(circuit: Circuit<T>): Promise<T> => {
  return circuit.operation; // TODO: implement logic in later pull request
};
