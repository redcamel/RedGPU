[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateUintRange

# Function: validateUintRange()

> **validateUintRange**(`value`, `min?`, `max?`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateUintRange.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/runtimeChecker/validateFunc/validateUintRange.ts#L34)

Validates that the value is an unsigned integer (Uint) within [min, max] and throws an exception on failure.

min and max must also be Uint values, and min must be less than max.

### Example
```typescript
RedGPU.RuntimeChecker.validateUintRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Numeric value to validate |
| `min?` | `number` | `0` | Minimum allowed Uint value (default: 0) |
| `max?` | `number` | `MAX_UINT` | Maximum allowed Uint value (default: 4503599627370496) |

## Returns

`boolean`

True if the value is a Uint within range

## Throws

Throws Error if value/min/max is not a Uint, min is not less than max, or the value is out of range
