[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:57](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L57)

Skybox class used as the distant view and environment map information for 3D scenes.

Renders an infinite background space using a cube map texture. It supports physical luminance configuration suitable for PBR, artistic intensity multipliers, real-time transition effects, and control over blur and opacity.

### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" ></iframe>

Below is a list of additional sample examples to help understand the structure and operation of SkyBox.

## See

 - [SkyBox basic example](https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/)
 - [SkyBox transition example](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 - [SkyBox transition example2](https://redcamel.github.io/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SkyBox**(`redGPUContext`, `texture`, `luminance?`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:97](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L97)

Creates an instance of SkyBox.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU context instance |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | Cube texture object to use as the background |
| `luminance` | `number` | `25000` | Physical luminance (unit: cd/m² or Nit, default: 25000 Nit) |

#### Returns

`SkyBox`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:67](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L67)

GPU rendering and globalStruct information object

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:62](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L62)

Skybox mesh model transformation matrix

## Accessors

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:152](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L152)

Gets or sets the blur strength (0.0 to 1.0) of the background texture.

##### Returns

`number`

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:156](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L156)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:140](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L140)

Gets or sets the intensity multiplier to adjust visual lighting strength.

##### Returns

`number`

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:144](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L144)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:127](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L127)

Gets or sets the luminance value (Nit) for physical optics simulation.

##### Returns

`number`

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:131](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L131)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:165](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L165)

Gets or sets the final opacity (0.0 to 1.0) of the skybox background.

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:169](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### texture

#### Get Signature

> **get** **texture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:113](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L113)

Gets or sets the current cube texture applied as the skybox background.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

#### Set Signature

> **set** **texture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:117](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) |

##### Returns

`void`

***

### transitionTexture

#### Get Signature

> **get** **transitionTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:178](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L178)

Gets the target texture during a texture transition animation.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:210](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L210)

Draws the skybox on the screen background. If a texture transition is in progress, computes and uploads progress based on elapsed time.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Current view and render state data |

#### Returns

`void`

***

### transition()

> **transition**(`targetTexture`, `duration?`, `mask`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:195](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/skyboxs/skyBox/SkyBox.ts#L195)

Starts a masking animation to smoothly transition the background to the specified target cube texture.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `targetTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md) | `undefined` | The new target cube texture to transition to |
| `duration` | `number` | `300` | The duration of the transition (in ms, default: 300) |
| `mask` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | Noise mask texture to apply to the transition effect |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
