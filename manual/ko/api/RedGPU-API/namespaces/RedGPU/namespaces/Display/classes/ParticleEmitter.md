[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / ParticleEmitter

# Class: ParticleEmitter

Defined in: [src/display/particle/ParticleEmitter.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L16)

GPU 연산(Compute Shader) 기반의 고성능 파티클 시스템을 생성 및 관리하는 클래스입니다.

수천에서 수십만 개의 파티클을 GPU에서 시뮬레이션하고 병렬로 렌더링합니다. 수명, 크기, 시작/종료 트랜스폼(위치, 회전, 스케일), 알파값의 변화와 이를 보간하는 다양한 이징(Easing) 함수를 실시간으로 제어할 수 있습니다.

***

### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.particleNum = 5000;

// 파티클에 텍스처 적용 예시 (기본 제공되는 BitmapMaterial의 diffuseTexture 속성을 설정합니다)
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/particle.png');
emitter.material.diffuseTexture = texture;

scene.addChild(emitter);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/particle/basic/" style="width:100%; height:500px;"></iframe>

아래는 ParticleEmitter의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

## See

[ParticleEmitter Performance](https://redcamel.github.io/RedGPU/examples/3d/particle/performance/)

## Roadmap

- *다양한 파티클 이미터 타입 지원**

## Extends

- [`Mesh`](Mesh.md)

## Constructors



***

### Constructor

> **new ParticleEmitter**(`redGPUContext`): `ParticleEmitter`

Defined in: [src/display/particle/ParticleEmitter.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L127)

ParticleEmitter 인스턴스를 생성합니다. 기본 지오메트리로 Plane, 기본 재질로 BitmapMaterial이 내부적으로 지정됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트 객체 |

#### Returns

`ParticleEmitter`

#### Inherited from

[`Mesh`](Mesh.md).[`constructor`](Mesh.md#constructor)

## Properties



***

### isInstanceofParticle

> **isInstanceofParticle**: `boolean`

Defined in: [src/display/particle/ParticleEmitter.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L26)

ParticleEmitter 인스턴스인지 판별하는 식별자

***

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/particle/ParticleEmitter.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L21)

파티클을 카메라를 항상 마주보도록 할지 여부

***

## Accessors



***

### easeAlpha

#### Get Signature

> **get** **easeAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:786](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L786)

알파(투명도) 수치 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

알파 이징 상수 값

#### Set Signature

> **set** **easeAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:790](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L790)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeRotationX

#### Get Signature

> **get** **easeRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:818](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L818)

X축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

X축 회전 이징 상수 값

#### Set Signature

> **set** **easeRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:822](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L822)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeRotationY

#### Get Signature

> **get** **easeRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:834](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L834)

Y축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

Y축 회전 이징 상수 값

#### Set Signature

> **set** **easeRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:838](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L838)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeRotationZ

#### Get Signature

> **get** **easeRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:850](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L850)

Z축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

Z축 회전 이징 상수 값

#### Set Signature

> **set** **easeRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:854](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L854)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeScale

#### Get Signature

> **get** **easeScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:802](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L802)

스케일 크기 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

스케일 이징 상수 값

#### Set Signature

> **set** **easeScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:806](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L806)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeX

#### Get Signature

> **get** **easeX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:738](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L738)

X축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

X축 이징 상수 값

#### Set Signature

> **set** **easeX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:742](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L742)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeY

#### Get Signature

> **get** **easeY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:754](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L754)

Y축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

Y축 이징 상수 값

#### Set Signature

> **set** **easeY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:758](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L758)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeZ

#### Get Signature

> **get** **easeZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:770](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L770)

Z축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.

##### Returns

`number`

Z축 이징 상수 값

#### Set Signature

> **set** **easeZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:774](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L774)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndAlpha

#### Get Signature

> **get** **maxEndAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:466](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L466)

파티클의 최대 종료 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 불투명도

#### Set Signature

> **set** **maxEndAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:470](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L470)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndRotationX

#### Get Signature

> **get** **maxEndRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:690](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L690)

파티클의 최대 종료 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 X축 회전각(도)

#### Set Signature

> **set** **maxEndRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:694](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndRotationY

#### Get Signature

> **get** **maxEndRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:706](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L706)

