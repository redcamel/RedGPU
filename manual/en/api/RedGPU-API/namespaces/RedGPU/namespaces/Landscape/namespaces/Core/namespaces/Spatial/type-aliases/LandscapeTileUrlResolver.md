[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Spatial](../README.md) / LandscapeTileUrlResolver

# Type Alias: LandscapeTileUrlResolver

> **LandscapeTileUrlResolver** = (`row`, `col`, `comp?`) => `string`

Defined in: [src/landscape/core/spatial/LandscapeTileStreamer.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeTileStreamer.ts#L38)

Resolver function type that returns the URL of a terrain heightmap tile image based on row and column indices.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `row` | `number` | Row (Z) index of the tile |
| `col` | `number` | Column (X) index of the tile |
| `comp?` | [`LandscapeComponent`](../classes/LandscapeComponent.md) | `LandscapeComponent` instance of the target tile (optional) |

## Returns

`string`

URL string of the tile heightmap resource to load
