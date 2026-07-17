[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / ParticleEmitter

# Class: ParticleEmitter

Defined in: [src/display/particle/ParticleEmitter.ts:16](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L16)

GPU 연산(Compute Shader) 기반의 고성능 파티클 시스템을 생성 및 관리하는 클래스입니다.

수천에서 수십만 개의 파티클을 GPU에서 시뮬레이션하고 병렬로 렌더링합니다. 수명, 크기, 시작/종료 트랜스폼(위치, 회전, 스케일), 알파값의 변화와 이를 보간하는 다양한 이징(Easing) 함수를 실시간으로 제어할 수 있습니다.

* ### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.particleNum = 5000;

// 파티클에 텍스처 적용 예시 (기본 제공되는 BitmapMaterial의 diffuseTexture 속성을 설정합니다)
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/particle.png');
emitter.material.diffuseTexture = texture;

scene.addChild(emitter);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/particle/basic/"></iframe>

아래는 ParticleEmitter의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## See

[ParticleEmitter Performance](https://redcamel.github.io/RedGPU/examples/3d/particle/performance/)

## Roadmap
- *다양한 파티클 이미터 타입 지원**

## Extends

- [`Mesh`](Mesh.md)

## Constructors

### Constructor

> **new ParticleEmitter**(`redGPUContext`): `ParticleEmitter`

Defined in: [src/display/particle/ParticleEmitter.ts:126](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L126)

ParticleEmitter 인스턴스를 생성합니다. 기본 지오메트리로 Plane, 기본 재질로 BitmapMaterial이 내부적으로 지정됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트 객체

#### Returns

`ParticleEmitter`

#### Inherited from

[`Mesh`](Mesh.md).[`constructor`](Mesh.md#constructor)

## Properties

### isInstanceofParticle

> **isInstanceofParticle**: `boolean`

Defined in: [src/display/particle/ParticleEmitter.ts:26](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L26)

ParticleEmitter 인스턴스인지 판별하는 식별자

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/particle/ParticleEmitter.ts:21](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L21)

파티클을 카메라를 항상 마주보도록 할지 여부

***

### easeAlpha

#### Get Signature

> **get** **easeAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:629](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L629)

알파(투명도) 수치 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:633](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L633)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeRotationX

#### Get Signature

> **get** **easeRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:653](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L653)

X축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:657](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L657)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeRotationY

#### Get Signature

> **get** **easeRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:665](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L665)

Y축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:669](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L669)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeRotationZ

#### Get Signature

> **get** **easeRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:677](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L677)

Z축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:681](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L681)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeScale

#### Get Signature

> **get** **easeScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:641](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L641)

스케일 크기 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:645](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L645)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeX

#### Get Signature

> **get** **easeX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:593](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L593)

X축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:597](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L597)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeY

#### Get Signature

> **get** **easeY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:605](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L605)

Y축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:609](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L609)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### easeZ

#### Get Signature

> **get** **easeZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:617](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L617)

Z축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **easeZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:621](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L621)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndAlpha

#### Get Signature

> **get** **maxEndAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:389](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L389)

파티클의 최대 종료 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:393](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L393)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndRotationX

#### Get Signature

> **get** **maxEndRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:557](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L557)

파티클의 최대 종료 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:561](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L561)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndRotationY

#### Get Signature

> **get** **maxEndRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:569](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L569)

파티클의 최대 종료 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:573](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L573)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndRotationZ

#### Get Signature

> **get** **maxEndRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:581](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L581)

파티클의 최대 종료 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:585](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndScale

#### Get Signature

> **get** **maxEndScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:437](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L437)

파티클의 최대 종료 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:441](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L441)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndX

#### Get Signature

> **get** **maxEndX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:317](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L317)

파티클이 사라지기 전에 도달할 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:321](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L321)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndY

#### Get Signature

> **get** **maxEndY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:329](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L329)

파티클이 사라지기 전에 도달할 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:333](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxEndZ

#### Get Signature

> **get** **maxEndZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:341](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L341)

파티클이 사라지기 전에 도달할 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxEndZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:345](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L345)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxLife

#### Get Signature

> **get** **maxLife**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:197](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L197)

