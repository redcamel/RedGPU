[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / View3D

# Class: View3D

Defined in: [src/display/view/View3D.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L57)

3D 렌더링을 위한 뷰 클래스입니다.

`Scene`, `Camera`, `IBL`, `SkyBox`, `PostEffectManager`, `ToneMappingManager` 등을 소유하며 3D 씬을 그리는 렌더링의 단위입니다.

***

### Example
```typescript
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.ObitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/view/singleView/" style="width:100%; height:500px;"></iframe>

## See

- [singleView Example](https://redcamel.github.io/RedGPU/examples/3d/view/singleView/)
 - [multiView Example](https://redcamel.github.io/RedGPU/examples/3d/view/multiView/)

## Extends

- [`AView`](../namespaces/CoreView/classes/AView.md)

## Extended by

- [`View2D`](View2D.md)

## Constructors



***

### Constructor

> **new View3D**(`redGPUContext`, `scene`, `camera`, `name?`): `View3D`

Defined in: [src/display/view/View3D.ts:111](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L111)

`View3D` 인스턴스를 생성합니다.

#### Example
```typescript
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera, 'Main3DView');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `scene` | [`Scene`](Scene.md) | 뷰에 렌더링할 씬 |
| `camera` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | 뷰에서 사용할 카메라 또는 컨트롤러 |
| `name?` | `string` | 뷰 이름 (선택) |

#### Returns

`View3D`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`constructor`](../namespaces/CoreView/classes/AView.md#constructor)

## Properties



## Accessors



***

### basicRenderBundleEncoderDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **basicRenderBundleEncoderDescriptor**(): `GPURenderBundleEncoderDescriptor`

Defined in: [src/display/view/View3D.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L311)

기본 렌더 번들 인코더 디스크립터를 반환합니다.

##### Returns

`GPURenderBundleEncoderDescriptor`

`GPURenderBundleEncoderDescriptor` 객체

***

***

### clusterLightManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **clusterLightManager**(): [`ClusterLightManager`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/ClusterLightManager.md)

Defined in: [src/display/view/View3D.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L148)

클러스터 라이트 매니저를 반환합니다.

##### Returns

[`ClusterLightManager`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/ClusterLightManager.md)

`ClusterLightManager` 인스턴스

***

***

### currentCascadeIndex

#### Get Signature

> **get** **currentCascadeIndex**(): `number`

Defined in: [src/display/view/View3D.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L184)

현재 렌더링 중인 CSM 캐스케이드 인덱스(0 ~ 3)를 반환하거나 설정합니다.

##### Returns

`number`

현재 캐스케이드 인덱스 또는 `undefined`

#### Set Signature

> **set** **currentCascadeIndex**(`value`): `void`

Defined in: [src/display/view/View3D.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L188)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### hierarchicalZBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hierarchicalZBuffer**(): `HierarchicalZBuffer`

Defined in: [src/display/view/View3D.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L136)

Hierarchical Z-Buffer (HZB) 전역 피라미드 객체를 반환합니다.

##### Returns

`HierarchicalZBuffer`

`HierarchicalZBuffer` 인스턴스

***

***

### ibl

#### Get Signature

> **get** **ibl**(): [`IBL`](../../Resource/classes/IBL.md)

Defined in: [src/display/view/View3D.ts:227](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L227)

이미지 기반 조명(IBL) 객체를 반환하거나 설정합니다.

##### Returns

[`IBL`](../../Resource/classes/IBL.md)

`IBL` 인스턴스

#### Set Signature

> **set** **ibl**(`value`): `void`

Defined in: [src/display/view/View3D.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L243)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`IBL`](../../Resource/classes/IBL.md) |

##### Returns

`void`

***

***

### noneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **noneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L333)

지터(Jitter)가 적용되지 않은 투영 뷰 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

투영 뷰 행렬 (`mat4`)

***

***

### postEffectManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **postEffectManager**(): [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

Defined in: [src/display/view/View3D.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L239)

포스트 이펙트 매니저를 반환합니다.

##### Returns

[`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

`PostEffectManager` 인스턴스

***

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:345](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L345)

이전 프레임의 지터가 적용되지 않은 투영 뷰 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

이전 프레임 투영 뷰 행렬 (`mat4`)

***

***

### renderViewStateData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderViewStateData**(): [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

Defined in: [src/display/view/View3D.ts:267](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L267)

뷰 렌더링 상태 데이터를 반환합니다.

##### Returns

[`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

`RenderViewStateData` 인스턴스

***

***

### skyAtmosphere

#### Get Signature

> **get** **skyAtmosphere**(): [`SkyAtmosphere`](SkyAtmosphere.md)

Defined in: [src/display/view/View3D.ts:291](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L291)

스카이 대기(`SkyAtmosphere`) 객체를 반환하거나 설정합니다.

##### Returns

[`SkyAtmosphere`](SkyAtmosphere.md)

`SkyAtmosphere` 인스턴스

#### Set Signature

> **set** **skyAtmosphere**(`value`): `void`

Defined in: [src/display/view/View3D.ts:321](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L321)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`SkyAtmosphere`](SkyAtmosphere.md) |

