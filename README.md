# Yet another circuit breaker (YACB)

[![Valor-mmm](https://circleci.com/gh/Valor-mmm/yet-another-circuit-breaker.svg?style=svg)](https://app.circleci.com/pipelines/github/Valor-mmm/yet-another-circuit-breaker?branch=master)
[![codecov](https://codecov.io/gh/Valor-mmm/yet-another-circuit-breaker/branch/master/graph/badge.svg)](https://codecov.io/gh/Valor-mmm/yet-another-circuit-breaker)
[![Known Vulnerabilities](https://snyk.io/test/github/Valor-mmm/yet-another-circuit-breaker/badge.svg)](https://snyk.io/test/github/Valor-mmm/yet-another-circuit-breaker)

This WILL be a simple, configurable utility for the circuit breaker pattern. Wrapped around asynchronous functions.

**Up to this point, this is still a WIP, which is only partially functional.**
I will update the readme, after the first actual release.

## Roadmap

### In the near future

1. Implement logic to change configurations during runtime.
2. Enable configuration to limit requests in _Half-Open_ state.
3. Performance tests.

### Sometime / Maybe

4. Possibility to provide a logger through an interface.
5. Custom failure test function (check, which results mean failure).
6. Ability to check operation during OPEN state to switch to HALF-OPEN more early.
7. AI to evaluate the right time to switch to HALF-OPEN state (maybe as plugin).
