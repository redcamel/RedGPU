[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / Camera2D

# Class: Camera2D

Defined in: [src/camera/camera/Camera2D.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L26)

2D 평면 좌표계를 기반으로 객체를 렌더링하는 카메라 클래스입니다. `View2D` 생성 시 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 올바른 접근 방법
const view = new RedGPU.Display.View2D(redGPUContext, scene);
const camera = view.camera;
camera.setPosition(100, 50);
```

## See

[MultiView with 2D/3D example](https://redcamel.github.io/RedGPU/examples/2d/view/multiViewWith3D/)

## Extends

- [`ACamera`](../namespaces/Core/classes/ACamera.md)

## Constructors



***

### Constructor

> **new Camera2D**(): `Camera2D`

Defined in: [src/camera/camera/Camera2D.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L37)

Camera2D 인스턴스를 생성합니다.

#### Returns

`Camera2D`

#### Overrides

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`constructor`](../namespaces/Core/classes/ACamera.md#constructor)

## Accessors



***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`\]

Defined in: [src/camera/camera/Camera2D.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L109)

카메라의 2D 위치 좌표를 반환합니다.

##### Returns

\[`number`, `number`\]

`[x, y]` 좌표 튜플

***

***

### viewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/Camera2D.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L49)

뷰 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

뷰 행렬 (`mat4`)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L73)

카메라의 X축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X축 좌표 (기본값: `0`)

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L77)

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

Defined in: [src/camera/camera/Camera2D.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L91)

카메라의 Y축 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y축 좌표 (기본값: `0`)

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L95)

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

> <span class="readonly-badge">readonly</span> **get** **z**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L61)

카메라의 Z축 좌표를 반환합니다. (2D 환경에서는 항상 `0`으로 유지됨)

##### Returns

`number`

Z축 좌표 (`0`)

## Methods



***

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/camera/camera/Camera2D.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/camera/Camera2D.ts#L132)

카메라의 2D 위치를 설정합니다.

#### Example
```typescript
camera.setPosition(100, 200);
camera.setPosition([100, 200, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X축 좌표 또는 `[x, y, z]` 배열 |
| `y?` | `number` | Y축 좌표 (`x`가 배열인 경우 무시됨) |

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
