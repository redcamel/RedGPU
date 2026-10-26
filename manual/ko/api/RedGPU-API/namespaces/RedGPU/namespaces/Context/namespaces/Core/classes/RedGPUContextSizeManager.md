[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Context](../../../README.md) / [Core](../README.md) / RedGPUContextSizeManager

# Class: RedGPUContextSizeManager

Defined in: [src/context/core/RedGPUContextSizeManager.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L86)

픽셀(`px`) 또는 백분율(`%`) 단위로 캔버스 크기를 제어하고 렌더링 해상도 배율(`renderScale`)을 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
const sizeManager = redGPUContext.sizeManager;
sizeManager.renderScale = 0.5;
sizeManager.setSize('100%', '100%');
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new RedGPUContextSizeManager**(`redGPUContext`, `width?`, `height?`): `RedGPUContextSizeManager`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L107)

RedGPUContextSizeManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `width?` | `string` \| `number` | `'100%'` | 초기 가로 크기 (기본값: `'100%'`) |
| `height?` | `string` \| `number` | `'100%'` | 초기 세로 크기 (기본값: `'100%'`) |

#### Returns

`RedGPUContextSizeManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:159](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L159)

설정된 세로 크기 값(숫자 또는 `px`/`%` 문자열)을 반환하거나 설정합니다.

##### Returns

`string` \| `number`

설정된 세로 크기 값

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L163)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### parentDomRect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **parentDomRect**(): `ParentRect`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L204)

캔버스 부모 DOM 요소의 가용 크기 및 위치 정보를 반환합니다. 부모가 없거나 `body`/`html`인 경우 뷰포트 크기를 반환합니다.

##### Returns

`ParentRect`

부모 DOM 요소의 위치 및 크기 정보

***

***

### pixelRectArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/context/core/RedGPUContextSizeManager.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L175)

물리 픽셀 단위의 렌더링 영역을 `[x, y, width, height]` 배열로 반환합니다.

##### Returns

\[`number`, `number`, `number`, `number`\]

물리 픽셀 영역 튜플 (`[number, number, number, number]`)

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L187)

물리 픽셀 단위의 렌더링 영역을 객체로 반환합니다.

##### Returns

`IRedGPURectObject`

물리 픽셀 영역 객체

***

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L124)

렌더링 해상도 배율을 반환하거나 설정합니다. (0 이하 입력 시 `0.01`로 보정)

##### Returns

`number`

현재 렌더링 스케일 배율

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L128)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L233)

CSS 논리 픽셀 단위의 화면 영역 정보를 객체로 반환합니다.

##### Returns

`IRedGPURectObject`

CSS 픽셀 영역 객체

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L143)

설정된 가로 크기 값(숫자 또는 `px`/`%` 문자열)을 반환하거나 설정합니다.

##### Returns

`string` \| `number`

설정된 가로 크기 값

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:147](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L147)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:349](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L349)

RedGPUContextSizeManager 인스턴스를 파기하고 캔버스 참조를 해제합니다.

#### Returns

`void`

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:364](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L364)

캔버스의 크기를 설정하고 스타일 및 하위 `View3D` 크기를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | 가로 크기 (기본값: 현재 설정된 `width`) |
| `h?` | `string` \| `number` | 세로 크기 (기본값: 현재 설정된 `height`) |

#### Returns

`void`

***

***

### calculateSizeFromString()

> `static` **calculateSizeFromString**(`rect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:332](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L332)

문자열(`px`, `%`) 값을 기준 영역 객체에 맞춰 픽셀 단위 숫자로 변환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rect` | \{ `height`: `number`; `width`: `number`; `x`: `number`; `y`: `number`; \} | 기준 영역 객체 |
| `rect.height` | `number` | - |
| `rect.width` | `number` | - |
| `rect.x` | `number` | - |
| `rect.y` | `number` | - |
| `key` | `string` | 참조할 속성 키 (`'width'` 또는 `'height'`) |
| `value` | `string` | 변환할 문자열 값 |

#### Returns

`number`

변환된 픽셀 단위 숫자 값

***

***

### getPixelDimension()

> `static` **getPixelDimension**(`parentRect`, `key`, `value`): `number`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L311)

부모 영역(`parentRect`)을 기준으로 숫자 또는 문자열(`px`, `%`) 값을 계산하여 픽셀 단위 수치로 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parentRect` | `ParentRect` | 기준이 되는 부모 영역 객체 |
| `key` | `string` | 참조할 속성 키 (`'width'` 또는 `'height'`) |
| `value` | `string` \| `number` | 계산할 크기 또는 위치 값 |

#### Returns

`number`

픽셀 단위로 환산된 숫자 값

***

***

### validatePositionValue()

> `static` **validatePositionValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L279)

입력값이 유효한 위치 값(숫자, `px`, `%`)인지 검증합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 검증할 위치 값 |

#### Returns

`void`

#### Throws

숫자 또는 유효한 `px`/`%` 형식이 아닐 경우 에러 발생

***

***

### validateSizeValue()

> `static` **validateSizeValue**(`value`): `void`

Defined in: [src/context/core/RedGPUContextSizeManager.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/context/core/RedGPUContextSizeManager.ts#L253)

입력값이 유효한 크기 값(양수, `px`, `%`)인지 검증합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 검증할 크기 값 |

#### Returns

`void`

#### Throws

양수 또는 유효한 `px`/`%` 형식이 아닐 경우 에러 발생

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
