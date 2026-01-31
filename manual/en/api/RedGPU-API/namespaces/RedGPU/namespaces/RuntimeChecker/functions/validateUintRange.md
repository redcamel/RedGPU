[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateUintRange

# Function: validateUintRange()

> **validateUintRange**(`value`, `min`, `max`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateUintRange.ts:34](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/runtimeChecker/validateFunc/validateUintRange.ts#L34)


Validates if the given value is an unsigned integer (Uint) within the specified range.


Throws an exception if inputs are not integers or out of the specified range.

* ### Example
```typescript
RedGPU.RuntimeChecker.validateUintRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Value to validate |
| `min` | `number` | `0` | Minimum allowed Uint value (default: 0) |
| `max` | `number` | `MAX_UINT` | Maximum allowed Uint value (default: 4503599627370496) |

## Returns

`boolean`


True if the value is a Uint within range

## Throws


Throws Error if values/range are not Uint or out of range
