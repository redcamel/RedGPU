[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:22](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/runtimeChecker/isFunc/isHexColor.ts#L22)

주어진 값이 유효한 16진수(Hex) 색상 형식인지 검사합니다.

'#' 접두사가 붙은 3자리 또는 6자리 16진수 색상 문자열 또는 0에서 0xFFFFFF 사이의 정수를 지원합니다.

* ### Example
```typescript
const isValidStr = RedGPU.RuntimeChecker.isHexColor('#FF0000');
const isValidNum = RedGPU.RuntimeChecker.isHexColor(0xFF0000);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `any` | 검사할 값 (문자열 또는 숫자)

## Returns

`boolean`

유효한 Hex 색상이면 true, 아니면 false
