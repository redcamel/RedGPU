[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGB

# Class: ColorRGB

Defined in: [src/color/ColorRGB.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L38)

RGB 색상을 나타내는 클래스입니다.

이 클래스는 RGB 색상 값을 생성, 조작, 변환하는 메서드를 제공합니다. 색상 구성 요소의 유효성 검사 및 선택적 변경 알림을 지원합니다.
### Example
```typescript
// 흰색 생성
const white = new RedGPU.Color.ColorRGB();

// 빨간색 생성
const red = new RedGPU.Color.ColorRGB(255, 0, 0);

// 변경 콜백과 함께 생성
const color = new RedGPU.Color.ColorRGB(100, 150, 200, () => console.log('Color changed'));

// 16진수로 색상 설정
color.setColorByHEX('#FF5733');

// 정규화된 값 가져오기
const normalized = color.rgbNormal; // [1, 0.34, 0.2]
```

## Extended by

- [`ColorRGBA`](ColorRGBA.md)

## Constructors

### Constructor

> **new ColorRGB**(`r?`, `g?`, `b?`, `onChange?`): `ColorRGB`

Defined in: [src/color/ColorRGB.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L68)

ColorRGB 클래스의 새 인스턴스를 생성합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r?` | `number` | `255` | RGB 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `g?` | `number` | `255` | RGB 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `b?` | `number` | `255` | RGB 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `onChange?` | () => `void` | `undefined` | 색상이 변경될 때 호출되는 선택적 콜백 함수입니다. |

#### Returns

`ColorRGB`

#### Throws

RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.

## Accessors

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L118)

파란색(B) 채널 값을 가져오거나 설정합니다. (0 ~ 255)

##### Returns

`number`

0에서 255 사이의 파란색 값

#### Set Signature

> **set** **b**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### g

#### Get Signature

> **get** **g**(): `number`

Defined in: [src/color/ColorRGB.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L100)

초록색(G) 채널 값을 가져오거나 설정합니다. (0 ~ 255)

##### Returns

`number`

0에서 255 사이의 초록색 값

#### Set Signature

> **set** **g**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### hex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hex**(): `string`

Defined in: [src/color/ColorRGB.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L176)

RGB 색상의 16진수(HEX) 문자열 표현을 반환합니다.

##### Returns

`string`

16진수 색상 문자열 (예: `"#FF8000"`)

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L82)

빨간색(R) 채널 값을 가져오거나 설정합니다. (0 ~ 255)

##### Returns

`number`

0에서 255 사이의 빨간색 값

#### Set Signature

> **set** **r**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L86)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rgb

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgb**(): `number`[]

Defined in: [src/color/ColorRGB.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L136)

색상의 RGB 값을 배열로 반환합니다.

##### Returns

`number`[]

`[r, g, b]` 형식의 숫자 배열

***

### rgbNormal

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L148)

0에서 1 사이로 정규화된 RGB 값을 배열로 반환합니다.

##### Returns

`number`[]

정규화된 RGB 배열 `[r/255, g/255, b/255]`

***

### rgbNormalLinear

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L160)

감마 보정(2.2)이 적용된 선형(Linear) 정규화 RGB 값을 배열로 반환합니다.

##### Returns

`number`[]

감마 보정된 선형 정규화 RGB 배열

## Methods

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:222](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L222)

16진수 색상 코드를 사용하여 객체의 색상을 설정합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByHEX('#FF8000');
color.setColorByHEX(0xFF8000);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hexColor` | `string` \| `number` | 색상을 설정할 16진수 색상 코드 (문자열 또는 숫자) |

#### Returns

`void`

#### Throws

유효하지 않은 16진수 색상 코드인 경우 오류가 발생합니다.

***

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L201)

제공된 RGB 값을 기반으로 객체의 색상을 설정합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | 0-255 범위의 빨간색 값 |
| `g` | `number` | 0-255 범위의 초록색 값 |
| `b` | `number` | 0-255 범위의 파란색 값 |

#### Returns

`void`

#### Throws

RGB 값이 0-255 범위를 벗어나면 오류가 발생합니다.

***

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/color/ColorRGB.ts#L243)

RGB 색상 값을 나타내는 문자열을 파싱하여 객체의 색상을 설정합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByRGBString('rgb(255, 128, 0)');
color.setColorByRGBString('rgb( 255 , 128 , 0 )');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgbString` | `string` | "rgb(r, g, b)" 형식의 RGB 색상 값을 나타내는 문자열 |

#### Returns

`void`

#### Throws

주어진 rgbString이 유효한 RGB 색상 값이 아닌 경우 오류가 발생합니다.
