[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumberRange

# Function: validateNumberRange()

> **validateNumberRange**(`value`, `minRange?`, `maxRange?`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumberRange.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/runtimeChecker/validateFunc/validateNumberRange.ts#L29)

Validates that the value is a number within [minRange, maxRange] and throws an exception on failure.

### Example
```typescript
RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | Numeric value to validate |
| `minRange?` | `number` | `-Number.MAX_VALUE` | Minimum allowed value (default: -Number.MAX_VALUE) |
| `maxRange?` | `number` | `Number.MAX_VALUE` | Maximum allowed value (default: Number.MAX_VALUE) |

## Returns

`boolean`

True if the value is within range

## Throws

Throws Error if any argument is not a number or NaN, or the value is out of range
