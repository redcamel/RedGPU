[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / ABaseLight

# Abstract Class: ABaseLight

Defined in: [src/light/core/ABaseLight.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L16)

Abstract class that defines common properties (`color`, `intensityMultiplier`, `enableDebugger`) for all lights.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extended by

- [`AmbientLight`](../../../classes/AmbientLight.md)
- [`PointLight`](../../../classes/PointLight.md)
- [`SpotLight`](../../../classes/SpotLight.md)
- [`DirectionalLight`](../../../classes/DirectionalLight.md)

## Constructors

### Constructor

> **new ABaseLight**(`color`, `intensityMultiplier?`): `ABaseLight`

Defined in: [src/light/core/ABaseLight.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L32)

Initializes the ABaseLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) | `undefined` | Base color of the light (`ColorRGB` instance) |
| `intensityMultiplier?` | `number` | `1` | Light intensity multiplier (default: `1`) |

#### Returns

`ABaseLight`

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L61)

Gets or sets the color (`ColorRGB`) instance of the light.

##### Returns

[`ColorRGB`](../../../../Color/classes/ColorRGB.md)

`ColorRGB` instance of the light

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGB`](../../../../Color/classes/ColorRGB.md) |

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L45)

Gets or sets whether the visual light debugger is enabled.

##### Returns

`boolean`

Whether the debugger is enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L49)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L80)

Gets or sets the light intensity multiplier (real number `0` or greater).

##### Returns

`number`

Light intensity multiplier

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L84)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
