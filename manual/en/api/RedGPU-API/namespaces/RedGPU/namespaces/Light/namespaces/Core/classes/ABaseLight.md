[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / ABaseLight

# Abstract Class: ABaseLight

Defined in: [src/light/core/ABaseLight.ts:14](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L14)

Abstract class serving as the base for all light classes.

Includes color, intensity, and debugging visualization features, serving as a base for various light classes like DirectionalLight and PointLight.

## Extended by

- [`AmbientLight`](../../../classes/AmbientLight.md)
- [`PointLight`](../../../classes/PointLight.md)
- [`SpotLight`](../../../classes/SpotLight.md)
- [`DirectionalLight`](../../../classes/DirectionalLight.md)

## Constructors

### Constructor

> `protected` **new ABaseLight**(`color`, `intensityMultiplier?`): `ABaseLight`

Defined in: [src/light/core/ABaseLight.ts:50](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L50)

Creates a new ABaseLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | `undefined` | Color of the light (ColorRGB object) |
| `intensityMultiplier` | `number` | `1` | Intensity multiplier of the light (default: 1) |

#### Returns

`ABaseLight`

## Properties

### drawDebugger

> **drawDebugger**: [`ADrawDebuggerLight`](../../../../Display/namespaces/drawDebugger/classes/ADrawDebuggerLight.md)\<`ABaseLight`\>

Defined in: [src/light/core/ABaseLight.ts:22](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L22)

Helper object for debugging visualization of the light.

Set externally, it can visually display the position or direction of the light.

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L84)

Returns the color of the light.

##### Returns

[`ColorRGB`](../../../../Color/classes/ColorRGB.md)

ColorRGB object

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:95](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L95)

Sets the color of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | ColorRGB object |

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:62](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L62)

Returns whether the debugging visualization feature is enabled.

##### Returns

`boolean`

Whether enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:73](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L73)

Enables or disables the debugging visualization feature.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | If true, enables debugging feature |

##### Returns

`void`

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:109](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L109)

Returns the intensity multiplier of the light.

##### Returns

`number`

Multiplier value

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:120](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/ABaseLight.ts#L120)

Sets the intensity multiplier of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Number value (e.g., 1.0) |

##### Returns

`void`
