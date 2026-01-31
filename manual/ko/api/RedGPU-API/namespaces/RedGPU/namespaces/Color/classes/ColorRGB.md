[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGB

# Class: ColorRGB

Defined in: [src/color/ColorRGB.ts:36](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L36)

RGB 색상을 나타내는 클래스입니다.


이 클래스는 RGB 색상 값을 생성, 조작, 변환하는 메서드를 제공합니다. 색상 구성 요소의 유효성 검사 및 선택적 변경 알림을 지원합니다.

* ### Example
```typescript
// 흰색 생성
//
const white = new RedGPU.Color.ColorRGB();

// 빨간색 생성
//
const red = new RedGPU.Color.ColorRGB(255, 0, 0);

// 변경 콜백과 함께 생성
//
const color = new RedGPU.Color.ColorRGB(100, 150, 200, () => console.log('Color changed'));

// 16진수로 색상 설정
//
color.setColorByHEX('#FF5733');

// 정규화된 값 가져오기
//
const normalized = color.rgbNormal; // [1, 0.34, 0.2]
```

## Extended by

- [`ColorRGBA`](ColorRGBA.md)

## Constructors

### Constructor

> **new ColorRGB**(`r`, `g`, `b`, `onChange`): `ColorRGB`

Defined in: [src/color/ColorRGB.ts:66](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L66)

ColorRGB 클래스의 새 인스턴스를 생성합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r` | `number` | `255` | RGB 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다.
| `g` | `number` | `255` | RGB 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다.
| `b` | `number` | `255` | RGB 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다.
| `onChange` | `Function` | `undefined` | 색상이 변경될 때 호출되는 선택적 콜백 함수입니다.

#### Returns

`ColorRGB`

#### Throws

RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.


## Accessors

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:154](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L154)

파란색 구성 요소를 가져옵니다.

* ### Example
```typescript
const b = color.b;
```

##### Returns

`number`

0에서 255 사이의 파란색 값


#### Set Signature

> **set** **b**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:172](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L172)

파란색 구성 요소를 설정합니다.

* ### Example
```typescript
color.b = 255;
```

##### Throws

값이 0-255 범위를 벗어나면 오류가 발생합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 파란색 값 (0-255)

##### Returns

`void`

***

### g

#### Get Signature

> **get** **g**(): `number`

Defined in: [src/color/ColorRGB.ts:119](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L119)

초록색 구성 요소를 가져옵니다.

* ### Example
```typescript
const g = color.g;
```

##### Returns

`number`

0에서 255 사이의 초록색 값


#### Set Signature

> **set** **g**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:137](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L137)

초록색 구성 요소를 설정합니다.

* ### Example
```typescript
color.g = 255;
```

##### Throws

값이 0-255 범위를 벗어나면 오류가 발생합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 초록색 값 (0-255)

##### Returns

`void`

***

### hex

#### Get Signature

> **get** **hex**(): `string`

Defined in: [src/color/ColorRGB.ts:242](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L242)

RGB 색상의 16진수 표현을 반환합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.hex); // "#FF8000"
```

##### Returns

`string`

16진수 색상 값 (예: "#FF8000")


***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:84](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L84)

빨간색 구성 요소를 가져옵니다.

* ### Example
```typescript
const r = color.r;
```

##### Returns

`number`

0에서 255 사이의 빨간색 값


#### Set Signature

> **set** **r**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:102](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L102)

빨간색 구성 요소를 설정합니다.

* ### Example
```typescript
color.r = 255;
```

##### Throws

값이 0-255 범위를 벗어나면 오류가 발생합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 빨간색 값 (0-255)

##### Returns

`void`

***

### rgb

#### Get Signature

> **get** **rgb**(): `number`[]

Defined in: [src/color/ColorRGB.ts:190](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L190)

색상의 RGB 값을 포함하는 배열을 반환합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgb); // [255, 128, 0]
```

##### Returns

`number`[]

[r, g, b] 형식의 RGB 값을 나타내는 숫자 배열


***

### rgbNormal

#### Get Signature

> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:206](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L206)

정규화된 RGB 값을 배열로 반환합니다. 각 값은 0에서 1 사이로 정규화됩니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgbNormal); // [1, 0.501, 0]
```

##### Returns

`number`[]

정규화된 RGB 값을 포함하는 배열 [r/255, g/255, b/255]


***

### rgbNormalLinear

#### Get Signature

> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:222](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L222)

감마 보정된(Linear) 정규화된 RGB 값을 배열로 반환합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgbNormalLinear);
```

##### Returns

`number`[]

감마 보정된(2.2) 정규화된 RGB 값을 포함하는 배열


## Methods

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:288](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L288)

16진수 색상 코드를 사용하여 객체의 색상을 설정합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByHEX('#FF8000');
color.setColorByHEX(0xFF8000);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hexColor` | `string` \| `number` | 색상을 설정할 16진수 색상 코드 (문자열 또는 숫자)

#### Returns

`void`

#### Throws

유효하지 않은 16진수 색상 코드인 경우 오류가 발생합니다.


***

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:267](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L267)

제공된 RGB 값을 기반으로 객체의 색상을 설정합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | 0-255 범위의 빨간색 값
| `g` | `number` | 0-255 범위의 초록색 값
| `b` | `number` | 0-255 범위의 파란색 값

#### Returns

`void`

#### Throws

RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.


***

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:309](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/color/ColorRGB.ts#L309)

RGB 색상 값을 나타내는 문자열을 파싱하여 객체의 색상을 설정합니다.

* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByRGBString('rgb(255, 128, 0)');
color.setColorByRGBString('rgb( 255 , 128 , 0 )');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgbString` | `string` | "rgb(r, g, b)" 형식의 RGB 색상 값을 나타내는 문자열

#### Returns

`void`

#### Throws

주어진 rgbString이 유효한 RGB 색상 값이 아닌 경우 오류가 발생합니다.

