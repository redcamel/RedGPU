[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:17](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/utils/file/getFilePath.ts#L17)

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
