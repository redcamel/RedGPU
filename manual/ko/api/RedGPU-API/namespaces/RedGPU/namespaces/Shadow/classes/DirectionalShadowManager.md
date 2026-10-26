[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / DirectionalShadowManager

# Class: DirectionalShadowManager

Defined in: [src/shadow/DirectionalShadowManager.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L46)

직사광(Directional Light)의 CSM (Cascaded Shadow Maps) 뎁스 텍스처 배열과 관련 설정을 총괄 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 올바른 접근 방법
const directionalShadowManager = view.directionalShadowManager;
```

## Constructors

### Constructor

> **new DirectionalShadowManager**(): `DirectionalShadowManager`

#### Returns

`DirectionalShadowManager`

## Accessors

### bias

#### Get Signature

> **get** **bias**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L175)

그림자 바이어스(Bias) 값을 반환합니다.

##### Returns

`number`

바이어스 값

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L162)

그림자 바이어스(Bias) 값을 설정합니다. (0.0 ~ 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 바이어스 값 |

##### Returns

`void`

***

### cascadeBoundingSpheres

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeBoundingSpheres**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L78)

각 캐스케이드의 월드 공간 외접구 정보 [center.x, center.y, center.z, radius] * 4 (길이 16 Float32Array)를 반환합니다.

##### Returns

`Float32Array`

***

### cascadeCount

#### Get Signature

> **get** **cascadeCount**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:212](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L212)

CSM(Cascaded Shadow Maps)의 캐스케이드 분할 수(1 ~ 4, 기본값: 3)를 반환합니다.

##### Returns

`number`

캐스케이드 개수

#### Set Signature

> **set** **cascadeCount**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L245)

CSM(Cascaded Shadow Maps)의 캐스케이드 분할 수(1 ~ 4)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 캐스케이드 개수 (1 ~ 4) |

##### Returns

`void`

***

### cascadeLightDistances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeLightDistances**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L86)

각 캐스케이드 중심으로부터 광원 역방향(-lightDir)으로 설정된 실제 직교 광원 거리 배열(길이 4 Float32Array)을 반환합니다.

##### Returns

`Float32Array`

***

### cascadeProjectionViewMatrices

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeProjectionViewMatrices**(): [`mat4`](../../Math/type-aliases/mat4.md)[]

Defined in: [src/shadow/DirectionalShadowManager.ts:270](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L270)

각 캐스케이드의 투영-뷰(Projection-View) 행렬 배열(길이 4)을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)[]

투영-뷰 행렬 배열

***

### cascadeSplitDepths

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeSplitDepths**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L258)

각 캐스케이드의 분할 깊이(Split Depth) 배열(길이 4)을 반환합니다.

##### Returns

`Float32Array`

분할 깊이 Float32Array

***

### casterBoundingCenter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **casterBoundingCenter**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L94)

캐스터들의 그림자 유효 영역 중심 좌표(vec3)를 반환합니다.

##### Returns

`Float32Array`

***

### casterBoundingRadiusSq

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **casterBoundingRadiusSq**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L102)

캐스터들의 그림자 유효 영역 반경 제곱값을 반환합니다. (0.0: 캐스터 없음, <0.0: 전역 캐스터 존재로 가드 우회, >0.0: 유효 반경 제곱)

##### Returns

`number`

***

### castingList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/shadow/DirectionalShadowManager.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L126)

그림자를 생성할 대상 객체 리스트를 반환합니다.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

섀도우 캐스팅 대상 배열

***

### maxShadowDistance

#### Get Signature

> **get** **maxShadowDistance**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:220](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L220)

직사광 그림자가 도달할 수 있는 최대 가시거리(언리얼 엔진 표준 기본값: 200m)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **maxShadowDistance**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:232](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L232)

직사광 그림자가 도달할 수 있는 최대 가시거리(기본값: 200m)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최대 그림자 가시거리 (m) |

##### Returns

`void`

***

### shadowDepthTextureSize

#### Get Signature

> **get** **shadowDepthTextureSize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:282](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L282)

섀도우 뎁스 텍스처의 크기(해상도, 기본값: 2048)를 반환합니다.

##### Returns

`number`

해상도 값

#### Set Signature

> **set** **shadowDepthTextureSize**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:294](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L294)

섀도우 뎁스 텍스처의 크기(해상도, 기본값: 2048)를 설정합니다. (정수)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 해상도 값 (기본값: 2048) |

##### Returns

`void`

***

### shadowDepthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDepthTextureView**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L138)

전체 2D Texture Array 형태의 섀도우 뎁스 텍스처 뷰를 반환합니다. (메인 렌더링 셰이더 바인딩용)

##### Returns

`GPUTextureView`

2D Array 섀도우 뎁스 GPUTextureView

***

### shadowDepthTextureViewEmpty

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDepthTextureViewEmpty**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L150)

그림자가 없는 상태를 위한 빈(1x1x4) 2D Array 뎁스 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 뎁스 GPUTextureView

***

### strength

#### Get Signature

> **get** **strength**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:200](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L200)

그림자의 세기(Strength) 값을 반환합니다.

##### Returns

`number`

세기 값 (0.0 ~ 1.0)

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L187)

그림자의 세기(Strength) 값을 설정합니다. (0.0 ~ 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 세기 값 |

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L114)

현재 섀도우 맵이 사용하는 비디오 메모리 크기(Bytes)를 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (Bytes)

## Methods

### calculateCSMMatrices()

> **calculateCSMMatrices**(`view`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:331](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L331)

Auto-CSM 물리 기반 텍셀 밀도 역산 모델 및 절두체 8정점 완전 포섭 대칭 외접구(Symmetric Bounding Sphere)
     알고리즘을 적용하여 CSM 행렬과 분할 깊이를 직접(In-Place) 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 View3D |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:483](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L483)

사용 중인 GPU 리소스를 해제합니다.

#### Returns

`void`

***

### getCascadeLayerView()

> **getCascadeLayerView**(`index`): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:310](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L310)

특정 캐스케이드 레이어의 단일 2D 뎁스 텍스처 뷰를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 캐스케이드 인덱스 (0 ~ 3) |

#### Returns

`GPUTextureView`

해당 레이어의 2D GPUTextureView

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:318](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L318)

섀도우 캐스팅 대상 리스트를 초기화합니다.

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `boolean`

Defined in: [src/shadow/DirectionalShadowManager.ts:508](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/DirectionalShadowManager.ts#L508)

내부 상태를 업데이트합니다. (주로 해상도 변경 체크)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`boolean`
