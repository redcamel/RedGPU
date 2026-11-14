[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / FoliageLODConfig

# Interface: FoliageLODConfig

Defined in: [src/landscape/foliage/core/Foliage.ts:162](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/Foliage.ts#L162)

Interface defining an individual LOD (Level of Detail) level configuration for foliage.

## Properties

### lodDistance?

> `optional` **lodDistance?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:172](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/Foliage.ts#L172)

Maximum camera distance at which this LOD level applies (in meters)

***

### mesh

> **mesh**: [`Mesh`](../../../../Display/classes/Mesh.md) \| [`Mesh`](../../../../Display/classes/Mesh.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:167](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/Foliage.ts#L167)

`Mesh` or array of `Mesh` instances to render at this LOD level

***

### receiveShadow?

> `optional` **receiveShadow?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:177](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/Foliage.ts#L177)

Whether this LOD level receives shadows
