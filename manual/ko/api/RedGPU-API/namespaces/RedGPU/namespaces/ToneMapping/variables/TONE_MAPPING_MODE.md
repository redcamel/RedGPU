[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ToneMapping](../README.md) / TONE\_MAPPING\_MODE

# Variable: TONE\_MAPPING\_MODE

> `const` **TONE\_MAPPING\_MODE**: `object`

Defined in: [src/toneMapping/TONE\_MAPPING\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/TONE_MAPPING_MODE.ts#L12)

사용 가능한 톤 매핑 모드 상수 정의입니다.

### Example
```typescript
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-aces_filmic_hill"></a> `ACES_FILMIC_HILL` | `"ACESFilmicHill"` | `'ACESFilmicHill'` | ACES Filmic (Hill 근사) 톤 매핑 | [src/toneMapping/TONE\_MAPPING\_MODE.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/TONE_MAPPING_MODE.ts#L27) |
| <a id="property-aces_filmic_narkowicz"></a> `ACES_FILMIC_NARKOWICZ` | `"ACESFilmicNarkowicz"` | `'ACESFilmicNarkowicz'` | ACES Filmic (Narkowicz 근사) 톤 매핑 | [src/toneMapping/TONE\_MAPPING\_MODE.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/TONE_MAPPING_MODE.ts#L32) |
| <a id="property-khronos_pbr_neutral"></a> `KHRONOS_PBR_NEUTRAL` | `"khronosPBRNeutral"` | `'khronosPBRNeutral'` | Khronos PBR Neutral 톤 매핑 | [src/toneMapping/TONE\_MAPPING\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/TONE_MAPPING_MODE.ts#L22) |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | 선형 톤 매핑 | [src/toneMapping/TONE\_MAPPING\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/TONE_MAPPING_MODE.ts#L17) |