파티클 수명의 최대값(ms)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxLife**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:201](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L201)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartAlpha

#### Get Signature

> **get** **maxStartAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:365](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L365)

파티클의 최대 시작 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:369](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L369)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartRotationX

#### Get Signature

> **get** **maxStartRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:485](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L485)

파티클의 최대 시작 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:489](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L489)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartRotationY

#### Get Signature

> **get** **maxStartRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:497](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L497)

파티클의 최대 시작 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:501](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L501)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartRotationZ

#### Get Signature

> **get** **maxStartRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:509](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L509)

파티클의 최대 시작 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:513](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L513)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartScale

#### Get Signature

> **get** **maxStartScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:413](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L413)

파티클의 최대 시작 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:417](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L417)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartX

#### Get Signature

> **get** **maxStartX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:245](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L245)

파티클이 처음 생성될 때 가질 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:249](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L249)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartY

#### Get Signature

> **get** **maxStartY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:257](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L257)

파티클이 처음 생성될 때 가질 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:261](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L261)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### maxStartZ

#### Get Signature

> **get** **maxStartZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:269](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L269)

파티클이 처음 생성될 때 가질 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxStartZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:273](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L273)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndAlpha

#### Get Signature

> **get** **minEndAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:377](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L377)

파티클의 최소 종료 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:381](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L381)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndRotationX

#### Get Signature

> **get** **minEndRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:521](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L521)

파티클의 최소 종료 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:525](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L525)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndRotationY

#### Get Signature

> **get** **minEndRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:533](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L533)

파티클의 최소 종료 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:537](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L537)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndRotationZ

#### Get Signature

> **get** **minEndRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:545](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L545)

파티클의 최소 종료 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:549](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L549)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndScale

#### Get Signature

> **get** **minEndScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:425](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L425)

파티클의 최소 종료 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:429](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L429)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndX

#### Get Signature

> **get** **minEndX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:281](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L281)

파티클이 사라지기 전에 도달할 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:285](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L285)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndY

#### Get Signature

> **get** **minEndY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:293](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L293)

파티클이 사라지기 전에 도달할 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:297](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L297)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minEndZ

#### Get Signature

> **get** **minEndZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:305](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L305)

파티클이 사라지기 전에 도달할 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minEndZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:309](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L309)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minLife

#### Get Signature

> **get** **minLife**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:185](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L185)

파티클 수명의 최소값(ms)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minLife**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:189](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L189)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartAlpha

#### Get Signature

> **get** **minStartAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:353](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L353)

파티클의 최소 시작 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:357](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L357)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartRotationX

#### Get Signature

> **get** **minStartRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:449](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L449)

파티클의 최소 시작 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:453](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L453)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartRotationY

#### Get Signature

> **get** **minStartRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:461](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L461)

파티클의 최소 시작 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:465](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L465)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartRotationZ

#### Get Signature

> **get** **minStartRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:473](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L473)

파티클의 최소 시작 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:477](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L477)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartScale

#### Get Signature

> **get** **minStartScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:401](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L401)

파티클의 최소 시작 스케일을 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:405](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L405)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartX

#### Get Signature

> **get** **minStartX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:209](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L209)

파티클이 처음 생성될 때 가질 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:213](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L213)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartY

#### Get Signature

> **get** **minStartY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:221](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L221)

파티클이 처음 생성될 때 가질 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:225](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L225)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minStartZ

#### Get Signature

> **get** **minStartZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:233](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L233)

파티클이 처음 생성될 때 가질 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

#### Set Signature

> **set** **minStartZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:237](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L237)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### particleBuffers

#### Get Signature

> **get** **particleBuffers**(): `GPUBuffer`[]

Defined in: [src/display/particle/ParticleEmitter.ts:689](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L689)

파티클 데이터 및 속성을 저장하는 GPUBuffer들의 배열을 가져옵니다.

##### Returns

`GPUBuffer`[]

***

### particleNum

#### Get Signature

> **get** **particleNum**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:171](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L171)

시뮬레이션할 총 파티클 개수를 조회하거나 설정합니다. 설정 가능한 값의 범위는 1부터 최대 500,000개까지이며, 변경 시 GPU 시뮬레이션 버퍼가 재구축됩니다.

