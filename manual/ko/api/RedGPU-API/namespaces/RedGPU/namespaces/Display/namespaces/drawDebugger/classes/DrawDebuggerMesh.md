[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [drawDebugger](../README.md) / DrawDebuggerMesh

# Class: DrawDebuggerMesh

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:48](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/DrawDebuggerMesh.ts#L48)

대상 3D 메시(Mesh)의 공간 바운딩 박스(AABB, OBB) 정보를 추출하여 시각적으로 투영해 주는 디버깅용 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Remarks

***
- 모드는 OBB(빨간색 와이어프레임), AABB(초록색 와이어프레임), 혹은 두 형태를 모두 표기하는 BOTH 모드를 지원합니다.
- 메시 오브젝트의 크기, 회전, 스케일 등 볼륨 데이터의 변경 이력을 감지(캐싱 연산)하여 필요할 때만 GPU 버텍스 정보를 갱신합니다.
- 카메라 절두체 컬링(View Frustum Culling) 로직과 긴밀하게 연동되어, 바운딩 볼륨이 화면 밖으로 이탈하면 렌더 루프 호출을 방지합니다.


## Constructors

### Constructor

> **new DrawDebuggerMesh**(`redGPUContext`, `target`): `DrawDebuggerMesh`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:61](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/DrawDebuggerMesh.ts#L61)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `target` | [`Mesh`](../../../classes/Mesh.md) |

#### Returns

`DrawDebuggerMesh`

## Accessors

### debugMode

#### Get Signature

> **get** **debugMode**(): `DebugMode`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:80](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/DrawDebuggerMesh.ts#L80)

##### Returns

`DebugMode`

#### Set Signature

> **set** **debugMode**(`value`): `void`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:84](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/DrawDebuggerMesh.ts#L84)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `DebugMode` |

##### Returns

`void`

## Methods

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/DrawDebuggerMesh.ts:99](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/display/drawDebugger/DrawDebuggerMesh.ts#L99)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`
