[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VORONOI\_DISTANCE\_TYPE

# Variable: VORONOI\_DISTANCE\_TYPE

> `const` **VORONOI\_DISTANCE\_TYPE**: `object`

Defined in: [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L13)

**`Experimental`**

Constants defining the cell distance calculation method of Voronoi noise.

### Example
```typescript
texture.distanceType = RedGPU.Resource.VORONOI_DISTANCE_TYPE.MANHATTAN;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-chebyshev"></a> `CHEBYSHEV` | `2` | `2` | Chebyshev distance (maximum of per-axis distances) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L28) |
| <a id="property-euclidean"></a> `EUCLIDEAN` | `0` | `0` | Euclidean distance (straight-line distance) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L18) |
| <a id="property-manhattan"></a> `MANHATTAN` | `1` | `1` | Manhattan distance (sum of per-axis distances) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_DISTANCE\_TYPE.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_DISTANCE_TYPE.ts#L23) |
