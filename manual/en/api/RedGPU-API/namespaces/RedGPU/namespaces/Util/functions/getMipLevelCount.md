[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getMipLevelCount

# Function: getMipLevelCount()

> **getMipLevelCount**(`width`, `height`): `number`

Defined in: [src/utils/texture/getMipLevelCount.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/texture/getMipLevelCount.ts#L25)

Calculates the maximum number of Mipmap levels for a given resolution.

### Example
```typescript
// Calculate Mipmap level count for 1024x1024 resolution
const levels = RedGPU.Util.getMipLevelCount(1024, 1024); // 11
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Texture width in pixels |
| `height` | `number` | Texture height in pixels |

## Returns

`number`

Calculated number of Mipmap levels
