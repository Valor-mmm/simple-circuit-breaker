export type PartialCircuitConfig = Partial<CircuitConfig>;

export interface CircuitConfig {
  successThreshold: number;
  failureThreshold: number;
  timeout: number;
}

const defaultConfig: CircuitConfig = {
  failureThreshold: 10,
  successThreshold: 2,
  timeout: 300,
};

export const mergeConfigWithDefaults = (
  config?: PartialCircuitConfig
): CircuitConfig => ({ ...defaultConfig, ...config });
