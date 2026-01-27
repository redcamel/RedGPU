[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGBA

# Class: ColorRGBA

Defined in: [src/color/ColorRGBA.ts:35](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L35)


Class representing a color with red, green, blue, and alpha (transparency) values.


Inherits from the ColorRGB class and adds transparency functionality. This class provides methods to create, manipulate, and convert RGBA color values, allowing transparency handling via the alpha channel.
* ### Example
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

### Constructor

> **new ColorRGBA**(`r`, `g`, `b`, `a`, `onChange`): `ColorRGBA`

Defined in: [src/color/ColorRGBA.ts:66](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L66)


Creates a new instance of the ColorRGBA class.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.75);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r` | `number` | `255` | Red component of the RGB color. Must be a value between 0 and 255. |
| `g` | `number` | `255` | Green component of the RGB color. Must be a value between 0 and 255. |
| `b` | `number` | `255` | Blue component of the RGB color. Must be a value between 0 and 255. |
| `a` | `number` | `1` | Alpha (transparency) component of the color. Must be a value between 0 (fully transparent) and 1 (fully opaque). |
| `onChange` | `Function` | `undefined` | Optional callback function called when the color changes. |

#### Returns

`ColorRGBA`

#### Throws


Throws an error if RGB values are out of the 0-255 range or alpha value is out of the 0-1 range.

#### Overrides

[`ColorRGB`](ColorRGB.md).[`constructor`](ColorRGB.md#constructor)

## Accessors

### a

#### Get Signature

> **get** **a**(): `number`

Defined in: [src/color/ColorRGBA.ts:84](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L84)


Gets the alpha (transparency) component.
* ### Example
```typescript
const a = color.a;
```

##### Returns

`number`


Alpha value between 0 (fully transparent) and 1 (fully opaque)

#### Set Signature

> **set** **a**(`value`): `void`

Defined in: [src/color/ColorRGBA.ts:102](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L102)


Sets the alpha (transparency) component.
* ### Example
```typescript
color.a = 0.5;
```

##### Throws


Throws an error if the value is out of the 0-1 range.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Alpha value to set (0-1) |

##### Returns

`void`

***

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:154](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L154)


Gets the blue component.
* ### Example
```typescript
const b = color.b;
```

##### Returns

`number`


Blue value between 0 and 255

#### Set Signature

> **set** **b**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:172](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L172)


Sets the blue component.
* ### Example
```typescript
color.b = 255;
```

##### Throws


Throws an error if the value is out of the 0-255 range.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Blue value to set (0-255) |

##### Returns

`void`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`b`](ColorRGB.md#b)

***

### g

#### Get Signature

> **get** **g**(): `number`

Defined in: [src/color/ColorRGB.ts:119](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L119)


Gets the green component.
* ### Example
```typescript
const g = color.g;
```

##### Returns

`number`


Green value between 0 and 255

#### Set Signature

> **set** **g**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:137](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L137)


Sets the green component.
* ### Example
```typescript
color.g = 255;
```

##### Throws


Throws an error if the value is out of the 0-255 range.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Green value to set (0-255) |

##### Returns

`void`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`g`](ColorRGB.md#g)

***

### hex

#### Get Signature

> **get** **hex**(): `string`

Defined in: [src/color/ColorRGB.ts:242](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L242)


Returns the hexadecimal representation of the RGB color.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.hex); // "#FF8000"
```

##### Returns

`string`


Hexadecimal color value (e.g., "#FF8000")

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`hex`](ColorRGB.md#hex)

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:84](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L84)


Gets the red component.
* ### Example
```typescript
const r = color.r;
```

##### Returns

`number`


Red value between 0 and 255

#### Set Signature

> **set** **r**(`value`): `void`

Defined in: [src/color/ColorRGB.ts:102](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L102)


Sets the red component.
* ### Example
```typescript
color.r = 255;
```

##### Throws


Throws an error if the value is out of the 0-255 range.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Red value to set (0-255) |

##### Returns

`void`

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`r`](ColorRGB.md#r)

***

### rgb

#### Get Signature

> **get** **rgb**(): `number`[]

Defined in: [src/color/ColorRGB.ts:190](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L190)


Returns an array containing the RGB values of the color.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgb); // [255, 128, 0]
```

##### Returns

`number`[]


Array of numbers representing RGB values in [r, g, b] format

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgb`](ColorRGB.md#rgb)

***

### rgba

#### Get Signature

> **get** **rgba**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:120](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L120)


Returns an array containing the RGBA values of the color.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgba); // [255, 128, 0, 0.8]
```

##### Returns

`number`[]


Array of numbers representing RGBA values in [r, g, b, a] format

***

### rgbaNormal

#### Get Signature

> **get** **rgbaNormal**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:139](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L139)


Returns normalized RGBA values as an array.


RGB values are normalized between 0 and 1, and the alpha value is already normalized.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgbaNormal); // [1, 0.501, 0, 0.8]
```

##### Returns

`number`[]


Array containing normalized RGBA values [r/255, g/255, b/255, a]

***

### rgbaNormalLinear

#### Get Signature

> **get** **rgbaNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGBA.ts:155](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L155)


Returns gamma-corrected (Linear) normalized RGBA values as an array.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGBA(255, 128, 0, 0.8);
console.log(color.rgbaNormalLinear);
```

##### Returns

`number`[]


Array containing gamma-corrected (2.2) normalized RGBA values

***

### rgbNormal

#### Get Signature

> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:206](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L206)


Returns normalized RGB values as an array. Each value is normalized between 0 and 1.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgbNormal); // [1, 0.501, 0]
```

##### Returns

`number`[]


Array containing normalized RGB values [r/255, g/255, b/255]

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgbNormal`](ColorRGB.md#rgbnormal)

***

### rgbNormalLinear

#### Get Signature

> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:222](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L222)


Returns gamma-corrected (Linear) normalized RGB values as an array.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgbNormalLinear);
```

##### Returns

`number`[]


Array containing gamma-corrected (2.2) normalized RGB values

#### Inherited from

[`ColorRGB`](ColorRGB.md).[`rgbNormalLinear`](ColorRGB.md#rgbnormallinear)

## Methods

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:288](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L288)


Sets the color of the object using a hexadecimal color code.
* ### Example
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

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:267](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L267)


Sets the color of the object based on the provided RGB values.
* ### Example
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

### setColorByRGBA()

> **setColorByRGBA**(`r`, `g`, `b`, `a`): `void`

Defined in: [src/color/ColorRGBA.ts:188](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L188)


Sets the color of the object using RGBA values.
* ### Example
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

### setColorByRGBAString()

> **setColorByRGBAString**(`rgbaString`): `void`

Defined in: [src/color/ColorRGBA.ts:214](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGBA.ts#L214)


Sets the color of the object using an RGBA string.
* ### Example
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

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:309](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/color/ColorRGB.ts#L309)


Parses a string representing an RGB color value and sets the object's color.
* ### Example
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
