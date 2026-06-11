[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineVector4

# Function: defineVector4()

> **defineVector4**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:51](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/defineProperty/funcs/vector/defineVector4.ts#L51)

지정된 클래스의 프로토타입에 GPU와 연동되는 4차원 벡터(Vector4) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineVector4Info`](../interfaces/DefineVector4Info.md) \| [`DefineVector4Info`](../interfaces/DefineVector4Info.md)[] | A single [DefineVector4Info](../interfaces/DefineVector4Info.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Handles a 4-tuple array (`[number, number, number, number]`).
- Automatically updates the GPU uniform buffer on value change.

## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, { key: 'lightColor', value: [1, 1, 1, 1] });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineVector4(MyMaterial, [
  { key: 'tilingAndOffset', value: [1, 1, 0, 0] },
  { key: 'viewport', value: [0, 0, 1920, 1080] }
]);
```
