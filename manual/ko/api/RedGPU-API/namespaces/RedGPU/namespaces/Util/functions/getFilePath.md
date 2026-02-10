[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFilePath

# Function: getFilePath()

> **getFilePath**(`url`): `string`

Defined in: [src/utils/file/getFilePath.ts:24](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/utils/file/getFilePath.ts#L24)

주어진 URL에서 파일 경로(디렉터리 경로)를 추출합니다.


URL에서 마지막 '/'까지의 부분을 반환합니다.


* ### Example
```typescript
const path = RedGPU.Util.getFilePath('https://example.com/assets/textures/diffuse.png');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | 파일 경로를 추출할 대상 URL

## Returns

`string`

추출된 파일 경로


## Throws

URL이 비어 있거나 유효하지 않을 경우 Error 발생

