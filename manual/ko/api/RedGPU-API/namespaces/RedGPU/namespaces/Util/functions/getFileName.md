[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / getFileName

# Function: getFileName()

> **getFileName**(`url`, `withExtension`): `string`

Defined in: [src/utils/file/getFileName.ts:22](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/utils/file/getFileName.ts#L22)

주어진 URL에서 파일 이름을 추출합니다.


* ### Example
```typescript
const nameWithExt = RedGPU.Util.getFileName('path/to/image.png'); // 'image.png'
const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false); // 'image'
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `url` | `string` | `undefined` | 파일 이름을 추출할 대상 URL
| `withExtension` | `boolean` | `true` | 파일 확장자를 포함할지 여부 (기본값: true)

## Returns

`string`

추출된 파일 이름

