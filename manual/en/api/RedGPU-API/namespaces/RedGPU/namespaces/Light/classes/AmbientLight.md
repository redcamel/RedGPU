[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / AmbientLight

# Class: AmbientLight

Defined in: [src/light/lights/AmbientLight.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/AmbientLight.ts#L17)

Ambient light class that provides uniform base brightness and tint across the entire scene without directionality or shadows.

***

### Example
```typescript
const ambientLight = new RedGPU.Light.AmbientLight('#ADD8E6', 50);
scene.lightManager.ambientLight = ambientLight;
```

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new AmbientLight**(`color?`, `lux?`): `AmbientLight`

Defined in: [src/light/lights/AmbientLight.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/AmbientLight.ts#L36)

Creates a new AmbientLight instance.

#### Example
```typescript
const light = new RedGPU.Light.AmbientLight('#ffffff', 100);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color?` | `string` | `'#ADD8E6'` | Light color (HEX string, default: `'#ADD8E6'`) |
| `lux?` | `number` | `50` | Illuminance of the light (in Lux, default: `50`) |

#### Returns

`AmbientLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### lux

#### Get Signature

> **get** **lux**(): `number`

Defined in: [src/light/lights/AmbientLight.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/AmbientLight.ts#L49)

Gets or sets the illuminance (Lux) of the ambient light.

##### Returns

`number`

Illuminance value (Lux)

#### Set Signature

> **set** **lux**(`value`): `void`

Defined in: [src/light/lights/AmbientLight.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/AmbientLight.ts#L53)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L61)

Gets or sets the color (`ColorRGB`) instance of the light.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

`ColorRGB` instance of the light

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGB`](../../Color/classes/ColorRGB.md) |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`color`](../namespaces/Core/classes/ABaseLight.md#color)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/light/core/ABaseLight.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L45)

Gets or sets whether the visual light debugger is enabled.

##### Returns

`boolean`

Whether the debugger is enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L49)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

***

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/light/core/ABaseLight.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L80)

Gets or sets the light intensity multiplier (real number `0` or greater).

##### Returns

`number`

Light intensity multiplier

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/ABaseLight.ts#L84)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensityMultiplier`](../namespaces/Core/classes/ABaseLight.md#intensitymultiplier)

***

</details>
