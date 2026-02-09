[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / IPhysicsEngine

# Interface: IPhysicsEngine

Defined in: [src/physics/IPhysicsEngine.ts:96](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L96)

**`Experimental`**

물리 엔진 플러그인이 구현해야 할 인터페이스입니다.


::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## Properties

### bodies

> `readonly` **bodies**: [`IPhysicsBody`](IPhysicsBody.md)[]

Defined in: [src/physics/IPhysicsEngine.ts:111](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L111)

**`Experimental`**

엔진에서 관리 중인 모든 물리 바디 리스트


***

### gravity

> **gravity**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:177](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L177)

**`Experimental`**

중력을 설정하거나 가져옵니다.


### Example
```typescript
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

#### x

> **x**: `number`

#### y

> **y**: `number`

#### z

> **z**: `number`

***

### nativeWorld

> `readonly` **nativeWorld**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:101](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L101)

**`Experimental`**

물리 엔진의 원본 월드 인스턴스 (Escape Hatch)


***

### onCollisionStarted()

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/physics/IPhysicsEngine.ts:123](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L123)

**`Experimental`**

물리 엔진에서 충돌이 시작될 때 호출되는 콜백입니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | 첫 번째 충돌체의 핸들
| `handle2` | `number` | 두 번째 충돌체의 핸들

#### Returns

`void`

***

### RAPIER

> `readonly` **RAPIER**: `any`

Defined in: [src/physics/IPhysicsEngine.ts:106](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L106)

**`Experimental`**

물리 엔진 라이브러리 네임스페이스 (Escape Hatch)


## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`IPhysicsBody`](IPhysicsBody.md)

Defined in: [src/physics/IPhysicsEngine.ts:157](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L157)

**`Experimental`**

메쉬에 물리 바디를 생성하고 연결합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | 대상 메쉬
| `params` | [`BodyParams`](BodyParams.md) | 바디 생성 파라미터

#### Returns

[`IPhysicsBody`](IPhysicsBody.md)

생성된 물리 바디


***

### createCharacterController()

> **createCharacterController**(`offset`): `any`

Defined in: [src/physics/IPhysicsEngine.ts:190](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L190)

**`Experimental`**

캐릭터 컨트롤러를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | 지면과의 간격

#### Returns

`any`

캐릭터 컨트롤러 인스턴스


***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/physics/IPhysicsEngine.ts:133](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L133)

**`Experimental`**

물리 엔진을 초기화합니다. (WASM 로딩 등)


#### Returns

`Promise`\<`void`\>

초기화 완료를 보장하는 Promise


***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:166](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L166)

**`Experimental`**

물리 바디를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`IPhysicsBody`](IPhysicsBody.md) | 제거할 바디

#### Returns

`void`

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/physics/IPhysicsEngine.ts:142](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/physics/IPhysicsEngine.ts#L142)

**`Experimental`**

물리 시뮬레이션을 한 단계 진행합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 시간 간격

#### Returns

`void`
