[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumber

# Function: validateNumber()

> **validateNumber**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumber.ts:26](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/runtimeChecker/validateFunc/validateNumber.ts#L26)


Validates if the given value is a number type.


Throws an exception if the value is not a number type.

* ### Example
```typescript
RedGPU.RuntimeChecker.validateNumber(123);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Value to validate |

## Returns

`boolean`


True if the value is a number

## Throws


Throws Error if the value is not a number
