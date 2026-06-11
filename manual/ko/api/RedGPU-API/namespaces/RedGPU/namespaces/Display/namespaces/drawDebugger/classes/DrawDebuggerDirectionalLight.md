[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerDirectionalLight

# Class: DrawDebuggerDirectionalLight

Defined in: [src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts:27](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts#L27)

직사광([DirectionalLight](../../../../Light/classes/DirectionalLight.md))의 위치 및 조사 방향 벡터를 공간상에 투영하는 디버거 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Remarks

***
- ☀️ 모양의 레이블 아이콘과 노란색의 화살표 라인을 이용하여 직사광이 비추는 투사 각도를 명시해 줍니다.
- 대상 조명 객체의 `enableDebugger` 플래그 상태에 따라 자동으로 렌더링 노출을 온/오프 처리합니다.


## Extends

- [`ADrawDebuggerLight`](ADrawDebuggerLight.md)\<[`DirectionalLight`](../../../../Light/classes/DirectionalLight.md)\>

## Constructors

### Constructor

> **new DrawDebuggerDirectionalLight**(`redGPUContext`, `target`): `DrawDebuggerDirectionalLight`

Defined in: [src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts:30](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts#L30)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `target` | [`DirectionalLight`](../../../../Light/classes/DirectionalLight.md) |

#### Returns

`DrawDebuggerDirectionalLight`

#### Overrides

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`constructor`](ADrawDebuggerLight.md#constructor)

## Accessors

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts:34](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/DrawDebuggerDirectionalLight.ts#L34)

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

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:60](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L60)

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`label`](ADrawDebuggerLight.md#label)

***

### lightDebugMesh

#### Get Signature

> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:64](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L64)

##### Returns

[`Mesh`](../../../classes/Mesh.md)

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`lightDebugMesh`](ADrawDebuggerLight.md#lightdebugmesh)

***

### target

#### Get Signature

> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:56](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L56)

##### Returns

`T`

#### Inherited from

[`ADrawDebuggerLight`](ADrawDebuggerLight.md).[`target`](ADrawDebuggerLight.md#target)

## Methods

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:68](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L68)

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
