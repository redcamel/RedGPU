[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / assembleScatterRenderUnits

# Function: assembleScatterRenderUnits()

> **assembleScatterRenderUnits**(`redGPUContext`, `roots`, `options?`): [`ScatterAssemblyResult`](../interfaces/ScatterAssemblyResult.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:314](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L314)

하나 이상의 `Mesh` 계층 구조를 순회하여 동일 머티리얼 단위로 정점/인덱스 버퍼를 병합하고, 스캐터 인스턴싱 렌더링에 최적화된 `ScatterRenderUnit` 목록과 바운딩 정보를 생성합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `roots` | [`Mesh`](../../../../../../Display/classes/Mesh.md) \| [`Mesh`](../../../../../../Display/classes/Mesh.md)[] | 병합할 루트 `Mesh` 또는 `Mesh[]` 배열 |
| `options?` | [`ScatterAssemblyOptions`](../interfaces/ScatterAssemblyOptions.md) | 피벗 보존, XZ 중심 정렬, 그림자 병합 지오메트리 및 렌더 유닛 생성 옵션 (선택적) |

## Returns

[`ScatterAssemblyResult`](../interfaces/ScatterAssemblyResult.md)

병합된 렌더 유닛, 통합 지오메트리 및 바운딩 볼륨 정보를 담은 `ScatterAssemblyResult` 객체
