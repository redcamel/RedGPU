[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileName

# Function: getFileName()

> **getFileName**(`url`, `withExtension?`): `string`

Defined in: [src/utils/file/getFileName.ts:16](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/utils/file/getFileName.ts#L16)

Extracts the file name from a URL or path.

* ### Example
```typescript
const nameWithExt = RedGPU.Util.getFileName('path/to/image.png'); // 'image.png'
const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false); // 'image'
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | Target URL or path |
| `withExtension` | `boolean` | `true` | Whether to include the extension (Default: true) |

## Returns

`string`

File name
