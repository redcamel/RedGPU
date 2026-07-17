[**RedGPU API v4.3.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / SystemUniformUpdater

# Class: SystemUniformUpdater

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:22](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L22)

시스템 유니폼 데이터를 업데이트하는 유틸리티 클래스입니다.

카메라, 조명, 그림자 등 시스템 전역에서 공통으로 사용되는 WGSL 구조체 데이터를 Float32Array/Uint32Array 버퍼에 매핑합니다.

## Constructors

### Constructor

> **new SystemUniformUpdater**(): `SystemUniformUpdater`

#### Returns

`SystemUniformUpdater`

## Methods

### updateAmbientLight()

> `static` **updateAmbientLight**(`ambientLight`, `ambientLightMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:392](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L392)

환경광(AmbientLight) 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ambientLight` | [`AmbientLight`](../namespaces/Light/classes/AmbientLight.md) | 업데이트할 환경광 인스턴스
| `ambientLightMembers` | `any` | WGSL 환경광 구조체 멤버 정보
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`

***

### updateCamera()

> `static` **updateCamera**(`camera`, `cameraMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:40](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L40)

카메라 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `camera` | [`Camera2D`](../namespaces/Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../namespaces/Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../namespaces/Camera/classes/OrthographicCamera.md) | 업데이트할 카메라 인스턴스
| `cameraMembers` | `any` | WGSL 카메라 구조체 멤버 정보
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`

***

### updateDirectionalLights()

> `static` **updateDirectionalLights**(`directionalLights`, `directionalLightsMemberList`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:347](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L347)

직사광(DirectionalLight) 배열 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `directionalLights` | [`DirectionalLight`](../namespaces/Light/classes/DirectionalLight.md)[] | 업데이트할 직사광 배열
| `directionalLightsMemberList` | `any` | WGSL 직사광 구조체 배열 멤버 리스트
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`

***

### updateProjection()

> `static` **updateProjection**(`projectionInfo`, `projectionMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:281](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L281)

투영 관련 행렬 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `projectionInfo` | \{ `inverseProjectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `inverseProjectionViewMatrix?`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `noneJitterProjectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `noneJitterProjectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `prevNoneJitterProjectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `projectionMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); `projectionViewMatrix`: [`mat4`](../namespaces/Math/type-aliases/mat4.md); \} | 투영 행렬 정보 객체
| `projectionInfo.inverseProjectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.inverseProjectionViewMatrix?` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.noneJitterProjectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.noneJitterProjectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.prevNoneJitterProjectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.projectionMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionInfo.projectionViewMatrix` | [`mat4`](../namespaces/Math/type-aliases/mat4.md) | - |
| `projectionMembers` | `any` | WGSL 투영 구조체 멤버 정보
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`

***

### updateShadow()

> `static` **updateShadow**(`shadowManager`, `shadowMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:117](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L117)

그림자 설정 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `shadowManager` | `any` | 쉐도우 매니저 인스턴스
| `shadowMembers` | `any` | WGSL 그림자 구조체 멤버 정보
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`

***

### updateSkyAtmosphere()

> `static` **updateSkyAtmosphere**(`skyAtmosphere`, `systemMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:163](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L163)

대기 산란(SkyAtmosphere) 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `skyAtmosphere` | [`SkyAtmosphere`](../namespaces/Display/classes/SkyAtmosphere.md) | 대기 산란 인스턴스
| `systemMembers` | `any` | - |
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`

***

### updateTime()

> `static` **updateTime**(`timeInfo`, `timeMembers`, `uniformDataF32`, `uniformDataU32`): `void`

Defined in: [src/renderer/helperFunc/SystemUniformUpdater.ts:230](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/renderer/helperFunc/SystemUniformUpdater.ts#L230)

시간 관련 정보를 유니폼 데이터에 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `timeInfo` | [`RenderViewStateData`](../namespaces/Display/namespaces/CoreView/classes/RenderViewStateData.md) \| \{ `deltaTime`: `number`; `frameIndex`: `number`; `sinTime`: `number`; `time`: `number`; \} | 시간 정보 객체
| `timeMembers` | `any` | WGSL 시간 구조체 멤버 정보
| `uniformDataF32` | `Float32Array` | 대상 Float32Array 버퍼
| `uniformDataU32` | `Uint32Array` | 대상 Uint32Array 버퍼

#### Returns

`void`
