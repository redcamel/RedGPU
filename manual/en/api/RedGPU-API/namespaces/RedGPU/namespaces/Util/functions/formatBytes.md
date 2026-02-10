[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / formatBytes

# Function: formatBytes()

> **formatBytes**(`bytes`, `decimals?`): `string`

Defined in: [src/utils/formatBytes.ts:26](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/utils/formatBytes.ts#L26)


Converts byte units to a human-readable string.

* ### Example
```typescript
const readable = RedGPU.Util.formatBytes(1048576); // '1.00 MB'
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `bytes` | `number` | `undefined` | Byte value to convert |
| `decimals` | `number` | `2` | Number of decimal places (Default: 2) |

## Returns

`string`


Converted byte string (e.g., '1.23 MB')

## Throws


Throws Error if bytes is not a valid uint
