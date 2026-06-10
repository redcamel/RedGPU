[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / View3D

# Class: View3D

Defined in: [src/display/view/View3D.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L58)

3D 렌더링을 위한 뷰 클래스입니다.

Scene, Camera, IBL, SkyBox, PostEffectManager, ToneMappingManager 등을 소유하며 3D 씬을 그리는 렌더링의 단위입니다.

### Example
```typescript
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.ObitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/view/singleView/" ></iframe>

## See

 - [singleView Example](https://redcamel.github.io/RedGPU/examples/3d/view/singleView/)
 - [multiView Example](https://redcamel.github.io/RedGPU/examples/3d/view/multiView/)

## Extends

- [`AView`](../namespaces/CoreView/classes/AView.md)

## Extended by

- [`View2D`](View2D.md)

## Constructors

### Constructor

> **new View3D**(`redGPUContext`, `scene`, `camera`, `name?`): `View3D`

Defined in: [src/display/view/View3D.ts:98](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L98)

새로운 View3D 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `scene` | [`Scene`](Scene.md) | 뷰에 렌더링할 씬
| `camera` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | 뷰에서 사용할 카메라 컨트롤러
| `name?` | `string` | 뷰의 선택적 이름

#### Returns

`View3D`

#### Overrides

[`AView`](../namespaces/CoreView/classes/AView.md).[`constructor`](../namespaces/CoreView/classes/AView.md#constructor)

## Properties

### basicRenderBundleEncoderDescriptor

#### Get Signature

> **get** **basicRenderBundleEncoderDescriptor**(): `GPURenderBundleEncoderDescriptor`

Defined in: [src/display/view/View3D.ts:240](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L240)

기본 렌더 번들 인코더 디스크립터를 반환합니다.

##### Returns

`GPURenderBundleEncoderDescriptor`

***

### clusterLightManager

#### Get Signature

> **get** **clusterLightManager**(): `ClusterLightManager`

Defined in: [src/display/view/View3D.ts:115](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L115)

클러스터 라이트 매니저를 반환합니다.

##### Returns

`ClusterLightManager`

***

### ibl

#### Get Signature

> **get** **ibl**(): [`IBL`](../../Resource/classes/IBL.md)

Defined in: [src/display/view/View3D.ts:155](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L155)

현재 설정된 IBL(기반 조명) 객체를 반환합니다.

##### Returns

[`IBL`](../../Resource/classes/IBL.md)

#### Set Signature

> **set** **ibl**(`value`): `void`

Defined in: [src/display/view/View3D.ts:166](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L166)

IBL(기반 조명) 객체를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`IBL`](../../Resource/classes/IBL.md) | 설정할 IBL 인스턴스

##### Returns

`void`

***

### noneJitterProjectionViewMatrix

#### Get Signature

> **get** **noneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:254](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L254)

지터(Jitter)가 적용되지 않은 투영 뷰 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

***

### postEffectManager

#### Get Signature

> **get** **postEffectManager**(): [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

Defined in: [src/display/view/View3D.ts:174](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L174)

포스트 이펙트 매니저를 반환합니다.

##### Returns

[`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

***

### renderViewStateData

#### Get Signature

> **get** **renderViewStateData**(): [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

Defined in: [src/display/view/View3D.ts:190](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L190)

렌더링 상태 및 디버그용 상태 데이터를 반환합니다.

##### Returns

[`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

***

### skyAtmosphere

#### Get Signature

> **get** **skyAtmosphere**(): [`SkyAtmosphere`](SkyAtmosphere.md)

Defined in: [src/display/view/View3D.ts:221](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L221)

스카이 대기(SkyAtmosphere) 객체를 반환합니다.

##### Returns

[`SkyAtmosphere`](SkyAtmosphere.md)

#### Set Signature

> **set** **skyAtmosphere**(`value`): `void`

Defined in: [src/display/view/View3D.ts:232](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L232)

스카이 대기(SkyAtmosphere) 객체를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyAtmosphere`](SkyAtmosphere.md) | 설정할 스카이 대기 인스턴스

##### Returns

`void`

***

### skybox

#### Get Signature

> **get** **skybox**(): [`SkyBox`](SkyBox.md)

Defined in: [src/display/view/View3D.ts:198](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L198)

스카이박스 객체를 반환합니다.

##### Returns

[`SkyBox`](SkyBox.md)

#### Set Signature

> **set** **skybox**(`value`): `void`

Defined in: [src/display/view/View3D.ts:209](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L209)

스카이박스 객체를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyBox`](SkyBox.md) | 설정할 스카이박스 인스턴스

##### Returns

`void`

***

### systemUniform\_Vertex\_StructInfo

#### Get Signature

> **get** **systemUniform\_Vertex\_StructInfo**(): `any`

Defined in: [src/display/view/View3D.ts:131](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L131)

시스템 버텍스 유니폼의 구조체 정보를 반환합니다.

##### Returns

`any`

***

### systemUniform\_Vertex\_UniformBindGroup

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBindGroup**(): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:139](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L139)

시스템 버텍스 유니폼 바인드 그룹을 반환합니다.

##### Returns

`GPUBindGroup`

***

### systemUniform\_Vertex\_UniformBuffer

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/view/View3D.ts:147](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L147)

시스템 버텍스 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

***

### toneMappingManager

#### Get Signature

> **get** **toneMappingManager**(): [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

Defined in: [src/display/view/View3D.ts:182](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L182)

톤 매핑 매니저를 반환합니다.

##### Returns

[`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

***

### viewRenderTextureManager

#### Get Signature

> **get** **viewRenderTextureManager**(): [`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

Defined in: [src/display/view/View3D.ts:123](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L123)

뷰 렌더 텍스처 매니저를 반환합니다.

##### Returns

[`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

***

### update()

> **update**(`shadowRender?`, `calcPointLightCluster?`, `renderPath1ResultTextureView?`): `void`

Defined in: [src/display/view/View3D.ts:271](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/View3D.ts#L271)

매 프레임마다 뷰 및 라이팅 데이터를 업데이트합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shadowRender` | `boolean` | `false` | 그림자 맵 생성 렌더 패스인지 여부
| `calcPointLightCluster` | `boolean` | `false` | 포인트 라이트 클러스터 계산 여부
| `renderPath1ResultTextureView?` | `GPUTextureView` | `undefined` | 렌더 패스 1단계 결과 텍스처 뷰

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:31](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L31)

뷰 크기 변경 시 호출되는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](../namespaces/CoreView/classes/ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`onResize`](../namespaces/CoreView/classes/AView.md#onresize)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`antialiasingManager`](../namespaces/CoreView/classes/AView.md#antialiasingmanager)

***

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L232)

현재 뷰의 가로세로 비율(Aspect Ratio)을 반환합니다.

##### Returns

`number`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`aspect`](../namespaces/CoreView/classes/AView.md#aspect)

***

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:226](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L226)

디버깅용 축 객체를 반환합니다.

##### Returns

[`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md)

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:237](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L237)

디버깅용 축을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md) | boolean 또는 DrawDebuggerAxis 인스턴스

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`axis`](../namespaces/CoreView/classes/AView.md#axis)

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:99](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L99)

