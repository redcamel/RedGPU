[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileExtension

# Function: getFileExtension()

> **getFileExtension**(`url`): `string`

Defined in: [src/utils/file/getFileExtension.ts:17](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/utils/file/getFileExtension.ts#L17)

URL 또는 경로에서 파일 확장자를 추출합니다.

확장자를 소문자로 반환하며, 없는 경우 빈 문자열을 반환합니다.

* ### Example
```typescript
const ext = RedGPU.Util.getFileExtension('assets/model.gltf'); // 'gltf'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | 대상 URL 또는 경로

## Returns

`string`

파일 확장자
