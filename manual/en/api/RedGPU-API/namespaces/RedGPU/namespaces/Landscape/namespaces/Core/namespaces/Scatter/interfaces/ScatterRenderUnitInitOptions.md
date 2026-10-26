[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterRenderUnitInitOptions

# Interface: ScatterRenderUnitInitOptions

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:10](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L10)

Options interface for geometry, index range, and material required to initialize a `ScatterRenderUnit` instance.

## Properties

### baseColorTexture?

> `optional` **baseColorTexture?**: [`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:75](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L75)

Base color texture instance (optional)

***

### firstIndex?

> `optional` **firstIndex?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L63)

Starting index offset within the unified index buffer (default: `0`)

***

### geometry

> **geometry**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L15)

`Geometry` instance holding the vertex/index buffers to render

***

### indexCount?

> `optional` **indexCount?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L27)

Number of indices to draw (inferred from index buffer if omitted)

***

### indexFormat?

> `optional` **indexFormat?**: `GPUIndexFormat`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L39)

Index buffer format (default: `'uint32'`)

***

### indirectOffsetBytes?

> `optional` **indirectOffsetBytes?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L51)

Byte offset within the indirect draw buffer (default: `0`)

***

### instanceBufferOffset?

> `optional` **instanceBufferOffset?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L57)

Starting instance offset within the culled instance buffer (default: `0`)

***

### isIndexed?

> `optional` **isIndexed?**: `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L33)

Whether an index buffer is used (inferred from geometry if omitted)

***

### isMasked?

> `optional` **isMasked?**: `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L87)

Whether the material uses alpha masking (alpha cutoff) (default: `false`)

***

### lodIndex?

> `optional` **lodIndex?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L81)

LOD level index to which this render unit belongs (default: `0`)

***

### material?

> `optional` **material?**: `any`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L69)

Material instance applied to this render unit (optional)

***

### strideBytes?

> `optional` **strideBytes?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L45)

Byte stride per vertex (default: `72`)

***

### vertexCount?

> `optional` **vertexCount?**: `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L21)

Vertex count of the render unit (inferred from geometry if omitted)
