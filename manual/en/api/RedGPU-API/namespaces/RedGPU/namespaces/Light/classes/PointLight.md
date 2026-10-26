[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / PointLight

# Class: PointLight

Defined in: [src/light/lights/PointLight.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L26)

Point light class that emits light uniformly in all directions from a single point. Light intensity attenuates with distance within the configured `radius`.

***

### Example
```typescript
const pointLight = new RedGPU.Light.PointLight('#ffcc00', 1000);
pointLight.setPosition(0, 5, 0);
pointLight.radius = 15;
scene.lightManager.addPointLight(pointLight);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/" style="width:100%; height:500px;"></iframe>

## See

- [PointLight basic example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/)
 - [PointLight performance example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightPerformance/)
 - [PointLight with GLTF example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLightWithGltf/)

## Extends

- [`ABaseLight`](../namespaces/Core/classes/ABaseLight.md)

## Constructors



***

### Constructor

> **new PointLight**(`color?`, `lumen?`): `PointLight`

Defined in: [src/light/lights/PointLight.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L50)

Creates a PointLight instance.

#### Example
```typescript
const light = new RedGPU.Light.PointLight('#ffffff', 1000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `color?` | `string` | `'#fff'` | Light color (HEX string, default: `'#fff'`) |
| `lumen?` | `number` | `1000` | Luminous flux of the light (in Lumens, default: `1000`) |

#### Returns

`PointLight`

#### Overrides

[`ABaseLight`](../namespaces/Core/classes/ABaseLight.md).[`constructor`](../namespaces/Core/classes/ABaseLight.md#constructor)

## Accessors



***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerPointLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerPointLight.md)

Defined in: [src/light/lights/PointLight.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L190)

Returns the visual debugger (`DrawDebuggerPointLight`) instance for the point light.

##### Returns

[`DrawDebuggerPointLight`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerPointLight.md)

Debugger instance (`DrawDebuggerPointLight`)

***

***

### lumen

#### Get Signature

> **get** **lumen**(): `number`

Defined in: [src/light/lights/PointLight.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L63)

Gets or sets the luminous flux (Lumen) of the point light.

##### Returns

`number`

Luminous flux value (Lumen)

#### Set Signature

> **set** **lumen**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L67)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/light/lights/PointLight.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L127)

Returns the world position coordinates (`[x, y, z]`) of the light source.

##### Returns

\[`number`, `number`, `number`\]

Position coordinate tuple (`[number, number, number]`)

***

***

### radius

#### Get Signature

> **get** **radius**(): `number`

Defined in: [src/light/lights/PointLight.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L139)

Gets or sets the maximum attenuation radius (`radius`) of the light.

##### Returns

`number`

Light radius

#### Set Signature

> **set** **radius**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L143)

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

Defined in: [src/light/lights/PointLight.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L79)

Gets or sets the world X coordinate of the light source.

##### Returns

`number`

X-axis coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L83)

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

Defined in: [src/light/lights/PointLight.ts:95](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L95)

Gets or sets the world Y coordinate of the light source.

##### Returns

`number`

Y-axis coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L99)

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

Defined in: [src/light/lights/PointLight.ts:111](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L111)

Gets or sets the world Z coordinate of the light source.

##### Returns

`number`

Z-axis coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/light/lights/PointLight.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L115)

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

Defined in: [src/light/lights/PointLight.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L202)

Renders the point light debugger gizmo when the debugger is enabled.

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

Defined in: [src/light/lights/PointLight.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/lights/PointLight.ts#L172)

Sets the world position of the light source.

#### Example
```typescript
// Set position with individual coordinates
pointLight.setPosition(10, 5, -3);

// Set position with an array
pointLight.setPosition([10, 5, -3]);
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
