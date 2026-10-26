[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VORONOI\_OUTPUT\_TYPE

# Variable: VORONOI\_OUTPUT\_TYPE

> `const` **VORONOI\_OUTPUT\_TYPE**: `object`

Defined in: [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L13)

**`Experimental`**

Constants defining how the Voronoi noise output value is computed.

### Example
```typescript
texture.outputType = RedGPU.Resource.VORONOI_OUTPUT_TYPE.F2_MINUS_F1;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-cell_id"></a> `CELL_ID` | `4` | `4` | Unique grayscale ID value per cell | [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L38) |
| <a id="property-cell_id_color"></a> `CELL_ID_COLOR` | `5` | `5` | Unique RGB color per cell | [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L43) |
| <a id="property-f1"></a> `F1` | `0` | `0` | Distance to the closest point | [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L18) |
| <a id="property-f1_plus_f2"></a> `F1_PLUS_F2` | `3` | `3` | F1 + F2 (smooth blend) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L33) |
| <a id="property-f2"></a> `F2` | `1` | `1` | Distance to the second closest point | [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L23) |
| <a id="property-f2_minus_f1"></a> `F2_MINUS_F1` | `2` | `2` | F2 - F1 (cell edge emphasis) | [src/resources/texture/noiseTexture/voronoi/VORONOI\_OUTPUT\_TYPE.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/voronoi/VORONOI_OUTPUT_TYPE.ts#L28) |
