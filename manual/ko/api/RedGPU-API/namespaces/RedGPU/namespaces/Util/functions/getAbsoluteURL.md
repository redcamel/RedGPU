[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:18](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/utils/file/getAbsoluteURL.ts#L18)

상대 경로를 절대 URL로 변환합니다.

기준(base) URL과 상대(relative) 경로를 결합하여 절대 URL을 생성합니다. 실패 시 상대 경로를 그대로 반환합니다.

* ### Example
```typescript
const absURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` \| `URL` | 기준 URL (문자열 또는 URL 객체)
| `relative` | `string` | 상대 경로 또는 URL

## Returns

`string`

절대 URL
