[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:21](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/runtimeChecker/isFunc/isUint.ts#L21)


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
