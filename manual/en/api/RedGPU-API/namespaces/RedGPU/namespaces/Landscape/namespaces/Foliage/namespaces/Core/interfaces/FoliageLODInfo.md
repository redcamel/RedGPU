[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageLODInfo

# Interface: FoliageLODInfo

Defined in: [src/landscape/foliage/core/Foliage.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L185)

LOD metadata interface used for GPU culling and rendering after assembly.

## Properties

### lodDistance

> **lodDistance**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:195](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L195)

Transition distance for this LOD level (in meters)

***

### lodIndex

> **lodIndex**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L190)

LOD level index

***

### renderUnitCount

> **renderUnitCount**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L205)

Number of render units belonging to this LOD level

***

### renderUnitOffset

> **renderUnitOffset**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:200](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L200)

Starting offset within the render unit array
