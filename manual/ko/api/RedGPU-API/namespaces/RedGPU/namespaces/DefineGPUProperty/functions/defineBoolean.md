[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / defineBoolean

# Function: defineBoolean()

> **defineBoolean**(`target`, `defineInfo`): `void`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/defineBoolean.ts#L85)

대상 클래스의 프로토타입에 GPU 유니폼 버퍼와 연동되는 불리언(`boolean`) 프로퍼티를 동적으로 정의합니다.

값 변경 시 GPU 유니폼 버퍼에는 `1`(`true`) 또는 `0`(`false`)으로 변환되어 기록되며, `dirtyPipeline` 플래그를 `true`로 갱신합니다.

### Example
```typescript
// 단일 불리언 프로퍼티 정의
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });

// 다중 불리언 프로퍼티 일괄 정의
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [
    { key: 'useAlphaTest', value: true },
    { key: 'useNormalMap', value: false }
]);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `any` | 프로퍼티를 정의할 대상 클래스 생성자 |
| `defineInfo` | [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md) \| [`DefineBooleanInfo`](../interfaces/DefineBooleanInfo.md)[] | 단일 `DefineBooleanInfo` 설정 객체 또는 설정 배열 |

## Returns

`void`
