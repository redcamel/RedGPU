[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getMipLevelCount

# Function: getMipLevelCount()

> **getMipLevelCount**(`width`, `height`): `number`

Defined in: [src/utils/texture/getMipLevelCount.ts:21](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/utils/texture/getMipLevelCount.ts#L21)

주어진 크기에 대해 생성 가능한 mipmap 레벨 개수를 계산합니다.


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

생성 가능한 mipmap 레벨 개수

