[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterRenderUnit

# Class: ScatterRenderUnit

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L101)

Submesh/LOD render unit class that serves as a single `drawIndexedIndirect` draw call unit in the scatter system.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extended by

- [`FoliageRenderUnit`](../../../../Foliage/namespaces/Core/classes/FoliageRenderUnit.md)

## Constructors

### Constructor

> **new ScatterRenderUnit**(`init`): `ScatterRenderUnit`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L125)

Initializes a `ScatterRenderUnit` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | [`ScatterRenderUnitInitOptions`](../interfaces/ScatterRenderUnitInitOptions.md) | Render unit initialization options |

#### Returns

`ScatterRenderUnit`

## Accessors

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

***

### firstIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **firstIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L208)

Returns the starting index offset within the unified index buffer.

##### Returns

`number`

Starting index offset

***

### geometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **geometry**(): [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L172)

Returns the `Geometry` instance of the render unit.

##### Returns

[`Geometry`](../../../../../../../classes/Geometry.md)

`Geometry` instance

***

### indexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L196)

Returns the index count of the render unit.

##### Returns

`number`

Index count

***

### indexFormat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexFormat**(): `GPUIndexFormat`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L232)

Returns the `GPUIndexFormat` of the index buffer.

##### Returns

`GPUIndexFormat`

Index format (`GPUIndexFormat`)

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

***

### isIndexed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isIndexed**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L220)

Returns whether rendering is index-buffer based.

##### Returns

`boolean`

Whether an index buffer is used

***

### isMasked

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMasked**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:328](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L328)

Returns whether an alpha mask (alpha cutoff) material is used.

##### Returns

`boolean`

Whether alpha masking is used

***

### lodIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L316)

Returns the LOD level index to which this render unit belongs.

##### Returns

`number`

LOD level index

***

### material

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **material**(): `any`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L288)

Returns the material instance associated with the render unit.

##### Returns

`any`

Material instance

***

### strideBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **strideBytes**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L244)

Returns the byte stride per vertex.

##### Returns

`number`

Byte stride per vertex

***

### vertexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L184)

Returns the vertex count of the render unit.

##### Returns

`number`

Vertex count

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:355](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L355)

Destroys the `Geometry` resource referenced by the render unit.

#### Returns

`void`

***

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
