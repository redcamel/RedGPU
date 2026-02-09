[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Plugin](../../../README.md) / [RapierPhysics](../README.md) / RapierBody

# Class: RapierBody

Defined in: [src/plugins/rapier/RapierBody.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L24)

**`Experimental`**

Rapier 물리 엔진을 위한 `IPhysicsBody` 구현체입니다.


Rapier의 RigidBody와 RedGPU의 Mesh 사이에서 트랜스폼 정보를 동기화하고 제어하는 역할을 합니다. 물리 시뮬레이션의 결과가 매 프레임마다 연결된 메쉬의 위치와 회전에 자동으로 반영됩니다.


::: warning
이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.

:::

## See

 - [물리 플러그인 매뉴얼](https://redcamel.github.io/RedGPU/manual/ko/plugins/physics)
 -

## Implements

- [`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md)

## Constructors

### Constructor

> **new RapierBody**(`mesh`, `body`, `collider`): `RapierBody`

Defined in: [src/plugins/rapier/RapierBody.ts:43](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L43)

**`Experimental`**

RapierBody 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../Display/classes/Mesh.md) | 연결할 RedGPU 메쉬
| `body` | `RigidBody` | Rapier 강체 객체
| `collider` | `Collider` | Rapier 충돌체 객체

#### Returns

`RapierBody`

## Accessors

### mesh

#### Get Signature

> **get** **mesh**(): [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/plugins/rapier/RapierBody.ts:54](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L54)

**`Experimental`**

연결된 RedGPU 메쉬를 반환합니다.


##### Returns

[`Mesh`](../../../../Display/classes/Mesh.md)

***

### nativeBody

#### Get Signature

> **get** **nativeBody**(): `RigidBody`

Defined in: [src/plugins/rapier/RapierBody.ts:63](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L63)

**`Experimental`**

Rapier의 원본 강체(RigidBody) 객체를 반환합니다.


##### Returns

`RigidBody`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`nativeBody`](../../../../Physics/interfaces/IPhysicsBody.md#nativebody)

***

### nativeCollider

#### Get Signature

> **get** **nativeCollider**(): `Collider`

Defined in: [src/plugins/rapier/RapierBody.ts:72](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L72)

**`Experimental`**

Rapier의 원본 충돌체(Collider) 객체를 반환합니다.


##### Returns

`Collider`

***

### position

#### Get Signature

> **get** **position**(): [`vec3`](../../../../Math/type-aliases/vec3.md)

Defined in: [src/plugins/rapier/RapierBody.ts:80](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L80)

**`Experimental`**

물리 바디의 현재 위치를 반환하거나 설정합니다.


##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:85](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L85)

**`Experimental`**

물리 바디의 현재 위치


### Example
```typescript
body.position = [0, 10, 0];
```

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

Defined in: [src/plugins/rapier/RapierBody.ts:97](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L97)

**`Experimental`**

물리 바디의 현재 회전(쿼터니언)을 반환하거나 설정합니다.


##### Returns

[`quat`](../../../../Math/type-aliases/quat.md)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:102](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L102)

**`Experimental`**

물리 바디의 현재 회전 (쿼터니언)


### Example
```typescript
body.rotation = [0, 0, 0, 1];
```

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

Defined in: [src/plugins/rapier/RapierBody.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L114)

**`Experimental`**

물리 바디의 현재 선속도를 반환하거나 설정합니다.


##### Returns

[`vec3`](../../../../Math/type-aliases/vec3.md)

#### Set Signature

> **set** **velocity**(`value`): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:119](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L119)

**`Experimental`**

물리 바디의 현재 선속도


### Example
```typescript
const velocity = body.velocity;
```

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

Defined in: [src/plugins/rapier/RapierBody.ts:140](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L140)

**`Experimental`**

물리 바디에 충격량(Impulse)을 적용합니다.


* ### Example
```typescript
body.applyImpulse([0, 10, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `force` | [`vec3`](../../../../Math/type-aliases/vec3.md) \| \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | 적용할 힘의 벡터

#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`applyImpulse`](../../../../Physics/interfaces/IPhysicsBody.md#applyimpulse)

***

### syncToMesh()

> **syncToMesh**(): `void`

Defined in: [src/plugins/rapier/RapierBody.ts:152](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/plugins/rapier/RapierBody.ts#L152)

**`Experimental`**

물리 시뮬레이션의 위치와 회전 정보를 연결된 RedGPU 메쉬에 동기화합니다.


#### Returns

`void`

#### Implementation of

[`IPhysicsBody`](../../../../Physics/interfaces/IPhysicsBody.md).[`syncToMesh`](../../../../Physics/interfaces/IPhysicsBody.md#synctomesh)
