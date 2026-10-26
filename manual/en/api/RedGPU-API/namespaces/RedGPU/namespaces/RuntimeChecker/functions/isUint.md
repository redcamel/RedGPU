[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/runtimeChecker/isFunc/isUint.ts#L19)

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
