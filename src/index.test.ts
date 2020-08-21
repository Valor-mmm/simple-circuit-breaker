import { add } from ".";

describe("Test Index", function () {
  it("should add two numbers correctly", () => {
    expect(add(1, 2)).toEqual(3);
  });
});
