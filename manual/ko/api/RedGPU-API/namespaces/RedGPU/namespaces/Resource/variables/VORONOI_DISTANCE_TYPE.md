[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VORONOI\_DISTANCE\_TYPE

# Variable: VORONOI\_DISTANCE\_TYPE

> `const` **VORONOI\_DISTANCE\_TYPE**: `object`

Defined in: [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L13)

**`Experimental`**

Voronoi 노이즈의 셀 거리 계산 방식을 정의하는 상수입니다.

### Example
```typescript
texture.distanceType = RedGPU.Resource.VORONOI_DISTANCE_TYPE.MANHATTAN;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-chebyshev"></a> `CHEBYSHEV` | `2` | `2` | 체비셰프 거리 (축별 거리 중 최댓값) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L28) |
| <a id="property-euclidean"></a> `EUCLIDEAN` | `0` | `0` | 유클리드 거리 (직선 거리) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L18) |
| <a id="property-manhattan"></a> `MANHATTAN` | `1` | `1` | 맨해튼 거리 (축별 거리의 합) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L23) |
