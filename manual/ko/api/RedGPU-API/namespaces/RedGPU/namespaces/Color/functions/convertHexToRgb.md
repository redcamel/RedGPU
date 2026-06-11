[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertHexToRgb

# Function: convertHexToRgb()

## Call Signature

> **convertHexToRgb**(`hex`, `returnArrayYn`): \[`number`, `number`, `number`\]

Defined in: [src/color/convertHexToRgb.ts:30](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/color/convertHexToRgb.ts#L30)

16진수(Hex) 색상 값을 RGB 색상으로 변환합니다.

문자열 또는 숫자 형태의 16진수 데이터를 받아 각 색상 채널(R, G, B)을 추출합니다.

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` \| `number` | 변환할 16진수 색상 데이터 (예: '#ff0000', 'ff0', 0xff0000)
| `returnArrayYn` | `true` | RGB 값을 배열 형태로 반환할지 여부 (기본값: false)

### Returns

\[`number`, `number`, `number`\]

변환된 RGB 색상 데이터. returnArrayYn이 true이면 [r, g, b] 배열을, false이면 {r, g, b} 객체를 반환합니다.

### Throws

입력값이 유효한 16진수 색상 형식이 아닐 경우 Error 발생

## Call Signature

> **convertHexToRgb**(`hex`, `returnArrayYn?`): `object`

Defined in: [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/color/convertHexToRgb.ts#L31)

16진수(Hex) 색상 값을 RGB 색상으로 변환합니다.

문자열 또는 숫자 형태의 16진수 데이터를 받아 각 색상 채널(R, G, B)을 추출합니다.

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` \| `number` | 변환할 16진수 색상 데이터 (예: '#ff0000', 'ff0', 0xff0000)
| `returnArrayYn?` | `false` | RGB 값을 배열 형태로 반환할지 여부 (기본값: false)

### Returns

`object`

변환된 RGB 색상 데이터. returnArrayYn이 true이면 [r, g, b] 배열을, false이면 {r, g, b} 객체를 반환합니다.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `b` | `number` | [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/color/convertHexToRgb.ts#L31) |
| `g` | `number` | [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/color/convertHexToRgb.ts#L31) |
| `r` | `number` | [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/color/convertHexToRgb.ts#L31) |

### Throws

입력값이 유효한 16진수 색상 형식이 아닐 경우 Error 발생

## Call Signature

> **convertHexToRgb**(`hex`, `returnArrayYn?`): \[`number`, `number`, `number`\] \| \{ `b`: `number`; `g`: `number`; `r`: `number`; \}

Defined in: [src/color/convertHexToRgb.ts:32](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/color/convertHexToRgb.ts#L32)

16진수(Hex) 색상 값을 RGB 색상으로 변환합니다.

문자열 또는 숫자 형태의 16진수 데이터를 받아 각 색상 채널(R, G, B)을 추출합니다.

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` \| `number` | 변환할 16진수 색상 데이터 (예: '#ff0000', 'ff0', 0xff0000)
| `returnArrayYn?` | `boolean` | RGB 값을 배열 형태로 반환할지 여부 (기본값: false)

### Returns

\[`number`, `number`, `number`\] \| \{ `b`: `number`; `g`: `number`; `r`: `number`; \}

변환된 RGB 색상 데이터. returnArrayYn이 true이면 [r, g, b] 배열을, false이면 {r, g, b} 객체를 반환합니다.

### Throws

입력값이 유효한 16진수 색상 형식이 아닐 경우 Error 발생
