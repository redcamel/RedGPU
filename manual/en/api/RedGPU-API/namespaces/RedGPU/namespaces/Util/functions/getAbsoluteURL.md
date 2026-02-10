[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:24](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/utils/file/getAbsoluteURL.ts#L24)


Converts a relative path to an absolute URL.


Combines base and relative to return an absolute URL, returning relative if it fails.

* ### Example
```typescript
const absURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` | Base URL to use as a reference |
| `relative` | `string` | Relative path or URL to convert |

## Returns

`string`


Converted absolute URL, or relative if conversion fails
