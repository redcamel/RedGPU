[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:71](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L71)


Skybox class used as the background for 3D scenes.


Renders a 360-degree environment using cube textures, providing smooth transitions between textures, blur, exposure, and transparency control.


Supports both regular 6-image cubemaps (`CubeTexture`) and IBL cubemaps (`IBLCubeTexture`) converted from HDR files.

::: info

To use an HDR (.hdr) file, you must pass the `environmentTexture` converted to a cubemap via `RedGPU.Resource.IBL`.
:::

### Example
```typescript
// 1. 일반 큐브 텍스처 사용 (Using regular CubeTexture)
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);

// 2. HDR 파일을 IBL을 통해 사용 (Using HDR file via IBL)
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'assets/env.hdr');
const skyboxHDR = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

view.skybox = skybox;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/"></iframe>

## See


Below is a list of additional sample examples to help understand the structure and operation of Skybox.
 - [Skybox using HDRTexture](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 - [Skybox using IBL](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithIbl/)

## Constructors

### Constructor

> **new SkyBox**(`redGPUContext`, `cubeTexture`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:156](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L156)


Creates a new SkyBox instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU rendering context |
| `cubeTexture` | [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | Cube texture to use for the skybox (Regular or IBL) |

#### Returns

`SkyBox`

#### Throws


Throws Error if redGPUContext is invalid

## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:81](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L81)


GPU rendering information object

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:76](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L76)


Model transformation matrix (4x4 matrix)

## Accessors

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:196](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L196)


Returns the skybox blur amount.

##### Returns

`number`

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:210](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L210)


Sets the skybox blur amount.

##### Throws


Throws Error if value is out of range

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Blur value between 0.0 and 1.0 |

##### Returns

`void`

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:220](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L220)


Returns the skybox opacity.

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:234](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L234)


Sets the skybox opacity.

##### Throws


Throws Error if value is out of range

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Opacity value between 0.0 and 1.0 |

##### Returns

`void`

***

### skyboxTexture

#### Get Signature

> **get** **skyboxTexture**(): [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:243](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L243)


Returns the current skybox texture.

##### Returns

[`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

#### Set Signature

> **set** **skyboxTexture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:257](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L257)


Sets the skybox texture.

##### Throws


Throws Error if texture is invalid

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | New cube texture (Regular or IBL) |

##### Returns

`void`

***

### transitionDuration

#### Get Signature

> **get** **transitionDuration**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:172](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L172)


Returns the transition duration (in ms).

##### Returns

`number`

***

### transitionElapsed

#### Get Signature

> **get** **transitionElapsed**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:180](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L180)


Returns the transition elapsed time (in ms).

##### Returns

`number`

***

### transitionProgress

#### Get Signature

> **get** **transitionProgress**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:188](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L188)


Returns the progress of the transition currently in progress (0.0 to 1.0).

##### Returns

`number`

***

### transitionTexture

#### Get Signature

> **get** **transitionTexture**(): [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:270](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L270)


Returns the transition target texture.

##### Returns

[`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

## Methods

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:316](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L316)


Renders the skybox.


This method should be called every frame, performing MSAA state check, texture transition updates, and executing actual rendering commands.

### Example
```typescript
skybox.render(renderViewState);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Rendering state and debug info |

#### Returns

`void`

***

### transition()

> **transition**(`transitionTexture`, `duration`, `transitionAlphaTexture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:293](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/skyboxs/skyBox/SkyBox.ts#L293)


Starts a smooth transition to another texture.

### Example
```typescript
// 1초 동안 새 텍스처로 전환
skybox.transition(newTexture, 1000, noiseTexture);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `transitionTexture` | [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | `undefined` | Target cube texture to transition to (Regular or IBL) |
| `duration` | `number` | `300` | Transition duration (ms, Default: 300) |
| `transitionAlphaTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | Alpha noise texture to use for the transition effect |

#### Returns

`void`
