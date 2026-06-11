[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / SpotLight

# Class: SpotLight

Defined in: [src/light/lights/SpotLight.ts:26](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L26)

Class that defines a spotlight source.

This light radiates light in a specific direction from a certain position, and the spread of light can be controlled through inner/outer cutoff angles.
* ### Example
```typescript
const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
light.setPosition(0, 5, 10);
light.lookAt(0, 0, 0);
scene.lightManager.addSpotLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/" ></iframe>

Below is a list of additional sample examples to help understand the structure and behavior of SpotLight.

## See

 - [SpotLight Cluster Performance example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightPerformance/)
 - [SpotLight with glTF example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new SpotLight**(`color?`, `lumen?`): `SpotLight`

Defined in: [src/light/lights/SpotLight.ts:94](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L94)

Creates a new SpotLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#fff'` | Color of the light (hex string, e.g., '#ffffff') |
| `lumen` | `number` | `1000` | Luminous flux of the light (Lumen, lm, default: 1,000) |

#### Returns

`SpotLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:293](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L293)

Returns the direction vector of the light in [x, y, z] format.

##### Returns

\[`number`, `number`, `number`\]

Direction vector [x, y, z]

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:304](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L304)

Sets the direction vector of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | \[`number`, `number`, `number`\] | Direction vector in [x, y, z] format |

##### Returns

`void`

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/SpotLight.ts:227](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L227)

Returns the X component of the direction vector.

##### Returns

`number`

X component value

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:238](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L238)

Sets the X component of the direction vector.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X component value |

##### Returns

`void`

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/SpotLight.ts:249](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L249)

Returns the Y component of the direction vector.

##### Returns

`number`

Y component value

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:260](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L260)

Sets the Y component of the direction vector.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y component value |

##### Returns

`void`

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/SpotLight.ts:271](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L271)

Returns the Z component of the direction vector.

##### Returns

`number`

Z component value

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:282](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L282)

Sets the Z component of the direction vector.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z component value |

##### Returns

`void`

***

### innerCutoff

#### Get Signature

> **get** **innerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:317](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L317)

Returns the inner cutoff angle.

##### Returns

`number`

Angle (degrees)

#### Set Signature

> **set** **innerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:328](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L328)

Sets the inner cutoff angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `degrees` | `number` | Angle (degrees) |

##### Returns

`void`

***

### innerCutoffCos

#### Get Signature

> **get** **innerCutoffCos**(): `number`

Defined in: [src/light/lights/SpotLight.ts:364](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L364)

Returns the cosine value of the inner cutoff angle.

Used for shader calculations, etc.

##### Returns

`number`

Cosine value

***

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/SpotLight.ts:106](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L106)

Returns the luminous flux (Lumen, lm) of the light source.

##### Returns

`number`

Luminous flux value

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:117](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L117)

Sets the luminous flux (Lumen, lm) of the light source.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Luminous flux value (e.g., 1,000) |

##### Returns

`void`

***

### outerCutoff

#### Get Signature

> **get** **outerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:339](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L339)

Returns the outer cutoff angle.

##### Returns

`number`

Angle (degrees)

#### Set Signature

> **set** **outerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:350](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L350)

Sets the outer cutoff angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `degrees` | `number` | Angle (degrees) |

##### Returns

`void`

***

### outerCutoffCos

#### Get Signature

> **get** **outerCutoffCos**(): `number`

Defined in: [src/light/lights/SpotLight.ts:378](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L378)

Returns the cosine value of the outer cutoff angle.

Used for shader calculations, etc.

##### Returns

`number`

Cosine value

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:194](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L194)

Returns the position of the light in [x, y, z] format.

##### Returns

\[`number`, `number`, `number`\]

Position array [x, y, z]

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/SpotLight.ts:205](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L205)

Returns the radius of the light.

##### Returns

`number`

Radius value

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:216](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L216)

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

Defined in: [src/light/lights/SpotLight.ts:128](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L128)

Returns the X coordinate.

##### Returns

`number`

X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:139](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L139)

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

Defined in: [src/light/lights/SpotLight.ts:150](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L150)

Returns the Y coordinate.

##### Returns

`number`

Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:161](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L161)

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

Defined in: [src/light/lights/SpotLight.ts:172](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L172)

Returns the Z coordinate.

##### Returns

`number`

Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:183](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L183)

Sets the Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate |

##### Returns

`void`

## Methods

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/light/lights/SpotLight.ts:418](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L418)

Sets the direction vector to look at a specific target position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | Target X coordinate or [x, y, z] array |
| `targetY?` | `number` | Target Y coordinate (if targetX is a number) |
| `targetZ?` | `number` | Target Z coordinate (if targetX is a number) |

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/SpotLight.ts:395](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/lights/SpotLight.ts#L395)

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

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L22)

Helper object for debugging visualization of the light.

Set externally, it can visually display the position or direction of the light.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L84)

Returns the color of the light.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

ColorRGB object

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L95)

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

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L62)

Returns whether the debugging visualization feature is enabled.

##### Returns

`boolean`

Whether enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L73)

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

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L109)

Returns the intensity multiplier of the light.

##### Returns

`number`

Multiplier value

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/light/core/ABaseLight.ts#L120)

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
