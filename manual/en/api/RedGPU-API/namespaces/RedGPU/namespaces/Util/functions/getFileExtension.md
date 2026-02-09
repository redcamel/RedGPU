[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:24](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/utils/file/getFileExtension.ts#L24)


Extracts the file extension from a given URL.


Returns the file extension in lowercase, or an empty string if none exists.

* ### Example
```typescript
const ext = RedGPU.Util.getFileExtension('https://example.com/assets/model.gltf'); // 'gltf'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Target URL to extract the file extension from |

## Returns

`string`


Extracted file extension (lowercase)

## Throws


Throws Error if the URL is empty or invalid
