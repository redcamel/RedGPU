[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageBakeResult

# Interface: FoliageBakeResult

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L19)

Result data interface for baking foliage into an octahedral impostor.

## Properties

### baseColorTexture

> **baseColorTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L24)

Baked base color atlas texture

***

### bottomOffset

> **bottomOffset**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:54](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L54)

Bottom Y-axis offset of the model

***

### depth

> **depth**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:49](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L49)

Bounding box depth (in world units)

***

### height

> **height**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L44)

Bounding box height (in world units)

***

### normalTexture

> **normalTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:29](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L29)

Baked world-space normal atlas texture

***

### packedORMTexture

> **packedORMTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:34](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L34)

Baked packed ORM (Occlusion/Roughness/Metallic) atlas texture

***

### width

> **width**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:39](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L39)

Bounding box width (in world units)
