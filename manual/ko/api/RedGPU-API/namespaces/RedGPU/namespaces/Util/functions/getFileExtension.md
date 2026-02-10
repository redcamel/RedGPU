[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:24](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/utils/file/getFileExtension.ts#L24)

주어진 URL에서 파일 확장자를 추출합니다.


URL에서 파일 확장자를 소문자로 반환하며, 없으면 빈 문자열을 반환합니다.


* ### Example
```typescript
const ext = RedGPU.Util.getFileExtension('https://example.com/assets/model.gltf'); // 'gltf'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | 파일 확장자를 추출할 대상 URL

## Returns

`string`

추출된 파일 확장자 (소문자)


## Throws

URL이 비어 있거나 유효하지 않을 경우 Error 발생

