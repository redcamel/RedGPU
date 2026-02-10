[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:24](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/utils/file/getAbsoluteURL.ts#L24)

상대 경로를 절대 URL로 변환합니다.


base와 relative를 조합하여 절대 URL을 반환하며, 실패 시 relative를 그대로 반환합니다.


* ### Example
```typescript
const absURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` | 기준이 되는 base URL
| `relative` | `string` | 변환할 상대 경로 또는 URL

## Returns

`string`

변환된 절대 URL, 실패 시 relative 반환

