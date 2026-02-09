[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / AmbientLight

# Class: AmbientLight

Defined in: [src/light/lights/AmbientLight.ts:18](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/lights/AmbientLight.ts#L18)


Class that defines AmbientLight.


Basic lighting that spreads uniformly across the scene, providing the same brightness to all objects without shadows or directionality. Mainly used for adjusting the overall atmosphere or as base lighting.
* ### Example
```typescript
const ambient = new RedGPU.Light.AmbientLight();
scene.lightManager.ambientLight = ambient;
```

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors

### Constructor

> **new AmbientLight**(`color`, `intensity`): `AmbientLight`

Defined in: [src/light/lights/AmbientLight.ts:29](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/lights/AmbientLight.ts#L29)


Creates a new AmbientLight instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color` | `string` | `'#ADD8E6'` | Color of the light (default: light sky blue #ADD8E6) |
| `intensity` | `number` | `0.1` | Intensity of the light (default: 0.1) |

#### Returns

`AmbientLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Properties

### drawDebugger

> **drawDebugger**: `ADrawDebuggerLight`

Defined in: [src/light/core/ABaseLight.ts:20](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L20)


Helper object for debugging visualization of the light.


Set externally, it can visually display the position or direction of the light.

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`drawDebugger`](../namespaces/Core/classes/ABaseLight.md#drawdebugger)

## Accessors

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:82](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L82)


Returns the color of the light.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)


ColorRGB object

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:93](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L93)


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

Defined in: [src/light/core/ABaseLight.ts:60](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L60)


Returns whether the debugging visualization feature is enabled.

##### Returns

`boolean`


Whether enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:71](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L71)


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

### intensity

#### Get Signature

> **get** **intensity**(): `number`

Defined in: [src/light/core/ABaseLight.ts:104](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L104)


Returns the intensity of the light.

##### Returns

`number`


Intensity value

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:115](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/light/core/ABaseLight.ts#L115)


Sets the intensity of the light.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Number value (e.g., 1.0) |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensity`](../namespaces/Core/classes/ABaseLight.md#intensity)
