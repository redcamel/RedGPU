[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterBaseSegmentAllocation

# Interface: ScatterBaseSegmentAllocation

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L50)

Interface containing segment offsets and capacity information allocated to a single scatter type within the mega buffer.

## Properties

### culledBaseOffset

> **culledBaseOffset**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:75](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L75)

Starting instance offset within the culled instance buffer

***

### indirectBaseOffset

> **indirectBaseOffset**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L80)

Starting slot offset within the indirect draw buffer

***

### instanceCount

> **instanceCount**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L90)

Number of currently active instances

***

### maxInstances

> **maxInstances**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L65)

Maximum instance capacity aligned to the workgroup size

***

### name?

> `optional` **name?**: `string`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L60)

Name of the allocated scatter type (optional)

***

### rawBaseOffset

> **rawBaseOffset**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L70)

Starting instance offset within the raw instance buffer

***

### renderUnitCount

> **renderUnitCount**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L85)

Number of render unit (submesh/LOD) slots used by this segment

***

### typeId

> **typeId**: `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L55)

Numeric ID of the allocated scatter type