현재 연결된 카메라를 반환합니다.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:113](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L113)

카메라를 설정합니다. PerspectiveCamera, OrthographicCamera, AController, Camera2D 중 하나여야 합니다.

##### Throws

지원하지 않는 카메라 타입일 경우 에러 발생

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | 연결할 카메라 인스턴스

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`camera`](../namespaces/CoreView/classes/AView.md#camera)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`commandEncoderManager`](../namespaces/CoreView/classes/AView.md#commandencodermanager)

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:179](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L179)

거리 기반 Culling의 기준 거리를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:190](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L190)

거리 기반 Culling의 기준 거리를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 거리 값

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`distanceCulling`](../namespaces/CoreView/classes/AView.md#distanceculling)

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L243)

현재 투영(projection) 및 카메라 뷰(view) 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.

##### Returns

`number`[][]

프러스텀 평면 배열

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`frustumPlanes`](../namespaces/CoreView/classes/AView.md#frustumplanes)

***

### fxaa

#### Get Signature

> **get** **fxaa**(): [`FXAA`](../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:257](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L257)

FXAA 후처리 효과 객체를 반환합니다.

##### Returns

[`FXAA`](../../Antialiasing/classes/FXAA.md)

FXAA 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`fxaa`](../namespaces/CoreView/classes/AView.md#fxaa)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`gpuDevice`](../namespaces/CoreView/classes/AView.md#gpudevice)

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:198](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L198)

