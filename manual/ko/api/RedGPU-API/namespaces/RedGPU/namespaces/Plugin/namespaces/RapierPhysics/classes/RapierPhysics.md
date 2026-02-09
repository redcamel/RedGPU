[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierPhysics

# Class: RapierPhysics

Defined in: [src/plugins/rapier/RapierPhysics.ts:26](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L26)

**`Experimental`**

Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인 구현체입니다.


이 클래스는 WASM 기반의 Rapier 엔진을 RedGPU 환경에 통합하며, 고성능 물리 시뮬레이션 월드를 관리합니다. 강체 생성, 충돌 감지, 캐릭터 컨트롤러 및 중력 설정과 같은 핵심 물리 기능을 제공합니다.


::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## See

 - [물리 플러그인 매뉴얼](https://redcamel.github.io/RedGPU/manual/ko/plugins/physics)
 -

## Implements

- [`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md)

## Constructors

### Constructor

> **new RapierPhysics**(): `RapierPhysics`

**`Experimental`**

#### Returns

`RapierPhysics`

## Properties

### onCollisionStarted()

> **onCollisionStarted**: (`handle1`, `handle2`) => `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:42](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L42)

**`Experimental`**

물리 엔진에서 충돌이 시작될 때 호출되는 콜백입니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle1` | `number` | 첫 번째 충돌체의 핸들
| `handle2` | `number` | 두 번째 충돌체의 핸들

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`onCollisionStarted`](../../../../Physics/interfaces/IPhysicsEngine.md#oncollisionstarted)

## Accessors

### bodies

#### Get Signature

> **get** **bodies**(): [`RapierBody`](RapierBody.md)[]

Defined in: [src/plugins/rapier/RapierPhysics.ts:63](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L63)

**`Experimental`**

엔진에서 관리 중인 모든 RapierBody 리스트를 반환합니다.


##### Returns

[`RapierBody`](RapierBody.md)[]

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`bodies`](../../../../Physics/interfaces/IPhysicsEngine.md#bodies)

***

### gravity

#### Get Signature

> **get** **gravity**(): `object`

Defined in: [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268)

**`Experimental`**

물리 월드의 중력 가속도를 설정하거나 반환합니다.


* ### Example
```typescript
// 중력 설정
//
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268) |
| `y` | `number` | [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268) |
| `z` | `number` | [src/plugins/rapier/RapierPhysics.ts:268](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L268) |

#### Set Signature

> **set** **gravity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:272](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L272)

**`Experimental`**

중력을 설정하거나 가져옵니다.


### Example
```typescript
physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
```

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

> **get** **nativeWorld**(): `World`

Defined in: [src/plugins/rapier/RapierPhysics.ts:49](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L49)

**`Experimental`**

물리 엔진의 원본 월드(World) 객체를 반환합니다.


##### Returns

`World`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`nativeWorld`](../../../../Physics/interfaces/IPhysicsEngine.md#nativeworld)

***

### RAPIER

#### Get Signature

> **get** **RAPIER**(): `__module`

Defined in: [src/plugins/rapier/RapierPhysics.ts:56](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L56)

**`Experimental`**

Rapier 라이브러리 네임스페이스를 반환합니다.


##### Returns

`__module`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`RAPIER`](../../../../Physics/interfaces/IPhysicsEngine.md#rapier)

## Methods

### createBody()

> **createBody**(`mesh`, `params`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:157](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L157)

**`Experimental`**

특정 메쉬에 물리 바디를 생성하고 엔진에 등록합니다.


* ### Example
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
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | 대상 RedGPU 메쉬
| `params` | [`BodyParams`](../../../../Physics/interfaces/BodyParams.md) | 바디 생성 설정 파라미터

#### Returns

[`RapierBody`](RapierBody.md)

생성된 RapierBody 인스턴스


#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createBody`](../../../../Physics/interfaces/IPhysicsEngine.md#createbody)

***

### createCharacterController()

> **createCharacterController**(`offset`): `KinematicCharacterController`

Defined in: [src/plugins/rapier/RapierPhysics.ts:292](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L292)

**`Experimental`**

캐릭터 컨트롤러를 생성하여 반환합니다.


* ### Example
```typescript
const controller = physicsEngine.createCharacterController(0.1);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offset` | `number` | 캐릭터와 지면 사이의 간격

#### Returns

`KinematicCharacterController`

Rapier 캐릭터 컨트롤러 인스턴스


#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`createCharacterController`](../../../../Physics/interfaces/IPhysicsEngine.md#createcharactercontroller)

***

### getBodyByColliderHandle()

> **getBodyByColliderHandle**(`handle`): [`RapierBody`](RapierBody.md)

Defined in: [src/plugins/rapier/RapierPhysics.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L81)

**`Experimental`**

콜라이더 핸들을 통해 관리 중인 RapierBody를 찾아서 반환합니다.


* ### Example
```typescript
const body = physicsEngine.getBodyByColliderHandle(handle);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handle` | `number` | 찾을 콜라이더의 고유 핸들

#### Returns

[`RapierBody`](RapierBody.md)

찾은 RapierBody (없으면 undefined)


***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [src/plugins/rapier/RapierPhysics.ts:98](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L98)

**`Experimental`**

Rapier 엔진을 초기화하고 물리 월드를 생성합니다.


* ### Example
```typescript
await physicsEngine.init();
```

#### Returns

`Promise`\<`void`\>

초기화 완료를 보장하는 Promise


#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`init`](../../../../Physics/interfaces/IPhysicsEngine.md#init)

***

### removeBody()

> **removeBody**(`body`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:252](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L252)

**`Experimental`**

물리 바디를 엔진에서 제거합니다.


* ### Example
```typescript
// 물리 바디 제거
//
physicsEngine.removeBody(body);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `body` | [`RapierBody`](RapierBody.md) | 제거할 RapierBody 인스턴스

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`removeBody`](../../../../Physics/interfaces/IPhysicsEngine.md#removebody)

***

### step()

> **step**(`deltaTime`): `void`

Defined in: [src/plugins/rapier/RapierPhysics.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierPhysics.ts#L121)

**`Experimental`**

물리 시뮬레이션을 한 단계 진행하고 메쉬 트랜스폼을 동기화합니다.


* ### Example
```typescript
// 렌더링 루프에서 물리 시뮬레이션 진행
//
renderer.start(redGPUContext, (time, deltaTime) => {
    physicsEngine.step(deltaTime / 1000);
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `deltaTime` | `number` | 프레임 간 시간 간격 (초 단위)

#### Returns

`void`

#### Implementation of

[`IPhysicsEngine`](../../../../Physics/interfaces/IPhysicsEngine.md).[`step`](../../../../Physics/interfaces/IPhysicsEngine.md#step)