파티클의 최대 종료 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 Y축 회전각(도)

#### Set Signature

> **set** **maxEndRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:710](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L710)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndRotationZ

#### Get Signature

> **get** **maxEndRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:722](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L722)

파티클의 최대 종료 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 Z축 회전각(도)

#### Set Signature

> **set** **maxEndRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:726](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L726)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndScale

#### Get Signature

> **get** **maxEndScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:530](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L530)

파티클의 최대 종료 스케일을 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 스케일

#### Set Signature

> **set** **maxEndScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:534](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndX

#### Get Signature

> **get** **maxEndX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:370](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L370)

파티클이 사라지기 전에 도달할 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 X 좌표

#### Set Signature

> **set** **maxEndX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:374](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L374)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndY

#### Get Signature

> **get** **maxEndY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:386](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L386)

파티클이 사라지기 전에 도달할 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 Y 좌표

#### Set Signature

> **set** **maxEndY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:390](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L390)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndZ

#### Get Signature

> **get** **maxEndZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:402](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L402)

파티클이 사라지기 전에 도달할 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최대 종료 Z 좌표

#### Set Signature

> **set** **maxEndZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:406](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L406)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxLife

#### Get Signature

> **get** **maxLife**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L210)

파티클 수명의 최대값(ms)을 가져오거나 설정합니다.

##### Returns

`number`

최대 파티클 수명(ms)

#### Set Signature

> **set** **maxLife**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:214](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartAlpha

#### Get Signature

> **get** **maxStartAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:434](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L434)

파티클의 최대 시작 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 불투명도

#### Set Signature

> **set** **maxStartAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:438](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartRotationX

#### Get Signature

> **get** **maxStartRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:594](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L594)

파티클의 최대 시작 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 X축 회전각(도)

#### Set Signature

> **set** **maxStartRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:598](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L598)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartRotationY

#### Get Signature

> **get** **maxStartRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:610](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L610)

파티클의 최대 시작 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 Y축 회전각(도)

#### Set Signature

> **set** **maxStartRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:614](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartRotationZ

#### Get Signature

> **get** **maxStartRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:626](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L626)

파티클의 최대 시작 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 Z축 회전각(도)

#### Set Signature

> **set** **maxStartRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:630](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L630)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartScale

#### Get Signature

> **get** **maxStartScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:498](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L498)

파티클의 최대 시작 스케일을 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 스케일

#### Set Signature

> **set** **maxStartScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:502](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L502)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartX

#### Get Signature

> **get** **maxStartX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:274](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L274)

파티클이 처음 생성될 때 가질 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 X 좌표

#### Set Signature

> **set** **maxStartX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:278](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L278)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartY

#### Get Signature

> **get** **maxStartY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L290)

파티클이 처음 생성될 때 가질 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 Y 좌표

#### Set Signature

> **set** **maxStartY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:294](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L294)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartZ

#### Get Signature

> **get** **maxStartZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:306](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L306)

파티클이 처음 생성될 때 가질 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최대 시작 Z 좌표

#### Set Signature

> **set** **maxStartZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:310](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L310)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndAlpha

#### Get Signature

> **get** **minEndAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:450](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L450)

파티클의 최소 종료 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 불투명도

#### Set Signature

> **set** **minEndAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:454](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L454)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndRotationX

#### Get Signature

> **get** **minEndRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:642](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L642)

파티클의 최소 종료 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 X축 회전각(도)

#### Set Signature

> **set** **minEndRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:646](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L646)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndRotationY

#### Get Signature

> **get** **minEndRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:658](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L658)

파티클의 최소 종료 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 Y축 회전각(도)

#### Set Signature

> **set** **minEndRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:662](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L662)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndRotationZ

#### Get Signature

> **get** **minEndRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:674](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L674)

파티클의 최소 종료 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 Z축 회전각(도)

#### Set Signature

> **set** **minEndRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:678](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L678)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndScale

#### Get Signature

> **get** **minEndScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:514](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L514)

파티클의 최소 종료 스케일을 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 스케일

#### Set Signature

> **set** **minEndScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:518](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L518)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndX

