[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertRgbToHex

# Function: convertRgbToHex()

> **convertRgbToHex**(`r`, `g`, `b`): `string`

Defined in: [src/color/convertRgbToHex.ts:32](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/color/convertRgbToHex.ts#L32)

RGB 값을 16진수(Hex) 색상 코드로 변환합니다.


각 채널(R, G, B)을 2자리 16진수 대문자 문자열('#RRGGBB')로 변환합니다.


* ### Example
```typescript
const hex = RedGPU.Color.convertRgbToHex(255, 0, 0); // '#FF0000'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | 빨간색 성분 (0~255)
| `g` | `number` | 초록색 성분 (0~255)
| `b` | `number` | 파란색 성분 (0~255)

## Returns

`string`

변환된 16진수 색상 코드 문자열


## Throws

각 색상 성분이 0~255 범위를 벗어날 경우 Error 발생

