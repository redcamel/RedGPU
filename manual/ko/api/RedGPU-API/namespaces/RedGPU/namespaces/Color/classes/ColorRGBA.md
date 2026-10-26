[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGBA

# Class: ColorRGBA

Defined in: [src/color/ColorRGBA.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L37)

빨강, 초록, 파랑, 알파(투명도) 값을 가진 색상을 나타내는 클래스입니다.

ColorRGB 클래스를 상속받아 투명도 기능을 추가합니다. 이 클래스는 RGBA 색상 값을 생성, 조작, 변환하는 메서드를 제공하며, 알파 채널을 통한 투명도 처리가 가능합니다.

***

### Example
```typescript
// 불투명한 흰색 생성
const white = new RedGPU.Color.ColorRGBA();

// 반투명한 빨간색 생성
const semiTransparentRed = new RedGPU.Color.ColorRGBA(255, 0, 0, 0.5);

// 변경 콜백과 함께 생성
const color = new RedGPU.Color.ColorRGBA(100, 150, 200, 0.8, () => console.log('Color changed'));

// RGBA 문자열로 색상 설정
color.setColorByRGBAString('rgba(255, 87, 51, 0.7)');

// 정규화된 값 가져오기
const normalized = color.rgbaNormal; // [1, 0.34, 0.2, 0.7]
```

## Extends

- [`ColorRGB`](ColorRGB.md)

## Constructors



***

### Constructor

> **new ColorRGBA**(`r?`, `g?`, `b?`, `a?`, `onChange?`): `ColorRGBA`

Defined in: [src/color/ColorRGBA.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L71)

ColorRGBA 클래스의 새 인스턴스를 생성합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.75);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r?` | `number` | `255` | RGB 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `g?` | `number` | `255` | RGB 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `b?` | `number` | `255` | RGB 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `a?` | `number` | `1` | 색상의 알파(투명도) 구성 요소. 0(완전 투명)에서 1(완전 불투명) 사이의 값이어야 합니다. |
| `onChange?` | () => `void` | `undefined` | 색상이 변경될 때 호출되는 선택적 콜백 함수입니다. |

#### Returns

`ColorRGBA`

#### Throws

RGB 값이 0-255 범위를 벗어나거나 알파 값이 0-1 범위를 벗어나면 오류가 발생합니다.

#### Overrides

[`ColorRGB`](ColorRGB.md).[`constructor`](ColorRGB.md#constructor)

## Accessors



***

### a

#### Get Signature

> **get** **a**(): `number`

Defined in: [src/color/ColorRGBA.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L90)

알파(투명도) 구성 요소를 가져오거나 설정합니다.
#### Example
```typescript
const a = color.a;
color.a = 0.5;
```

##### Returns

`number`

0(완전 투명)에서 1(완전 불투명) 사이의 알파 값

#### Set Signature

> **set** **a**(`value`): `void`

Defined in: [src/color/ColorRGBA.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L94)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rgba

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgba**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L112)

색상의 RGBA 값을 포함하는 배열을 반환합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgba); // [255, 128, 0, 0.8]
```

##### Returns

`number`[]

[r, g, b, a] 형식의 RGBA 값을 나타내는 숫자 배열

***

***

### rgbaNormal

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbaNormal**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L136)

정규화된 RGBA 값을 배열로 반환합니다.

RGB 값은 0에서 1 사이로 정규화되고, 알파 값은 이미 정규화된 상태입니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgbaNormal); // [1, 0.501, 0, 0.8]
```

##### Returns

`number`[]

정규화된 RGBA 값을 포함하는 배열 [r/255, g/255, b/255, a]

***

***

### rgbaNormalLinear

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbaNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L157)

감마 보정된(Linear) 정규화된 RGBA 값을 배열로 반환합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgbaNormalLinear);
```

##### Returns

`number`[]

감마 보정된(2.2) 정규화된 RGBA 값을 포함하는 배열

***

## Methods



***