#### Get Signature

> **get** **minEndX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:322](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L322)

파티클이 사라지기 전에 도달할 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 X 좌표

#### Set Signature

> **set** **minEndX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:326](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L326)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndY

#### Get Signature

> **get** **minEndY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:338](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L338)

파티클이 사라지기 전에 도달할 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 Y 좌표

#### Set Signature

> **set** **minEndY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:342](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L342)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndZ

#### Get Signature

> **get** **minEndZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:354](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L354)

파티클이 사라지기 전에 도달할 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최소 종료 Z 좌표

#### Set Signature

> **set** **minEndZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:358](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L358)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minLife

#### Get Signature

> **get** **minLife**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:194](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L194)

파티클 수명의 최소값(ms)을 가져오거나 설정합니다.

##### Returns

`number`

최소 파티클 수명(ms)

#### Set Signature

> **set** **minLife**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:198](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L198)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartAlpha

#### Get Signature

> **get** **minStartAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:418](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L418)

파티클의 최소 시작 불투명도(Opacity)를 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 불투명도

#### Set Signature

> **set** **minStartAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:422](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L422)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartRotationX

#### Get Signature

> **get** **minStartRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:546](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L546)

파티클의 최소 시작 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 X축 회전각(도)

#### Set Signature

> **set** **minStartRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:550](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L550)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartRotationY

#### Get Signature

> **get** **minStartRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:562](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L562)

파티클의 최소 시작 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 Y축 회전각(도)

#### Set Signature

> **set** **minStartRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:566](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L566)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartRotationZ

#### Get Signature

> **get** **minStartRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:578](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L578)

파티클의 최소 시작 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 Z축 회전각(도)

#### Set Signature

> **set** **minStartRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:582](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L582)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartScale

#### Get Signature

> **get** **minStartScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:482](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L482)

파티클의 최소 시작 스케일을 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 스케일

#### Set Signature

> **set** **minStartScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:486](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L486)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartX

#### Get Signature

> **get** **minStartX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:226](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L226)

파티클이 처음 생성될 때 가질 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 X 좌표

#### Set Signature

> **set** **minStartX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:230](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L230)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartY

#### Get Signature

> **get** **minStartY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:242](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L242)

파티클이 처음 생성될 때 가질 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 Y 좌표

#### Set Signature

> **set** **minStartY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L246)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartZ

#### Get Signature

> **get** **minStartZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L258)

파티클이 처음 생성될 때 가질 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.

##### Returns

`number`

최소 시작 Z 좌표

#### Set Signature

> **set** **minStartZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:262](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### particleBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **particleBuffers**(): `GPUBuffer`[]

Defined in: [src/display/particle/ParticleEmitter.ts:866](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L866)

파티클 데이터 및 속성을 저장하는 GPUBuffer들의 배열을 가져옵니다.

##### Returns

`GPUBuffer`[]

파티클 GPUBuffer 배열

***

***

### particleNum

#### Get Signature

> **get** **particleNum**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:176](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L176)

시뮬레이션할 총 파티클 개수를 조회하거나 설정합니다. 설정 가능한 값의 범위는 1부터 최대 500,000개까지이며, 변경 시 GPU 시뮬레이션 버퍼가 재구축됩니다.

##### Returns

`number`

시뮬레이션 총 파티클 개수

#### Set Signature

> **set** **particleNum**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:180](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L180)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/particle/ParticleEmitter.ts:892](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L892)

파티클용 커스텀 버텍스 셰이더 모듈을 컴파일하고 반환합니다.

#### Returns

`GPUShaderModule`

컴파일 완료된 GPUShaderModule

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L301)

#### Inherited from

[`Mesh`](Mesh.md).[`_geometry`](Mesh.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L279)

#### Inherited from

[`Mesh`](Mesh.md).[`_material`](Mesh.md#_material)

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L42)

GLTF 모프, 스킨 및 클립 애니메이션 정보입니다.

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

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L99)

그림자 캐스팅 여부

#### Inherited from

[`Mesh`](Mesh.md).[`castShadow`](Mesh.md#castshadow)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L104)

LOD 정보 변경 필요 여부

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyLOD`](Mesh.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L74)

불투명도(Opacity) 갱신이 필요한지 여부입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyOpacity`](Mesh.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L64)

