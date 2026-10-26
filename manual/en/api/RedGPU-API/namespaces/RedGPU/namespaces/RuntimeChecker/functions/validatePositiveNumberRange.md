[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validatePositiveNumberRange

# Function: validatePositiveNumberRange()

> **validatePositiveNumberRange**(`value`, `minRange?`, `maxRange?`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validatePositiveNumberRange.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/runtimeChecker/validateFunc/validatePositiveNumberRange.ts#L29)

Validates that the value is a non-negative number within [minRange, maxRange] and throws an exception on failure.

### Example
```typescript
RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Numeric value to validate |
| `minRange?` | `number` | `0` | Minimum allowed value (must be >= 0, default: 0) |
| `maxRange?` | `number` | `Number.MAX_VALUE` | Maximum allowed value (default: Number.MAX_VALUE) |

## Returns

`boolean`

True if the value is a non-negative number within range

## Throws

Throws Error if any argument is not a number or NaN, minRange or the value is negative, or the value is out of range
