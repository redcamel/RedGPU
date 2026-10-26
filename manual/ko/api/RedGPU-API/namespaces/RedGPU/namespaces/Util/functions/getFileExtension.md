[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/file/getFileExtension.ts#L23)

URL 또는 경로의 마지막 세그먼트에서 파일 확장자를 소문자로 추출합니다. 확장자가 없으면 빈 문자열을 반환합니다.

### Example
```typescript
// 'gltf' 반환
const extension = RedGPU.Util.getFileExtension('assets/model.GLTF');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | 대상 URL 또는 경로 |

## Returns

`string`

소문자 파일 확장자 (점 제외)

## Throws

`url`이 비어 있거나 공백뿐인 경우
