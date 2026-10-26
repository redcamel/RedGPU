[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / BLEND\_MODE

# Variable: BLEND\_MODE

> `const` **BLEND\_MODE**: `object`

Defined in: [src/material/BLEND\_MODE.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L13)

2D 객체 및 머티리얼 합성 시 사용되는 블렌드 모드 상수입니다.

### Example
```typescript
sprite2D.blendMode = RedGPU.Material.BLEND_MODE.MULTIPLY;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-difference"></a> `DIFFERENCE` | `6` | `6` | 차이(Difference) 블렌드 모드 (6) | [src/material/BLEND\_MODE.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L48) |
| <a id="property-exclusion"></a> `EXCLUSION` | `7` | `7` | 제외(Exclusion) 블렌드 모드 (7) | [src/material/BLEND\_MODE.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L53) |
| <a id="property-lighten"></a> `LIGHTEN` | `2` | `2` | 밝게(Lighten) 블렌드 모드 (2) | [src/material/BLEND\_MODE.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L28) |
| <a id="property-linear_dodge"></a> `LINEAR_DODGE` | `4` | `4` | 선형 닷지(Linear Dodge) 블렌드 모드 (4) | [src/material/BLEND\_MODE.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L38) |
| <a id="property-multiply"></a> `MULTIPLY` | `1` | `1` | 곱하기(Multiply) 블렌드 모드 (1) | [src/material/BLEND\_MODE.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L23) |
| <a id="property-normal"></a> `NORMAL` | `0` | `0` | 기본 블렌드 모드 (0) | [src/material/BLEND\_MODE.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L18) |
| <a id="property-screen"></a> `SCREEN` | `3` | `3` | 스크린(Screen) 블렌드 모드 (3) | [src/material/BLEND\_MODE.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L33) |
| <a id="property-subtract"></a> `SUBTRACT` | `5` | `5` | 빼기(Subtract) 블렌드 모드 (5) | [src/material/BLEND\_MODE.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/BLEND_MODE.ts#L43) |

## See

[2D BlendMode basic example](https://redcamel.github.io/RedGPU/examples/2d/blendMode/basic/)
