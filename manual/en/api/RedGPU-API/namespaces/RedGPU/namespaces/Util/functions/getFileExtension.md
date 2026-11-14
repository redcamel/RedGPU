[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/file/getFileExtension.ts#L23)

Extracts the lowercase file extension from the last segment of a URL or path. Returns an empty string if there is no extension.

### Example
```typescript
// Returns 'gltf'
const extension = RedGPU.Util.getFileExtension('assets/model.GLTF');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Target URL or path |

## Returns

`string`

Lowercase file extension (without the dot)

## Throws

If `url` is empty or whitespace only
