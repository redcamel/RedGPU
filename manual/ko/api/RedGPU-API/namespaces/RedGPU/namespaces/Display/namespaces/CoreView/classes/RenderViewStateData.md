[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / RenderViewStateData

# Class: RenderViewStateData

Defined in: [src/display/view/core/RenderViewStateData.ts:36](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L36)

3D 뷰의 렌더링 상태 데이터를 관리하고 추적하는 클래스입니다.


이 클래스는 렌더링 프로세스 중에 필요한 모든 상태 정보를 캡슐화합니다. 컬링 설정, 성능 메트릭, GPU 리소스, 레이어 관리 등을 포함합니다.


::: warning
이 클래스는 시스템 내부적으로 사용되는 데이터 구조체입니다.<br/>직접 인스턴스를 생성하여 사용하지 마십시오.

:::

## Constructors

### Constructor

> **new RenderViewStateData**(`view`): `RenderViewStateData`

Defined in: [src/display/view/core/RenderViewStateData.ts:107](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L107)

새로운 RenderViewStateData 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 이 상태 데이터가 연결될 View3D 인스턴스 |

#### Returns

`RenderViewStateData`

## Properties

### animationList

> **animationList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:87](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L87)

처리할 애니메이션 목록

***

### bundleListAlphaLayer

> **bundleListAlphaLayer**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:77](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L77)

알파 렌더링 레이어의 객체 배열

***

### bundleListBasicList

> **bundleListBasicList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:89](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L89)

효율적인 렌더링을 위한 렌더 번들 목록

***

### bundleListParticleLayer

> **bundleListParticleLayer**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:81](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L81)

파티클 렌더링 레이어의 객체 배열

***

### bundleListRender2PathLayer

> **bundleListRender2PathLayer**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:83](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L83)

2D 패스 렌더링 레이어의 객체 배열

***

### bundleListTransparentLayer

> **bundleListTransparentLayer**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:79](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L79)

투명 렌더링 레이어의 객체 배열

***

### cullingDistanceSquared

> **cullingDistanceSquared**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:40](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L40)

컬링 계산에 사용되는 거리의 제곱 값

***

### currentRenderPassEncoder

> **currentRenderPassEncoder**: `GPURenderPassEncoder`

Defined in: [src/display/view/core/RenderViewStateData.ts:66](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L66)

현재 사용 중인 GPU 렌더 패스 인코더

***

### dirtyVertexUniformFromMaterial

> **dirtyVertexUniformFromMaterial**: `object` = `{}`

Defined in: [src/display/view/core/RenderViewStateData.ts:75](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L75)

머티리얼로부터 변경된 버텍스 유니폼의 맵

***

### distanceCulling

> **distanceCulling**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:42](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L42)

객체를 컬링하기 위한 거리 임계값

***

### frustumPlanes

> **frustumPlanes**: `number`[][]

Defined in: [src/display/view/core/RenderViewStateData.ts:69](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L69)

컬링을 위한 프러스텀 평면 배열, 프러스텀 컬링이 비활성화된 경우 null

***

### isScene2DMode

> **isScene2DMode**: `boolean` = `false`

Defined in: [src/display/view/core/RenderViewStateData.ts:96](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L96)

씬이 2D 모드인지 여부

***

### needResetRenderLayer

> **needResetRenderLayer**: `boolean` = `false`

Defined in: [src/display/view/core/RenderViewStateData.ts:97](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L97)

***

### num3DGroups

> **num3DGroups**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:44](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L44)

현재 프레임에서 렌더링된 3D 그룹의 수

***

### num3DObjects

> **num3DObjects**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:46](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L46)

현재 프레임에서 렌더링된 3D 객체의 수

***

### numDirtyPipelines

> **numDirtyPipelines**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:50](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L50)

업데이트가 필요했던 더티 파이프라인의 수

***

### numDrawCalls

> **numDrawCalls**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:48](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L48)

현재 프레임에서 발행된 드로우 콜의 수

***

### numInstances

> **numInstances**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:52](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L52)

렌더링된 총 인스턴스 수

***

### numPoints

> **numPoints**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:56](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L56)

렌더링된 총 포인트 수

***

### numTriangles

> **numTriangles**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:54](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L54)

렌더링된 총 삼각형 수

***

### prevFragmentUniformBindGroup

> **prevFragmentUniformBindGroup**: `GPUBindGroup`

Defined in: [src/display/view/core/RenderViewStateData.ts:73](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L73)

최적화를 위해 이전에 사용한 프래그먼트 유니폼 바인드 그룹

***

### prevTimestamp

> **prevTimestamp**: `number` = `0`

Defined in: [src/display/view/core/RenderViewStateData.ts:93](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L93)

***

### prevVertexGpuBuffer

> **prevVertexGpuBuffer**: `GPUBuffer`

Defined in: [src/display/view/core/RenderViewStateData.ts:71](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L71)

최적화를 위해 이전에 사용한 버텍스 GPU 버퍼

***

### skinList

> **skinList**: `any`[] = `[]`

Defined in: [src/display/view/core/RenderViewStateData.ts:85](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L85)

처리할 스킨 메시 목록

***

### startTime

> **startTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:94](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L94)

***

### swapBufferIndex

> **swapBufferIndex**: `number` = `1`

Defined in: [src/display/view/core/RenderViewStateData.ts:62](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L62)

***

### timestamp

> **timestamp**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:92](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L92)

렌더링 프레임의 현재 타임스탬프

***

### useDistanceCulling

> **useDistanceCulling**: `boolean`

Defined in: [src/display/view/core/RenderViewStateData.ts:38](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L38)

이 뷰에 대해 거리 컬링이 활성화되어 있는지 여부

***

### usedVideoMemory

> **usedVideoMemory**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:64](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L64)

렌더 텍스처가 사용하는 비디오 메모리 양 (바이트)

***

### viewIndex

> **viewIndex**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:61](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L61)

***

### viewportSize

> **viewportSize**: `ViewportSize`

Defined in: [src/display/view/core/RenderViewStateData.ts:60](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L60)

현재 뷰포트 크기 및 위치 정보

***

### viewRenderTime

> **viewRenderTime**: `number`

Defined in: [src/display/view/core/RenderViewStateData.ts:58](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L58)

뷰 렌더링에 소요된 시간 (밀리초)

## Accessors

### view

#### Get Signature

> **get** **view**(): [`View3D`](../../../classes/View3D.md)

Defined in: [src/display/view/core/RenderViewStateData.ts:117](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L117)

연결된 View3D 인스턴스를 가져옵니다.

##### Returns

[`View3D`](../../../classes/View3D.md)

View3D 인스턴스

## Methods

### reset()

> **reset**(`viewRenderPassEncoder`, `time`): `void`

Defined in: [src/display/view/core/RenderViewStateData.ts:134](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/display/view/core/RenderViewStateData.ts#L134)

새로운 프레임을 위해 렌더 상태 데이터를 초기화합니다.

이 메서드는 모든 카운터를 초기화하고, 레이어 배열을 비우며,
현재 렌더링 패스를 위한 GPU 리소스를 설정합니다.
또한 비디오 메모리 사용량을 계산하고 뷰 설정에 따라 컬링 매개변수를 구성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `viewRenderPassEncoder` | `GPURenderPassEncoder` | 현재 프레임의 렌더 패스 인코더 |
| `time` | `number` | 프레임의 현재 타임스탬프 |

#### Returns

`void`

#### Throws

잘못된 매개변수가 제공되거나 필수 뷰 속성이 없는 경우

#### Throws

텍스처 크기 계산이 실패한 경우
