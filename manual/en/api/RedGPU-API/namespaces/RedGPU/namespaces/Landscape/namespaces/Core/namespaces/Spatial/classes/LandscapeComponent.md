[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Spatial](../README.md) / LandscapeComponent

# Class: LandscapeComponent

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L12)

Class that manages individual tile component data constituting the Landscape spatial grid.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new LandscapeComponent**(`worldX?`, `worldZ?`, `componentX?`, `componentZ?`, `minHeightNorm?`, `maxHeightNorm?`): `LandscapeComponent`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L44)

Creates a `LandscapeComponent` instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `worldX?` | `number` | `0` | World X coordinate of the tile center |
| `worldZ?` | `number` | `0` | World Z coordinate of the tile center |
| `componentX?` | `number` | `0` | Column index of the tile within the grid |
| `componentZ?` | `number` | `0` | Row index of the tile within the grid |
| `minHeightNorm?` | `number` | `0.0` | Normalized minimum height value (`0.0` to `1.0`) |
| `maxHeightNorm?` | `number` | `1.0` | Normalized maximum height value (`0.0` to `1.0`) |

#### Returns

`LandscapeComponent`

## Accessors

### componentX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **componentX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:105](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L105)

Returns the column index of the tile within the grid.

##### Returns

`number`

Tile column (X) index

***

### componentZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **componentZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L117)

Returns the row index of the tile within the grid.

##### Returns

`number`

Tile row (Z) index

***

### key

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **key**(): `string`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L69)

Returns the unique key (`{componentZ}_{componentX}`) identifying the tile component.

##### Returns

`string`

Unique tile identifier key string

***

### maxHeightNorm

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxHeightNorm**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:141](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L141)

Returns the normalized maximum height value of the tile.

##### Returns

`number`

Normalized maximum height value (`0.0` to `1.0`)

***

### minHeightNorm

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **minHeightNorm**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:129](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L129)

Returns the normalized minimum height value of the tile.

##### Returns

`number`

Normalized minimum height value (`0.0` to `1.0`)

***

### worldX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldX**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L81)

Returns the world X coordinate of the tile center.

##### Returns

`number`

Tile center world X coordinate

***

### worldZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **worldZ**(): `number`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L93)

Returns the world Z coordinate of the tile center.

##### Returns

`number`

Tile center world Z coordinate

## Methods

### setHeightBounds()

> **setHeightBounds**(`minHeightNorm`, `maxHeightNorm`): `void`

Defined in: [src/landscape/core/spatial/LandscapeComponent.ts:156](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/spatial/LandscapeComponent.ts#L156)

Sets the normalized minimum and maximum height bounds of the tile.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `minHeightNorm` | `number` | Normalized minimum height value |
| `maxHeightNorm` | `number` | Normalized maximum height value |

#### Returns

`void`
