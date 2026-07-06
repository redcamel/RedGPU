[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / RenderViewStateData

# Class: RenderViewStateData

Defined in: [src/display/view/core/RenderViewStateData.ts:53](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L53)

3D 뷰의 렌더링 상태 데이터를 관리하고 추적하는 클래스입니다.

이 클래스는 렌더링 프로세스 중에 필요한 모든 상태 정보를 캡슐화합니다. 컬링 설정, 성능 메트릭, GPU 리소스, 레이어 관리 등을 포함합니다.

::: warning
이 클래스는 시스템 내부적으로 사용되는 데이터 구조체입니다.<br/>직접 인스턴스를 생성하여 사용하지 마십시오.
:::

## Constructors

### Constructor

> **new RenderViewStateData**(`view`): `RenderViewStateData`

Defined in: [src/display/view/core/RenderViewStateData.ts:244](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L244)

새로운 RenderViewStateData 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 이 상태 데이터가 연결될 View3D 인스턴스

#### Returns

`RenderViewStateData`

## Properties

### animationList

> **animationList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:217](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L217)

처리할 애니메이션 목록

***

### commandBatchStats

> **commandBatchStats**: [`CommandBatchStats`](../../../../CommandEncoderManager/interfaces/CommandBatchStats.md) = `null`

Defined in: [src/display/view/core/RenderViewStateData.ts:228](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L228)

커맨드 배치 통계 정보

***

### cullingDistanceSquared

> **cullingDistanceSquared**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:63](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L63)

컬링 계산에 사용되는 거리의 제곱 값

***

### currentRenderPassEncoder

> **currentRenderPassEncoder**: `GPURenderPassEncoder`

Defined in: [src/display/view/core/RenderViewStateData.ts:183](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L183)

현재 사용 중인 GPU 렌더 패스 인코더

***

### deltaTime

> **deltaTime**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:142](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L142)

프레임 간 경과 시간 (초)

***

### dirtyVertexUniformFromMaterial

> **dirtyVertexUniformFromMaterial**: `object` = `{}`

Defined in: [src/display/view/core/RenderViewStateData.ts:194](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L194)

머티리얼로부터 변경된 버텍스 유니폼의 맵

***

### distanceCulling

> **distanceCulling**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:68](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L68)

객체를 컬링하기 위한 거리 임계값

***

### elapsed

> **elapsed**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:105](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L105)

이전 프레임으로부터 경과된 시간 (ms)

***

### fixedStepDeltaTime

> **fixedStepDeltaTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:157](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L157)

고정 타임스텝의 간격 (초)

***

### frameIndex

> **frameIndex**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:115](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L115)

현재 프레임 인덱스 (누적 렌더링 횟수)

***

### frustumPlanes

> **frustumPlanes**: `number`[][]

Defined in: [src/display/view/core/RenderViewStateData.ts:189](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L189)

컬링을 위한 프러스텀 평면 배열

***

### interleavedCullingInfo

> **interleavedCullingInfo**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:120](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L120)

인터리빙(분산) 콸링 처리를 위한 카메라 및 뷰포트 상태 추적 정보 객체입니다.

#### forceCullingCheck

> **forceCullingCheck**: `boolean` = `false`

#### interleavedCullingCheckFrameIndex

> **interleavedCullingCheckFrameIndex**: `number` = `0`

#### prevCameraRotX

> **prevCameraRotX**: `number` = `0`

#### prevCameraRotY

> **prevCameraRotY**: `number` = `0`

#### prevCameraRotZ

> **prevCameraRotZ**: `number` = `0`

#### prevCameraX

> **prevCameraX**: `number` = `0`

#### prevCameraY

> **prevCameraY**: `number` = `0`

#### prevCameraZ

> **prevCameraZ**: `number` = `0`

#### prevViewportHeight

> **prevViewportHeight**: `number` = `0`

#### prevViewportWidth

> **prevViewportWidth**: `number` = `0`

#### projectionScale

> **projectionScale**: `number` = `0`

***

### isScene2DMode

> **isScene2DMode**: `boolean` = `false`

Defined in: [src/display/view/core/RenderViewStateData.ts:223](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L223)

씬이 2D 모드인지 여부

