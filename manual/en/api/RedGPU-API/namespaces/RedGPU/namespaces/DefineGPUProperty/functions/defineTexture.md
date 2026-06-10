[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineTexture

# Function: defineTexture()

> **defineTexture**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/texture/defineTexture.ts:75](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/defineProperty/funcs/texture/defineTexture.ts#L75)

지정된 클래스의 프로토타입에 GPU와 연동되는 일반 텍스처(Texture) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineTextureInfo`](../interfaces/DefineTextureInfo.md) \| [`DefineTextureInfo`](../interfaces/DefineTextureInfo.md)[] | A single [DefineTextureInfo](../interfaces/DefineTextureInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Handles [BitmapTexture](../../Resource/classes/BitmapTexture.md), [ANoiseTexture](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md), and [HDRTexture](../../Resource/classes/HDRTexture.md) instances.
- When a texture is set, it invokes `updateTexture(prevTexture, texture)` on the target instance to update bind groups.
- If a corresponding `use{Key}` property (e.g. `useDiffuseTexture`) exists on the target, it automatically synchronizes its boolean state and GPU uniform value (1 or 0) based on texture presence.

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
