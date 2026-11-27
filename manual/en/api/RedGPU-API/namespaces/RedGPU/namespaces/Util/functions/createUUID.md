[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / createUUID

# Function: createUUID()

> **createUUID**(): `string`

Defined in: [src/utils/uuid/createUUID.ts:23](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/utils/uuid/createUUID.ts#L23)

Generates a random UUID (version 4) string.

Reuses an internal static character buffer; the format is `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` (uppercase hex).

### Example
```typescript
const uuid = RedGPU.Util.createUUID();
```

## Returns

`string`

Generated UUID string
