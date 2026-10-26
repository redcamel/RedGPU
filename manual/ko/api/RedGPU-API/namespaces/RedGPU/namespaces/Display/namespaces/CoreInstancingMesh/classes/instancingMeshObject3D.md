[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreInstancingMesh](../README.md) / instancingMeshObject3D

# Class: instancingMeshObject3D

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L35)

인스턴싱된 메시의 개별 인스턴스 트랜스폼 및 불투명도를 제어하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 올바른 접근 방법
const instance = instancingMesh.instanceChildren[0];
instance.setPosition(10, 0, 0);
```

## Constructors

### Constructor

> **new instancingMeshObject3D**(`redGPUContext`, `location`, `instancingMesh`): `InstancingMeshObject3D`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L86)

InstancingMeshObject3D 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `location` | `number` | 인스턴싱 메시 내의 인덱스 위치 |
| `instancingMesh` | [`InstancingMesh`](../../../classes/InstancingMesh.md) | 부모 InstancingMesh 객체 |

#### Returns

`InstancingMeshObject3D`

## Properties

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L45)

인스턴스의 로컬 행렬

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L40)

인스턴스의 모델 행렬

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L50)

인스턴스의 노말 모델 행렬

## Accessors

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L102)

인스턴스의 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.

##### Returns

`number`

불투명도 값

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:171](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L171)

인스턴스의 위치 배열(`[x, y, z]`)을 가져오거나 모든 축의 위치를 단일 값으로 설정합니다.

##### Returns

`number`[]

위치 배열 (`[x, y, z]`)

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:175](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L175)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotation

#### Get Signature

> **get** **rotation**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:311](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L311)

인스턴스의 회전각 배열(`[rotationX, rotationY, rotationZ]`)을 가져오거나 모든 축의 회전각을 단일 값으로 설정합니다.

##### Returns

`number`[]

회전각 배열 (`[rotationX, rotationY, rotationZ]`)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:315](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L315)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:260](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L260)

인스턴스의 X축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

X축 회전각 (도)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:264](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L264)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L277)

인스턴스의 Y축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

Y축 회전각 (도)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:281](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L281)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:294](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L294)

인스턴스의 Z축 회전각(도)을 가져오거나 설정합니다.

##### Returns

`number`

Z축 회전각 (도)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:298](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L298)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scale

#### Get Signature

> **get** **scale**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L241)

인스턴스의 스케일 배열(`[scaleX, scaleY, scaleZ]`)을 가져오거나 모든 축의 스케일을 단일 값으로 설정합니다.

##### Returns

`number`[]

스케일 배열 (`[scaleX, scaleY, scaleZ]`)

#### Set Signature

> **set** **scale**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L245)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L190)

인스턴스의 X축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

X축 스케일

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:194](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L194)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:207](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L207)

인스턴스의 Y축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Y축 스케일

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:211](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L211)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:224](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L224)

인스턴스의 Z축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Z축 스케일

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:228](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L228)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:120](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L120)

인스턴스의 X축 위치를 가져오거나 설정합니다.

##### Returns

`number`

X축 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L124)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L137)

인스턴스의 Y축 위치를 가져오거나 설정합니다.

##### Returns

`number`

Y축 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:141](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L141)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:154](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L154)

인스턴스의 Z축 위치를 가져오거나 설정합니다.

##### Returns

`number`

Z축 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:158](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L158)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:413](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L413)

인스턴스 내부 참조를 해제합니다.

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:370](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L370)

인스턴스의 X, Y, Z축 위치를 설정합니다. `y`, `z` 생략 시 `x`와 동일한 값으로 설정됩니다.

#### Example
```typescript
instance.setPosition(10, 20, 30);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 좌표 |
| `y?` | `number` | Y축 좌표 (선택, 기본값: `x`) |
| `z?` | `number` | Z축 좌표 (선택, 기본값: `x`) |

#### Returns

`void`

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:399](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L399)

인스턴스의 X, Y, Z축 회전각(도)을 설정합니다. `rotationY`, `rotationZ` 생략 시 `rotationX`와 동일한 값으로 설정됩니다.

#### Example
```typescript
instance.setRotation(45, 90, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전각 (도) |
| `rotationY?` | `number` | Y축 회전각 (도, 선택, 기본값: `rotationX`) |
| `rotationZ?` | `number` | Z축 회전각 (도, 선택, 기본값: `rotationX`) |

#### Returns

`void`

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:341](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L341)

인스턴스의 X, Y, Z축 스케일을 설정합니다. `y`, `z` 생략 시 `x`와 동일한 값으로 설정됩니다.

#### Example
```typescript
instance.setScale(2, 2, 2);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 |
| `y?` | `number` | Y축 스케일 (선택, 기본값: `x`) |
| `z?` | `number` | Z축 스케일 (선택, 기본값: `x`) |

#### Returns

`void`
