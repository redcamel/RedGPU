[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/runtimeChecker/isFunc/isUint.ts#L19)

Checks whether the value is an integer greater than or equal to 0 (unsigned integer).

### Example
```typescript
RedGPU.RuntimeChecker.isUint(10); // true
RedGPU.RuntimeChecker.isUint(-1); // false
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Numeric value to check |

## Returns

`boolean`

True if the value is an unsigned integer, otherwise false
