[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineBoolean

# Function: defineBoolean()

> **defineBoolean**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/defineBoolean.ts#L88)

지정된 클래스의 프로토타입에 GPU와 연동되는 사용자 정의 불리언(Boolean) 속성을 정의합니다.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | Class constructor to define properties on |
| `defineInfo` | [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md) \| [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md)[] | A single [DefineBooleanInfo](../interfaces/DefineBooleanInfo.md) configuration or an array of configurations |

## Returns

`void`

## Remarks


***
- Since GPU buffers do not support booleans, the setter converts `true` → `1` and `false` → `0` before calling updateTargetUniform.
- Assigning a non-boolean value emits a `console.warn`.
- Sets `dirtyPipeline = true` on change to trigger render pipeline rebuild.

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
