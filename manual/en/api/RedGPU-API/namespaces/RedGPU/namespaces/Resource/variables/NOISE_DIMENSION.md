[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / NOISE\_DIMENSION

# Variable: NOISE\_DIMENSION

> `const` **NOISE\_DIMENSION**: `object`

Defined in: [src/resources/texture/noiseTexture/simplex/NOISE\_DIMENSION.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/simplex/NOISE_DIMENSION.ts#L16)

**`Experimental`**

Constants defining the dimension used for Simplex noise generation.

Has the values `MODE_1D`(1), `MODE_2D`(2), and `MODE_3D`(3).

### Example
```typescript
simplexTexture.noiseDimension = RedGPU.Resource.NOISE_DIMENSION.MODE_3D;
```

## Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="property-mode_1d"></a> `MODE_1D` | `1` | `1` | [src/resources/texture/noiseTexture/simplex/NOISE\_DIMENSION.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/simplex/NOISE_DIMENSION.ts#L17) |
| <a id="property-mode_2d"></a> `MODE_2D` | `2` | `2` | [src/resources/texture/noiseTexture/simplex/NOISE\_DIMENSION.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/simplex/NOISE_DIMENSION.ts#L18) |
| <a id="property-mode_3d"></a> `MODE_3D` | `3` | `3` | [src/resources/texture/noiseTexture/simplex/NOISE\_DIMENSION.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/noiseTexture/simplex/NOISE_DIMENSION.ts#L19) |
