[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Physics](../README.md) / BodyParams

# Interface: BodyParams

Defined in: [src/physics/IPhysicsEngine.ts:10](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L10)

**`Experimental`**

물리 바디 생성을 위한 파라미터 인터페이스입니다.


## Properties

### angularDamping?

> `optional` **angularDamping**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:45](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L45)

**`Experimental`**

각감쇠


***

### enableCCD?

> `optional` **enableCCD**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:55](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L55)

**`Experimental`**

연속 충돌 감지(CCD) 활성화 여부


***

### friction?

> `optional` **friction**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:30](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L30)

**`Experimental`**

마찰 계수


***

### heightData?

> `optional` **heightData**: `object`

Defined in: [src/physics/IPhysicsEngine.ts:60](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L60)

**`Experimental`**

높이맵 데이터 (shape가 HEIGHTFIELD일 경우 필수)


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

> `optional` **isSensor**: `boolean`

Defined in: [src/physics/IPhysicsEngine.ts:50](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L50)

**`Experimental`**

센서 여부 (충돌 반응 없이 이벤트만 발생)


***

### linearDamping?

> `optional` **linearDamping**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:40](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L40)

**`Experimental`**

선형 감쇠


***

### mass?

> `optional` **mass**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:25](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L25)

**`Experimental`**

질량


***

### restitution?

> `optional` **restitution**: `number`

Defined in: [src/physics/IPhysicsEngine.ts:35](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L35)

**`Experimental`**

탄성 계수


***

### shape?

> `optional` **shape**: [`PhysicsShape`](../type-aliases/PhysicsShape.md)

Defined in: [src/physics/IPhysicsEngine.ts:20](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L20)

**`Experimental`**

충돌체의 형상


***

### type?

> `optional` **type**: [`PhysicsBodyType`](../type-aliases/PhysicsBodyType.md)

Defined in: [src/physics/IPhysicsEngine.ts:15](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/physics/IPhysicsEngine.ts#L15)

**`Experimental`**

물리 바디의 타입 (정적, 동적, 키네마틱)

