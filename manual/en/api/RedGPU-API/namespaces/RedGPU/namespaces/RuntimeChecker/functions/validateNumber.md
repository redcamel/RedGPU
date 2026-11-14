[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumber

# Function: validateNumber()

> **validateNumber**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumber.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/runtimeChecker/validateFunc/validateNumber.ts#L23)

Validates that the value is a non-NaN number and throws an exception on failure.

### Example
```typescript
RedGPU.RuntimeChecker.validateNumber(123);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Value to validate |

## Returns

`boolean`

True if the value is a valid number

## Throws

Throws Error if the value is not a number or is NaN
