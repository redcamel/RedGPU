[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/utils/file/getAbsoluteURL.ts#L18)

Converts a relative path to an absolute URL.

Combines a base URL and a relative path to create an absolute URL. Returns the relative path as is if conversion fails.

* ### Example
```typescript
const absURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` \| `URL` | Base URL (string or URL object) |
| `relative` | `string` | Relative path or URL |

## Returns

`string`

Absolute URL
