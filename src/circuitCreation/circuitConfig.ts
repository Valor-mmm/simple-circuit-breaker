export type PartialCircuitConfig = Partial<CircuitConfig>;

export interface CircuitConfig {
  successThreshold: number;
  failureThreshold: number;
  timeout: number;
  failureCounterResetInterval: number;
}

const defaultConfig: CircuitConfig = {
  failureThreshold: 10,
  successThreshold: 2,
  timeout: 300,
  failureCounterResetInterval: 5000,
};

export const mergeConfigWithDefaults = (
  config?: PartialCircuitConfig
): CircuitConfig => ({ ...defaultConfig, ...config });

export const mergeConfigs = (
  newConfigElements: PartialCircuitConfig,
  currentConfig: CircuitConfig
): CircuitConfig => {
  return { ...currentConfig, ...newConfigElements };
};
