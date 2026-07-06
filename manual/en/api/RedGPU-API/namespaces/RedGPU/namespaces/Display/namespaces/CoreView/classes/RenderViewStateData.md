[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / RenderViewStateData

# Class: RenderViewStateData

Defined in: [src/display/view/core/RenderViewStateData.ts:53](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L53)

Class that manages and tracks the rendering state data of a 3D view.

This class encapsulates all state information needed during the rendering process. Includes culling settings, performance metrics, GPU resources, layer management, etc.

::: warning
This class is a data structure used internally by the system.<br/>Do not create or use instances directly.
:::

## Constructors

### Constructor

> **new RenderViewStateData**(`view`): `RenderViewStateData`

Defined in: [src/display/view/core/RenderViewStateData.ts:244](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L244)

Creates a new RenderViewStateData instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | View3D instance this state data will link to |

#### Returns

`RenderViewStateData`

## Properties

### animationList

> **animationList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:217](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L217)

List of animations to process

***

### commandBatchStats

> **commandBatchStats**: [`CommandBatchStats`](../../../../CommandEncoderManager/interfaces/CommandBatchStats.md) = `null`

Defined in: [src/display/view/core/RenderViewStateData.ts:228](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L228)

Command batch statistics info

***

### cullingDistanceSquared

> **cullingDistanceSquared**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:63](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L63)

Squared distance value used for culling calculations

***

### currentRenderPassEncoder

> **currentRenderPassEncoder**: `GPURenderPassEncoder`

Defined in: [src/display/view/core/RenderViewStateData.ts:183](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L183)

Current GPU render pass encoder in use

***

### deltaTime

> **deltaTime**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:142](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L142)

Elapsed time between frames (seconds)

***

### dirtyVertexUniformFromMaterial

> **dirtyVertexUniformFromMaterial**: `object` = `{}`

Defined in: [src/display/view/core/RenderViewStateData.ts:194](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L194)

Map of vertex uniforms changed from materials

***

### distanceCulling

> **distanceCulling**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:68](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L68)

Distance threshold for culling objects

***

### elapsed

> **elapsed**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:105](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L105)

Elapsed time since the previous frame (ms)

***

### fixedStepDeltaTime

> **fixedStepDeltaTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:157](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L157)

Fixed timestep interval (seconds)

***

### frameIndex

> **frameIndex**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:115](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L115)

Current frame index (accumulated rendering count)

***

### frustumPlanes

> **frustumPlanes**: `number`[][]

Defined in: [src/display/view/core/RenderViewStateData.ts:189](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L189)

Frustum planes array for culling

***

### interleavedCullingInfo

> **interleavedCullingInfo**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:120](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L120)

Object tracking camera and viewport state for interleaved (distributed) culling processing.

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

Defined in: [src/display/view/core/RenderViewStateData.ts:223](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L223)

Whether the scene is in 2D mode

***

### numFixedSteps

> **numFixedSteps**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:152](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L152)

Number of fixed timestep updates needed for physics engine etc.

***

### prevTimestamp

> **prevTimestamp**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:100](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L100)

Timestamp of the previous frame (ms)

***

### renderBundleResults

> **renderBundleResults**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:200](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L200)

Group of bundle lists for each rendering layer

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

Defined in: [src/display/view/core/RenderViewStateData.ts:75](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L75)

Group of rendering statistics results

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

Defined in: [src/display/view/core/RenderViewStateData.ts:147](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L147)

Calculated value of sin(time)

***

### skinList

> **skinList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:212](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L212)

List of skin meshes to process

***

### swapBufferIndex

> **swapBufferIndex**: `number` = `1`

Defined in: [src/display/view/core/RenderViewStateData.ts:173](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L173)

Swap buffer index for double buffering

***

### time

> **time**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:137](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L137)

Absolute time of the current frame (seconds)

***

### timestamp

> **timestamp**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:95](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L95)

Current timestamp of the rendering frame (ms)

***

### useDistanceCulling

> **useDistanceCulling**: `boolean`

Defined in: [src/display/view/core/RenderViewStateData.ts:58](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L58)

Whether distance culling is enabled for this view

***

### usedVideoMemory

> **usedVideoMemory**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:178](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L178)

Amount of video memory used by render textures (in bytes)

***

### viewIndex

> **viewIndex**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:168](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L168)

View index

***

### viewportSize

> **viewportSize**: `ViewportSize`

Defined in: [src/display/view/core/RenderViewStateData.ts:163](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L163)

Current viewport size and position information

***

### viewRenderCPURecordingTime

> **viewRenderCPURecordingTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:110](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L110)

Time taken for view render preparation (ms)

***

### viewRenderStartTime

> **viewRenderStartTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:90](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L90)

Performance timestamp marking the start of rendering (ms)

## Accessors

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../../classes/View3D.md)

Defined in: [src/display/view/core/RenderViewStateData.ts:254](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L254)

Returns the connected View3D instance.

##### Returns

[`View3D`](../../../classes/View3D.md)

## Methods

### reset()

> **reset**(): `void`

Defined in: [src/display/view/core/RenderViewStateData.ts:269](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/display/view/core/RenderViewStateData.ts#L269)

Resets render state data for a new frame.

This method resets all counters, clears layer arrays, and configures GPU resources for the current rendering pass. It also calculates video memory usage and configures culling parameters according to view settings.

#### Returns

`void`

#### Throws

Throws an error if invalid parameters are provided, required view properties are missing, or texture size calculation fails.
