[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:17](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/utils/file/getFilePath.ts#L17)

URL 또는 경로에서 파일이 포함된 디렉토리 경로를 추출합니다.

마지막 '/'를 포함한 전체 경로의 앞부분을 반환합니다.

* ### Example
```typescript
const path = RedGPU.Util.getFilePath('assets/textures/diffuse.png'); // 'assets/textures/'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | 대상 URL 또는 경로

## Returns

`string`

디렉토리 경로
