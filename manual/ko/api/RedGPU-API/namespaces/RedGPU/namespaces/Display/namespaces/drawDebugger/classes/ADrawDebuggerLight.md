[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / ADrawDebuggerLight

# Abstract Class: ADrawDebuggerLight\<T\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:34](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L34)

광원(Light) 디버거들의 조명 매개변수 및 시각 가이드를 그리기 위한 공통 추상 부모 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Remarks

***
- 3D 뷰포트 내에 조명의 위치를 상징하는 3D 텍스트 레이블([TextField3D](../../../classes/TextField3D.md)) 아이콘을 자동으로 오버레이 투영해 줍니다.
- 서브클래스에서 조명 데이터로부터 라인을 빌드하면, 이를 부드럽게 버텍스 버퍼에 매핑하는 공유 로직을 제공합니다.


## Extended by

- [`DrawDebuggerDirectionalLight`](DrawDebuggerDirectionalLight.md)
- [`DrawDebuggerPointLight`](DrawDebuggerPointLight.md)
- [`DrawDebuggerSpotLight`](DrawDebuggerSpotLight.md)

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ABaseLight`](../../../../Light/namespaces/Core/classes/ABaseLight.md) |

## Constructors

### Constructor

> `protected` **new ADrawDebuggerLight**\<`T`\>(`redGPUContext`, `target`, `labelIcon`, `color`, `maxLines?`): `ADrawDebuggerLight`\<`T`\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L40)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` |
| `target` | `T` | `undefined` |
| `labelIcon` | `string` | `undefined` |
| `color` | \[`number`, `number`, `number`\] | `undefined` |
| `maxLines` | `number` | `32` |

#### Returns

`ADrawDebuggerLight`\<`T`\>

## Accessors

### label

#### Get Signature

> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:60](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L60)

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

***

### lightDebugMesh

#### Get Signature

> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L64)

##### Returns

[`Mesh`](../../../classes/Mesh.md)

***

### target

#### Get Signature

> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:56](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L56)

##### Returns

`T`

## Methods

### render()

> `abstract` **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:106](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L106)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`

***

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:68](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L68)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `lines` | `number`[][][] |
| `vertexBuffer` | [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md) |

#### Returns

`void`
