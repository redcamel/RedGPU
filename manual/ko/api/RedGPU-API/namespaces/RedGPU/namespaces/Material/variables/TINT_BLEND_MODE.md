[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / TINT\_BLEND\_MODE

# Variable: TINT\_BLEND\_MODE

> `const` **TINT\_BLEND\_MODE**: `object`

Defined in: [src/material/TINT\_BLEND\_MODE.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L15)

머티리얼의 틴트(Tint) 색상을 원본 색상과 합성할 때 사용하는 블렌드 모드 상수입니다.

### Example
```typescript
material.useTint = true;
material.tintBlendMode = RedGPU.Material.TINT_BLEND_MODE.MULTIPLY;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-color"></a> `COLOR` | `21` | `21` | 색상(Color) 틴트 블렌드 모드 (21) | [src/material/TINT\_BLEND\_MODE.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L125) |
| <a id="property-color_burn"></a> `COLOR_BURN` | `9` | `9` | 컬러 번(Color Burn) 틴트 블렌드 모드 (9) | [src/material/TINT\_BLEND\_MODE.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L65) |
| <a id="property-color_dodge"></a> `COLOR_DODGE` | `8` | `8` | 컬러 닷지(Color Dodge) 틴트 블렌드 모드 (8) | [src/material/TINT\_BLEND\_MODE.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L60) |
| <a id="property-darken"></a> `DARKEN` | `6` | `6` | 어둡게(Darken) 틴트 블렌드 모드 (6) | [src/material/TINT\_BLEND\_MODE.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L50) |
| <a id="property-difference"></a> `DIFFERENCE` | `12` | `12` | 차이(Difference) 틴트 블렌드 모드 (12) | [src/material/TINT\_BLEND\_MODE.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L80) |
| <a id="property-divide"></a> `DIVIDE` | `14` | `14` | 나누기(Divide) 틴트 블렌드 모드 (14) | [src/material/TINT\_BLEND\_MODE.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L90) |
| <a id="property-exclusion"></a> `EXCLUSION` | `13` | `13` | 제외(Exclusion) 틴트 블렌드 모드 (13) | [src/material/TINT\_BLEND\_MODE.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L85) |
| <a id="property-hard_light"></a> `HARD_LIGHT` | `10` | `10` | 하드 라이트(Hard Light) 틴트 블렌드 모드 (10) | [src/material/TINT\_BLEND\_MODE.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L70) |
| <a id="property-hue"></a> `HUE` | `19` | `19` | 색조(Hue) 틴트 블렌드 모드 (19) | [src/material/TINT\_BLEND\_MODE.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L115) |
| <a id="property-lighten"></a> `LIGHTEN` | `2` | `2` | 밝게(Lighten) 틴트 블렌드 모드 (2) | [src/material/TINT\_BLEND\_MODE.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L30) |
| <a id="property-linear_burn"></a> `LINEAR_BURN` | `16` | `16` | 선형 번(Linear Burn) 틴트 블렌드 모드 (16) | [src/material/TINT\_BLEND\_MODE.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L100) |
| <a id="property-linear_dodge"></a> `LINEAR_DODGE` | `4` | `4` | 선형 닷지(Linear Dodge) 틴트 블렌드 모드 (4) | [src/material/TINT\_BLEND\_MODE.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L40) |
| <a id="property-luminosity"></a> `LUMINOSITY` | `20` | `20` | 광도(Luminosity) 틴트 블렌드 모드 (20) | [src/material/TINT\_BLEND\_MODE.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L120) |
| <a id="property-multiply"></a> `MULTIPLY` | `1` | `1` | 곱하기(Multiply) 틴트 블렌드 모드 (1) | [src/material/TINT\_BLEND\_MODE.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L25) |
| <a id="property-negation"></a> `NEGATION` | `22` | `22` | 반전(Negation) 틴트 블렌드 모드 (22) | [src/material/TINT\_BLEND\_MODE.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L130) |
| <a id="property-normal"></a> `NORMAL` | `0` | `0` | 기본(Normal) 틴트 블렌드 모드 (0) | [src/material/TINT\_BLEND\_MODE.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L20) |
| <a id="property-overlay"></a> `OVERLAY` | `7` | `7` | 오버레이(Overlay) 틴트 블렌드 모드 (7) | [src/material/TINT\_BLEND\_MODE.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L55) |
| <a id="property-pin_light"></a> `PIN_LIGHT` | `17` | `17` | 핀 라이트(Pin Light) 틴트 블렌드 모드 (17) | [src/material/TINT\_BLEND\_MODE.ts:105](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L105) |
| <a id="property-saturation"></a> `SATURATION` | `18` | `18` | 채도(Saturation) 틴트 블렌드 모드 (18) | [src/material/TINT\_BLEND\_MODE.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L110) |
| <a id="property-screen"></a> `SCREEN` | `3` | `3` | 스크린(Screen) 틴트 블렌드 모드 (3) | [src/material/TINT\_BLEND\_MODE.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L35) |
| <a id="property-soft_light"></a> `SOFT_LIGHT` | `11` | `11` | 소프트 라이트(Soft Light) 틴트 블렌드 모드 (11) | [src/material/TINT\_BLEND\_MODE.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L75) |
| <a id="property-subtract"></a> `SUBTRACT` | `5` | `5` | 빼기(Subtract) 틴트 블렌드 모드 (5) | [src/material/TINT\_BLEND\_MODE.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L45) |
| <a id="property-vivid_light"></a> `VIVID_LIGHT` | `15` | `15` | 비비드 라이트(Vivid Light) 틴트 블렌드 모드 (15) | [src/material/TINT\_BLEND\_MODE.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/TINT_BLEND_MODE.ts#L95) |

## See

 - [2D Tint basic example](https://redcamel.github.io/RedGPU/examples/2d/tint/basic/)
 - [3D Tint basic example](https://redcamel.github.io/RedGPU/examples/3d/tint/basic/)