##### Returns

`void`

***

***

### skybox

#### Get Signature

> **get** **skybox**(): [`SkyBox`](SkyBox.md)

Defined in: [src/display/view/View3D.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L279)

스카이박스 객체를 반환하거나 설정합니다.

##### Returns

[`SkyBox`](SkyBox.md)

`SkyBox` 인스턴스

#### Set Signature

> **set** **skybox**(`value`): `void`

Defined in: [src/display/view/View3D.ts:295](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L295)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`SkyBox`](SkyBox.md) |

##### Returns

`void`

***

***

### systemUniform\_Vertex\_StructInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniform\_Vertex\_StructInfo**(): `any`

Defined in: [src/display/view/View3D.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L172)

시스템 버텍스 유니폼의 구조체 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조체 정보

***

***

### systemUniform\_Vertex\_UniformBindGroup

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniform\_Vertex\_UniformBindGroup**(): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:200](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L200)

시스템 버텍스 유니폼 바인드 그룹을 반환합니다. 캐스케이드 렌더링 중에는 해당 캐스케이드 바인드 그룹을 반환합니다.

##### Returns

`GPUBindGroup`

시스템 유니폼 `GPUBindGroup`

***

***

### systemUniform\_Vertex\_UniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniform\_Vertex\_UniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/view/View3D.ts:215](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L215)

시스템 버텍스 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

***

***

### toneMappingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **toneMappingManager**(): [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

Defined in: [src/display/view/View3D.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L255)

톤 매핑 매니저를 반환합니다.

##### Returns

[`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

`ToneMappingManager` 인스턴스

***

***

### viewRenderTextureManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewRenderTextureManager**(): [`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

Defined in: [src/display/view/View3D.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L160)

뷰 렌더 텍스처 매니저를 반환합니다.

##### Returns

[`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

`ViewRenderTextureManager` 인스턴스

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/view/View3D.ts:368](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L368)

뷰와 연결된 모든 GPU 리소스 및 하위 매니저를 해제합니다.

#### Returns

`void`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`destroy`](../namespaces/CoreView/classes/AView.md#destroy)

***

***

### getCascadeUniformBindGroup()

> **getCascadeUniformBindGroup**(`cascadeIndex`): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:360](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L360)

지정된 캐스케이드 인덱스에 대응하는 시스템 버텍스 유니폼 바인드 그룹을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | 캐스케이드 인덱스 (0 ~ 3) |

#### Returns

`GPUBindGroup`

시스템 유니폼 `GPUBindGroup`

***

***

### update()

> **update**(`renderPath1ResultTextureView?`, `renderPath1DepthTextureView?`): `void`

Defined in: [src/display/view/View3D.ts:422](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/View3D.ts#L422)

매 프레임 뷰의 시스템 유니폼 및 바인드 그룹 상태를 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderPath1ResultTextureView?` | `GPUTextureView` | 렌더 패스 1단계 결과 텍스처 뷰 (선택) |
| `renderPath1DepthTextureView?` | `GPUTextureView` | 렌더 패스 1단계 깊이 결과 텍스처 뷰 (선택) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L28)

뷰 크기 변경 시 호출되는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](../namespaces/CoreView/classes/ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`onResize`](../namespaces/CoreView/classes/AView.md#onresize)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`antialiasingManager`](../namespaces/CoreView/classes/AView.md#antialiasingmanager)

***

***

### aspect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L196)

뷰포트의 가로세로 비율(종횡비)을 반환합니다.

##### Returns

`number`

뷰포트 종횡비

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`aspect`](../namespaces/CoreView/classes/AView.md#aspect)

***

***

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../namespaces/DrawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L185)

디버깅용 축(`DrawDebuggerAxis`) 객체를 반환하거나 설정합니다. (`boolean` 전달 시 자동 생성/해제)

##### Returns

[`DrawDebuggerAxis`](../namespaces/DrawDebugger/classes/DrawDebuggerAxis.md)

`DrawDebuggerAxis` 인스턴스

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L189)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../namespaces/DrawDebugger/classes/DrawDebuggerAxis.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`axis`](../namespaces/CoreView/classes/AView.md#axis)

***

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L65)

현재 뷰에 연결된 카메라 또는 컨트롤러를 반환하거나 설정합니다.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

