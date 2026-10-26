[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageRenderUnit

# Class: FoliageRenderUnit

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L62)

Render unit class representing an individual submesh or impostor draw unit of foliage.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md)

## Constructors



***

### Constructor

> **new FoliageRenderUnit**(`init`): `FoliageRenderUnit`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L79)

Creates a `FoliageRenderUnit` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | `FoliageRenderUnitInitOptions` | Render unit initialization options |

#### Returns

`FoliageRenderUnit`

#### Overrides

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#constructor)

## Accessors



***

### isImpostor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isImpostor**(): `boolean`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L144)

Returns whether this render unit is an octahedral impostor unit.

##### Returns

`boolean`

Whether this is an impostor render unit

***

***

### mainDepthMode

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainDepthMode**(): `FoliageDepthPassMode`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L132)

Returns the depth test mode used in the main pass.

##### Returns

`FoliageDepthPassMode`

Depth pass mode (`FoliageDepthPassMode`)

***

***

### slotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **slotIndex**(): `number`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:120](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L120)

Returns the allocated dynamic uniform slot index.

##### Returns

`number`

Slot index (`-1` if unallocated)

***

## Methods



***

### canRenderInPass()

> **canRenderInPass**(`passType`): `boolean`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L249)

Checks whether this render unit can be rendered in the specified render pass type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passType` | `FoliageRenderPassType` | Render pass type to check (`'depthPrepass'` or `'main'`) |

#### Returns

`boolean`

Whether rendering is allowed in the specified pass

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L229)

Frees the allocated uniform slot and releases render unit resources.

#### Returns

`void`

#### Overrides

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#destroy)

***

***

### flushSlotUBO()

> **flushSlotUBO**(): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:219](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L219)

Uploads changes from the CPU slot buffer to the GPU uniform buffer.

#### Returns

`void`

***

***

### getPipeline()

> **getPipeline**(`registry`, `sampleCount`, `msaaID`, `depthPassMode`, `renderUnitBindGroupLayout`): `GPURenderPipeline`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:284](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L284)

Retrieves or creates a `GPURenderPipeline` matching the current material and render state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `registry` | [`FoliagePipelineRegistry`](FoliagePipelineRegistry.md) | Pipeline cache registry (`FoliagePipelineRegistry`) |
| `sampleCount` | `number` | MSAA sample count |
| `msaaID` | `string` | MSAA configuration identifier string |
| `depthPassMode` | `FoliageDepthPassMode` | Depth pass operation mode |
| `renderUnitBindGroupLayout` | `GPUBindGroupLayout` | Render unit dynamic uniform bind group layout |

#### Returns

`GPURenderPipeline`

Created or cached `GPURenderPipeline` instance (`null` if material is absent)

***

***

### updateGroundBlendParams()

> **updateGroundBlendParams**(`groundBlendStrength`, `groundBlendRange`): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L188)

Updates ground surface color blend strength and range in the slot buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `groundBlendStrength` | `number` | Ground blend strength (`0.0` to `1.0`) |
| `groundBlendRange` | `number` | Ground blend height range in meters |

#### Returns

`void`

***

***

### updateReceiveShadow()

> **updateReceiveShadow**(`receiveShadow`): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L209)

Updates the shadow receiving flag in the slot buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `receiveShadow` | `boolean` | Whether to receive shadows |

#### Returns

`void`

***

***

### updateWindScales()

> **updateWindScales**(`trunkBendScale`, `leafFlutterScale`, `foliageHeight`): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L162)

Updates wind trunk bend and leaf flutter scale parameters in the slot buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `trunkBendScale` | `number` | Trunk bend strength scale |
| `leafFlutterScale` | `number` | Leaf flutter strength scale |
| `foliageHeight` | `number` | Reference foliage height |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### baseColorTexture

#### Get Signature

> **get** **baseColorTexture**(): [`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:300](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L300)

Gets or sets the base color `BitmapTexture` of the render unit.

##### Returns

[`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md)

Base color `BitmapTexture`, `null`, or `undefined`

#### Set Signature

> **set** **baseColorTexture**(`val`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:304](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L304)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`baseColorTexture`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#basecolortexture)

***

***

### firstIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **firstIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L208)

Returns the starting index offset within the unified index buffer.

##### Returns

`number`

Starting index offset

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`firstIndex`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#firstindex)

***

***

### geometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **geometry**(): [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L172)

Returns the `Geometry` instance of the render unit.

##### Returns

[`Geometry`](../../../../../../../classes/Geometry.md)

`Geometry` instance

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`geometry`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#geometry)

***

***

### indexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L196)

Returns the index count of the render unit.

##### Returns

`number`

Index count

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`indexCount`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#indexcount)

***

***

### indexFormat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexFormat**(): `GPUIndexFormat`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L232)

Returns the `GPUIndexFormat` of the index buffer.

##### Returns

`GPUIndexFormat`

Index format (`GPUIndexFormat`)

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`indexFormat`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#indexformat)

***

***

### indirectOffsetBytes

#### Get Signature

> **get** **indirectOffsetBytes**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:256](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L256)

Gets or sets the byte offset within the indirect draw buffer.

##### Returns

`number`

Byte offset within the indirect buffer

#### Set Signature

> **set** **indirectOffsetBytes**(`val`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:260](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L260)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`indirectOffsetBytes`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#indirectoffsetbytes)

***

***

### instanceBufferOffset

#### Get Signature

> **get** **instanceBufferOffset**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:272](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L272)

Gets or sets the starting instance offset within the culled instance buffer.

##### Returns

`number`

Starting instance offset

#### Set Signature

> **set** **instanceBufferOffset**(`val`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L276)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`instanceBufferOffset`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#instancebufferoffset)

***

***

### isIndexed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isIndexed**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L220)

Returns whether rendering is index-buffer based.

##### Returns

`boolean`

Whether an index buffer is used

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`isIndexed`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#isindexed)

***

***

### isMasked

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMasked**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:328](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L328)

Returns whether an alpha mask (alpha cutoff) material is used.

##### Returns

`boolean`

Whether alpha masking is used

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`isMasked`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#ismasked)

***

***

### lodIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L316)

Returns the LOD level index to which this render unit belongs.

##### Returns

`number`

LOD level index

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`lodIndex`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#lodindex)

***

***

### material

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **material**(): `any`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L288)

Returns the material instance associated with the render unit.

##### Returns

`any`

Material instance

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`material`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#material)

***

***

### strideBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **strideBytes**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L244)

Returns the byte stride per vertex.

##### Returns

`number`

Byte stride per vertex

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`strideBytes`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#stridebytes)

***

***

### vertexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L184)

Returns the vertex count of the render unit.

##### Returns

`number`

Vertex count

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`vertexCount`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#vertexcount)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### draw()

> **draw**(`passEncoder`, `indirectGPUBuffer`, `offsetBytes?`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:346](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L346)

Records a `drawIndexedIndirect` command onto the provided render pass or render bundle encoder.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passEncoder` | `GPURenderPassEncoder` \| `GPURenderBundleEncoder` | Render pass encoder or render bundle encoder on which to record the draw command |
| `indirectGPUBuffer` | `GPUBuffer` | `GPUBuffer` containing indirect draw arguments |
| `offsetBytes?` | `number` | Byte offset within the indirect buffer (uses `indirectOffsetBytes` if omitted) |

#### Returns

`void`

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`draw`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#draw)

***

</details>
