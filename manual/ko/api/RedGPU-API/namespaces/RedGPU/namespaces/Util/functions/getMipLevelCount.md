[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getMipLevelCount

# Function: getMipLevelCount()

> **getMipLevelCount**(`width`, `height`): `number`

Defined in: [src/utils/texture/getMipLevelCount.ts:25](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/texture/getMipLevelCount.ts#L25)

주어진 해상도에 대해 생성 가능한 최대 Mipmap 레벨 수를 계산합니다.

### Example
```typescript
// 1024x1024 해상도의 Mipmap 레벨 수 계산
const levels = RedGPU.Util.getMipLevelCount(1024, 1024); // 11
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | 텍스처 가로 크기 (픽셀 단위) |
| `height` | `number` | 텍스처 세로 크기 (픽셀 단위) |

## Returns

`number`

계산된 Mipmap 레벨 수
