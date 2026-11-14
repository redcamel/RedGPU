[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGBA

# Class: ColorRGBA

Defined in: [src/color/ColorRGBA.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L38)

Class representing a color with red, green, blue, and alpha (transparency) values.

Inherits from the ColorRGB class and adds transparency functionality. This class provides methods to create, manipulate, and convert RGBA color values, allowing transparency handling via the alpha channel.

***

### Example
```typescript
// Create opaque white
const white = new RedGPU.Color.ColorRGBA();

// Create semi-transparent red
const semiTransparentRed = new RedGPU.Color.ColorRGBA(255, 0, 0, 0.5);

// Create with change callback
const color = new RedGPU.Color.ColorRGBA(100, 150, 200, 0.8, () => console.log('Color changed'));

// Set color by RGBA string
color.setColorByRGBAString('rgba(255, 87, 51, 0.7)');

// Get normalized values
const normalized = color.rgbaNormal; // [1, 0.34, 0.2, 0.7]
```

## Extends

- [`ColorRGB`](ColorRGB.md)

## Constructors



***

### Constructor

> **new ColorRGBA**(`r?`, `g?`, `b?`, `a?`, `onChange?`): `ColorRGBA`

Defined in: [src/color/ColorRGBA.ts:72](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L72)

Creates a new instance of the ColorRGBA class.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.75);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r?` | `number` | `255` | Red component of the RGB color. Must be a value between 0 and 255. |
| `g?` | `number` | `255` | Green component of the RGB color. Must be a value between 0 and 255. |
| `b?` | `number` | `255` | Blue component of the RGB color. Must be a value between 0 and 255. |
| `a?` | `number` | `1` | Alpha (transparency) component of the color. Must be a value between 0 (fully transparent) and 1 (fully opaque). |
| `onChange?` | () => `void` | `undefined` | Optional callback function called when the color changes. |

#### Returns

`ColorRGBA`

#### Throws

Throws an error if RGB values are out of the 0-255 range or alpha value is out of the 0-1 range.

#### Overrides

[`ColorRGB`](ColorRGB.md).[`constructor`](ColorRGB.md#constructor)

## Accessors



***

### a

#### Get Signature

> **get** **a**(): `number`

Defined in: [src/color/ColorRGBA.ts:91](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L91)

Gets or sets the alpha (transparency) component.
#### Example
```typescript
const a = color.a;
color.a = 0.5;
```

##### Returns

`number`

Alpha value between 0 (fully transparent) and 1 (fully opaque)

#### Set Signature

> **set** **a**(`value`): `void`

Defined in: [src/color/ColorRGBA.ts:95](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L95)

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

Defined in: [src/color/ColorRGBA.ts:113](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L113)

Returns an array containing the RGBA values of the color.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgba); // [255, 128, 0, 0.8]
```

##### Returns

`number`[]

Array of numbers representing RGBA values in [r, g, b, a] format

***

***

### rgbaNormal

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbaNormal**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:137](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L137)

Returns normalized RGBA values as an array.

RGB values are normalized between 0 and 1, and the alpha value is already normalized.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgbaNormal); // [1, 0.501, 0, 0.8]
```

##### Returns

`number`[]

Array containing normalized RGBA values [r/255, g/255, b/255, a]

***

***

### rgbaNormalLinear

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbaNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:158](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L158)

Returns linear normalized RGBA values converted with the standard sRGB transfer function (IEC 61966-2-1) as an array. The alpha value is not converted.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgbaNormalLinear); // [1, 0.2158..., 0, 0.8]
```

##### Returns

`number`[]

Array containing linear normalized RGBA values

***

## Methods



***

### setColorByRGBA()

> **setColorByRGBA**(`r`, `g`, `b`, `a`): `void`

Defined in: [src/color/ColorRGBA.ts:191](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L191)