디버깅용 그리드 객체를 반환합니다.

##### Returns

[`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md)

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:209](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L209)

디버깅용 그리드를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md) | boolean 또는 DrawDebuggerGrid 인스턴스

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`grid`](../namespaces/CoreView/classes/AView.md#grid)

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L179)

뷰의 높이 값을 반환합니다. (픽셀 또는 퍼센트 문자열)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L190)

뷰의 높이를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 설정할 높이 값

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`height`](../namespaces/CoreView/classes/AView.md#height)

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:330](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L330)

프로젝션 행렬의 역행렬을 계산하여 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`inverseProjectionMatrix`](../namespaces/CoreView/classes/AView.md#inverseprojectionmatrix)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:338](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L338)

현재 설정된 지터 오프셋 [offsetX, offsetY]을 반환합니다.

##### Returns

\[`number`, `number`\]

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`jitterOffset`](../namespaces/CoreView/classes/AView.md#jitteroffset)

***

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`name`](../namespaces/CoreView/classes/AView.md#name)

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:263](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L263)

지터(Jitter)가 배제된 상태의 원본 프로젝션 행렬을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`noneJitterProjectionMatrix`](../namespaces/CoreView/classes/AView.md#nonejitterprojectionmatrix)

***

### pickingManager

#### Get Signature

> **get** **pickingManager**(): [`PickingManager`](../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:133](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L133)

마우스 좌표 기반 객체 선택을 위한 PickingManager를 반환합니다.

##### Returns

[`PickingManager`](../../Picking/classes/PickingManager.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pickingManager`](../namespaces/CoreView/classes/AView.md#pickingmanager)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L198)

픽셀 단위의 사각형 배열을 반환합니다. ([x, y, width, height])

##### Returns

\[`number`, `number`, `number`, `number`\]

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectArray`](../namespaces/CoreView/classes/AView.md#pixelrectarray)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L206)

픽셀 단위의 사각형을 객체 형태로 반환합니다. ({ x, y, width, height })

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:211](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L211) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:210](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L210) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L208) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:209](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L209) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`pixelRectObject`](../namespaces/CoreView/classes/AView.md#pixelrectobject)

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:308](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L308)

지터 오프셋이 반영된 최종 프로젝션 행렬을 반환합니다. (TAA 기동 시 PerspectiveCamera에 한해 적용됨)

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`projectionMatrix`](../namespaces/CoreView/classes/AView.md#projectionmatrix)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:255](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L255)

내부적으로 참조하는 실제 카메라 인스턴스를 반환합니다. (AController가 연동된 경우 제어 대상 내부 카메라 반환)

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`rawCamera`](../namespaces/CoreView/classes/AView.md#rawcamera)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`redGPUContext`](../namespaces/CoreView/classes/AView.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`resourceManager`](../namespaces/CoreView/classes/AView.md#resourcemanager)

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](Scene.md)

Defined in: [src/display/view/core/AView.ts:110](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L110)

현재 뷰에 연결된 Scene 객체를 반환합니다.

##### Returns

[`Scene`](Scene.md)

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:124](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L124)

뷰에 Scene을 설정합니다.

##### Throws

Scene 인스턴스가 아닌 경우 에러 발생

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Scene`](Scene.md) | Scene 인스턴스

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`scene`](../namespaces/CoreView/classes/AView.md#scene)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L219)

스크린 해상도(DPI)가 고려된 스크린 기준 사각형 객체를 반환합니다. (devicePixelRatio로 나눈 값)

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:224](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L224) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:223](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L223) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L221) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:222](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L222) |

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenRectObject`](../namespaces/CoreView/classes/AView.md#screenrectobject)

***

### taa

#### Get Signature

> **get** **taa**(): [`TAA`](../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:271](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L271)

TAA 후처리 효과 객체를 반환합니다.

##### Returns

[`TAA`](../../Antialiasing/classes/TAA.md)

TAA 인스턴스

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`taa`](../namespaces/CoreView/classes/AView.md#taa)

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L160)

거리 기반 Culling 사용 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:171](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L171)

거리 기반 Culling 사용 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 사용 여부

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useDistanceCulling`](../namespaces/CoreView/classes/AView.md#usedistanceculling)

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:141](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L141)

