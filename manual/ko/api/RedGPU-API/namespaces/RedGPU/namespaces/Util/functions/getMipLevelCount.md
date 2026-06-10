[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getMipLevelCount

# Function: getMipLevelCount()

> **getMipLevelCount**(`width`, `height`): `number`

Defined in: [src/utils/texture/getMipLevelCount.ts:17](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/utils/texture/getMipLevelCount.ts#L17)

주어진 해상도에 대해 생성 가능한 최대 Mipmap 레벨 수를 계산합니다.

* ### Example
```typescript
const levels = RedGPU.Util.getMipLevelCount(1024, 1024); // 11
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | 가로 크기
| `height` | `number` | 세로 크기

## Returns

`number`

Mipmap 레벨 수
