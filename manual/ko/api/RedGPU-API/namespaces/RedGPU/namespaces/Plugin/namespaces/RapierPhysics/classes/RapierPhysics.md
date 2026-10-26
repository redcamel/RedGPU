[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierPhysics

# Class: RapierPhysics

Defined in: [src/plugins/rapier/RapierPhysics.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L25)

**`Experimental`**

Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인 구현체입니다.

WASM 기반의 Rapier 엔진을 통합하여 강체 생성, 충돌 감지, 캐릭터 컨트롤러 및 중력 설정 등 물리 시뮬레이션 월드를 관리합니다.

::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
:::

## See

[Basic Physics example](https://redcamel.github.io/RedGPU/examples/physics/basic/)

## Implements

- [`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md)

## Constructors

### Constructor

> **new RapierPhysics**(): `RapierPhysics`

**`Experimental`**

#### Returns

`RapierPhysics`

## Properties

### onCollisionStarted

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L37)

**`Experimental`**

물리 엔진에서 충돌이 시작될 때 호출되는 콜백 함수입니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | 첫 번째 콜라이더 핸들 |
| `handle2` | `number` | 두 번째 콜라이더 핸들 |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`onCollisionStarted`](../../../../Physics/interfaces/IPhysicsEngine.md#oncollisionstarted)

## Accessors

### bodies

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bodies**(): [`RapierBody`](RapierBody.md)[]

Defined in: [src/plugins/rapier/RapierPhysics.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L74)

**`Experimental`**

엔진에서 관리 중인 모든 `RapierBody` 목록을 반환합니다.

##### Returns

[`RapierBody`](RapierBody.md)[]

`RapierBody` 인스턴스 배열

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`bodies`](../../../../Physics/interfaces/IPhysicsEngine.md#bodies)

***

### gravity

#### Get Signature

> **get** **gravity**(): `object`

Defined in: [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L93)

**`Experimental`**

물리 월드의 중력 가속도를 가져오거나 설정합니다.

#### Example
```typescript
// 중력 설정
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

##### Returns

`object`

X, Y, Z 축 중력 가속도 벡터

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L93) |
| `y` | `number` | [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L93) |
| `z` | `number` | [src/plugins/rapier/RapierPhysics.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L93) |

#### Set Signature

> **set** **gravity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:97](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L97)

**`Experimental`**

물리 월드의 중력 가속도 벡터

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} |
| `value.x` | `number` |
| `value.y` | `number` |
| `value.z` | `number` |

##### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`gravity`](../../../../Physics/interfaces/IPhysicsEngine.md#gravity)

***

### nativeWorld

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nativeWorld**(): `World`

Defined in: [src/plugins/rapier/RapierPhysics.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L50)

**`Experimental`**

물리 엔진의 원본 월드(World) 객체를 반환합니다.

##### Returns

`World`

Rapier 원본 월드 객체

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`nativeWorld`](../../../../Physics/interfaces/IPhysicsEngine.md#nativeworld)

***

### RAPIER

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **RAPIER**(): `__module`

Defined in: [src/plugins/rapier/RapierPhysics.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L62)

**`Experimental`**

Rapier 라이브러리 네임스페이스를 반환합니다.

##### Returns

`__module`

Rapier 네임스페이스 객체

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`RAPIER`](../../../../Physics/interfaces/IPhysicsEngine.md#rapier)

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L191)

**`Experimental`**

대상 메쉬에 물리 바디와 콜라이더를 생성하고 물리 월드에 등록합니다.

#### Example
```typescript
const body = physicsEngine.createBody(mesh, {
    type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
    shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
    mass: 1.0
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | 물리 바디를 적용할 대상 메쉬 |
| `params` | [`BodyParams`](../../../../Physics/interfaces/BodyParams.md) | 물리 바디 생성 설정 파라미터 |

#### Returns

[`RapierBody`](RapierBody.md)

생성된 `RapierBody` 인스턴스

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createBody`](../../../../Physics/interfaces/IPhysicsEngine.md#createbody)

***

### createCharacterController()

> **createCharacterController**(`offset`): `KinematicCharacterController`

Defined in: [src/plugins/rapier/RapierPhysics.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L241)

**`Experimental`**

경사로 및 계단 오르기와 지면 밀착이 활성화된 캐릭터 컨트롤러를 생성하여 반환합니다.

#### Example
```typescript
const controller = physicsEngine.createCharacterController(0.1);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | 캐릭터와 주변 장애물 사이의 여유 간격 |

#### Returns

`KinematicCharacterController`

생성된 `RAPIER.KinematicCharacterController` 인스턴스

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createCharacterController`](../../../../Physics/interfaces/IPhysicsEngine.md#createcharactercontroller)

***

### getBodyByColliderHandle()

> **getBodyByColliderHandle**(`handle`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L117)

**`Experimental`**

콜라이더 핸들로 관리 중인 `RapierBody`를 조회하여 반환합니다.

#### Example
```typescript
const body = physicsEngine.getBodyByColliderHandle(handle);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle` | `number` | 조회할 콜라이더의 고유 핸들 |

#### Returns

[`RapierBody`](RapierBody.md)

조회된 `RapierBody` 인스턴스 (존재하지 않으면 `undefined`)

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/plugins/rapier/RapierPhysics.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L134)

**`Experimental`**

Rapier 엔진을 초기화하고 기본 중력이 적용된 물리 월드를 생성합니다.

#### Example
```typescript
await physicsEngine.init();
```

#### Returns

`Promise`\<`void`\>

초기화 완료 `Promise`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`init`](../../../../Physics/interfaces/IPhysicsEngine.md#init)

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L220)

**`Experimental`**

물리 바디를 물리 월드에서 제거합니다.

#### Example
```typescript
// 물리 바디 제거
physicsEngine.removeBody(body);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`RapierBody`](RapierBody.md) | 제거할 `RapierBody` 인스턴스 |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`removeBody`](../../../../Physics/interfaces/IPhysicsEngine.md#removebody)

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/plugins/rapier/RapierPhysics.ts#L157)

**`Experimental`**

물리 시뮬레이션을 한 스텝 진행하고 충돌 이벤트 처리 및 메쉬 트랜스폼 동기화를 수행합니다.

#### Example
```typescript
// 렌더링 루프에서 물리 시뮬레이션 진행
renderer.start(redGPUContext, (time, deltaTime) => {
    physicsEngine.step(deltaTime / 1000);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 시간 간격 (초 단위) |

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`step`](../../../../Physics/interfaces/IPhysicsEngine.md#step)