***

### numFixedSteps

> **numFixedSteps**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:152](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L152)

물리 엔진 등에 사용될 고정 타임스텝 업데이트가 필요한 횟수

***

### prevTimestamp

> **prevTimestamp**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:100](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L100)

이전 프레임의 타임스탬프 (ms)

***

### renderBundleResults

> **renderBundleResults**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:200](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L200)

렌더링 레이어별 번들 리스트 그룹

#### bundleListAlphaLayer

> **bundleListAlphaLayer**: `GPURenderBundle`[]

#### bundleListBasicList

> **bundleListBasicList**: `GPURenderBundle`[]

#### bundleListParticleLayer

> **bundleListParticleLayer**: `GPURenderBundle`[]

#### bundleListRender2PathLayer

> **bundleListRender2PathLayer**: `GPURenderBundle`[]

#### bundleListTransparentLayer

> **bundleListTransparentLayer**: `GPURenderBundle`[]

***

### renderResults

> **renderResults**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:75](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L75)

렌더링 통계 결과 데이터 그룹

#### num3DGroups

> **num3DGroups**: `number` = `0`

#### num3DObjects

> **num3DObjects**: `number` = `0`

#### numDirtyPipelines

> **numDirtyPipelines**: `number` = `0`

#### numDrawCalls

> **numDrawCalls**: `number` = `0`

#### numInstances

> **numInstances**: `number` = `0`

#### numPoints

> **numPoints**: `number` = `0`

#### numTriangles

> **numTriangles**: `number` = `0`

***

### sinTime

> **sinTime**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:147](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L147)

sin(time)의 계산된 값

***

### skinList

> **skinList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:212](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L212)

처리할 스킨 메시 목록

***

### swapBufferIndex

> **swapBufferIndex**: `number` = `1`

Defined in: [src/display/view/core/RenderViewStateData.ts:173](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L173)

더블 버퍼링용 스왑 버퍼 인덱스

***

### time

> **time**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:137](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L137)

현재 프레임의 절대 시간 (초)

***

### timestamp

> **timestamp**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:95](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L95)

렌더링 프레임의 현재 타임스탬프 (ms)

***

### useDistanceCulling

> **useDistanceCulling**: `boolean`

Defined in: [src/display/view/core/RenderViewStateData.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L58)

이 뷰에 대해 거리 컬링이 활성화되어 있는지 여부

***

### usedVideoMemory

> **usedVideoMemory**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:178](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L178)

렌더 텍스처가 사용하는 비디오 메모리 양 (바이트 단위)

***

### viewIndex

> **viewIndex**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:168](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L168)

뷰 인덱스

***

### viewportSize

> **viewportSize**: `ViewportSize`

Defined in: [src/display/view/core/RenderViewStateData.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L163)

현재 뷰포트 크기 및 위치 정보

***

### viewRenderCPURecordingTime

> **viewRenderCPURecordingTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:110](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L110)

뷰 렌더링 준비에 소요된 시간 (밀리초)

***

### viewRenderStartTime

> **viewRenderStartTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:90](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L90)

뷰 렌더링 시작을 표시하는 성능 타임스탬프 (ms)

## Accessors

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../../classes/View3D.md)

Defined in: [src/display/view/core/RenderViewStateData.ts:254](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L254)

연결된 View3D 인스턴스를 가져옵니다.

##### Returns

[`View3D`](../../../classes/View3D.md)

## Methods

### reset()

> **reset**(): `void`

Defined in: [src/display/view/core/RenderViewStateData.ts:269](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/view/core/RenderViewStateData.ts#L269)

새로운 프레임을 위해 렌더 상태 데이터를 초기화합니다.

이 메서드는 모든 카운터를 초기화하고, 레이어 배열을 비우며, 현재 렌더링 패스를 위한 GPU 리소스를 설정합니다. 또한 비디오 메모리 사용량을 계산하고 뷰 설정에 따라 컬링 매개변수를 구성합니다.

#### Returns

`void`

#### Throws

잘못된 매개변수가 제공되거나 필수 뷰 속성이 없는 경우, 혹은 텍스처 크기 계산이 실패한 경우 에러가 발생합니다.
