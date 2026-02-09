[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/utils/file/getFilePath.ts#L24)


Extracts the file path (directory path) from a given URL.


Returns the part of the URL up to the last '/'.

* ### Example
```typescript
const path = RedGPU.Util.getFilePath('https://example.com/assets/textures/diffuse.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Target URL to extract the file path from |

## Returns

`string`


Extracted file path

## Throws


Throws Error if the URL is empty or invalid
