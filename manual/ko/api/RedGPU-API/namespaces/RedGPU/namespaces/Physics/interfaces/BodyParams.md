[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / BodyParams

# Interface: BodyParams

Defined in: [src/physics/IPhysicsEngine.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L12)

**`Experimental`**

물리 바디 생성을 위한 설정 파라미터 인터페이스입니다.

## Properties

### angularDamping?

> `optional` **angularDamping?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L47)

**`Experimental`**

각감쇠율

***

### enableCCD?

> `optional` **enableCCD?**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L57)

**`Experimental`**

연속 충돌 감지(CCD) 활성화 여부

***

### friction?

> `optional` **friction?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L32)

**`Experimental`**

마찰 계수

***

### heightData?

> `optional` **heightData?**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L62)

**`Experimental`**

높이맵 데이터 (`shape`가 `HEIGHTFIELD`일 경우 필수)

#### heights

> **heights**: `Float32Array`

높이 데이터 배열

#### ncols

> **ncols**: `number`

가로(X축) 세그먼트 수

#### nrows

> **nrows**: `number`

세로(Z축) 세그먼트 수

#### scale

> **scale**: `object`

충돌체의 전체 스케일

##### scale.x

> **x**: `number`

##### scale.y

> **y**: `number`

##### scale.z

> **z**: `number`

***

### isSensor?

> `optional` **isSensor?**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L52)

**`Experimental`**

물리적 충돌 반응 없이 이벤트만 발생시키는 센서 여부

***

### linearDamping?

> `optional` **linearDamping?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L42)

**`Experimental`**

선형 감쇠율

***

### mass?

> `optional` **mass?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L27)

**`Experimental`**

질량

***

### restitution?

> `optional` **restitution?**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L37)

**`Experimental`**

반발(탄성) 계수

***

### shape?

> `optional` **shape?**: [`PhysicsShape`](../type-aliases/PhysicsShape.md)

Defined in: [src/physics/IPhysicsEngine.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L22)

**`Experimental`**

충돌체의 형상

***

### type?

> `optional` **type?**: [`PhysicsBodyType`](../type-aliases/PhysicsBodyType.md)

Defined in: [src/physics/IPhysicsEngine.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/physics/IPhysicsEngine.ts#L17)

**`Experimental`**

물리 바디의 시뮬레이션 타입 (정적, 동적, 키네마틱)
