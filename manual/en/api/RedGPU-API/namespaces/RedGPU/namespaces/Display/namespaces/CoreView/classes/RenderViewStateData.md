[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / RenderViewStateData

# Class: RenderViewStateData

Defined in: [src/display/view/core/RenderViewStateData.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L59)

Class that manages per-frame rendering states, culling data, and performance statistics of a 3D view.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Access via View3D instance
const renderViewStateData = view.renderViewStateData;
```

## Constructors

### Constructor

> **new RenderViewStateData**(`view`): `RenderViewStateData`

Defined in: [src/display/view/core/RenderViewStateData.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L279)

Creates a RenderViewStateData instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | View3D instance to which this state data is linked |

#### Returns

`RenderViewStateData`

## Properties

### activeCascadeCount

> **activeCascadeCount**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L223)

Currently active cascade count (`0` to `4`)

***

### animationList

> **animationList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L253)

List of animations to process in the frame

***

### cascadeShadowFrustumPlanesByCascade

> <span class="readonly-badge">readonly</span> **cascadeShadowFrustumPlanesByCascade**: `Float32Array`\<`ArrayBufferLike`\>[]

Defined in: [src/display/view/core/RenderViewStateData.ts:208](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L208)

Per-cascade 24-float subarray view cache array

***

### cascadeShadowFrustumPlanesFlat

> <span class="readonly-badge">readonly</span> **cascadeShadowFrustumPlanesFlat**: `Float32Array`

Defined in: [src/display/view/core/RenderViewStateData.ts:203](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L203)

1D flattened cascade shadow frustum planes buffer for 4 cascades (`Float32Array(96)`)

***

### cascadeSplitDepths

> <span class="readonly-badge">readonly</span> **cascadeSplitDepths**: `Float32Array`

Defined in: [src/display/view/core/RenderViewStateData.ts:218](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L218)

Maximum split depth array per cascade

***

### commandBatchStats

> **commandBatchStats**: [`CommandBatchStats`](../../../../CommandEncoderManager/interfaces/CommandBatchStats.md) = `null`

Defined in: [src/display/view/core/RenderViewStateData.ts:264](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L264)

Command batch execution statistics information

***

### cullingDistanceSquared

> **cullingDistanceSquared**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L69)

Squared distance threshold used for distance culling calculations

***

### currentRenderPassEncoder

> **currentRenderPassEncoder**: `GPURenderPassEncoder`

Defined in: [src/display/view/core/RenderViewStateData.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L187)

Currently active GPU render pass encoder

***

### deltaTime

> **deltaTime**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L146)

Elapsed time between frames (seconds)

***

### dirtyVertexUniformFromMaterial

> **dirtyVertexUniformFromMaterial**: `object` = `{}`

Defined in: [src/display/view/core/RenderViewStateData.ts:228](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L228)

Map of vertex uniform states dirtied by materials

***

### distanceCulling

> **distanceCulling**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L74)

Distance threshold for culling objects

***

### elapsed

> **elapsed**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L109)

Elapsed time since the previous frame (ms)

***

### fixedStepDeltaTime

> **fixedStepDeltaTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L161)

Fixed timestep interval (seconds)

***

### frameIndex

> **frameIndex**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L119)

Current accumulated rendering frame index

***

### frustumPlanes

> **frustumPlanes**: `number`[][]

Defined in: [src/display/view/core/RenderViewStateData.ts:193](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L193)

Array of 6 planes for frustum culling

***

### frustumPlanesFlat

> <span class="readonly-badge">readonly</span> **frustumPlanesFlat**: `Float32Array`

Defined in: [src/display/view/core/RenderViewStateData.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L198)

1D flattened frustum planes buffer for GPU upload and fast culling (`Float32Array(24)`)

***

### interleavedCullingInfo

> **interleavedCullingInfo**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L124)

Camera and viewport state tracking information for interleaved culling

#### forceCullingCheck

> **forceCullingCheck**: `boolean` = `false`

#### interleavedCullingCheckFrameIndex

> **interleavedCullingCheckFrameIndex**: `number` = `0`

#### prevCameraRotX

> **prevCameraRotX**: `number` = `0`

#### prevCameraRotY

> **prevCameraRotY**: `number` = `0`

#### prevCameraRotZ

> **prevCameraRotZ**: `number` = `0`

#### prevCameraX

> **prevCameraX**: `number` = `0`

#### prevCameraY

> **prevCameraY**: `number` = `0`

#### prevCameraZ

> **prevCameraZ**: `number` = `0`

#### prevViewportHeight

> **prevViewportHeight**: `number` = `0`

#### prevViewportWidth

> **prevViewportWidth**: `number` = `0`

#### projectionScale

> **projectionScale**: `number` = `0`

***

### isScene2DMode

> **isScene2DMode**: `boolean` = `false`

Defined in: [src/display/view/core/RenderViewStateData.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L259)

Whether the current scene is in 2D camera mode

***

### numFixedSteps

> **numFixedSteps**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L156)

Number of fixed timestep updates to execute in the current frame

***

### prevTimestamp

> **prevTimestamp**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L104)

Timestamp of the previous physics step (ms)

***

### renderBundleResults

> **renderBundleResults**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:236](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L236)

Render bundle lists categorized by rendering layer

#### bundleListAlphaLayer

> **bundleListAlphaLayer**: `GPURenderBundle`[]

#### bundleListBasicList

> **bundleListBasicList**: `GPURenderBundle`[]

#### bundleListParticleLayer

> **bundleListParticleLayer**: `GPURenderBundle`[]

#### bundleListRender2PathLayer

> **bundleListRender2PathLayer**: `GPURenderBundle`[]

#### bundleListTransparentLayer

> **bundleListTransparentLayer**: `GPURenderBundle`[]

***

### renderResults

> **renderResults**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L80)

Rendering statistics results for the current frame

#### num3DGroups

> **num3DGroups**: `number` = `0`

#### num3DObjects

> **num3DObjects**: `number` = `0`

#### numDirtyPipelines

> **numDirtyPipelines**: `number` = `0`

#### numDrawCalls

> **numDrawCalls**: `number` = `0`

#### numInstances

> **numInstances**: `number` = `0`

#### numPoints

> **numPoints**: `number` = `0`

#### numTriangles

> **numTriangles**: `number` = `0`

***

### sinTime

> **sinTime**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L151)

Calculated value of `Math.sin(time)`

***

### skinList

> **skinList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:248](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L248)

List of skin meshes to process in the frame

***

### swapBufferIndex

> **swapBufferIndex**: `number` = `1`

Defined in: [src/display/view/core/RenderViewStateData.ts:177](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L177)

Swap buffer index for double buffering (`0` or `1`)

***

### time

> **time**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L141)

Accumulated time of the current frame (seconds)

***

### timestamp

> **timestamp**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L99)

Timestamp of the current frame (ms)

***

### useDistanceCulling

> **useDistanceCulling**: `boolean`

Defined in: [src/display/view/core/RenderViewStateData.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L64)

Whether distance-based culling is enabled

***

### usedVideoMemory

> **usedVideoMemory**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L182)

Total video memory size used by view-related render textures (bytes)

***

### view

> <span class="readonly-badge">readonly</span> **view**: [`View3D`](../../../classes/View3D.md)

Defined in: [src/display/view/core/RenderViewStateData.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L269)

Connected View3D instance

***

### viewIndex

> **viewIndex**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L172)

View index within the context

***

### viewportSize

> **viewportSize**: `ViewportSize`

Defined in: [src/display/view/core/RenderViewStateData.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L167)

Current viewport size and position information

***

### viewRenderCPURecordingTime

> **viewRenderCPURecordingTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L114)

Time taken for view render CPU recording (ms)

***

### viewRenderStartTime

> **viewRenderStartTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L94)

Performance timestamp at the start of view rendering (ms)

## Methods

### reset()

> **reset**(): `void`

Defined in: [src/display/view/core/RenderViewStateData.ts:291](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/RenderViewStateData.ts#L291)

Resets statistics counters, layer bundle lists, time, and culling states for a new frame.

#### Returns

`void`

#### Throws

Throws an error if the linked view or required render textures are invalid, or if video memory size calculation fails.
