[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileName

# Function: getFileName()

> **getFileName**(`url`, `withExtension`): `string`

Defined in: [src/utils/file/getFileName.ts:22](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/utils/file/getFileName.ts#L22)


Extracts the file name from a given URL.

* ### Example
```typescript
const nameWithExt = RedGPU.Util.getFileName('path/to/image.png'); // 'image.png'
const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false); // 'image'
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | Target URL to extract the file name from |
| `withExtension` | `boolean` | `true` | Whether to include the file extension (Default: true) |

## Returns

`string`


Extracted file name
