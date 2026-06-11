[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / DirectionalLight

# Class: DirectionalLight

Defined in: [src/light/lights/DirectionalLight.ts:19](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L19)

Class that defines a directional light source.

This light projects light uniformly in a specific direction and is used to implement effects like sunlight. It operates based on direction rather than position and is suitable for shadow generation and light simulation.
* ### Example
```typescript
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/" ></iframe>

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new DirectionalLight**(`direction?`, `color?`, `lux?`): `DirectionalLight`

Defined in: [src/light/lights/DirectionalLight.ts:42](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L42)

Creates a new DirectionalLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `direction` | \[`number`, `number`, `number`\] | `...` | Direction vector of the light [x, y, z] |
| `color` | `string` | `'#fff'` | Color of the light (hex string, e.g., '#ffcc00') |
| `lux` | `number` | `100000` | Illuminance of the light (Lux, lx, default: 100,000) |

#### Returns

`DirectionalLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### azimuth

#### Get Signature

> **get** **azimuth**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:87](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L87)

Azimuth of the light source (degrees).

##### Returns

`number`

#### Set Signature

> **set** **azimuth**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:91](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/DirectionalLight.ts:139](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L139)

Returns the full direction vector of the light.

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:147](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L147)

Sets the full direction vector of the light.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:100](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L100)

X direction vector value of the light.

##### Returns

`number`

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:104](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:113](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L113)

Y direction vector value of the light.

##### Returns

`number`

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:117](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:126](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L126)

Z direction vector value of the light.

##### Returns

`number`

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:130](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L130)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### elevation

#### Get Signature

> **get** **elevation**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:74](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L74)

Elevation of the light source (degrees).

##### Returns

`number`

#### Set Signature

> **set** **elevation**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:78](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L78)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### lux

#### Get Signature

> **get** **lux**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:55](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L55)

Returns the illuminance (Lux, lx) of the light source.

##### Returns

`number`

Illuminance value

#### Set Signature

> **set** **lux**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:66](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/light/lights/DirectionalLight.ts#L66)

Sets the illuminance (Lux, lx) of the light source.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Illuminance value (e.g., 100,000) |

##### Returns

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
