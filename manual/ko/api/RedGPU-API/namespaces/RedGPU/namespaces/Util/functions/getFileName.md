[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileName

# Function: getFileName()

> **getFileName**(`url`, `withExtension?`): `string`

Defined in: [src/utils/file/getFileName.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/file/getFileName.ts#L26)

URL 또는 경로의 마지막 `/` 이후 부분을 파일 이름으로 반환합니다.

### Example
```typescript
// 'image.png' 반환
const nameWithExtension = RedGPU.Util.getFileName('path/to/image.png');
// 'image' 반환
const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | 대상 URL 또는 경로 |
| `withExtension?` | `boolean` | `true` | 확장자 포함 여부 (기본값: `true`) |

## Returns

`string`

파일 이름