Sets the color of the object using RGBA values.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGBA();
color.setColorByRGBA(255, 128, 0, 0.6);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | Red component of the color. Must be a value between 0 and 255. |
| `g` | `number` | Green component of the color. Must be a value between 0 and 255. |
| `b` | `number` | Blue component of the color. Must be a value between 0 and 255. |
| `a` | `number` | Alpha (transparency) component of the color. Must be a value between 0 and 1. |

#### Returns

`void`

#### Throws

Throws an error if RGBA color values are invalid.

***

***

### setColorByRGBAString()

> **setColorByRGBAString**(`rgbaString`): `void`

Defined in: [src/color/ColorRGBA.ts:214](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGBA.ts#L214)

Sets the color of the object using an RGBA string.
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
| `rgbaString` | `string` | String representing RGBA color values in "rgba(r, g, b, a)" format |

#### Returns

`void`

#### Throws

Throws an error if the provided rgbaString is not a valid RGBA color value.

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:120](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L120)

Gets or sets the blue (B) channel value. (0 ~ 255)

##### Returns

`number`

Blue value between 0 and 255

#### Set Signature

> **set** **b**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:124](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L124)

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

Defined in: [src/color/ColorRGB.ts:102](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L102)

Gets or sets the green (G) channel value. (0 ~ 255)

##### Returns

`number`

Green value between 0 and 255

#### Set Signature

> **set** **g**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:106](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L106)

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

Defined in: [src/color/ColorRGB.ts:181](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L181)

Returns the hexadecimal (HEX) string representation of the RGB color.

##### Returns

`string`

Hexadecimal color string (e.g., `"#FF8000"`)

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`hex`](ColorRGB.md#hex)

***

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:84](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L84)

Gets or sets the red (R) channel value. (0 ~ 255)

##### Returns

`number`

Red value between 0 and 255

#### Set Signature

> **set** **r**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:88](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L88)

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

Defined in: [src/color/ColorRGB.ts:138](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L138)

Returns an array containing the RGB values of the color.

##### Returns

`number`[]

Array of numbers in `[r, g, b]` format

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgb`](ColorRGB.md#rgb)

***

***

### rgbNormal

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:150](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L150)

Returns normalized RGB values between 0 and 1 as an array.

##### Returns

`number`[]

Normalized RGB array `[r/255, g/255, b/255]`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgbNormal`](ColorRGB.md#rgbnormal)

***

***

### rgbNormalLinear

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:165](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L165)

Returns linear RGB values in the 0~1 range converted with the standard sRGB transfer function (IEC 61966-2-1) as an array.

Returns a reused internal buffer to avoid hot-path heap allocation. Copy the values if they need to be retained.

##### Returns

`number`[]

Linear normalized RGB array

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgbNormalLinear`](ColorRGB.md#rgbnormallinear)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:227](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L227)

Sets the color of the object using a hexadecimal color code.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByHEX('#FF8000');
color.setColorByHEX(0xFF8000);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hexColor` | `string` \| `number` | Hexadecimal color code to set the color (string or number) |

#### Returns

`void`

#### Throws

Throws an error if the hexadecimal color code is invalid.

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`setColorByHEX`](ColorRGB.md#setcolorbyhex)

***

***

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:206](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L206)

Sets the color of the object based on the provided RGB values.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | Red value in the range of 0-255 |
| `g` | `number` | Green value in the range of 0-255 |
| `b` | `number` | Blue value in the range of 0-255 |

#### Returns

`void`

#### Throws

Throws an error if RGB values are out of the 0-255 range.

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`setColorByRGB`](ColorRGB.md#setcolorbyrgb)

***

***

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:248](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/ColorRGB.ts#L248)

Parses a string representing an RGB color value and sets the object's color.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB();
color.setColorByRGBString('rgb(255, 128, 0)');
color.setColorByRGBString('rgb( 255 , 128 , 0 )');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rgbString` | `string` | String representing RGB color values in "rgb(r, g, b)" format |

#### Returns

`void`

#### Throws

Throws an error if the provided rgbString is not a valid RGB color value.

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`setColorByRGBString`](ColorRGB.md#setcolorbyrgbstring)

</details>
