[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineBoolean

# Function: defineBoolean()

> **defineBoolean**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/defineProperty/funcs/defineBoolean.ts#L88)

지정된 클래스의 프로토타입에 GPU와 연동되는 사용자 정의 불리언(Boolean) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 속성을 정의할 클래스 생성자
| `defineInfo` | [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md) \| [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md)[] | 단일 [DefineBooleanInfo](../interfaces/DefineBooleanInfo.md) 설정 또는 그 배열

## Returns

`void`

## Remarks

***
- GPU 버퍼는 불리언을 지원하지 않으므로, setter는 `true` → `1`, `false` → `0`으로 변환하여 updateTargetUniform에 전달합니다.
- 속성에 `boolean`이 아닌 값을 할당하면 `console.warn`으로 경고합니다.
- 값 변경 시 `dirtyPipeline = true`로 설정하여 렌더 파이프라인 재빌드를 트리거합니다.


## Example

```typescript
// 단일 설정
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });

// 여러 속성 일괄 정의
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [
  { key: 'useAlphaTest', value: true },
  { key: 'useNormalMap', value: false },
]);
```