##### Returns

`number`

#### Set Signature

> **set** **particleNum**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:175](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L175)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/particle/ParticleEmitter.ts:713](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L713)

파티클용 커스텀 버텍스 셰이더 모듈을 컴파일하고 반환합니다.

#### Returns

`GPUShaderModule`

컴파일 완료된 GPUShaderModule

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:386](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L386)

#### Inherited from

[`Mesh`](Mesh.md).[`_geometry`](Mesh.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:359](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L359)

#### Inherited from

[`Mesh`](Mesh.md).[`_material`](Mesh.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L32)

#### animationsList

> **animationsList**: [`ClipAnimState`](../../../classes/ClipAnimState.md)[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Mesh`](Mesh.md).[`animationInfo`](Mesh.md#animationinfo)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:86](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L86)

그림자 캐스팅 여부

#### Inherited from

[`Mesh`](Mesh.md).[`castShadow`](Mesh.md#castshadow)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:91](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L91)

LOD 정보 변경 필요 여부

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyLOD`](Mesh.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyOpacity`](Mesh.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyPipeline`](Mesh.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyTransform`](Mesh.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:42](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L42)

#### Inherited from

[`Mesh`](Mesh.md).[`disableJitter`](Mesh.md#disablejitter)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:45](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L45)

#### Inherited from

[`Mesh`](Mesh.md).[`gltfLoaderInfo`](Mesh.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:31](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L31)

#### Inherited from

[`Mesh`](Mesh.md).[`gpuRenderInfo`](Mesh.md#gpurenderinfo)

***

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`Mesh`](Mesh.md).[`instanceId`](Mesh.md#instanceid)

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`Mesh`](Mesh.md).[`isInstanceofMesh`](Mesh.md#isinstanceofmesh)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L50)

#### Inherited from

[`Mesh`](Mesh.md).[`localMatrix`](Mesh.md#localmatrix)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L49)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Mesh`](Mesh.md).[`modelMatrix`](Mesh.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`Mesh`](Mesh.md).[`normalModelMatrix`](Mesh.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:96](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L96)

프러스텀 컬링 통과 여부

#### Inherited from

[`Mesh`](Mesh.md).[`passFrustumCulling`](Mesh.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:41](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L41)

#### Inherited from

[`Mesh`](Mesh.md).[`receiveShadow`](Mesh.md#receiveshadow)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:43](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L43)

#### Inherited from

[`Mesh`](Mesh.md).[`useDisplacementTexture`](Mesh.md#usedisplacementtexture)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:810](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L810)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`boundingAABB`](Mesh.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:797](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L797)

OBB(Oriented Bounding Box) 정보를 반환합니다.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`boundingOBB`](Mesh.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:44](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L44)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Mesh`](Mesh.md).[`children`](Mesh.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:823](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L823)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`combinedBoundingAABB`](Mesh.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:67](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L67)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:71](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L71)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`currentShaderModuleName`](Mesh.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:80](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L80)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Mesh`](Mesh.md).[`depthStencilState`](Mesh.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:355](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L355)

디버그 메시 객체를 반환합니다.

##### Returns

[`DrawDebuggerMesh`](../namespaces/drawDebugger/classes/DrawDebuggerMesh.md)

#### Inherited from

[`Mesh`](Mesh.md).[`drawDebugger`](Mesh.md#drawdebugger)

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:335](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L335)

디버거 활성화 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:346](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L346)