연결된 카메라 또는 컨트롤러 인스턴스

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L69)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`camera`](../namespaces/CoreView/classes/AView.md#camera)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`commandEncoderManager`](../namespaces/CoreView/classes/AView.md#commandencodermanager)

***

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L144)

거리 기반 컬링의 기준 거리를 반환하거나 설정합니다.

##### Returns

`number`

기준 거리

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L148)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`distanceCulling`](../namespaces/CoreView/classes/AView.md#distanceculling)

***

***

### frustumPlanes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L208)

현재 투영 행렬과 뷰 행렬을 기반으로 계산된 6개의 뷰 프러스텀 평면 배열을 반환합니다.

##### Returns

`number`[][]

프러스텀 평면 배열

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanes`](../namespaces/CoreView/classes/AView.md#frustumplanes)

***

***

### frustumPlanesFlat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanesFlat**(): `Float32Array`

Defined in: [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L221)

현재 투영 행렬과 뷰 행렬을 기반으로 계산된 1차원 평탄 프러스텀 평면 버퍼(`Float32Array(24)`)를 반환합니다.

##### Returns

`Float32Array`

24개 float으로 구성된 1차원 프러스텀 평면 버퍼

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanesFlat`](../namespaces/CoreView/classes/AView.md#frustumplanesflat)

***

***

### fxaa

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fxaa**(): [`FXAA`](../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L210)

FXAA 안티앨리어싱 객체를 반환합니다.

##### Returns

[`FXAA`](../../Antialiasing/classes/FXAA.md)

`FXAA` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`fxaa`](../namespaces/CoreView/classes/AView.md#fxaa)

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`gpuDevice`](../namespaces/CoreView/classes/AView.md#gpudevice)

***

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../namespaces/DrawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L160)

디버깅용 그리드(`DrawDebuggerGrid`) 객체를 반환하거나 설정합니다. (`boolean` 전달 시 자동 생성/해제)

##### Returns

[`DrawDebuggerGrid`](../namespaces/DrawDebugger/classes/DrawDebuggerGrid.md)

`DrawDebuggerGrid` 인스턴스

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L164)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../namespaces/DrawDebugger/classes/DrawDebuggerGrid.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`grid`](../namespaces/CoreView/classes/AView.md#grid)

***

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L134)

뷰의 높이(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 높이

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L138)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`height`](../namespaces/CoreView/classes/AView.md#height)

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`instanceId`](../namespaces/CoreView/classes/AView.md#instanceid)

***

***

### inverseProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **inverseProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:321](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L321)

현재 투영 행렬의 역행렬을 계산하여 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

역투영 행렬

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`inverseProjectionMatrix`](../namespaces/CoreView/classes/AView.md#inverseprojectionmatrix)

***

***

### jitterOffset

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L333)

현재 적용된 픽셀 지터 오프셋(`[offsetX, offsetY]`)을 반환합니다.

##### Returns

\[`number`, `number`\]

지터 오프셋 튜플

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`jitterOffset`](../namespaces/CoreView/classes/AView.md#jitteroffset)

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`name`](../namespaces/CoreView/classes/AView.md#name)

***

***

### noneJitterProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L246)

TAA 지터(Jitter)가 적용되지 않은 원본 투영 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

지터가 배제된 투영 행렬

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`noneJitterProjectionMatrix`](../namespaces/CoreView/classes/AView.md#nonejitterprojectionmatrix)

***

***

### pickingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingManager**(): [`PickingManager`](../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L100)

마우스 좌표 기반 객체 선택을 관리하는 `PickingManager`를 반환합니다.

##### Returns

[`PickingManager`](../../Picking/classes/PickingManager.md)

`PickingManager` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pickingManager`](../namespaces/CoreView/classes/AView.md#pickingmanager)

***

***

### pixelRectArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L150)

물리 픽셀 단위의 사각형 배열(`[x, y, width, height]`)을 반환합니다.

##### Returns

\[`number`, `number`, `number`, `number`\]

물리 픽셀 사각형 배열

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectArray`](../namespaces/CoreView/classes/AView.md#pixelrectarray)

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L162)

물리 픽셀 단위의 사각형 정보 객체(`{ x, y, width, height }`)를 반환합니다.

##### Returns

`object`

