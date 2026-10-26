[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / uuidToUint

# Function: uuidToUint()

> **uuidToUint**(`uuid`): `number`

Defined in: [src/utils/uuid/uuidToUint.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/uuid/uuidToUint.ts#L18)

Converts a UUID string to a 32-bit unsigned integer by parsing its first 8 characters (hyphens removed) as hexadecimal.

### Example
```typescript
const uintId = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uuid` | `string` | UUID string to convert |

## Returns

`number`

Converted uint32 value (0 ~ 4294967295)
