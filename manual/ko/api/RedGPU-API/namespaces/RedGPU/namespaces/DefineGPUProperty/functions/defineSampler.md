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
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md) \| [`DefineSamplerInfo`](../interfaces/DefineSamplerInfo.md)[] | 단일 [DefineSamplerInfo](../interfaces/DefineSamplerInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter/setter는 [Sampler](../../Resource/classes/Sampler.md) 인스턴스를 처리합니다.
- 샘플러가 설정되면 자동으로 바인드 그룹을 업데이트하기 위해 대상 인스턴스의 `updateSampler(prevSampler, sampler)` 메서드가 호출됩니다.


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
