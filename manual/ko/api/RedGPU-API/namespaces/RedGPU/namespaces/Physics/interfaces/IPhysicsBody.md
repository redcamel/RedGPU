[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsBody

# Interface: IPhysicsBody

Defined in: [src/physics/IPhysicsBody.ts:18](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L18)

**`Experimental`**

물리 엔진의 강체(Rigid Body)와 RedGPU 메쉬를 연결하는 인터페이스입니다.


이 인터페이스를 통해 물리 시뮬레이션 결과(위치, 회전 등)를 메쉬에 반영하거나, 외부에서 물리 객체를 제어할 수 있습니다.


::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## Properties

### nativeBody

> **nativeBody**: `any`

Defined in: [src/physics/IPhysicsBody.ts:26](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L26)

**`Experimental`**

물리 엔진의 원본 Body 객체 (Escape Hatch)


특정 물리 엔진(예: Rapier)의 고유 기능에 직접 접근해야 할 때 사용합니다.


***

### position

> **position**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:37](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L37)

**`Experimental`**

물리 바디의 현재 위치


### Example
```typescript
body.position = [0, 10, 0];
```

***

### rotation

> **rotation**: [`quat`](../../Math/type-aliases/quat.md) \| \{ `w`: `number`; `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:48](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L48)

**`Experimental`**

물리 바디의 현재 회전 (쿼터니언)


### Example
```typescript
body.rotation = [0, 0, 0, 1];
```

***

### velocity

> **velocity**: [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \}

Defined in: [src/physics/IPhysicsBody.ts:59](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L59)

**`Experimental`**

물리 바디의 현재 선속도


### Example
```typescript
const velocity = body.velocity;
```

## Methods

### applyImpulse()

> **applyImpulse**(`force`): `void`

Defined in: [src/physics/IPhysicsBody.ts:74](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L74)

**`Experimental`**

물리 바디에 충격량(Impulse)을 적용합니다.


### Example
```typescript
body.applyImpulse([0, 5, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 적용할 힘의 벡터

#### Returns

`void`

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/physics/IPhysicsBody.ts:83](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/physics/IPhysicsBody.ts#L83)

**`Experimental`**

물리 엔진의 시뮬레이션 결과를 연결된 메쉬의 트랜스폼에 동기화합니다.


일반적으로 렌더링 루프에서 자동으로 호출됩니다.


#### Returns

`void`
