[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsEngine

# Interface: IPhysicsEngine

Defined in: [src/physics/IPhysicsEngine.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L98)

**`Experimental`**

물리 엔진 플러그인이 구현해야 할 인터페이스입니다.

::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
:::

## Properties

### bodies

> <span class="readonly-badge">readonly</span> **bodies**: [`IPhysicsBody`](IPhysicsBody.md)[]

Defined in: [src/physics/IPhysicsEngine.ts:113](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L113)

**`Experimental`**

엔진에서 관리 중인 모든 물리 바디 목록

***

### gravity

> **gravity**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L131)

**`Experimental`**

물리 월드의 중력 가속도 벡터

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### nativeWorld

> <span class="readonly-badge">readonly</span> **nativeWorld**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L103)

**`Experimental`**

물리 엔진의 원본 월드 인스턴스

***

### onCollisionStarted

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/physics/IPhysicsEngine.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L126)

**`Experimental`**

충돌이 시작될 때 호출되는 콜백 함수입니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | 첫 번째 충돌체의 핸들 |
| `handle2` | `number` | 두 번째 충돌체의 핸들 |

#### Returns

`void`

***

### RAPIER

> <span class="readonly-badge">readonly</span> **RAPIER**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:108](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L108)

**`Experimental`**

물리 엔진 라이브러리 네임스페이스

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`IPhysicsBody`](IPhysicsBody.md)

Defined in: [src/physics/IPhysicsEngine.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L167)

**`Experimental`**

메시에 물리 바디를 생성하여 연결합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | 대상 메시 객체 |
| `params` | [`BodyParams`](BodyParams.md) | 바디 생성 설정 파라미터 |

#### Returns

[`IPhysicsBody`](IPhysicsBody.md)

생성된 `IPhysicsBody` 인스턴스

***

### createCharacterController()

> **createCharacterController**(`offset`): `any`

Defined in: [src/physics/IPhysicsEngine.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L190)

**`Experimental`**

캐릭터 컨트롤러를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | 지면과의 오프셋 간격 |

#### Returns

`any`

생성된 캐릭터 컨트롤러 인스턴스

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/physics/IPhysicsEngine.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L141)

**`Experimental`**

물리 엔진을 비동기로 초기화합니다.

#### Returns

`Promise`\<`void`\>

초기화 완료 `Promise<void>`

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:177](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L177)

**`Experimental`**

물리 월드에서 물리 바디를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`IPhysicsBody`](IPhysicsBody.md) | 제거할 물리 바디 |

#### Returns

`void`

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L151)

**`Experimental`**

물리 시뮬레이션을 한 단계 진행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 경과 시간(초) |

#### Returns

`void`
