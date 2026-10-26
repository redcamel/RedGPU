[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/file/getAbsoluteURL.ts#L26)

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
