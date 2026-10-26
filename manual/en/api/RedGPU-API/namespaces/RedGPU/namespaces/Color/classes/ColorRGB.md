[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGB

# Class: ColorRGB

Defined in: [src/color/ColorRGB.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L38)

Class representing RGB color.

This class provides methods to create, manipulate, and convert RGB color values. It supports validation of color components and optional change notifications.
### Example
```typescript
// Create white
const white = new RedGPU.Color.ColorRGB();

// Create red
const red = new RedGPU.Color.ColorRGB(255, 0, 0);

// Create with change callback
const color = new RedGPU.Color.ColorRGB(100, 150, 200, () => console.log('Color changed'));

// Set color by hex
color.setColorByHEX('#FF5733');

// Get normalized values
const normalized = color.rgbNormal; // [1, 0.34, 0.2]
```

## Extended by

- [`ColorRGBA`](ColorRGBA.md)

## Constructors

### Constructor

> **new ColorRGB**(`r?`, `g?`, `b?`, `onChange?`): `ColorRGB`

Defined in: [src/color/ColorRGB.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L68)

Creates a new instance of the ColorRGB class.
#### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r?` | `number` | `255` | Red component of the RGB color. Must be a value between 0 and 255. |
| `g?` | `number` | `255` | Green component of the RGB color. Must be a value between 0 and 255. |
| `b?` | `number` | `255` | Blue component of the RGB color. Must be a value between 0 and 255. |
| `onChange?` | () => `void` | `undefined` | Optional callback function called when the color changes. |

#### Returns

`ColorRGB`

#### Throws

Throws an error if RGB values are out of the 0-255 range.

## Accessors

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L118)

Gets or sets the blue (B) channel value. (0 ~ 255)

##### Returns

`number`

Blue value between 0 and 255

#### Set Signature

> **set** **b**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L122)

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

Defined in: [src/color/ColorRGB.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L100)

Gets or sets the green (G) channel value. (0 ~ 255)

##### Returns

`number`

Green value between 0 and 255

#### Set Signature

> **set** **g**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L104)

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

Defined in: [src/color/ColorRGB.ts:176](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L176)

Returns the hexadecimal (HEX) string representation of the RGB color.

##### Returns

`string`

Hexadecimal color string (e.g., `"#FF8000"`)

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L82)

Gets or sets the red (R) channel value. (0 ~ 255)

##### Returns

`number`

Red value between 0 and 255

#### Set Signature

> **set** **r**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L86)

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

Defined in: [src/color/ColorRGB.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L136)

Returns an array containing the RGB values of the color.

##### Returns

`number`[]

Array of numbers in `[r, g, b]` format

***

### rgbNormal

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L148)

Returns normalized RGB values between 0 and 1 as an array.

##### Returns

`number`[]

Normalized RGB array `[r/255, g/255, b/255]`

***

### rgbNormalLinear

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L160)

Returns gamma-corrected (2.2) linear normalized RGB values as an array.

##### Returns

`number`[]

Gamma-corrected linear normalized RGB array

## Methods

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:222](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L222)

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

***

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L201)

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

***

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/color/ColorRGB.ts#L243)

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