렌더 파이프라인 갱신이 필요한지 여부입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyPipeline`](Mesh.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L69)

트랜스폼 행렬 갱신이 필요한지 여부입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyTransform`](Mesh.md#dirtytransform)

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L50)

TAA 지터(Jitter) 비활성화 여부

#### Inherited from

[`Mesh`](Mesh.md).[`disableJitter`](Mesh.md#disablejitter)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L59)

이 객체를 로드한 GLTFLoader 인스턴스 정보입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`gltfLoaderInfo`](Mesh.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L37)

GPU 버텍스 렌더링 정보 객체입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`gpuRenderInfo`](Mesh.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L60)

Mesh 인스턴스 여부 판별 식별자

#### Inherited from

[`Mesh`](Mesh.md).[`isInstanceofMesh`](Mesh.md#isinstanceofmesh)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L84)

부모 기준 로컬 변환 행렬입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`localMatrix`](Mesh.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L79)

월드 변환이 적용된 모델 행렬입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`modelMatrix`](Mesh.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L89)

법선 벡터 변환에 사용되는 노멀 모델 행렬입니다.

#### Inherited from

[`Mesh`](Mesh.md).[`normalModelMatrix`](Mesh.md#normalmodelmatrix)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L109)

프러스텀 컬링 통과 여부

#### Inherited from

[`Mesh`](Mesh.md).[`passFrustumCulling`](Mesh.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L45)

그림자 수신 여부

#### Inherited from

[`Mesh`](Mesh.md).[`receiveShadow`](Mesh.md#receiveshadow)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L55)

변위 텍스처(Displacement Texture) 사용 여부

#### Inherited from

[`Mesh`](Mesh.md).[`useDisplacementTexture`](Mesh.md#usedisplacementtexture)

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:751](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L751)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다. (Zero-GC 인플레이스 재사용)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

계산된 AABB 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`boundingAABB`](Mesh.md#boundingaabb)

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:736](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L736)

OBB(Oriented Bounding Box) 정보를 반환합니다.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

계산된 OBB 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`boundingOBB`](Mesh.md#boundingobb)

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L46)

자식 객체 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 Mesh 배열 (`Mesh[]`)

#### Inherited from

[`Mesh`](Mesh.md).[`children`](Mesh.md#children)

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:771](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L771)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

통합된 AABB 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`combinedBoundingAABB`](Mesh.md#combinedboundingaabb)

***

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L121)

현재 적용된 버텍스 셰이더 모듈의 이름을 가져오거나 설정합니다.

##### Returns

`string`

현재 버텍스 셰이더 모듈 이름

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`currentShaderModuleName`](Mesh.md#currentshadermodulename)

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L149)

객체의 깊이/스텐실 렌더링 상태(`DepthStencilState`)를 반환합니다.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`depthStencilState`](Mesh.md#depthstencilstate)

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L234)

드로우 버퍼 매니저를 반환합니다.

##### Returns

`DrawBufferManager`

DrawBufferManager 인스턴스 또는 `null`

#### Inherited from

[`Mesh`](Mesh.md).[`drawBufferManager`](Mesh.md#drawbuffermanager)

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:222](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L222)

드로우 커맨드 슬롯을 반환합니다.

##### Returns

`DrawCommandSlot`

DrawCommandSlot 인스턴스 또는 `null`

#### Inherited from

[`Mesh`](Mesh.md).[`drawCommandSlot`](Mesh.md#drawcommandslot)

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:275](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L275)

디버그 메시 객체를 반환합니다.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`drawDebugger`](Mesh.md#drawdebugger)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L258)

디버거 활성화 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

디버거 활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:262](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableDebugger`](Mesh.md#enabledebugger)

***

***

### enableWaterInteraction

#### Get Signature

> **get** **enableWaterInteraction**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L447)

물(Lake)과의 실시간 파동 인터랙션 활성화 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

물 파동 인터랙션 활성화 여부

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L451)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableWaterInteraction`](Mesh.md#enablewaterinteraction)

***

***

### events

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:407](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L407)

등록된 이벤트 맵 객체를 반환합니다.

##### Returns

`any`

