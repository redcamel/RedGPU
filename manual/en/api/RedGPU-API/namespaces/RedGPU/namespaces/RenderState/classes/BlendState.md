[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / BlendState

# Class: BlendState

Defined in: [src/renderState/BlendState.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L27)

Render state class that controls color and alpha blending behavior for materials.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
const blendState = material.blendStateColor;
blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
```

## Constructors

### Constructor

> **new BlendState**(`targetMaterial`, `srcFactor?`, `dstFactor?`, `operation?`): `BlendState`

Defined in: [src/renderState/BlendState.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L55)

Creates a BlendState instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `targetMaterial` | `any` | `undefined` | Target material to which the blend state is applied |
| `srcFactor?` | `GPUBlendFactor` | `GPU_BLEND_FACTOR.SRC_ALPHA` | Source blend factor (default: `GPU_BLEND_FACTOR.SRC_ALPHA`) |
| `dstFactor?` | `GPUBlendFactor` | `GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA` | Destination blend factor (default: `GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA`) |
| `operation?` | `GPUBlendOperation` | `GPU_BLEND_OPERATION.ADD` | Blend operation mode (default: `GPU_BLEND_OPERATION.ADD`) |

#### Returns

`BlendState`

## Properties

### state

> **state**: `GPUBlendComponent`

Defined in: [src/renderState/BlendState.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L32)

Final generated `GPUBlendComponent` state object

## Accessors

### dstFactor

#### Get Signature

> **get** **dstFactor**(): `GPUBlendFactor`

Defined in: [src/renderState/BlendState.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L110)

Gets or sets the destination blend factor.

##### Returns

`GPUBlendFactor`

Currently configured destination `GPUBlendFactor` value

#### Set Signature

> **set** **dstFactor**(`newDstFactor`): `void`

Defined in: [src/renderState/BlendState.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L114)

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

Defined in: [src/renderState/BlendState.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L70)

Gets or sets the blend operation mode.

##### Returns

`GPUBlendOperation`

Currently configured `GPUBlendOperation` value

#### Set Signature

> **set** **operation**(`newOperation`): `void`

Defined in: [src/renderState/BlendState.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L74)

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

Defined in: [src/renderState/BlendState.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L90)

Gets or sets the source blend factor.

##### Returns

`GPUBlendFactor`

Currently configured source `GPUBlendFactor` value

#### Set Signature

> **set** **srcFactor**(`newSrcFactor`): `void`

Defined in: [src/renderState/BlendState.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L94)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newSrcFactor` | `GPUBlendFactor` |

##### Returns

`void`
