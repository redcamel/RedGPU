[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertHexToRgb

# Function: convertHexToRgb()

> **convertHexToRgb**(`hex`, `returnArrayYn`): `any`

Defined in: [src/color/convertHexToRgb.ts:30](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/convertHexToRgb.ts#L30)

16진수(Hex) 색상 값을 RGB 색상으로 변환합니다.


문자열 또는 숫자 형태의 16진수 데이터를 받아 각 색상 채널(R, G, B)을 추출합니다.


* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `hex` | `string` \| `number` | `undefined` | 변환할 16진수 색상 데이터 (예: '#ff0000', 'ff0', 0xff0000)
| `returnArrayYn` | `boolean` | `false` | RGB 값을 배열 형태로 반환할지 여부 (기본값: false)

## Returns

`any`

변환된 RGB 색상 데이터


## Throws

입력값이 유효한 16진수 색상 형식이 아닐 경우 Error 발생

