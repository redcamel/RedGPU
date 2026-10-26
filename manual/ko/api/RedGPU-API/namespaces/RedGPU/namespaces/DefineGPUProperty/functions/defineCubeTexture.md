[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineCubeTexture

# Function: defineCubeTexture()

> **defineCubeTexture**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineCubeTexture.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/texture/defineCubeTexture.ts#L77)

지정된 대상의 프로토타입에 GPU 바인드 그룹 및 유니폼 버퍼와 연동되는 큐브 텍스처 속성을 정의합니다.

텍스처 변경 시 대상의 `updateTexture(prevTexture, texture)`를 호출하며, `use{Key}` 속성이 존재하면 불리언 상태와 유니폼 값(1 또는 0)을 자동 갱신합니다.

### Example
```typescript
// 단일 큐브 텍스처 속성 정의
RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, { key: 'envTexture' });

// 다중 큐브 텍스처 속성 일괄 정의
RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, [
  { key: 'skyboxTexture' },
  { key: 'reflectionTexture' }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 대상 클래스 또는 프로토타입 |
| `defineInfo` | [`DefineCubeTextureInfo`](../interfaces/DefineCubeTextureInfo.md) \| [`DefineCubeTextureInfo`](../interfaces/DefineCubeTextureInfo.md)[] | 단일 `DefineCubeTextureInfo` 설정 또는 설정 배열 |

## Returns

`void`
