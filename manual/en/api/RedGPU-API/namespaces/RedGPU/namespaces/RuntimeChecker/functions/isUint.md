[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:21](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/runtimeChecker/isFunc/isUint.ts#L21)


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
