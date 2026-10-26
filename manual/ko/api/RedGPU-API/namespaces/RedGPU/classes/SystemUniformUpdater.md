[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / SystemUniformUpdater

# Class: SystemUniformUpdater

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L21)

카메라, 조명, 그림자, 대기 산란, 바람 등 시스템 전역 WGSL 유니폼 구조체 데이터를 `Float32Array`/`Uint32Array` 버퍼에 업데이트하는 유틸리티 클래스입니다.

## Constructors

### Constructor

> **new SystemUniformUpdater**(): `SystemUniformUpdater`

#### Returns

`SystemUniformUpdater`

## Methods

### updateAmbientLight()

> `static` **updateAmbientLight**(`ambientLight`, `ambientLightMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:431](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L431)

환경광(`AmbientLight`) 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ambientLight` | [`AmbientLight`](../namespaces/Light/classes/AmbientLight.md) | 업데이트할 환경광 인스턴스 (`AmbientLight`) |
| `ambientLightMembers` | `any` | WGSL 환경광 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateCamera()

> `static` **updateCamera**(`camera`, `cameraMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L39)

카메라 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `camera` | [`Camera2D`](../namespaces/Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../namespaces/Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../namespaces/Camera/classes/OrthographicCamera.md) | 업데이트할 카메라 인스턴스 |
| `cameraMembers` | `any` | WGSL 카메라 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateDirectionalLights()

> `static` **updateDirectionalLights**(`directionalLights`, `directionalLightsMemberList`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:386](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L386)

직사광(`DirectionalLight`) 배열 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `directionalLights` | [`DirectionalLight`](../namespaces/Light/classes/DirectionalLight.md)[] | 업데이트할 직사광 배열 (`DirectionalLight[]`) |
| `directionalLightsMemberList` | `any` | WGSL 직사광 구조체 배열 멤버 리스트 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateProjection()

> `static` **updateProjection**(`projectionInfo`, `projectionMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:320](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L320)

투영 및 뷰-투영 행렬 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionInfo` | \{ `inverseProjectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `inverseProjectionViewMatrix?`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `noneJitterProjectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `noneJitterProjectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `prevNoneJitterProjectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `projectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `projectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); \} | 투영 행렬 정보 객체 |
| `projectionInfo.inverseProjectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.inverseProjectionViewMatrix?` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.noneJitterProjectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.noneJitterProjectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.prevNoneJitterProjectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.projectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.projectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionMembers` | `any` | WGSL 투영 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateShadow()

> `static` **updateShadow**(`shadowManager`, `shadowMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L116)

그림자 설정 및 캐스케이드 행렬 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shadowManager` | `any` | 섀도우 매니저 인스턴스 |
| `shadowMembers` | `any` | WGSL 그림자 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateSkyAtmosphere()

> `static` **updateSkyAtmosphere**(`skyAtmosphere`, `systemMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L206)

대기 산란(`SkyAtmosphere`) 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `skyAtmosphere` | [`SkyAtmosphere`](../namespaces/Display/classes/SkyAtmosphere.md) | `SkyAtmosphere` 인스턴스 |
| `systemMembers` | `any` | WGSL 시스템 유니폼 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateTime()

> `static` **updateTime**(`timeInfo`, `timeMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L269)

시간 및 프레임 관련 정보를 시스템 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timeInfo` | [`RenderViewStateData`](../namespaces/Display/namespaces/CoreView/classes/RenderViewStateData.md) \| \{ `deltaTime`: `number`; `frameIndex`: `number`; `sinTime`: `number`; `time`: `number`; \} | 시간 정보 객체 또는 `RenderViewStateData` 인스턴스 |
| `timeMembers` | `any` | WGSL 시간 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`

***

### updateWind()

> `static` **updateWind**(`windManager`, `windMembersInfo`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:469](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/helperFunc/SystemUniformUpdater.ts#L469)

바람(`WindManager`) 환경 정보를 시스템 유니폼 버퍼에 직접 복사하여 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `windManager` | [`WindManager`](../namespaces/Wind/classes/WindManager.md) | 업데이트할 `WindManager` 인스턴스 |
| `windMembersInfo` | `any` | WGSL 바람 구조체 멤버 정보 |
| `uniformDataF32` | `Float32Array` | 대상 `Float32Array` 버퍼 |
| `uniformDataU32` | `Uint32Array` | 대상 `Uint32Array` 버퍼 |

#### Returns

`void`
