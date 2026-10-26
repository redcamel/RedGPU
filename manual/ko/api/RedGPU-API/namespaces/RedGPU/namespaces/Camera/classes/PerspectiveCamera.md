[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / PerspectiveCamera

# Class: PerspectiveCamera

Defined in: [src/camera/camera/PerspectiveCamera.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L24)

거리에 따른 원근감을 적용하여 3D 씬을 렌더링하는 원근 투영 카메라 클래스입니다.

***

### Example
```typescript
const camera = new RedGPU.Camera.PerspectiveCamera();
camera.setPosition(10, 5, 20);
camera.fieldOfView = 60;
camera.lookAt(0, 0, 0);
```

## See

[SingleView example](https://redcamel.github.io/RedGPU/examples/3d/view/singleView/)

## Extends

- [`ACamera`](../namespaces/Core/classes/ACamera.md)

## Extended by

- [`OrthographicCamera`](OrthographicCamera.md)

## Constructors



***

### Constructor

> **new PerspectiveCamera**(): `PerspectiveCamera`

Defined in: [src/camera/camera/PerspectiveCamera.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L47)

PerspectiveCamera 인스턴스를 생성합니다.

#### Example
```typescript
const camera = new RedGPU.Camera.PerspectiveCamera();
```

#### Returns

`PerspectiveCamera`

#### Overrides

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`constructor`](../namespaces/Core/classes/ACamera.md#constructor)

## Accessors



***

### farClipping

#### Get Signature

> **get** **farClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L144)

원평면(Far Clipping Plane) 거리를 가져오거나 설정합니다.

##### Returns

`number`

원평면 거리 (기본값: `50000`)

#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L148)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fieldOfView

#### Get Signature

> **get** **fieldOfView**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L110)

수직 시야각(FOV)을 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

시야각 (기본값: `60`)

#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L114)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### nearClipping

#### Get Signature

> **get** **nearClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L127)

근평면(Near Clipping Plane) 거리를 가져오거나 설정합니다.

##### Returns

`number`

근평면 거리 (기본값: `0.1`)

#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L131)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/camera/camera/PerspectiveCamera.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L227)

카메라의 3D 위치 좌표를 반환합니다.

##### Returns

\[`number`, `number`, `number`\]

`[x, y, z]` 좌표 튜플

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L59)

카메라의 X축 회전 각도를 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

X축 회전 각도 (기본값: `0`)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L63)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L76)

카메라의 Y축 회전 각도를 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

Y축 회전 각도 (기본값: `0`)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L80)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L93)

카메라의 Z축 회전 각도를 가져오거나 설정합니다. (단위: 도)

##### Returns

`number`

Z축 회전 각도 (기본값: `0`)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:97](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L97)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### viewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L161)

뷰 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

뷰 행렬 (`mat4`)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L173)

카메라의 X축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X축 좌표 (기본값: `0`)

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:177](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L177)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L191)

카메라의 Y축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y축 좌표 (기본값: `0`)

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:195](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L209)

카메라의 Z축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z축 좌표 (기본값: `0`)

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L213)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### lookAt()

> **lookAt**(`x`, `y`, `z`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:294](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L294)

카메라가 지정된 월드 좌표를 바라보도록 뷰 행렬을 갱신합니다.

#### Example
```typescript
camera.lookAt(0, 0, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 바라볼 목표 지점의 X축 좌표 |
| `y` | `number` | 바라볼 목표 지점의 Y축 좌표 |
| `z` | `number` | 바라볼 목표 지점의 Z축 좌표 |

#### Returns

`void`

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:254](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/PerspectiveCamera.ts#L254)

카메라의 3D 위치를 설정합니다.

#### Example
```typescript
camera.setPosition(10, 5, 20);
camera.setPosition([10, 5, 20]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X축 좌표 또는 `[x, y, z]` 배열 |
| `y?` | `number` | Y축 좌표 (`x`가 배열인 경우 무시됨) |
| `z?` | `number` | Z축 좌표 (`x`가 배열인 경우 무시됨) |

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/camera/core/ACamera.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L86)

조리개(f-stop) 값을 가져오거나 설정합니다. (양수, 기본값: `16.0`)

##### Returns

`number`

조리개(f-stop) 값

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`aperture`](../namespaces/Core/classes/ACamera.md#aperture)

***

***

### ev100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **ev100**(): `number`

Defined in: [src/camera/core/ACamera.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L73)

ISO 100 기준 물리적 노출 지수(EV100)를 반환합니다.

##### Returns

`number`

EV100 값

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`ev100`](../namespaces/Core/classes/ACamera.md#ev100)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`instanceId`](../namespaces/Core/classes/ACamera.md#instanceid)

***

***

### iso

#### Get Signature

> **get** **iso**(): `number`

Defined in: [src/camera/core/ACamera.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L124)

센서 감도(ISO)를 가져오거나 설정합니다. (양수, 기본값: `100`)

##### Returns

`number`

ISO 감도 값

#### Set Signature

> **set** **iso**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L128)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`iso`](../namespaces/Core/classes/ACamera.md#iso)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### shutterSpeed

#### Get Signature

> **get** **shutterSpeed**(): `number`

Defined in: [src/camera/core/ACamera.ts:105](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L105)

초(second) 단위의 셔터 속도를 가져오거나 설정합니다. (양수, 기본값: `1 / 3200`)

##### Returns

`number`

셔터 속도 (초)

#### Set Signature

> **set** **shutterSpeed**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L109)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`shutterSpeed`](../namespaces/Core/classes/ACamera.md#shutterspeed)

***

***

### useAutoExposure

#### Get Signature

> **get** **useAutoExposure**(): `boolean`

Defined in: [src/camera/core/ACamera.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L36)

자동 노출 활성화 여부를 가져오거나 설정합니다. 비활성화(`false`) 전환 시 현재 EV100을 유지하도록 ISO를 100으로 고정하고 가장 가까운 표준 셔터 속도로 스냅합니다. (기본값: `true`)

##### Returns

`boolean`

자동 노출 활성화 여부

#### Set Signature

> **set** **useAutoExposure**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L40)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`useAutoExposure`](../namespaces/Core/classes/ACamera.md#useautoexposure)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`uuid`](../namespaces/Core/classes/ACamera.md#uuid)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/ACamera.ts#L143)

자동 노출 결과 또는 수동 물리 파라미터(`aperture`, `shutterSpeed`, `iso`)를 바탕으로 `ev100` 값을 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | [`View3D`](../../Display/classes/View3D.md) | 자동 노출 값을 참조할 `View3D` 인스턴스 (선택) |

#### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`updateExposure`](../namespaces/Core/classes/ACamera.md#updateexposure)

</details>