디버거 활성화 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 활성화 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableDebugger`](Mesh.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L495)

등록된 이벤트들을 반환합니다.

##### Returns

`any`

#### Inherited from

[`Mesh`](Mesh.md).[`events`](Mesh.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:392](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L392)

지오메트리를 반환합니다.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:403](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L403)

지오메트리를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | 설정할 지오메트리

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`geometry`](Mesh.md#geometry)

***

### globalVertexSlotIndex

#### Get Signature

> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:316](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L316)

글로벌 버퍼 슬롯 인덱스를 반환합니다.

##### Returns

`number`

#### Inherited from

[`Mesh`](Mesh.md).[`globalVertexSlotIndex`](Mesh.md#globalvertexslotindex)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L88)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

[`Mesh`](Mesh.md).[`gpuDevice`](Mesh.md#gpudevice)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:434](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L434)

프러스텀 컬링 무시 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:445](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L445)

프러스텀 컬링 무시 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 무시 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`ignoreFrustumCulling`](Mesh.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:327](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L327)

LOD(Level of Detail) 매니저를 반환합니다.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`LODManager`](Mesh.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:365](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L365)

머티리얼을 반환합니다.

##### Returns

`any`

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:376](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L376)

머티리얼을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 설정할 머티리얼

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`material`](Mesh.md#material)

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:470](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L470)

투영 면적 Culling의 화면상 크기 비율 임계값을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:479](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L479)

투영 면적 Culling의 화면상 크기 비율 임계값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 크기 비율 임계값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`minScreenSpaceSize`](Mesh.md#minscreenspacesize)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`name`](Mesh.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:52](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L52)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Mesh`](Mesh.md).[`numChildren`](Mesh.md#numchildren)

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:413](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L413)

메시의 투명도를 반환합니다. (0~1)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:424](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L424)

메시의 투명도를 설정합니다. (0~1)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 투명도 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`opacity`](Mesh.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:511](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L511)

설정된 부모 객체를 반환합니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:522](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L522)

부모 객체를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | 부모 컨테이너

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`parent`](Mesh.md#parent)

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:487](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L487)

피킹 ID를 반환합니다.

##### Returns

`number`

#### Inherited from

[`Mesh`](Mesh.md).[`pickingId`](Mesh.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L530)

피벗 X 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:541](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L541)

피벗 X 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotX`](Mesh.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:550](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L550)

피벗 Y 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:561](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L561)

피벗 Y 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotY`](Mesh.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:570](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L570)

피벗 Z 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L581)

피벗 Z 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotZ`](Mesh.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:653](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L653)

현재 위치를 반환합니다. [x, y, z]

##### Returns

`Float32Array`

위치 배열

#### Inherited from

[`Mesh`](Mesh.md).[`position`](Mesh.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:76](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L76)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Mesh`](Mesh.md).[`primitiveState`](Mesh.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:97](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L97)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`Mesh`](Mesh.md).[`redGPUContext`](Mesh.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:789](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L789)

현재 회전값을 반환합니다. [x, y, z] (도)

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](Mesh.md).[`rotation`](Mesh.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:729](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L729)

X축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:740](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L740)

X축 회전값을 설정합니다. (도)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationX`](Mesh.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:749](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L749)

Y축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:760](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L760)

Y축 회전값을 설정합니다. (도)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationY`](Mesh.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:769](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L769)

Z축 회전값을 반환합니다. (도)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:780](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L780)

Z축 회전값을 설정합니다. (도)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationZ`](Mesh.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:721](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L721)

현재 스케일을 반환합니다. [x, y, z]

##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](Mesh.md).[`scale`](Mesh.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L661)

X축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:672](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L672)

X축 스케일을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleX`](Mesh.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:681](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L681)

Y축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:692](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L692)

Y축 스케일을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleY`](Mesh.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:701](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L701)

Z축 스케일을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:712](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L712)

Z축 스케일을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleZ`](Mesh.md#scalez)

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:453](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L453)

투영 면적 Culling 사용 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:462](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L462)

투영 면적 Culling 사용 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 사용 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`useScreenSpaceSizeCulling`](Mesh.md#usescreenspacesizeculling)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`Mesh`](Mesh.md).[`uuid`](Mesh.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/particle/ParticleEmitter.ts:137](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L137)

파티클 개별 렌더링에 사용되는 인스턴스 기반 GPU 버텍스 버퍼 레이아웃 정보를 가져옵니다.

##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Mesh`](Mesh.md).[`vertexStateBuffers`](Mesh.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:590](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L590)

X 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:601](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L601)

X 위치 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`x`](Mesh.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L610)

Y 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:621](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L621)

Y 위치 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`y`](Mesh.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:630](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L630)

Z 위치 좌표를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:641](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L641)

