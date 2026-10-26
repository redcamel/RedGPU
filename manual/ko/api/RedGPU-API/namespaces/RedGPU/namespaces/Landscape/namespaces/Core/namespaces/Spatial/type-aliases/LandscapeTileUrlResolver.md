[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Spatial](../README.md) / LandscapeTileUrlResolver

# Type Alias: LandscapeTileUrlResolver

> **LandscapeTileUrlResolver** = (`row`, `col`, `comp?`) => `string`

Defined in: [src/landscape/core/spatial/LandscapeTileStreamer.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/spatial/LandscapeTileStreamer.ts#L38)

행(row)과 열(col) 인덱스를 기반으로 지형 하이트맵 타일 이미지의 URL을 반환하는 리졸버 함수 타입입니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `row` | `number` | 타일의 행(Z) 인덱스 |
| `col` | `number` | 타일의 열(X) 인덱스 |
| `comp?` | [`LandscapeComponent`](../classes/LandscapeComponent.md) | 대상 타일의 `LandscapeComponent` 인스턴스 (선택) |

## Returns

`string`

로드할 타일 하이트맵 리소스의 URL 문자열
