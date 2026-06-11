[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:17](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/utils/file/getFileExtension.ts#L17)

Extracts the file extension from a URL or path.

Returns the extension in lowercase, or an empty string if it doesn't exist.

* ### Example
```typescript
const ext = RedGPU.Util.getFileExtension('assets/model.gltf'); // 'gltf'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Target URL or path |

## Returns

`string`

File extension
