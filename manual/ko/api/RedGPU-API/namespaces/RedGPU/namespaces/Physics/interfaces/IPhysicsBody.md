[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsBody

# Interface: IPhysicsBody

Defined in: [src/physics/IPhysicsBody.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L15)

**`Experimental`**

물리 엔진의 강체(Rigid Body)와 RedGPU 메시를 연결하는 인터페이스입니다.

::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
:::

## Properties

### nativeBody

> **nativeBody**: `any`

Defined in: [src/physics/IPhysicsBody.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L20)

**`Experimental`**

물리 엔진의 원본 Body 객체

***

### position

> **position**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L26)

**`Experimental`**

물리 바디의 현재 위치

***

### rotation

> **rotation**: [`quat`](../../Math/type-aliases/quat.md) \| \{ `w`: `number`; `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L32)

**`Experimental`**

물리 바디의 현재 회전(쿼터니언)

***

### velocity

> **velocity**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L38)

**`Experimental`**

물리 바디의 현재 선속도

## Methods

### applyImpulse()

> **applyImpulse**(`force`): `void`

Defined in: [src/physics/IPhysicsBody.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L55)

**`Experimental`**

물리 바디에 충격량(Impulse)을 적용합니다.

### Example
```typescript
// Y축 방향으로 충격량 적용
body.applyImpulse([0, 5, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 적용할 힘의 벡터 |

#### Returns

`void`

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/physics/IPhysicsBody.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/physics/IPhysicsBody.ts#L61)

**`Experimental`**

물리 시뮬레이션 결과를 연결된 메시의 트랜스폼에 동기화합니다.

#### Returns

`void`