등록된 이벤트 객체

#### Inherited from

[`Mesh`](Mesh.md).[`events`](Mesh.md#events)

***

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:311](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L311)

지오메트리를 가져오거나 설정합니다.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Geometry 또는 Primitive 인스턴스

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:315](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L315)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`geometry`](Mesh.md#geometry)

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L210)

글로벌 버퍼 슬롯 인덱스를 반환합니다.

##### Returns

`number`

글로벌 버텍스 슬롯 인덱스

#### Inherited from

[`Mesh`](Mesh.md).[`globalVertexSlotIndex`](Mesh.md#globalvertexslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L161)

현재 인스턴스에 연결된 WebGPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`gpuDevice`](Mesh.md#gpudevice)

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L347)

프러스텀 컬링 무시 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

프러스텀 컬링 무시 여부

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L351)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`ignoreFrustumCulling`](Mesh.md#ignorefrustumculling)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`Mesh`](Mesh.md).[`instanceId`](Mesh.md#instanceid)

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L246)

LOD(Level of Detail) 매니저를 반환합니다.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`LODManager`](Mesh.md#lodmanager)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L289)

머티리얼을 가져오거나 설정합니다.

##### Returns

`any`

설정된 머티리얼 인스턴스

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`material`](Mesh.md#material)

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L379)

투영 면적 컬링의 화면상 크기 비율 임계값을 가져오거나 설정합니다.

##### Returns

`number`

화면상 크기 비율 임계값

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:383](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L383)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`minScreenSpaceSize`](Mesh.md#minscreenspacesize)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`name`](Mesh.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L58)

등록된 자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 객체 개수

#### Inherited from

[`Mesh`](Mesh.md).[`numChildren`](Mesh.md#numchildren)

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L329)

메시의 투명도를 가져오거나 설정합니다 (0~1).

##### Returns

`number`

투명도 값 (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`opacity`](Mesh.md#opacity)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L431)

설정된 부모 컨테이너 객체를 가져오거나 설정합니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

부모 Object3DContainer 인스턴스

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L435)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`parent`](Mesh.md#parent)

***

***

### pickingId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:395](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L395)

피킹 ID를 반환합니다.

##### Returns

`number`

피킹 식별자 값

#### Inherited from

[`Mesh`](Mesh.md).[`pickingId`](Mesh.md#pickingid)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L496)

피벗 X 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 X 좌표

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:500](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L500)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotX`](Mesh.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L513)

피벗 Y 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 Y 좌표

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:517](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L517)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotY`](Mesh.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L530)

피벗 Z 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 Z 좌표

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotZ`](Mesh.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:598](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L598)

현재 위치를 반환합니다. [x, y, z]

##### Returns

`Float32Array`

위치 배열

#### Inherited from

[`Mesh`](Mesh.md).[`position`](Mesh.md#position)

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L137)

객체의 프리미티브 렌더링 상태(`PrimitiveState`)를 반환합니다.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`primitiveState`](Mesh.md#primitivestate)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L173)

현재 인스턴스에 연결된 RedGPUContext를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`redGPUContext`](Mesh.md#redgpucontext)

***

***

### rotation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:724](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L724)

현재 회전값을 반환합니다. [x, y, z] (도)

##### Returns

`Float32Array`

회전값 배열 (도)

#### Inherited from

[`Mesh`](Mesh.md).[`rotation`](Mesh.md#rotation)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L673)

X축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

X축 회전값 (도)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:677](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L677)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationX`](Mesh.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:690](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L690)

Y축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

Y축 회전값 (도)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationY`](Mesh.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:707](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L707)

Z축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

Z축 회전값 (도)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:711](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L711)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationZ`](Mesh.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L661)

현재 스케일을 반환합니다. [x, y, z]

##### Returns

`Float32Array`

스케일 배열

#### Inherited from

[`Mesh`](Mesh.md).[`scale`](Mesh.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L610)

X축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

X축 스케일 값

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleX`](Mesh.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:627](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L627)

Y축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Y축 스케일 값

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L631)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleY`](Mesh.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L644)

