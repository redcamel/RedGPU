[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerSpotLight

# Class: DrawDebuggerSpotLight

Defined in: [src/display/drawDebugger/light/DrawDebuggerSpotLight.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/DrawDebuggerSpotLight.ts#L26)

스포트라이트([SpotLight](../../../../Light/classes/SpotLight.md))의 원추형 조사 범위, 방향, 도달거리를 입체 기하 형태로 시각화하는 디버거 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Remarks

***
- 🔦 모양의 레이블 아이콘과 함께, 조명의 조사각 설정(`innerCutoff` 및 `outerCutoff`)에 정렬된 이중 원뿔 선 형태를 노란색 와이어프레임으로 제공합니다.
- 도달 거리 경계 원호와 중심선, 시작점 조준 십자선 등을 조합하여 광원의 유효 방향을 입체적으로 인지하기 좋습니다.


## Extends

- [`ADrawDebuggerLight`](ADrawDebuggerLight.md)\<[`SpotLight`](../../../../Light/classes/SpotLight.md)\>

## Constructors

### Constructor

> **new DrawDebuggerSpotLight**(`redGPUContext`, `target`): `DrawDebuggerSpotLight`

Defined in: [src/display/drawDebugger/light/DrawDebuggerSpotLight.ts:28](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/DrawDebuggerSpotLight.ts#L28)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `target` | [`SpotLight`](../../../../Light/classes/SpotLight.md) |

#### Returns

`DrawDebuggerSpotLight`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`constructor`](ADrawDebuggerLight.md#constructor)

## Accessors

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/DrawDebuggerSpotLight.ts:32](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/DrawDebuggerSpotLight.ts#L32)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`render`](ADrawDebuggerLight.md#render)

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### label

#### Get Signature

> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:60](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L60)

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`label`](ADrawDebuggerLight.md#label)

***

### lightDebugMesh

#### Get Signature

> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L64)

##### Returns

[`Mesh`](../../../classes/Mesh.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`lightDebugMesh`](ADrawDebuggerLight.md#lightdebugmesh)

***

### target

#### Get Signature

> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:56](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L56)

##### Returns

`T`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`target`](ADrawDebuggerLight.md#target)

## Methods

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:68](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lines` | `number`[][][] |
| `vertexBuffer` | [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md) |

#### Returns

`void`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`updateVertexBuffer`](ADrawDebuggerLight.md#updatevertexbuffer)


</details>
