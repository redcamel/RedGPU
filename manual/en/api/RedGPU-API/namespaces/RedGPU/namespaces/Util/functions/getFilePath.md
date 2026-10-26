[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/file/getFilePath.ts#L23)

Returns the directory path of a URL or path, including the last `/`.

### Example
```typescript
// Returns 'assets/textures/'
const path = RedGPU.Util.getFilePath('assets/textures/diffuse.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Target URL or path |

## Returns

`string`

Directory path

## Throws

When `url` is empty or undefined
