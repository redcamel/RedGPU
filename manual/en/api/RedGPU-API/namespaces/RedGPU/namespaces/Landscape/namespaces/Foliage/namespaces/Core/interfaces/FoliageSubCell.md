[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageSubCell

# Interface: FoliageSubCell

Defined in: [src/landscape/foliage/core/Foliage.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L61)

Interface representing the state information of a sub-cell, the minimum spatial unit for foliage streaming.

## Properties

### centerX

> **centerX**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L81)

World X coordinate of the sub-cell center

***

### centerZ

> **centerZ**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L86)

World Z coordinate of the sub-cell center

***

### instanceCount

> **instanceCount**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L91)

Number of valid instances to be placed in the sub-cell (`-1` if not yet computed)

***

### isMounted

> **isMounted**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L96)

Whether the sub-cell is currently mounted in the GPU mega buffer

***

### mountedSlotIndex

> **mountedSlotIndex**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L101)

Starting slot offset within the mounted GPU mega buffer (`-1` if unmounted)

***

### subCellKey

> **subCellKey**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L66)

Unique key packed from sub-cell grid coordinates (`subCellX`, `subCellZ`)

***

### subCellX

> **subCellX**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L71)

Grid X index of the sub-cell

***

### subCellZ

> **subCellZ**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L76)

Grid Z index of the sub-cell
