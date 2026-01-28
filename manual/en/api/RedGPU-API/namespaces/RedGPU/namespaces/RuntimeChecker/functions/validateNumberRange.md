[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumberRange

# Function: validateNumberRange()

> **validateNumberRange**(`value`, `minRange`, `maxRange`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumberRange.ts:32](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/runtimeChecker/validateFunc/validateNumberRange.ts#L32)


Validates if the given value is a number within the specified range.


Throws an exception if the value is out of range or not a number.

* ### Example
```typescript
RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Value to validate |
| `minRange` | `number` | `-Number.MAX_VALUE` | Minimum allowed value (default: -Number.MAX_VALUE) |
| `maxRange` | `number` | `Number.MAX_VALUE` | Maximum allowed value (default: Number.MAX_VALUE) |

## Returns

`boolean`


True if the value is a number within range

## Throws


Throws Error if inputs are not numbers or the value is out of range
