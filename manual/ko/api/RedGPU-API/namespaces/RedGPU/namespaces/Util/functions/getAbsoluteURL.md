[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getAbsoluteURL

# Function: getAbsoluteURL()

> **getAbsoluteURL**(`base`, `relative`): `string`

Defined in: [src/utils/file/getAbsoluteURL.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/file/getAbsoluteURL.ts#L26)

기준 URL을 기준으로 상대 경로를 해석하여 절대 URL 문자열을 반환합니다.

### Example
```typescript
// 'https://example.com/image.png' 반환
const absoluteURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` \| `URL` | 기준 URL (문자열 또는 `URL` 객체) |
| `relative` | `string` | 해석할 상대 경로 또는 URL |

## Returns

`string`

절대 URL 문자열

## Throws

`relative`가 빈 문자열이거나 `base`가 유효한 문자열/`URL`이 아닌 경우
