[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyToTextureArray

# Function: copyToTextureArray()

> **copyToTextureArray**(`commandEncoder`, `sourceTexture`, `targetArrayTexture`, `sliceIndex`): `void`

Defined in: [src/utils/texture/copyToTextureArray.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/texture/copyToTextureArray.ts#L26)

소스 텍스처를 배열 텍스처의 특정 슬라이스(Slice)로 복사합니다.

### Example
```typescript
// 소스 텍스처를 배열 텍스처의 0번 슬라이스로 복사
RedGPU.Util.copyToTextureArray(commandEncoder, sourceTexture, targetArrayTexture, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 커맨드 인코더 |
| `sourceTexture` | `GPUTexture` | 복사할 소스 텍스처 |
| `targetArrayTexture` | `GPUTexture` | 대상 배열 텍스처 |
| `sliceIndex` | `number` | 대상 슬라이스 인덱스 |

## Returns

`void`
