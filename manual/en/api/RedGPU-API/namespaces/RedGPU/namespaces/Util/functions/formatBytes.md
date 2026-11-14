[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / formatBytes

# Function: formatBytes()

> **formatBytes**(`bytes`, `decimals?`): `string`

Defined in: [src/utils/formatBytes.ts:28](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/formatBytes.ts#L28)

Converts a byte value into a human-readable string (Bytes, KB, MB, GB) based on 1024 units.

### Example
```typescript
// Returns '1 MB'
const readable = RedGPU.Util.formatBytes(1048576);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `bytes` | `number` | `undefined` | Byte value to convert (non-negative integer) |
| `decimals?` | `number` | `2` | Number of decimal places (Default: 2, negative values are treated as 0) |

## Returns

`string`

Converted string including the unit

## Throws

If `bytes` is not a non-negative integer
