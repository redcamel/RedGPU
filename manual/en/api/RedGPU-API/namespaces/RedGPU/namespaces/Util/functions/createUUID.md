[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / createUUID

# Function: createUUID()

> **createUUID**(): `string`

Defined in: [src/utils/uuid/createUUID.ts:23](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/utils/uuid/createUUID.ts#L23)

Generates a random UUID (version 4) string.

Reuses an internal static character buffer; the format is `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` (uppercase hex).

### Example
```typescript
const uuid = RedGPU.Util.createUUID();
```

## Returns

`string`

Generated UUID string
