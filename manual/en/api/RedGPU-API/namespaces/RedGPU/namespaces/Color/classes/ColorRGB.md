[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / ColorRGB

# Class: ColorRGB

Defined in: [src/color/ColorRGB.ts:36](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L36)


Class representing RGB color.


This class provides methods to create, manipulate, and convert RGB color values. It supports validation of color components and optional change notifications.
* ### Example
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

> **new ColorRGB**(`r`, `g`, `b`, `onChange`): `ColorRGB`

Defined in: [src/color/ColorRGB.ts:66](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L66)


Creates a new instance of the ColorRGB class.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `r` | `number` | `255` | Red component of the RGB color. Must be a value between 0 and 255. |
| `g` | `number` | `255` | Green component of the RGB color. Must be a value between 0 and 255. |
| `b` | `number` | `255` | Blue component of the RGB color. Must be a value between 0 and 255. |
| `onChange` | `Function` | `undefined` | Optional callback function called when the color changes. |

#### Returns

`ColorRGB`

#### Throws


Throws an error if RGB values are out of the 0-255 range.

## Accessors

### b

#### Get Signature

> **get** **b**(): `number`

Defined in: [src/color/ColorRGB.ts:154](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L154)


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

Defined in: [src/color/ColorRGB.ts:172](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L172)


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

***

### g

#### Get Signature

> **get** **g**(): `number`

Defined in: [src/color/ColorRGB.ts:119](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L119)


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

Defined in: [src/color/ColorRGB.ts:137](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L137)


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

***

### hex

#### Get Signature

> **get** **hex**(): `string`

Defined in: [src/color/ColorRGB.ts:242](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L242)


Returns the hexadecimal representation of the RGB color.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.hex); // "#FF8000"
```

##### Returns

`string`


Hexadecimal color value (e.g., "#FF8000")

***

### r

#### Get Signature

> **get** **r**(): `number`

Defined in: [src/color/ColorRGB.ts:84](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L84)


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

Defined in: [src/color/ColorRGB.ts:102](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L102)


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

***

### rgb

#### Get Signature

> **get** **rgb**(): `number`[]

Defined in: [src/color/ColorRGB.ts:190](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L190)


Returns an array containing the RGB values of the color.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgb); // [255, 128, 0]
```

##### Returns

`number`[]


Array of numbers representing RGB values in [r, g, b] format

***

### rgbNormal

#### Get Signature

> **get** **rgbNormal**(): `number`[]

Defined in: [src/color/ColorRGB.ts:206](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L206)


Returns normalized RGB values as an array. Each value is normalized between 0 and 1.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgbNormal); // [1, 0.501, 0]
```

##### Returns

`number`[]


Array containing normalized RGB values [r/255, g/255, b/255]

***

### rgbNormalLinear

#### Get Signature

> **get** **rgbNormalLinear**(): `number`[]

Defined in: [src/color/ColorRGB.ts:222](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L222)


Returns gamma-corrected (Linear) normalized RGB values as an array.
* ### Example
```typescript
const color = new RedGPU.Color.ColorRGB(255, 128, 0);
console.log(color.rgbNormalLinear);
```

##### Returns

`number`[]


Array containing gamma-corrected (2.2) normalized RGB values

## Methods

### setColorByHEX()

> **setColorByHEX**(`hexColor`): `void`

Defined in: [src/color/ColorRGB.ts:288](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L288)


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

***

### setColorByRGB()

> **setColorByRGB**(`r`, `g`, `b`): `void`

Defined in: [src/color/ColorRGB.ts:267](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L267)


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

***

### setColorByRGBString()

> **setColorByRGBString**(`rgbString`): `void`

Defined in: [src/color/ColorRGB.ts:309](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/color/ColorRGB.ts#L309)


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