Frustum Culling 사용 여부를 반환합니다.

##### Returns

`boolean`

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:152](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L152)

Frustum Culling 사용 여부를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 사용 여부

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`useFrustumCulling`](../namespaces/CoreView/classes/AView.md#usefrustumculling)

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

[`AView`](../namespaces/CoreView/classes/AView.md).[`uuid`](../namespaces/CoreView/classes/AView.md#uuid)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:160](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L160)

뷰의 너비 값을 반환합니다. (픽셀 또는 퍼센트 문자열)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:171](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L171)

뷰의 너비를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 설정할 너비 값

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`width`](../namespaces/CoreView/classes/AView.md#width)

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L122)

뷰의 X 위치 값을 반환합니다. (픽셀 또는 퍼센트 문자열)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L133)

뷰의 X 위치를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 설정할 X 위치 값

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`x`](../namespaces/CoreView/classes/AView.md#x)

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:141](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L141)

뷰의 Y 위치 값을 반환합니다. (픽셀 또는 퍼센트 문자열)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:152](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L152)

뷰의 Y 위치를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | 설정할 Y 위치 값

##### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`y`](../namespaces/CoreView/classes/AView.md#y)

## Methods

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:305](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L305)

마우스 포인터가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.

#### Returns

`boolean`

마우스가 뷰 영역 안에 있으면 true, 그렇지 않으면 false

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`checkMouseInViewBounds`](../namespaces/CoreView/classes/AView.md#checkmouseinviewbounds)

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:361](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L361)

지터 오프셋을 0으로 지우고 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`clearJitterOffset`](../namespaces/CoreView/classes/AView.md#clearjitteroffset)

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:291](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/AView.ts#L291)

화면 좌표를 월드 좌표로 변환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표
| `screenY` | `number` | 화면 Y 좌표

#### Returns

`number`[]

변환된 월드 좌표 (3D 벡터 배열)

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`screenToWorld`](../namespaces/CoreView/classes/AView.md#screentoworld)

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:352](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L352)

TAA 계산을 위한 렌더 픽셀 지터 오프셋을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X축 지터 오프셋 값
| `offsetY` | `number` | Y축 지터 오프셋 값

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setJitterOffset`](../namespaces/CoreView/classes/AView.md#setjitteroffset)

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:376](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L376)

뷰의 위치(X, Y)를 지정하고 스크린 해상도를 고려해 물리 픽셀 사각형 정보를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `string` \| `number` | 설정할 X 위치 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 X 위치)
| `y` | `string` \| `number` | 설정할 Y 위치 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 Y 위치)

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setPosition`](../namespaces/CoreView/classes/AView.md#setposition)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:399](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/view/core/ViewTransform.ts#L399)

뷰의 크기(너비, 높이)를 지정하고 내부 물리 픽셀 사각형 정보를 갱신합니다. onResize 콜백이 지정되어 있다면 호출합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | 설정할 너비 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 너비)
| `h` | `string` \| `number` | 설정할 높이 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 높이)

#### Returns

`void`

#### Inherited from

[`AView`](../namespaces/CoreView/classes/AView.md).[`setSize`](../namespaces/CoreView/classes/AView.md#setsize)

***


</details>
