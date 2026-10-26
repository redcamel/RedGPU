[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LANDSCAPE\_DEBUG\_MODE

# Variable: LANDSCAPE\_DEBUG\_MODE

> `const` **LANDSCAPE\_DEBUG\_MODE**: `object`

Defined in: [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L7)

지형 렌더링의 시각적 디버그 모드 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-albedo"></a> `ALBEDO` | `3` | `3` | 조명 연산이 제외된 순수 알베도(Base Color) 색상을 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L27) |
| <a id="property-ambient_occlusion"></a> `AMBIENT_OCCLUSION` | `6` | `6` | 지형 표면의 앰비언트 오클루전(Ambient Occlusion) 값을 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L42) |
| <a id="property-csm_shadow_mask"></a> `CSM_SHADOW_MASK` | `8` | `8` | 캐스케이드 섀도우 맵(CSM) 그림자 마스크를 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L52) |
| <a id="property-elevation_heatmap"></a> `ELEVATION_HEATMAP` | `10` | `10` | 정규화된 지형 고도(Elevation)를 히트맵 색상으로 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L62) |
| <a id="property-final_normal"></a> `FINAL_NORMAL` | `1` | `1` | 레이어 노말 맵이 합성된 최종 월드 공간 법선 벡터를 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L17) |
| <a id="property-heightmap_shadow_mask"></a> `HEIGHTMAP_SHADOW_MASK` | `7` | `7` | 하이트맵 레이마칭 기반 자체 그림자(Heightmap Shadow) 마스크를 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L47) |
| <a id="property-lod_level"></a> `LOD_LEVEL` | `11` | `11` | 타일별 지오메트리 LOD 레벨을 색상으로 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L67) |
| <a id="property-macro_normal"></a> `MACRO_NORMAL` | `2` | `2` | VNT 아틀라스에서 샘플링한 지형 매크로 법선 벡터를 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L22) |
| <a id="property-none"></a> `NONE` | `0` | `0` | 디버그 시각화를 비활성화하고 일반 PBR 렌더링을 수행합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L12) |
| <a id="property-roughness"></a> `ROUGHNESS` | `5` | `5` | 지형 표면의 거칠기(Roughness) 값을 그레이스케일로 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L37) |
| <a id="property-splat_weights"></a> `SPLAT_WEIGHTS` | `4` | `4` | 스플래팅 레이어들의 블렌딩 가중치 분포를 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L32) |
| <a id="property-total_shadow_visibility"></a> `TOTAL_SHADOW_VISIBILITY` | `9` | `9` | 하이트맵 그림자와 CSM 그림자가 결합된 전체 그림자 가시성을 시각화합니다. | [src/landscape/LANDSCAPE\_DEBUG\_MODE.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LANDSCAPE_DEBUG_MODE.ts#L57) |
