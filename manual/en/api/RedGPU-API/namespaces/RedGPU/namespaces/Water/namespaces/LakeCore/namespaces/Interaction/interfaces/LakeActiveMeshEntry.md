[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeActiveMeshEntry

# Interface: LakeActiveMeshEntry

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L12)

Interface defining physical and wave information of an active mesh interacting with the lake surface.

## Properties

### footSide

> **footSide**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L37)

Left/right foot indicator sign of the stride cycle. (`-1.0` or `1.0`)

***

### mesh

> **mesh**: [`Mesh`](../../../../../../Display/classes/Mesh.md)

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L17)

Target `Mesh` instance for interaction.

***

### speed

> **speed**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L27)

Movement speed of the mesh in world units per second.

***

### stepPulse

> **stepPulse**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L32)

Footstep impulse strength generated during movement. (Range: `0` ~ `1`)

***

### waveStrength

> **waveStrength**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L22)

Wave strength caused by water submersion.
