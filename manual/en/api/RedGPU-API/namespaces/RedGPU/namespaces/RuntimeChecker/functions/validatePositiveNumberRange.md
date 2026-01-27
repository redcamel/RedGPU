[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validatePositiveNumberRange

# Function: validatePositiveNumberRange()

> **validatePositiveNumberRange**(`value`, `minRange`, `maxRange`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validatePositiveNumberRange.ts:32](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/runtimeChecker/validateFunc/validatePositiveNumberRange.ts#L32)


Validates if the given value is a positive number within the specified range.


Throws an exception if the value is less than 0 or out of range.

* ### Example
```typescript
RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Value to validate |
| `minRange` | `number` | `0` | Minimum allowed value (>= 0, default: 0) |
| `maxRange` | `number` | `Number.MAX_VALUE` | Maximum allowed value (default: Number.MAX_VALUE) |

## Returns

`boolean`


True if the value is a positive number within range

## Throws


Throws Error if inputs are not numbers, negative, or the value is out of range
