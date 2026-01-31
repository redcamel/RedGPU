[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:56](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L56)


Skybox class used as the background for 3D scenes.


Renders a 360-degree environment using cube or HDR textures, providing smooth transitions between textures, blur, exposure, and transparency control.

* ### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/"></iframe>

## See


Below is a list of additional sample examples to help understand the structure and operation of Skybox.
 - [Skybox using HDRTexture](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 - [Skybox using IBL](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithIbl/)

## Constructors

### Constructor

> **new SkyBox**(`redGPUContext`, `cubeTexture`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:141](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L141)


Creates a new SkyBox instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU rendering context |
| `cubeTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | Cube texture or HDR texture to use for the skybox |

#### Returns

`SkyBox`

#### Throws


Throws error if redGPUContext is invalid

## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:66](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L66)


GPU rendering information object

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:61](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L61)


Model transformation matrix (4x4 matrix)

## Accessors

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:193](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L193)


Returns the skybox blur amount.

##### Returns

`number`


Blur value between 0.0 and 1.0

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:207](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L207)


Sets the skybox blur amount.

##### Throws


Throws error if value is out of 0.0-1.0 range

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

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:220](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L220)


Returns the skybox opacity.

##### Returns

`number`


Opacity value between 0.0 and 1.0

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:234](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L234)


Sets the skybox opacity.

##### Throws


Throws error if value is out of 0.0-1.0 range

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Opacity value between 0.0 and 1.0 |

##### Returns

`void`

***

### skyboxTexture

#### Get Signature

> **get** **skyboxTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:246](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L246)


Returns the current skybox texture.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)


Current skybox texture

#### Set Signature

> **set** **skyboxTexture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:260](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L260)


Sets the skybox texture.

##### Throws


Throws error if texture is invalid

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | New skybox texture |

##### Returns

`void`

***

### transitionDuration

#### Get Signature

> **get** **transitionDuration**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:160](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L160)


Returns the transition duration.

##### Returns

`number`


Transition duration (ms)

***

### transitionElapsed

#### Get Signature

> **get** **transitionElapsed**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:171](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L171)


Returns the transition elapsed time.

##### Returns

`number`


Transition elapsed time (ms)

***

### transitionProgress

#### Get Signature

> **get** **transitionProgress**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:182](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L182)


Returns the transition progress.

##### Returns

`number`


Transition progress between 0.0 and 1.0

***

### transitionTexture

#### Get Signature

> **get** **transitionTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:276](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L276)


Returns the transition target texture.

##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)


Transition target texture (undefined if not transitioning)

## Methods

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:323](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L323)


Renders the skybox.


This method should be called every frame, performing MSAA state check, texture transition updates, and executing actual rendering commands.

* ### Example
```typescript
// 렌더링 루프에서
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

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:299](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/display/skyboxs/skyBox/SkyBox.ts#L299)


Starts a smooth transition to another texture.

* ### Example
```typescript
// 1초 동안 새 텍스처로 전환
skybox.transition(newTexture, 1000, noiseTexture);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `transitionTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | `undefined` | Target texture to transition to |
| `duration` | `number` | `300` | Transition duration (ms, default: 300) |
| `transitionAlphaTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | Alpha noise texture to use for the transition effect |

#### Returns

`void`
