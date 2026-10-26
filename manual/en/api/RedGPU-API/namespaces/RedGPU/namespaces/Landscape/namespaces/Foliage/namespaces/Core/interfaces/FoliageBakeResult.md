[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageBakeResult

# Interface: FoliageBakeResult

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L17)

Result data interface for baking foliage into an octahedral impostor.

## Properties

### baseColorTexture

> **baseColorTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L22)

Baked base color atlas texture

***

### bottomOffset

> **bottomOffset**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L52)

Bottom Y-axis offset of the model

***

### depth

> **depth**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L47)

Bounding box depth (in world units)

***

### height

> **height**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L42)

Bounding box height (in world units)

***

### normalTexture

> **normalTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L27)

Baked world-space normal atlas texture

***

### packedORMTexture

> **packedORMTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L32)

Baked packed ORM (Occlusion/Roughness/Metallic) atlas texture

***

### width

> **width**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L37)

Bounding box width (in world units)