### setColorByRGBA()

> **setColorByRGBA**(`r`, `g`, `b`, `a`): `void`

Defined in: [src/color/ColorRGBA.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L190)

RGBA 값을 사용하여 객체의 색상을 설정합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA();
color.setColorByRGBA(255, 128, 0, 0.6);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | 색상의 빨간색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `g` | `number` | 색상의 초록색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `b` | `number` | 색상의 파란색 구성 요소. 0에서 255 사이의 값이어야 합니다. |
| `a` | `number` | 색상의 알파(투명도) 구성 요소. 0에서 1 사이의 값이어야 합니다. |

#### Returns

`void`

#### Throws

RGBA 색상 값이 유효하지 않으면 오류가 발생합니다.

***

***

### setColorByRGBAString()

> **setColorByRGBAString**(`rgbaString`): `void`

Defined in: [src/color/ColorRGBA.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGBA.ts#L213)

RGBA 문자열을 사용하여 객체의 색상을 설정합니다.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA();
color.setColorByRGBAString('rgba(255, 128, 0, 0.75)');
color.setColorByRGBAString('rgba( 255 , 128 , 0 , 0.75 )');
color.setColorByRGBAString('rgba(255, 128, 0, .5)');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgbaString` | `string` | "rgba(r, g, b, a)" 형식의 RGBA 색상 값을 나타내는 문자열 |

#### Returns

`void`

#### Throws

주어진 rgbaString이 유효한 RGBA 색상 값이 아닌 경우 오류가 발생합니다.

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L118)

파란색(B) 채널 값을 가져오거나 설정합니다. (0 ~ 255)

##### Returns

`number`

0에서 255 사이의 파란색 값

#### Set Signature

> **set** **b**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`b`](ColorRGB.md#b)

***

***

### g

#### Get Signature

> **get** **g**(): `number`

Defined in: [src/color/ColorRGB.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L100)

초록색(G) 채널 값을 가져오거나 설정합니다. (0 ~ 255)

##### Returns

`number`

0에서 255 사이의 초록색 값

#### Set Signature

> **set** **g**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`g`](ColorRGB.md#g)

***

***

### hex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hex**(): `string`

Defined in: [src/color/ColorRGB.ts:176](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L176)

RGB 색상의 16진수(HEX) 문자열 표현을 반환합니다.

##### Returns

`string`

16진수 색상 문자열 (예: `"#FF8000"`)

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`hex`](ColorRGB.md#hex)

***

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L82)

빨간색(R) 채널 값을 가져오거나 설정합니다. (0 ~ 255)

##### Returns

`number`

0에서 255 사이의 빨간색 값

#### Set Signature

> **set** **r**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L86)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`r`](ColorRGB.md#r)

***

***

### rgb

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgb**(): `number`[]

Defined in: [src/color/ColorRGB.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L136)

색상의 RGB 값을 배열로 반환합니다.

##### Returns

`number`[]

`[r, g, b]` 형식의 숫자 배열

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgb`](ColorRGB.md#rgb)

***

***

### rgbNormal

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L148)

0에서 1 사이로 정규화된 RGB 값을 배열로 반환합니다.

##### Returns

`number`[]

정규화된 RGB 배열 `[r/255, g/255, b/255]`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgbNormal`](ColorRGB.md#rgbnormal)

***

***

### rgbNormalLinear

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L160)

감마 보정(2.2)이 적용된 선형(Linear) 정규화 RGB 값을 배열로 반환합니다.

##### Returns

`number`[]

감마 보정된 선형 정규화 RGB 배열

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgbNormalLinear`](ColorRGB.md#rgbnormallinear)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:222](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L222)

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

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`setColorByHEX`](ColorRGB.md#setcolorbyhex)

***

***

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L201)

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

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`setColorByRGB`](ColorRGB.md#setcolorbyrgb)

***

***

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L243)

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

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`setColorByRGBString`](ColorRGB.md#setcolorbyrgbstring)

</details>
