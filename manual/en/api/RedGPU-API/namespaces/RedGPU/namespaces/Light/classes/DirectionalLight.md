[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / DirectionalLight

# Class: DirectionalLight

Defined in: [src/light/lights/DirectionalLight.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L22)

Directional light class emitting parallel rays in a constant direction without distance attenuation, controlled via a direction vector (`direction`) or spherical coordinates (`elevation`, `azimuth`).

***

### Example
```typescript
const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
scene.lightManager.addDirectionalLight(directionalLight);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/" style="width:100%; height:500px;"></iframe>

## See

[DirectionalLight example](https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new DirectionalLight**(`direction?`, `color?`, `lux?`): `DirectionalLight`

Defined in: [src/light/lights/DirectionalLight.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L52)

Creates a new DirectionalLight instance.

#### Example
```typescript
const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#fff', 100000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `direction?` | \[`number`, `number`, `number`\] | `...` | Light direction vector (`[x, y, z]`, default: `[-1, -1, -1]`) |
| `color?` | `string` | `'#fff'` | Light color (HEX string, default: `'#fff'`) |
| `lux?` | `number` | `100000` | Illuminance of the light (in Lux, default: `100000`) |

#### Returns

`DirectionalLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### azimuth

#### Get Signature

> **get** **azimuth**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L99)

Gets or sets the azimuth angle (in degrees) of the light source. Changing this value automatically updates the `direction` vector.

##### Returns

`number`

Azimuth angle (in degrees)

#### Set Signature

> **set** **azimuth**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L103)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/DirectionalLight.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L167)

Gets or sets the light direction vector (`[x, y, z]`). Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).

##### Returns

\[`number`, `number`, `number`\]

Direction vector tuple (`[number, number, number]`)

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:171](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L171)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### directionX

#### Get Signature

> **get** **directionX**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L116)

Gets or sets the X component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).

##### Returns

`number`

X component of the direction vector

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L120)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### directionY

#### Get Signature

> **get** **directionY**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:133](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L133)

Gets or sets the Y component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).

##### Returns

`number`

Y component of the direction vector

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L137)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### directionZ

#### Get Signature

> **get** **directionZ**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L150)

Gets or sets the Z component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).

##### Returns

`number`

Z component of the direction vector

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L154)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerDirectionalLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerDirectionalLight.md)

Defined in: [src/light/lights/DirectionalLight.ts:186](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L186)

Returns the visual debugger (`DrawDebuggerDirectionalLight`) instance for the directional light.

##### Returns

[`DrawDebuggerDirectionalLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerDirectionalLight.md)

Debugger instance (`DrawDebuggerDirectionalLight`)

***

***

### elevation

#### Get Signature

> **get** **elevation**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L82)

Gets or sets the elevation angle (in degrees) of the light source. Changing this value automatically updates the `direction` vector.

##### Returns

`number`

Elevation angle (in degrees)

#### Set Signature

> **set** **elevation**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L86)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lux

#### Get Signature

> **get** **lux**(): `number`

Defined in: [src/light/lights/DirectionalLight.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L66)

Gets or sets the illuminance (Lux) of the directional light.

##### Returns

`number`

Illuminance value (Lux)

#### Set Signature

> **set** **lux**(`value`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### render()

> **render**(`debugViewRenderState`): `void`

Defined in: [src/light/lights/DirectionalLight.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/DirectionalLight.ts#L198)

Renders the directional light debugger gizmo when the debugger is enabled.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `debugViewRenderState` | [`RenderViewStateData`](../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | State data of the current render view (`RenderViewStateData`) |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### color

#### Get Signature

> **get** **color**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/light/core/ABaseLight.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L61)

Gets or sets the color (`ColorRGB`) instance of the light.

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

`ColorRGB` instance of the light

#### Set Signature

> **set** **color**(`value`): `void`

Defined in: [src/light/core/ABaseLight.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/core/ABaseLight.ts#L65)

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

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`enableDebugger`](../namespaces/Core/classes/ABaseLight.md#enabledebugger)

***

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

#### Inherited from

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`intensityMultiplier`](../namespaces/Core/classes/ABaseLight.md#intensitymultiplier)

***

</details>