물리 픽셀 사각형 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L167) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L166) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L164) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L165) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectObject`](../namespaces/CoreView/classes/AView.md#pixelrectobject)

***

***

### projectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **projectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:295](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L295)

TAA 활성화 여부에 따라 지터 오프셋이 반영된 최종 투영 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

최종 투영 행렬

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`projectionMatrix`](../namespaces/CoreView/classes/AView.md#projectionmatrix)

***

***

### rawCamera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rawCamera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L234)

실제 렌더링에 사용되는 내부 카메라 인스턴스를 반환합니다. (`AController`가 연결된 경우 제어 대상 카메라 반환)

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

내부 카메라 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`rawCamera`](../namespaces/CoreView/classes/AView.md#rawcamera)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`redGPUContext`](../namespaces/CoreView/classes/AView.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`resourceManager`](../namespaces/CoreView/classes/AView.md#resourcemanager)

***

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](Scene.md)

Defined in: [src/display/view/core/AView.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L83)

현재 뷰에 연결된 `Scene` 객체를 반환하거나 설정합니다.

##### Throws

`Scene` 인스턴스가 아닌 값을 설정할 경우 예외 발생

##### Returns

[`Scene`](Scene.md)

`Scene` 인스턴스

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L87)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Scene`](Scene.md) |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`scene`](../namespaces/CoreView/classes/AView.md#scene)

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L179)

`devicePixelRatio`가 반영된 CSS 스크린 기준 사각형 정보 객체를 반환합니다.

##### Returns

`object`

스크린 기준 사각형 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L184) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:183](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L183) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:181](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L181) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L182) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenRectObject`](../namespaces/CoreView/classes/AView.md#screenrectobject)

***

***

### taa

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **taa**(): [`TAA`](../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L225)

TAA 안티앨리어싱 객체를 반환합니다.

##### Returns

[`TAA`](../../Antialiasing/classes/TAA.md)

`TAA` 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`taa`](../namespaces/CoreView/classes/AView.md#taa)

***

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:128](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L128)

거리 기반 컬링(Distance Culling) 사용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

거리 기반 컬링 사용 여부

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L132)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useDistanceCulling`](../namespaces/CoreView/classes/AView.md#usedistanceculling)

***

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L112)

절두체 컬링(Frustum Culling) 사용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

절두체 컬링 사용 여부

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L116)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useFrustumCulling`](../namespaces/CoreView/classes/AView.md#usefrustumculling)

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`uuid`](../namespaces/CoreView/classes/AView.md#uuid)

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L118)

뷰의 너비(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 너비

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`width`](../namespaces/CoreView/classes/AView.md#width)

***

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L86)

뷰의 X 좌표(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 X 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`x`](../namespaces/CoreView/classes/AView.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L102)

뷰의 Y 좌표(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

뷰의 Y 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`y`](../namespaces/CoreView/classes/AView.md#y)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L261)

마우스 포인터가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.

#### Returns

`boolean`

마우스가 뷰 영역 내에 있으면 `true`, 아니면 `false`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`checkMouseInViewBounds`](../namespaces/CoreView/classes/AView.md#checkmouseinviewbounds)

***

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:357](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L357)

지터 오프셋을 `[0, 0]`으로 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`clearJitterOffset`](../namespaces/CoreView/classes/AView.md#clearjitteroffset)

***

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/AView.ts#L246)

화면 좌표를 3D 월드 좌표로 변환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표 (픽셀) |
| `screenY` | `number` | 화면 Y 좌표 (픽셀) |

#### Returns

`number`[]

변환된 월드 좌표 (`[x, y, z]`)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenToWorld`](../namespaces/CoreView/classes/AView.md#screentoworld)

***

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:348](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L348)

TAA 연산을 위한 서브픽셀 지터 오프셋을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X축 지터 오프셋 |
| `offsetY` | `number` | Y축 지터 오프셋 |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setJitterOffset`](../namespaces/CoreView/classes/AView.md#setjitteroffset)

***

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:380](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L380)

뷰의 위치(X, Y)를 설정하고 물리 픽셀 영역 좌표를 갱신합니다.

#### Example
```typescript
// 픽셀 또는 퍼센트 단위로 뷰 위치 지정
view.setPosition(100, '50%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x?` | `string` \| `number` | X 좌표 (픽셀 수치 또는 백분율 문자열) |
| `y?` | `string` \| `number` | Y 좌표 (픽셀 수치 또는 백분율 문자열) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setPosition`](../namespaces/CoreView/classes/AView.md#setposition)

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:411](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/ViewTransform.ts#L411)

뷰의 크기(너비, 높이)를 설정하고 물리 픽셀 영역을 갱신하며, `onResize` 콜백이 등록되어 있으면 호출합니다.

#### Example
```typescript
// 픽셀 또는 퍼센트 단위로 뷰 크기 지정
view.setSize('100%', '100%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | 너비 (픽셀 수치 또는 백분율 문자열) |
| `h?` | `string` \| `number` | 높이 (픽셀 수치 또는 백분율 문자열) |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setSize`](../namespaces/CoreView/classes/AView.md#setsize)

***

</details>