Z 위치 좌표를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`z`](Mesh.md#z)

## Methods

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:71](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L71)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Mesh`](Mesh.md).[`addChild`](Mesh.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L89)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`ParticleEmitter`

현재 컨테이너

#### Inherited from

[`Mesh`](Mesh.md).[`addChildAt`](Mesh.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L935)

이벤트 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름
| `callback` | `Function` | 콜백 함수

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`addListener`](Mesh.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1045](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L1045)

**`Experimental`**

메시를 복제합니다.

#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`clone`](Mesh.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:61](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L61)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Mesh`](Mesh.md).[`contains`](Mesh.md#contains)

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1821](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L1821)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` |
| `SHADER_INFO` | `any` |
| `UNIFORM_STRUCT_BASIC` | `any` |
| `vertexModuleSource` | `any` |

#### Returns

`GPUShaderModule`

#### Inherited from

[`Mesh`](Mesh.md).[`createMeshVertexShaderModuleBASIC`](Mesh.md#createmeshvertexshadermodulebasic)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:907](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L907)

Mesh 인스턴스를 파기하고 할당된 드로우 커맨드 슬롯, 전역 버퍼 슬롯 및 리소스를 즉시 해제합니다.

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`destroy`](Mesh.md#destroy)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/display/mesh/Mesh.ts:831](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L831)

리소스를 해제합니다.

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`dispose`](Mesh.md#dispose)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:111](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L111)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Mesh`](Mesh.md).[`getChildAt`](Mesh.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:125](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L125)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Mesh`](Mesh.md).[`getChildIndex`](Mesh.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:917](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L917)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.

#### Returns

`number`

통합 투명도 값

#### Inherited from

[`Mesh`](Mesh.md).[`getCombinedOpacity`](Mesh.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L109)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`getScreenPoint`](Mesh.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1807](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L1807)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`initGPURenderInfos`](Mesh.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:105](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L105)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`localToWorld`](Mesh.md#localtoworld)

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:953](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L953)

메시가 특정 좌표를 바라보도록 회전시킵니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 대상 X 좌표 또는 [x, y, z] 배열
| `targetY?` | `number` | 대상 Y 좌표 (targetX가 배열인 경우 무시됨)
| `targetZ?` | `number` | 대상 Z 좌표 (targetX가 배열인 경우 무시됨)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`lookAt`](Mesh.md#lookat)

***

### removeAllChildren()

> **removeAllChildren**(): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:234](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L234)

모든 자식 객체를 제거합니다.

#### Returns

`ParticleEmitter`

현재 컨테이너

#### Inherited from

[`Mesh`](Mesh.md).[`removeAllChildren`](Mesh.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:203](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L203)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChild`](Mesh.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:219](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L219)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChildAt`](Mesh.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:700](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/particle/ParticleEmitter.ts#L700)

파티클 이미터를 렌더링 프레임 단위로 갱신 및 시뮬레이션합니다. 매 프레임마다 GPU 컴퓨트 패스(Compute Pass)를 수행하여 위치 정보를 재계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더 뷰 상태 데이터 객체

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`render`](Mesh.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:863](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L863)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 캐스팅 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setCastShadowRecursively`](Mesh.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:140](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L140)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setChildIndex`](Mesh.md#setchildindex)

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:845](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L845)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | 활성화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setEnableDebuggerRecursively`](Mesh.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:899](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L899)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 무시 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setIgnoreFrustumCullingRecursively`](Mesh.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:1004](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L1004)

위치를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표
| `y?` | `number` | Y 좌표 (생략 시 x와 동일)
| `z?` | `number` | Z 좌표 (생략 시 x와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setPosition`](Mesh.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:881](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L881)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 수신 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setReceiveShadowRecursively`](Mesh.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:1027](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L1027)

회전값을 설정합니다. (도)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전
| `rotationY?` | `number` | Y축 회전 (생략 시 rotationX와 동일)
| `rotationZ?` | `number` | Z축 회전 (생략 시 rotationX와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setRotation`](Mesh.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:981](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/Mesh.ts#L981)

스케일을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일)
| `z?` | `number` | Z축 스케일 (생략 시 x와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setScale`](Mesh.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L163)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildren`](Mesh.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:183](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/Object3DContainer.ts#L183)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildrenAt`](Mesh.md#swapchildrenat)

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:101](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/display/mesh/core/MeshBase.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`worldToLocal`](Mesh.md#worldtolocal)


</details>
