[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineTexture

# Function: defineTexture()

> **defineTexture**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineTexture.ts:75](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/defineProperty/funcs/texture/defineTexture.ts#L75)

지정된 클래스의 프로토타입에 GPU와 연동되는 일반 텍스처(Texture) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineTextureInfo`](../interfaces/DefineTextureInfo.md) \| [`DefineTextureInfo`](../interfaces/DefineTextureInfo.md)[] | 단일 [DefineTextureInfo](../interfaces/DefineTextureInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- 해당 속성의 getter/setter는 [BitmapTexture](../../Resource/classes/BitmapTexture.md), [ANoiseTexture](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md), [HDRTexture](../../Resource/classes/HDRTexture.md) 인스턴스를 처리합니다.
- 텍스처가 설정되면 자동으로 바인드 그룹을 업데이트하기 위해 대상 인스턴스의 `updateTexture(prevTexture, texture)` 메서드가 호출됩니다.
- 만약 대상 인스턴스에 `use{Key}` 패턴의 속성(예: `useDiffuseTexture` 등)이 존재할 경우, 해당 텍스처의 유무에 맞춰 불리언 값 및 GPU 유니폼 버퍼에 1/0 상태를 동기화합니다.


## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineTexture(MyMaterial, { key: 'diffuseTexture' });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineTexture(MyMaterial, [
  { key: 'diffuseTexture' },
  { key: 'normalTexture' },
  { key: 'displacementTexture' }
]);
```
