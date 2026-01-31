[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / BlendState

# Class: BlendState

Defined in: [src/renderState/BlendState.ts:24](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L24)


State class that controls color and alpha blending behavior for materials.


Defines how source and destination colors are mixed in the render pipeline, used to implement transparency or compositing effects.

* ### Example
```typescript
const blendState = material.blendState;
blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
```

## Constructors

### Constructor

> **new BlendState**(`targetMaterial`, `srcFactor?`, `dstFactor?`, `operation?`): `BlendState`

Defined in: [src/renderState/BlendState.ts:52](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L52)


Creates an instance of BlendState.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMaterial` | `any` | Material to which the blend state is applied |
| `srcFactor?` | `GPUBlendFactor` | Source blend factor |
| `dstFactor?` | `GPUBlendFactor` | Destination blend factor |
| `operation?` | `GPUBlendOperation` | Blend operation |

#### Returns

`BlendState`

## Properties

### state

> **state**: `GPUBlendComponent`

Defined in: [src/renderState/BlendState.ts:29](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L29)


Final GPUBlendComponent state object

## Accessors

### dstFactor

#### Get Signature

> **get** **dstFactor**(): `GPUBlendFactor`

Defined in: [src/renderState/BlendState.ts:107](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L107)


Gets or sets the destination blend factor.

##### Returns

`GPUBlendFactor`


Current GPUBlendFactor

#### Set Signature

> **set** **dstFactor**(`newDstFactor`): `void`

Defined in: [src/renderState/BlendState.ts:111](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L111)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newDstFactor` | `GPUBlendFactor` |

##### Returns

`void`

***

### operation

#### Get Signature

> **get** **operation**(): `GPUBlendOperation`

Defined in: [src/renderState/BlendState.ts:67](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L67)


Gets or sets the blend operation.

##### Returns

`GPUBlendOperation`


Current GPUBlendOperation

#### Set Signature

> **set** **operation**(`newOperation`): `void`

Defined in: [src/renderState/BlendState.ts:71](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L71)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newOperation` | `GPUBlendOperation` |

##### Returns

`void`

***

### srcFactor

#### Get Signature

> **get** **srcFactor**(): `GPUBlendFactor`

Defined in: [src/renderState/BlendState.ts:87](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L87)


Gets or sets the source blend factor.

##### Returns

`GPUBlendFactor`


Current GPUBlendFactor

#### Set Signature

> **set** **srcFactor**(`newSrcFactor`): `void`

Defined in: [src/renderState/BlendState.ts:91](https://github.com/redcamel/RedGPU/blob/fe2940f17a5472298f14a33e21121155d25234e5/src/renderState/BlendState.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newSrcFactor` | `GPUBlendFactor` |

##### Returns

`void`
