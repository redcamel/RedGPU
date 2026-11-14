[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/file/getFilePath.ts#L23)

URL 또는 경로에서 마지막 `/`까지 포함한 디렉터리 경로를 반환합니다.

### Example
```typescript
// 'assets/textures/' 반환
const path = RedGPU.Util.getFilePath('assets/textures/diffuse.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | 대상 URL 또는 경로 |

## Returns

`string`

디렉터리 경로

## Throws

`url`이 비어 있거나 정의되지 않은 경우
