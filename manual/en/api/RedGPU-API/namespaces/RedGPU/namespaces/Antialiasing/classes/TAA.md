[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / TAA

# Class: TAA

Defined in: [src/antialiasing/taa/TAA.ts:35](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L35)


TAA (Temporal Anti-Aliasing) post-processing effect.


A high-quality anti-aliasing technique that removes aliasing in the current frame by accumulating information from previous frames.

::: warning

This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
:::

* ### Example
```typescript
// AntialiasingManager를 통해 TAA 설정 (Configure TAA via AntialiasingManager)
redGPUContext.antialiasingManager.useTAA = true;
```

## Constructors

### Constructor

> **new TAA**(`redGPUContext`): `TAA`

Defined in: [src/antialiasing/taa/TAA.ts:82](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L82)


Creates a TAA instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |

#### Returns

`TAA`

## Accessors

### frameIndex

#### Get Signature

> **get** **frameIndex**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:117](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L117)


Returns the frame index.

##### Returns

`number`


Current frame index

***

### jitterStrength

#### Get Signature

> **get** **jitterStrength**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:141](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L141)


Returns the jitter strength.

##### Returns

`number`


Jitter strength

#### Set Signature

> **set** **jitterStrength**(`value`): `void`

Defined in: [src/antialiasing/taa/TAA.ts:153](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L153)


Sets the jitter strength.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Jitter strength (0.0 ~ 1.0) |

##### Returns

`void`

***

### prevNoneJitterProjectionCameraMatrix

#### Get Signature

> **get** **prevNoneJitterProjectionCameraMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/antialiasing/taa/TAA.ts:105](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L105)


Returns the non-jittered projection camera matrix of the previous frame.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)


4x4 matrix

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:129](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L129)


Returns the video memory usage.

##### Returns

`number`


Memory usage (bytes)

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:229](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L229)


Clears TAA resources.

#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): `ASinglePassPostEffectResult`

Defined in: [src/antialiasing/taa/TAA.ts:179](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L179)


Renders the TAA effect.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `sourceTextureInfo` | `ASinglePassPostEffectResult` | Source texture info |

#### Returns

`ASinglePassPostEffectResult`


Rendering result (texture and view)

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/antialiasing/taa/TAA.ts:257](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/antialiasing/taa/TAA.ts#L257)


Updates a uniform value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Uniform key |
| `value` | `number` \| `boolean` \| `number`[] | Uniform value |

#### Returns

`void`
