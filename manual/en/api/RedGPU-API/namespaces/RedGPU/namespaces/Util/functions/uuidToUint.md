[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / uuidToUint

# Function: uuidToUint()

> **uuidToUint**(`uuid`): `number`

Defined in: [src/utils/uuid/uuidToUint.ts:18](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/utils/uuid/uuidToUint.ts#L18)


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
