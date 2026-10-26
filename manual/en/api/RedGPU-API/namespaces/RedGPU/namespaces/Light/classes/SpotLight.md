[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / SpotLight

# Class: SpotLight

Defined in: [src/light/lights/SpotLight.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L28)

Spot light class that emits a cone-shaped beam of light in a specific direction from a single point. Supports distance attenuation based on `radius` and smooth edge falloff between `innerCutoff` and `outerCutoff` angles.

***

### Example
```typescript
const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
spotLight.setPosition(0, 5, 5);
spotLight.lookAt(0, 0, 0);
spotLight.innerCutoff = 15;
spotLight.outerCutoff = 30;
scene.lightManager.addSpotLight(spotLight);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/" style="width:100%; height:500px;"></iframe>

## See

- [SpotLight basic example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/)
 - [SpotLight performance example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightPerformance/)
 - [SpotLight with GLTF example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new SpotLight**(`color?`, `lumen?`): `SpotLight`

Defined in: [src/light/lights/SpotLight.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L57)

Creates a SpotLight instance.

#### Example
```typescript
const light = new RedGPU.Light.SpotLight('#ffffff', 1000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color?` | `string` | `'#fff'` | Light color (HEX string, default: `'#fff'`) |
| `lumen?` | `number` | `1000` | Luminous flux of the light (in Lumens, default: `1000`) |

#### Returns

`SpotLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### direction

#### Get Signature

> **get** **direction**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L210)

Gets or sets the light direction vector (`[x, y, z]`).

##### Returns

\[`number`, `number`, `number`\]

Direction vector tuple (`[number, number, number]`)

#### Set Signature

> **set** **direction**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L214)

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

Defined in: [src/light/lights/SpotLight.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L162)

Gets or sets the X component of the light direction.

##### Returns

`number`

X component of the direction vector

#### Set Signature

> **set** **directionX**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L166)

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

Defined in: [src/light/lights/SpotLight.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L178)

Gets or sets the Y component of the light direction.

##### Returns

`number`

Y component of the direction vector

#### Set Signature

> **set** **directionY**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L182)

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

Defined in: [src/light/lights/SpotLight.ts:194](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L194)

Gets or sets the Z component of the light direction.

##### Returns

`number`

Z component of the direction vector

#### Set Signature

> **set** **directionZ**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L198)

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

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerSpotLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerSpotLight.md)

Defined in: [src/light/lights/SpotLight.ts:336](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L336)

Returns the visual debugger (`DrawDebuggerSpotLight`) instance for the spot light.

##### Returns

[`DrawDebuggerSpotLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerSpotLight.md)

Debugger instance (`DrawDebuggerSpotLight`)

***

***

### innerCutoff

#### Get Signature

> **get** **innerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:228](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L228)

Gets or sets the inner cone cutoff angle (in degrees) within which light intensity remains at maximum.

##### Returns

`number`

Inner cutoff angle (in degrees)

#### Set Signature

> **set** **innerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:232](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `degrees` | `number` |

##### Returns

`void`

***

***

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/SpotLight.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L70)

Gets or sets the luminous flux (Lumen) of the spot light.

##### Returns

`number`

Luminous flux value (Lumen)

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L74)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### outerCutoff

#### Get Signature

> **get** **outerCutoff**(): `number`

Defined in: [src/light/lights/SpotLight.ts:244](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L244)

Gets or sets the outer cone cutoff angle (in degrees) beyond which light completely falls off.

##### Returns

`number`

Outer cutoff angle (in degrees)

#### Set Signature

> **set** **outerCutoff**(`degrees`): `void`

Defined in: [src/light/lights/SpotLight.ts:248](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L248)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `degrees` | `number` |

##### Returns

`void`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/SpotLight.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L134)

Returns the world position coordinates (`[x, y, z]`) of the light source.

##### Returns

\[`number`, `number`, `number`\]

Position coordinate tuple (`[number, number, number]`)

***

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/SpotLight.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L146)

Gets or sets the maximum attenuation radius (`radius`) of the light.

##### Returns

`number`

Light radius

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/light/lights/SpotLight.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L86)

Gets or sets the world X coordinate of the light source.

##### Returns

`number`

X-axis coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/light/lights/SpotLight.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L102)

Gets or sets the world Y coordinate of the light source.

##### Returns

`number`

Y-axis coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/light/lights/SpotLight.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L118)

Gets or sets the world Z coordinate of the light source.

##### Returns

`number`

Z-axis coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/SpotLight.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/light/lights/SpotLight.ts:308](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L308)

Updates the direction vector (`direction`) so that the light points toward the specified target position.

#### Example
```typescript
// Point the light toward the origin
spotLight.lookAt(0, 0, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | Target X coordinate or `[x, y, z]` coordinate array |
| `targetY?` | `number` | Target Y coordinate (when `targetX` is a number) |
| `targetZ?` | `number` | Target Z coordinate (when `targetX` is a number) |

#### Returns

`void`

***

***

### render()

> **render**(`debugViewRenderState`): `void`

Defined in: [src/light/lights/SpotLight.ts:348](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L348)

Renders the spot light debugger gizmo when the debugger is enabled.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `debugViewRenderState` | [`RenderViewStateData`](../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | State data of the current render view (`RenderViewStateData`) |

#### Returns

`void`

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/light/lights/SpotLight.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/light/lights/SpotLight.ts#L277)

Sets the world position of the light source.

#### Example
```typescript
// Set position with individual coordinates
spotLight.setPosition(0, 5, 5);

// Set position with an array
spotLight.setPosition([0, 5, 5]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X-axis coordinate or `[x, y, z]` coordinate array |
| `y?` | `number` | Y-axis coordinate (when `x` is a number) |
| `z?` | `number` | Z-axis coordinate (when `x` is a number) |

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
