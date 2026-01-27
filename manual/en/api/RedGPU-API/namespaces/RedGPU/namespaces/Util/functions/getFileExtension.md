[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:24](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/utils/file/getFileExtension.ts#L24)


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
