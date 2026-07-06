[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:17](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/utils/file/getFilePath.ts#L17)

Extracts the directory path containing the file from a URL or path.

Returns the leading part of the path, including the last '/'.

* ### Example
```typescript
const path = RedGPU.Util.getFilePath('assets/textures/diffuse.png'); // 'assets/textures/'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Target URL or path |

## Returns

`string`

Directory path
