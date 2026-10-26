[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineSampler

# Function: defineSampler()

> **defineSampler**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineSampler.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/texture/defineSampler.ts#L64)

지정된 대상의 프로토타입에 GPU 바인드 그룹과 연동되는 텍스처 샘플러 속성을 정의합니다.

샘플러 변경 시 대상의 `updateSampler(prevSampler, sampler)`를 호출하여 바인드 그룹을 자동 갱신합니다.

### Example
```typescript
// 단일 샘플러 속성 정의
RedGPU.DefineGPUProperty.defineSampler(MyMaterial, { key: 'diffuseSampler' });

// 다중 샘플러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineSampler(MyMaterial, [
  { key: 'diffuseSampler' },
  { key: 'normalSampler' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md) \| [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md)[] | 단일 `DefineSamplerInfo` 설정 또는 설정 배열 |

## Returns

`void`
