[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / uuidToUint

# Function: uuidToUint()

> **uuidToUint**(`uuid`): `number`

Defined in: [src/utils/uuid/uuidToUint.ts:18](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/utils/uuid/uuidToUint.ts#L18)


Converts a UUID string to a 32-bit unsigned integer.

* ### Example
```typescript
const uintId = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uuid` | `string` | UUID string to convert |

## Returns

`number`


Converted 32-bit unsigned integer
