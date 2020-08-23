import { applyCircuit } from "./index";

describe("Test index", () => {
  const operation: Promise<string> = (jest.fn() as unknown) as Promise<string>;

  it("should work", () => {
    applyCircuit(operation);
  });
});
