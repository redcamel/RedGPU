[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerGrid

# Class: DrawDebuggerGrid

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:48](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L48)

3D 씬(Scene)의 기준 바닥면을 바둑판 형태의 격자로 렌더링하여 구조와 위치를 가늠하게 돕는 디버깅용 그리드 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Remarks

***
- 그리드 크기(`size`)에 상응하는 1단위 간격의 격자선을 그리며, Z축(파란색)과 X축(빨간색) 방향 중심선을 다르게 채색하여 방위 인지를 도모합니다.
- 투명 블렌딩 상태 조절 및 안티앨리어싱(MSAA) 설정 변경 등 렌더 상태에 동적으로 대처하며, 성능 최적화를 위해 GPU 렌더 번들(Render Bundle)로 드로우를 제어합니다.


## Extends

- [`BaseObject`](../../../../BaseObject/classes/BaseObject.md)

## Constructors

### Constructor

> **new DrawDebuggerGrid**(`redGPUContext`): `DrawDebuggerGrid`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:66](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |

#### Returns

`DrawDebuggerGrid`

#### Overrides

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`constructor`](../../../../BaseObject/classes/BaseObject.md#constructor)

## Accessors

### lineColor

#### Get Signature

> **get** **lineColor**(): [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:166](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L166)

##### Returns

[`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:158](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L158)

##### Returns

`number`

#### Set Signature

> **set** **size**(`value`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:162](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L162)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/grid/DrawDebuggerGrid.ts:170](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/drawDebugger/grid/DrawDebuggerGrid.ts#L170)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`name`](../../../../BaseObject/classes/BaseObject.md#name)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

## Methods


</details>
