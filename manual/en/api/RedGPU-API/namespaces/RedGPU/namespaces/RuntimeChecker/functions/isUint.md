[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:21](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/runtimeChecker/isFunc/isUint.ts#L21)


Checks if the given value is an unsigned integer.


Returns true if the value is an integer greater than or equal to 0.

* ### Example
```typescript
const isValid = RedGPU.RuntimeChecker.isUint(10);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Value to check |

## Returns

`boolean`


True if it is an unsigned integer, otherwise false
