import { mergeConfigWithDefaults } from './circuitConfig';

describe('Test mergeConfigWithDefaults', () => {
  it('should overwrite the default config with a given failureThreshold prop', () => {
    expect(mergeConfigWithDefaults({ failureThreshold: 60 })).toEqual({
      failureThreshold: 60,
      successThreshold: expect.anything(),
      timeout: expect.anything(),
    });
  });

  it('should overwrite the default config with a given successThreshold prop', () => {
    expect(mergeConfigWithDefaults({ successThreshold: 60 })).toEqual({
      failureThreshold: expect.anything(),
      successThreshold: 60,
      timeout: expect.anything(),
    });
  });

  it('should overwrite the default config with a given timeout prop', () => {
    expect(mergeConfigWithDefaults({ timeout: 60 })).toEqual({
      failureThreshold: expect.anything(),
      successThreshold: expect.anything(),
      timeout: 60,
    });
  });

  it('should overwrite all default options if needed', () => {
    expect(
      mergeConfigWithDefaults({
        timeout: 60,
        successThreshold: 60,
        failureThreshold: 60,
      })
    ).toEqual({
      failureThreshold: 60,
      successThreshold: 60,
      timeout: 60,
    });
  });

  it('should use default config if no overwrite object is provided', () => {
    expect(mergeConfigWithDefaults()).toEqual({
      failureThreshold: 10,
      successThreshold: 2,
      timeout: 300,
    });
  });
});