Z축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Z축 스케일 값

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:648](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L648)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleZ`](Mesh.md#scalez)

***

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:363](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L363)

투영 면적 컬링(Screen Space Size Culling) 사용 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

투영 면적 컬링 사용 여부

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:367](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L367)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`useScreenSpaceSizeCulling`](Mesh.md#usescreenspacesizeculling)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`Mesh`](Mesh.md).[`uuid`](Mesh.md#uuid)

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/particle/ParticleEmitter.ts:142](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L142)

파티클 개별 렌더링에 사용되는 인스턴스 기반 GPU 버텍스 버퍼 레이아웃 정보를 가져옵니다.

##### Returns

`GPUVertexBufferLayout`[]

GPU 버텍스 버퍼 레이아웃 배열

#### Inherited from

[`Mesh`](Mesh.md).[`vertexStateBuffers`](Mesh.md#vertexstatebuffers)

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:472](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L472)

물 파동 생성 강도 배율을 가져오거나 설정합니다 (기본값: 1.0).

##### Returns

`number`

물 파동 생성 강도 배율

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L476)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`waterWaveStrength`](Mesh.md#waterwavestrength)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:547](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L547)

X 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X 위치 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L551)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`x`](Mesh.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:564](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L564)

Y 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y 위치 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:568](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L568)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`y`](Mesh.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L581)

Z 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z 위치 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:585](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`z`](Mesh.md#z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L89)

자식 객체를 컨테이너 끝에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 자식 객체 (실패 시 `null`)

#### Inherited from

[`Mesh`](Mesh.md).[`addChild`](Mesh.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L115)

지정한 인덱스 위치에 자식 객체를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입할 인덱스 위치 |

#### Returns

`ParticleEmitter`

현재 컨테이너 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`addChildAt`](Mesh.md#addchildat)

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:888](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L888)

이벤트 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름 |
| `callback` | `Function` | 콜백 함수 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`addListener`](Mesh.md#addlistener)

***

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1002](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1002)

**`Experimental`**

메시를 복제합니다.

#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`clone`](Mesh.md#clone)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L73)

지정한 객체가 현재 컨테이너의 자식인지 확인합니다.

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

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1721](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1721)

기본 메시 버텍스 셰이더 모듈과 유니폼 바인드 그룹을 생성하고 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` | 버텍스 셰이더 모듈 이름 |
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보 |
| `UNIFORM_STRUCT_BASIC` | `any` | 버텍스 유니폼 구조체 정보 |
| `vertexModuleSource` | `any` | 버텍스 셰이더 WGSL 소스 코드 |

#### Returns

`GPUShaderModule`

생성된 GPUShaderModule 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`createMeshVertexShaderModuleBASIC`](Mesh.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:916](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L916)

파티클 이미터와 관련 GPU 버퍼 및 파이프라인 리소스를 해제하고 파괴합니다.

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`destroy`](Mesh.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L143)

지정한 인덱스에 위치한 자식 객체를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 인덱스 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 (범위 초과 시 `undefined`)

#### Inherited from

[`Mesh`](Mesh.md).[`getChildAt`](Mesh.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L163)

지정한 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 인덱스를 조회할 자식 객체 |

#### Returns

`number`

자식 객체의 인덱스 (존재하지 않으면 `-1`)

#### Inherited from

[`Mesh`](Mesh.md).[`getChildIndex`](Mesh.md#getchildindex)

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:869](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L869)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.

#### Returns

`number`

통합 투명도 값

#### Inherited from

[`Mesh`](Mesh.md).[`getCombinedOpacity`](Mesh.md#getcombinedopacity)

***

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L245)

지정된 뷰를 기준으로 이 객체의 2D 화면 좌표를 반환합니다.

