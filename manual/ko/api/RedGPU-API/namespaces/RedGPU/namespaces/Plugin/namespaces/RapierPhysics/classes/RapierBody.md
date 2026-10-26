[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierBody

# Class: RapierBody

Defined in: [src/plugins/rapier/RapierBody.ts:14](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L14)

**`Experimental`**

Rapier 강체(`RigidBody`)와 RedGPU `Mesh` 간의 트랜스폼을 동기화하고 제어하는 `IPhysicsBody` 구현 클래스입니다.

## Implements

- [`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md)

## Constructors

### Constructor

> **new RapierBody**(`mesh`, `body`, `collider`): `RapierBody`

Defined in: [src/plugins/rapier/RapierBody.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L33)

**`Experimental`**

RapierBody 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | 연동할 RedGPU `Mesh` 인스턴스 |
| `body` | `RigidBody` | Rapier 강체(`RigidBody`) 인스턴스 |
| `collider` | `Collider` | Rapier 충돌체(`Collider`) 인스턴스 |

#### Returns

`RapierBody`

## Accessors

### mesh

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mesh**(): [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/plugins/rapier/RapierBody.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L47)

**`Experimental`**

연동된 RedGPU `Mesh` 인스턴스를 반환합니다.

##### Returns

[`Mesh`](../../../../Display/classes/Mesh.md)

연동된 `Mesh` 인스턴스

***

### nativeBody

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nativeBody**(): `RigidBody`

Defined in: [src/plugins/rapier/RapierBody.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L59)

**`Experimental`**

원본 Rapier 강체(`RigidBody`) 객체를 반환합니다.

##### Returns

`RigidBody`

Rapier `RigidBody` 객체

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`nativeBody`](../../../../Physics/interfaces/IPhysicsBody.md#nativebody)

***

### nativeCollider

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nativeCollider**(): `Collider`

Defined in: [src/plugins/rapier/RapierBody.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L71)

**`Experimental`**

원본 Rapier 충돌체(`Collider`) 객체를 반환합니다.

##### Returns

`Collider`

Rapier `Collider` 객체

***

### position

#### Get Signature

> **get** **position**(): [`vec3`](../../../../Math/type-aliases/vec3.md)

Defined in: [src/plugins/rapier/RapierBody.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L83)

**`Experimental`**

물리 바디의 월드 위치를 가져오거나 설정합니다.

##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

월드 위치 벡터 (`vec3`)

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:88](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L88)

**`Experimental`**

물리 바디의 현재 위치

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} |

##### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`position`](../../../../Physics/interfaces/IPhysicsBody.md#position)

***

### rotation

#### Get Signature

> **get** **rotation**(): [`quat`](../../../../Math/type-aliases/quat.md)

Defined in: [src/plugins/rapier/RapierBody.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L104)

**`Experimental`**

물리 바디의 회전 쿼터니언(`quat`)을 가져오거나 설정합니다.

##### Returns

[`quat`](../../../../Math/type-aliases/quat.md)

회전 쿼터니언 (`quat`)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L109)

**`Experimental`**

물리 바디의 현재 회전(쿼터니언)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`quat`](../../../../Math/type-aliases/quat.md) \| \{ `w`: `number`; `x`: `number`; `y`: `number`; `z`: `number`; \} |

##### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`rotation`](../../../../Physics/interfaces/IPhysicsBody.md#rotation)

***

### velocity

#### Get Signature

> **get** **velocity**(): [`vec3`](../../../../Math/type-aliases/vec3.md)

Defined in: [src/plugins/rapier/RapierBody.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L125)

**`Experimental`**

물리 바디의 선속도(`vec3`)를 가져오거나 설정합니다.

##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

선속도 벡터 (`vec3`)

#### Set Signature

> **set** **velocity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:130](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L130)

**`Experimental`**

물리 바디의 현재 선속도

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} |

##### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`velocity`](../../../../Physics/interfaces/IPhysicsBody.md#velocity)

## Methods

### applyImpulse()

> **applyImpulse**(`force`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L151)

**`Experimental`**

물리 바디에 순간 충격량(Impulse)을 가합니다.

#### Example
```typescript
body.applyImpulse([0, 10, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 적용할 충격량 벡터 (`vec3` 또는 `{ x, y, z }`) |

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`applyImpulse`](../../../../Physics/interfaces/IPhysicsBody.md#applyimpulse)

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierBody.ts#L163)

**`Experimental`**

물리 시뮬레이션의 위치 및 회전 결과를 연동된 `Mesh`에 동기화합니다.

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`syncToMesh`](../../../../Physics/interfaces/IPhysicsBody.md#synctomesh)
