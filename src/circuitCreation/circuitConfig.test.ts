import {
  CircuitConfig,
  mergeConfigs,
  mergeConfigWithDefaults,
  PartialCircuitConfig,
} from './circuitConfig';
import { createTestConfig } from '../utils/test.utils';

describe('Test circuitConfig', () => {
  describe('Test mergeConfigWithDefaults', () => {
    const anythingConfig: CircuitConfig = {
      failureCounterResetInterval: expect.anything(),
      timeout: expect.anything(),
      failureThreshold: expect.anything(),
      successThreshold: expect.anything(),
    };

    it('should overwrite the default config with a given failureThreshold prop', () => {
      expect(mergeConfigWithDefaults({ failureThreshold: 60 })).toEqual({
        ...anythingConfig,
        failureThreshold: 60,
      });
    });

    it('should overwrite the default config with a given successThreshold prop', () => {
      expect(mergeConfigWithDefaults({ successThreshold: 60 })).toEqual({
        ...anythingConfig,
        successThreshold: 60,
      });
    });

    it('should overwrite the default config with a given timeout prop', () => {
      expect(mergeConfigWithDefaults({ timeout: 60 })).toEqual({
        ...anythingConfig,
        timeout: 60,
      });
    });

    it('should overwrite all default options if needed', () => {
      expect(
        mergeConfigWithDefaults({
          timeout: 60,
          successThreshold: 60,
          failureThreshold: 60,
          failureCounterResetInterval: 90,
        })
      ).toEqual({
        failureThreshold: 60,
        successThreshold: 60,
        timeout: 60,
        failureCounterResetInterval: 90,
      });
    });

    it('should use default config if no overwrite object is provided', () => {
      expect(mergeConfigWithDefaults()).toEqual({
        failureThreshold: 10,
        successThreshold: 2,
        timeout: 300,
        failureCounterResetInterval: 5000,
      });
    });
  });

  describe('Test mergeConfigs', () => {
    it('should overwrite existing properties of a current configuration', () => {
      const config = createTestConfig({ failureThreshold: 1 });
      const newProperties: PartialCircuitConfig = { failureThreshold: 2 };

      expect(mergeConfigs(newProperties, config)).toEqual({
        ...config,
        failureThreshold: 2,
      });
    });

    it('should overwrite all properties of a current configuration', () => {
      const config = createTestConfig({
        failureThreshold: 1,
        timeout: 100,
        successThreshold: 1,
        failureCounterResetInterval: 1,
      });
      const newProperties: PartialCircuitConfig = {
        failureThreshold: 2,
        timeout: 600,
        successThreshold: 4,
        failureCounterResetInterval: 3,
      };

      expect(mergeConfigs(newProperties, config)).toEqual({
        failureThreshold: 2,
        timeout: 600,
        successThreshold: 4,
        failureCounterResetInterval: 3,
      });
    });
  });
});
