[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileName

# Function: getFileName()

> **getFileName**(`url`, `withExtension?`): `string`

Defined in: [src/utils/file/getFileName.ts:26](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/utils/file/getFileName.ts#L26)

Returns the part after the last `/` of a URL or path as the file name.

### Example
```typescript
// Returns 'image.png'
const nameWithExtension = RedGPU.Util.getFileName('path/to/image.png');
// Returns 'image'
const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | Target URL or path |
| `withExtension?` | `boolean` | `true` | Whether to include the extension (Default: `true`) |

## Returns

`string`

File name
