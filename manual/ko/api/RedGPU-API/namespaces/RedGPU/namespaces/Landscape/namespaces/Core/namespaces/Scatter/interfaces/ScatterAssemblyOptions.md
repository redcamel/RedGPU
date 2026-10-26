[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterAssemblyOptions

# Interface: ScatterAssemblyOptions

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L93)

스캐터 렌더 유닛 조립 시 피벗 보존, 중심 정렬 및 그림자 전용 병합 지오메트리 생성 여부를 제어하는 옵션 인터페이스입니다.

## Properties

### centerXZ?

> `optional` **centerXZ?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L104)

바운딩 박스의 XZ 중심을 원점(`0, 0`)으로 정렬할지 여부 (기본값: `false`)

***

### createRenderUnits?

> `optional` **createRenderUnits?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L116)

기본 `ScatterRenderUnit[]` 인스턴스 배열을 생성할지 여부 (기본값: `true`)

***

### generateShadowMergedGeometry?

> `optional` **generateShadowMergedGeometry?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L110)

그림자 패스용 위치 전용(`POSITION_ONLY`) 단일 병합 지오메트리를 함께 생성할지 여부 (기본값: `false`)

***

### preservePivot?

> `optional` **preservePivot?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L98)

원본 메시의 Y축 피벗을 그대로 유지할지 여부 (기본값: `true`)
