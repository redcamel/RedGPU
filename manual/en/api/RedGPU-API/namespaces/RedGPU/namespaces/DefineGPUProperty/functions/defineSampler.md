[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineSampler

# Function: defineSampler()

> **defineSampler**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineSampler.ts:59](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/defineProperty/funcs/texture/defineSampler.ts#L59)

지정된 클래스의 프로토타입에 GPU와 연동되는 텍스처 샘플러(Sampler) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md) \| [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md)[] | A single [DefineSamplerInfo](../interfaces/DefineSamplerInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Handles [Sampler](../../Resource/classes/Sampler.md) instances.
- When a sampler is set, it invokes `updateSampler(prevSampler, sampler)` on the target instance to update bind groups.

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineSampler(MyMaterial, { key: 'diffuseSampler' });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineSampler(MyMaterial, [
  { key: 'diffuseSampler' },
  { key: 'normalSampler' }
]);
```
