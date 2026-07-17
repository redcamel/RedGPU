[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineSampler

# Function: defineSampler()

> **defineSampler**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineSampler.ts:59](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/texture/defineSampler.ts#L59)

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
