[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineCubeTexture

# Function: defineCubeTexture()

> **defineCubeTexture**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineCubeTexture.ts:74](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/texture/defineCubeTexture.ts#L74)

지정된 클래스의 프로토타입에 GPU와 연동되는 큐브 텍스처(CubeTexture) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineCubeTextureInfo`](../interfaces/DefineCubeTextureInfo.md) \| [`DefineCubeTextureInfo`](../interfaces/DefineCubeTextureInfo.md)[] | A single [DefineCubeTextureInfo](../interfaces/DefineCubeTextureInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Handles [CubeTexture](../../Resource/classes/CubeTexture.md) or [DirectCubeTexture](../../Resource/classes/DirectCubeTexture.md) instances.
- When a texture is set, it invokes `updateTexture(prevTexture, texture)` on the target instance to update bind groups.
- If a corresponding `use{Key}` property (e.g. `useEnvMap`) exists on the target, it automatically synchronizes its boolean state and GPU uniform value (1 or 0) based on texture presence.

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, { key: 'envTexture' });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineCubeTexture(MyMaterial, [
  { key: 'skyboxTexture' },
  { key: 'reflectionTexture' }
]);
```
