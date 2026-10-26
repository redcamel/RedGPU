[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L47)

Skybox class that renders an infinite distant background for a 3D scene using a cubemap texture.

Supports physical luminance (Nit), intensity multiplier, blur, opacity control, and real-time texture transition effects using a noise mask.

***

### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" style="width:100%; height:500px;"></iframe>

## See

- [SkyBox basic example](https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/)
 - [SkyBox IBL example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 - [SkyBox transition example](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 - [SkyBox transition with noise texture](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SkyBox**(`redGPUContext`, `texture`, `luminance?`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L94)

Creates a SkyBox instance.

#### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, 25000);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | Cube texture object to use as the background |
| `luminance?` | `number` | `25000` | Physical luminance (unit: Nit, default: 25000) |

#### Returns

`SkyBox`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L57)

Vertex GPU render info object

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L52)

Skybox model transformation matrix

## Accessors



***

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:165](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L165)

Gets or sets the blur strength (0.0 to 1.0) of the background texture.

##### Returns

`number`

Blur strength (0.0 to 1.0)

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:169](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L149)

Gets or sets the intensity multiplier for visual brightness adjustment.

##### Returns

`number`

Intensity multiplier

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L153)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L132)

Gets or sets the luminance value (Nit) for physical optics simulation.

##### Returns

`number`

Luminance value (unit: Nit)

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L182)

Gets or sets the opacity (0.0 to 1.0) of the skybox background.

##### Returns

`number`

Opacity (0.0 to 1.0)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### texture

#### Get Signature

> **get** **texture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L114)

Gets or sets the current cube texture applied as the skybox background.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Current cube texture instance

#### Set Signature

> **set** **texture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) |

##### Returns

`void`

***

***

### transitionTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **transitionTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L199)

Returns the target cube texture of the texture transition animation.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Target cube texture for transition

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:297](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L297)

Destroys the SkyBox instance and releases allocated GPU resources.

#### Returns

`void`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:238](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L238)

Renders the skybox and updates any active texture transition state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

***

***

### transition()

> **transition**(`targetTexture`, `duration?`, `mask`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:222](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyboxs/skyBox/SkyBox.ts#L222)

Starts an animation that transitions the background to the specified target cube texture.

#### Example
```typescript
skybox.transition(nextCubeTexture, 500, noiseTexture);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `targetTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | Target cube texture to transition to |
| `duration?` | `number` | `300` | Transition duration (unit: ms, default: 300) |
| `mask` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | Noise mask texture to use for the transition effect |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