#### Example
```typescript
const screenPos = mesh.getScreenPoint(view3D);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | 기준이 되는 View3D 인스턴스 |

#### Returns

\[`number`, `number`\]

화면 좌표 `[x, y]`

#### Inherited from

[`Mesh`](Mesh.md).[`getScreenPoint`](Mesh.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L1687)

메시의 GPU 렌더링 정보(VertexGPURenderInfo)를 초기화하고 파이프라인을 갱신합니다.

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`initGPURenderInfos`](Mesh.md#initgpurenderinfos)

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L225)

이 객체의 로컬 공간 좌표를 월드 공간 좌표로 변환합니다.

#### Example
```typescript
const worldPos = mesh.localToWorld(0, 1, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 로컬 X 좌표 |
| `y` | `number` | 로컬 Y 좌표 |
| `z` | `number` | 로컬 Z 좌표 |

#### Returns

\[`number`, `number`, `number`\]

변환된 월드 좌표 `[x, y, z]`

#### Inherited from

[`Mesh`](Mesh.md).[`localToWorld`](Mesh.md#localtoworld)

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:907](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L907)

메시가 특정 좌표를 바라보도록 회전시킵니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 대상 X 좌표 또는 [x, y, z] 배열 |
| `targetY?` | `number` | 대상 Y 좌표 (targetX가 배열인 경우 무시됨) |
| `targetZ?` | `number` | 대상 Z 좌표 (targetX가 배열인 경우 무시됨) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`lookAt`](Mesh.md#lookat)

***

***

### removeAllChildren()

> **removeAllChildren**(): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L309)

컨테이너의 모든 자식 객체를 제거합니다.

#### Returns

`ParticleEmitter`

현재 컨테이너 인스턴스

#### Inherited from

[`Mesh`](Mesh.md).[`removeAllChildren`](Mesh.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L265)

지정한 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChild`](Mesh.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L290)

지정한 인덱스의 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 자식 객체의 인덱스 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Throws

해당 인덱스에 자식 객체가 존재하지 않을 경우 Error 발생

#### Inherited from

[`Mesh`](Mesh.md).[`removeChildAt`](Mesh.md#removechildat)

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:878](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/particle/ParticleEmitter.ts#L878)

파티클 이미터를 렌더링 프레임 단위로 갱신 및 시뮬레이션합니다. 매 프레임마다 GPU 컴퓨트 패스(Compute Pass)를 수행하여 위치 정보를 재계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더 뷰 상태 데이터 객체 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`render`](Mesh.md#render)

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:802](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L802)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 캐스팅 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setCastShadowRecursively`](Mesh.md#setcastshadowrecursively)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L184)

자식 객체의 인덱스 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 위치를 변경할 자식 객체 |
| `index` | `number` | 새로 지정할 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setChildIndex`](Mesh.md#setchildindex)

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L783)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | 활성화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setEnableDebuggerRecursively`](Mesh.md#setenabledebuggerrecursively)

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:840](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L840)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 무시 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setIgnoreFrustumCullingRecursively`](Mesh.md#setignorefrustumcullingrecursively)

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:959](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L959)

위치를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표 |
| `y?` | `number` | Y 좌표 (생략 시 x와 동일) |
| `z?` | `number` | Z 좌표 (생략 시 x와 동일) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setPosition`](Mesh.md#setposition)

***

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:821](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L821)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 수신 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setReceiveShadowRecursively`](Mesh.md#setreceiveshadowrecursively)

***

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:983](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L983)

회전값을 설정합니다. (도)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전 |
| `rotationY?` | `number` | Y축 회전 (생략 시 rotationX와 동일) |
| `rotationZ?` | `number` | Z축 회전 (생략 시 rotationX와 동일) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setRotation`](Mesh.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/Mesh.ts#L935)

스케일을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 |
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일) |
| `z?` | `number` | Z축 스케일 (생략 시 x와 동일) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setScale`](Mesh.md#setscale)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L213)

두 자식 객체의 배열 내 순서(인덱스)를 서로 맞바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 자식 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 자식 객체 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildren`](Mesh.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/Object3DContainer.ts#L239)

지정된 두 인덱스에 있는 자식 객체들의 위치를 서로 맞바꿉니다.

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

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/MeshBase.ts#L199)

월드 공간 좌표를 이 객체의 로컬 공간 좌표로 변환합니다.

#### Example
```typescript
const localPos = mesh.worldToLocal(10, 5, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 월드 X 좌표 |
| `y` | `number` | 월드 Y 좌표 |
| `z` | `number` | 월드 Z 좌표 |

#### Returns

\[`number`, `number`, `number`\]

변환된 로컬 좌표 `[x, y, z]`

#### Inherited from

[`Mesh`](Mesh.md).[`worldToLocal`](Mesh.md#worldtolocal)

</details>
