[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [DrawDebugger](../README.md) / DrawDebuggerGrid

# Class: DrawDebuggerGrid

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L49)

3D 씬(Scene)의 기준 바닥면(XZ 평면)에 절차적 안티앨리어싱 격자를 렌더링하는 디버거 클래스입니다.

보조선(Minor Grid), 주선(Major Grid), X축(빨강) 및 Z축(파랑) 중심선을 표시하며 카메라 거리에 따른 페이드아웃을 지원합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 grid 프로퍼티를 통해 활성화합니다.
view.grid = true;
```

## See

[DrawDebugger basic example](https://redcamel.github.io/RedGPU/examples/3d/drawDebugger/basic/)

## Extends

- [`BaseObject`](../../../../BaseObject/classes/BaseObject.md)

## Constructors



***

### Constructor

> **new DrawDebuggerGrid**(`redGPUContext`): `DrawDebuggerGrid`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L96)

`DrawDebuggerGrid` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`DrawDebuggerGrid`

#### Overrides

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`constructor`](../../../../BaseObject/classes/BaseObject.md#constructor)

## Accessors



***

### axisLineWidth

#### Get Signature

> **get** **axisLineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:312](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L312)

X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 가져오거나 설정합니다.

##### Returns

`number`

축 중심선 두께

#### Set Signature

> **set** **axisLineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:335](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L335)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeEnd

#### Get Signature

> **get** **fadeEnd**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:350](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L350)

거리 기반 페이드가 완료되어 투명해지는 카메라 거리(단위: m, 기본값: 60.0)를 가져오거나 설정합니다.

##### Returns

`number`

페이드 종료 거리

#### Set Signature

> **set** **fadeEnd**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:373](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L373)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fadeStart

#### Get Signature

> **get** **fadeStart**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:331](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L331)

거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 25.0)를 가져오거나 설정합니다.

##### Returns

`number`

페이드 시작 거리

#### Set Signature

> **set** **fadeStart**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L354)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### gridSize

#### Get Signature

> **get** **gridSize**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:236](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L236)

기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 가져오거나 설정합니다.

##### Returns

`number`

보조 그리드 간격

#### Set Signature

> **set** **gridSize**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lineColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lineColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:369](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L369)

기본 보조 그리드(Minor Grid) 색상을 반환합니다.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

보조 그리드 색상 인스턴스

***

***

### lineWidth

#### Get Signature

> **get** **lineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:274](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L274)

보조선(Minor Grid)의 화면 픽셀 두께(기본값: 1.0)를 가져오거나 설정합니다.

##### Returns

`number`

보조선 두께

#### Set Signature

> **set** **lineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L297)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### majorLineColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **majorLineColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:388](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L388)

주 그리드(Major Grid) 색상을 반환합니다.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

주 그리드 색상 인스턴스

***

***

### majorLineWidth

#### Get Signature

> **get** **majorLineWidth**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L293)

주선(Major Grid)의 화면 픽셀 두께(기본값: 1.5)를 가져오거나 설정합니다.

##### Returns

`number`

주선 두께

#### Set Signature

> **set** **majorLineWidth**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:316](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L316)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### majorStep

#### Get Signature

> **get** **majorStep**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L255)

주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 가져오거나 설정합니다.

##### Returns

`number`

주 그리드 간격

#### Set Signature

> **set** **majorStep**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:278](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L278)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:224](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L224)

그리드 평면의 가로/세로 크기(단위: m, 기본값: 100)를 가져오거나 설정합니다.

##### Returns

`number`

그리드 평면 크기

#### Set Signature

> **set** **size**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:240](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L240)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### xAxisColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **xAxisColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:400](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L400)

X축(빨강) 중심선 색상을 반환합니다.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

X축 중심선 색상 인스턴스

***

***

### zAxisColor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **zAxisColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:412](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L412)

Z축(파랑) 중심선 색상을 반환합니다.

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Z축 중심선 색상 인스턴스

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:471](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L471)

`DrawDebuggerGrid` 인스턴스를 파기하고 할당된 GPU 리소스와 드로우 커맨드 슬롯을 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(`view`, `targetTextureView`, `depthTextureView`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:430](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L430)

디버그 그리드를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 렌더링할 View3D 인스턴스 |
| `targetTextureView` | `GPUTextureView` | 컬러 렌더 타겟 텍스처 뷰 |
| `depthTextureView` | `GPUTextureView` | 깊이 렌더 타겟 텍스처 뷰 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`instanceId`](../../../../BaseObject/classes/BaseObject.md#instanceid)

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

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`name`](../../../../BaseObject/classes/BaseObject.md#name)

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

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

***

</details>
