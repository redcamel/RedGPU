[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / RenderViewStateData

# Class: RenderViewStateData

Defined in: [src/display/view/core/RenderViewStateData.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L59)

3D 뷰의 프레임별 렌더링 상태, 컬링 정보 및 성능 통계를 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// View3D 인스턴스를 통해 접근
const renderViewStateData = view.renderViewStateData;
```

## Constructors

### Constructor

> **new RenderViewStateData**(`view`): `RenderViewStateData`

Defined in: [src/display/view/core/RenderViewStateData.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L279)

RenderViewStateData 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 상태 데이터가 연결될 View3D 인스턴스 |

#### Returns

`RenderViewStateData`

## Properties

### activeCascadeCount

> **activeCascadeCount**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L223)

현재 활성화된 캐스케이드 수 (`0` ~ `4`)

***

### animationList

> **animationList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L253)

프레임 내 처리할 애니메이션 목록

***

### cascadeShadowFrustumPlanesByCascade

> <span class="readonly-badge">readonly</span> **cascadeShadowFrustumPlanesByCascade**: `Float32Array`\<`ArrayBufferLike`\>[]

Defined in: [src/display/view/core/RenderViewStateData.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L208)

캐스케이드별 24-float 서브어레이 뷰 캐시 배열

***

### cascadeShadowFrustumPlanesFlat

> <span class="readonly-badge">readonly</span> **cascadeShadowFrustumPlanesFlat**: `Float32Array`

Defined in: [src/display/view/core/RenderViewStateData.ts:203](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L203)

4개 캐스케이드 통합 1차원 평탄 섀도우 프러스텀 평면 버퍼 (`Float32Array(96)`)

***

### cascadeSplitDepths

> <span class="readonly-badge">readonly</span> **cascadeSplitDepths**: `Float32Array`

Defined in: [src/display/view/core/RenderViewStateData.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L218)

캐스케이드별 최대 분할 깊이 배열

***

### commandBatchStats

> **commandBatchStats**: [`CommandBatchStats`](../../../../CommandEncoderManager/interfaces/CommandBatchStats.md) = `null`

Defined in: [src/display/view/core/RenderViewStateData.ts:264](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L264)

커맨드 배치 실행 통계 정보

***

### cullingDistanceSquared

> **cullingDistanceSquared**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L69)

거리 컬링 계산에 사용되는 임계 거리의 제곱값

***

### currentRenderPassEncoder

> **currentRenderPassEncoder**: `GPURenderPassEncoder`

Defined in: [src/display/view/core/RenderViewStateData.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L187)

현재 활성화된 GPU 렌더 패스 인코더

***

### deltaTime

> **deltaTime**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L146)

프레임 간 경과 시간 (초)

***

### dirtyVertexUniformFromMaterial

> **dirtyVertexUniformFromMaterial**: `object` = `{}`

Defined in: [src/display/view/core/RenderViewStateData.ts:228](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L228)

재질로부터 변경된 버텍스 유니폼 상태 맵

***

### distanceCulling

> **distanceCulling**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L74)

객체 컬링을 위한 거리 임계값

***

### elapsed

> **elapsed**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L109)

이전 프레임으로부터 경과된 시간 (ms)

***

### fixedStepDeltaTime

> **fixedStepDeltaTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L161)

고정 타임스텝 간격 (초)

***

### frameIndex

> **frameIndex**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L119)

현재 누적 렌더링 프레임 인덱스

***

### frustumPlanes

> **frustumPlanes**: `number`[][]

Defined in: [src/display/view/core/RenderViewStateData.ts:193](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L193)

프러스텀 컬링용 6개 평면 배열

***

### frustumPlanesFlat

> <span class="readonly-badge">readonly</span> **frustumPlanesFlat**: `Float32Array`

Defined in: [src/display/view/core/RenderViewStateData.ts:198](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L198)

GPU 업로드 및 고속 컬링용 1차원 평탄 프러스텀 평면 버퍼 (`Float32Array(24)`)

***

### interleavedCullingInfo

> **interleavedCullingInfo**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L124)

인터리빙(분산) 컬링 처리를 위한 카메라 및 뷰포트 상태 추적 정보

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

Defined in: [src/display/view/core/RenderViewStateData.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L259)

현재 씬이 2D 카메라 모드인지 여부

***

### numFixedSteps

> **numFixedSteps**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:156](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L156)

현재 프레임에 실행할 고정 타임스텝 업데이트 횟수

***

### prevTimestamp

> **prevTimestamp**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L104)

이전 물리 스텝 기준 타임스탬프 (ms)

***

### renderBundleResults

> **renderBundleResults**: `object`

Defined in: [src/display/view/core/RenderViewStateData.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L236)

렌더링 레이어별 렌더 번들 목록

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

Defined in: [src/display/view/core/RenderViewStateData.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L80)

현재 프레임의 렌더링 통계 결과

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

Defined in: [src/display/view/core/RenderViewStateData.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L151)

`Math.sin(time)` 계산값

***

### skinList

> **skinList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:248](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L248)

프레임 내 처리할 스킨 메시 목록

***

### swapBufferIndex

> **swapBufferIndex**: `number` = `1`

Defined in: [src/display/view/core/RenderViewStateData.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L177)

더블 버퍼링용 스왑 버퍼 인덱스 (`0` 또는 `1`)

***

### time

> **time**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:141](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L141)

현재 프레임의 누적 시간 (초)

***

### timestamp

> **timestamp**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L99)

현재 프레임의 타임스탬프 (ms)

***

### useDistanceCulling

> **useDistanceCulling**: `boolean`

Defined in: [src/display/view/core/RenderViewStateData.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L64)

거리 기반 컬링 활성화 여부

***

### usedVideoMemory

> **usedVideoMemory**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L182)

뷰 관련 렌더 텍스처가 사용 중인 총 비디오 메모리 크기 (바이트)

***

### view

> <span class="readonly-badge">readonly</span> **view**: [`View3D`](../../../classes/View3D.md)

Defined in: [src/display/view/core/RenderViewStateData.ts:269](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L269)

연결된 View3D 인스턴스

***

### viewIndex

> **viewIndex**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L172)

컨텍스트 내 뷰 인덱스

***

### viewportSize

> **viewportSize**: `ViewportSize`

Defined in: [src/display/view/core/RenderViewStateData.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L167)

현재 뷰포트 크기 및 위치 정보

***

### viewRenderCPURecordingTime

> **viewRenderCPURecordingTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L114)

뷰 렌더링 CPU 기록에 소요된 시간 (ms)

***

### viewRenderStartTime

> **viewRenderStartTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L94)

뷰 렌더링 시작 시점의 성능 타임스탬프 (ms)

## Methods

### reset()

> **reset**(): `void`

Defined in: [src/display/view/core/RenderViewStateData.ts:291](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/RenderViewStateData.ts#L291)

새 프레임 렌더링을 위해 통계 카운터, 레이어 번들 목록, 시간 및 컬링 상태를 초기화합니다.

#### Returns

`void`

#### Throws

연결된 뷰나 필수 렌더 텍스처가 유효하지 않거나 비디오 메모리 크기 계산에 실패한 경우 에러가 발생합니다.
