[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:26](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/utils/file/getAbsoluteURL.ts#L26)

Resolves a relative path against a base URL and returns the absolute URL string.

### Example
```typescript
// Returns 'https://example.com/image.png'
const absoluteURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` \| `URL` | Base URL (string or `URL` object) |
| `relative` | `string` | Relative path or URL to resolve |

## Returns

`string`

Absolute URL string

## Throws

If `relative` is empty or `base` is not a valid string/`URL`
