[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / PointLight

# Class: PointLight

Defined in: [src/light/lights/PointLight.ts:25](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L25)

Class that defines a point light source.

This light radiates light in all directions from a specific position, and the range affected by the light can be set based on the radius.
* ### Example
```typescript
const light = new RedGPU.Light.PointLight('#ffcc00', 1.5);
light.setPosition(0, 5, 10);
scene.lightManager.addPointLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/" ></iframe>

Below is a list of additional sample examples to help understand the structure and behavior of PointLight.

## See

 - [PointLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightPerformance/)
 - [PointLight with glTF example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new PointLight**(`color?`, `lumen?`): `PointLight`

Defined in: [src/light/lights/PointLight.ts:63](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L63)

Creates a new PointLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | Color of the light (hex string, e.g., '#ffffff') |
| `lumen` | `number` | `1000` | Luminous flux of the light (Lumen, lm, default: 1,000) |

#### Returns

`PointLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/PointLight.ts:75](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L75)

Returns the luminous flux (Lumen, lm) of the light source.

##### Returns

`number`

Luminous flux value

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:86](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L86)

Sets the luminous flux (Lumen, lm) of the light source.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Luminous flux value (e.g., 1,000) |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/PointLight.ts:163](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L163)

Returns the position of the light in [x, y, z] format.

##### Returns

\[`number`, `number`, `number`\]

Position array [x, y, z]

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/PointLight.ts:174](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L174)

Returns the radius of the light.

##### Returns

`number`

Radius value

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:185](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L185)

Sets the radius of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Radius value (e.g., 5.0) |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/light/lights/PointLight.ts:97](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L97)

Returns the X coordinate.

##### Returns

`number`

X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:108](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L108)

Sets the X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/light/lights/PointLight.ts:119](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L119)

Returns the Y coordinate.

##### Returns

`number`

Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:130](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L130)

Sets the Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/light/lights/PointLight.ts:141](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L141)

Returns the Z coordinate.

##### Returns

`number`

Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:152](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L152)

Sets the Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

## Methods

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/PointLight.ts:202](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/PointLight.ts#L202)

Sets the position of the light.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X coordinate or [x, y, z] array |
| `y?` | `number` | Y coordinate (if x is a number) |
| `z?` | `number` | Z coordinate (if x is a number) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### drawDebugger

> **drawDebugger**: [`ADrawDebuggerLight`](../../Display/namespaces/drawDebugger/classes/ADrawDebuggerLight.md)\<[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)\>

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L22)

Helper object for debugging visualization of the light.

Set externally, it can visually display the position or direction of the light.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L84)

Returns the color of the light.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB object

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L95)

Sets the color of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGB`](../../Color/classes/ColorRGB.md) | ColorRGB object |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`color`](../namespaces/Core/classes/ABaseLight.md#color)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L62)

Returns whether the debugging visualization feature is enabled.

##### Returns

`boolean`

Whether enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L73)

Enables or disables the debugging visualization feature.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | If true, enables debugging feature |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L109)

Returns the intensity multiplier of the light.

##### Returns

`number`

Multiplier value

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/core/ABaseLight.ts#L120)

Sets the intensity multiplier of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Number value (e.g., 1.0) |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensityMultiplier`](../namespaces/Core/classes/ABaseLight.md#intensitymultiplier)

***


</details>
