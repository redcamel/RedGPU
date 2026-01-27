[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:56](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L56)

3D 씬의 배경으로 사용되는 스카이박스 클래스입니다.


큐브 텍스처나 HDR 텍스처를 사용하여 360도 환경을 렌더링하며, 텍스처 간 부드러운 전환 효과와 블러, 노출, 투명도 조절 기능을 제공합니다.


* ### Example
```typescript
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
view.skybox = skybox
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/"></iframe>

## See

 - 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

 - [Skybox using HDRTexture](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 - [Skybox using IBL](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithIbl/)

## Constructors

### Constructor

> **new SkyBox**(`redGPUContext`, `cubeTexture`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:141](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L141)

새로운 SkyBox 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU 렌더링 컨텍스트
| `cubeTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | 스카이박스에 사용할 큐브 텍스처 또는 HDR 텍스처

#### Returns

`SkyBox`

#### Throws

redGPUContext가 유효하지 않은 경우 에러 발생


## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:66](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L66)

GPU 렌더링 정보 객체


***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:61](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L61)

모델 변환 행렬 (4x4 매트릭스)


## Accessors

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:193](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L193)

스카이박스 블러 정도를 반환합니다.


##### Returns

`number`

0.0에서 1.0 사이의 블러 값


#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:207](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L207)

스카이박스 블러 정도를 설정합니다.


##### Throws

값이 0.0-1.0 범위를 벗어나는 경우 에러 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 0.0에서 1.0 사이의 블러 값

##### Returns

`void`

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:220](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L220)

스카이박스의 불투명도를 반환합니다.


##### Returns

`number`

0.0에서 1.0 사이의 불투명도 값


#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:234](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L234)

스카이박스의 불투명도를 설정합니다.


##### Throws

값이 0.0-1.0 범위를 벗어나는 경우 에러 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 0.0에서 1.0 사이의 불투명도 값

##### Returns

`void`

***

### skyboxTexture

#### Get Signature

> **get** **skyboxTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:246](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L246)

현재 스카이박스 텍스처를 반환합니다.


##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)

현재 스카이박스 텍스처


#### Set Signature

> **set** **skyboxTexture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:260](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L260)

스카이박스 텍스처를 설정합니다.


##### Throws

텍스처가 유효하지 않은 경우 에러 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | 새로운 스카이박스 텍스처

##### Returns

`void`

***

### transitionDuration

#### Get Signature

> **get** **transitionDuration**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:160](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L160)

전환 지속 시간을 반환합니다.


##### Returns

`number`

전환 지속 시간 (밀리초)


***

### transitionElapsed

#### Get Signature

> **get** **transitionElapsed**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:171](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L171)

전환 경과 시간을 반환합니다.


##### Returns

`number`

전환 경과 시간 (밀리초)


***

### transitionProgress

#### Get Signature

> **get** **transitionProgress**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:182](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L182)

전환 진행률을 반환합니다.


##### Returns

`number`

0.0에서 1.0 사이의 전환 진행률


***

### transitionTexture

#### Get Signature

> **get** **transitionTexture**(): [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:276](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L276)

전환 대상 텍스처를 반환합니다.


##### Returns

[`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md)

전환 대상 텍스처 (전환 중이 아니면 undefined)


## Methods

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:323](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L323)

스카이박스를 렌더링합니다.


이 메서드는 매 프레임마다 호출되어야 하며, MSAA 상태, 텍스처 전환 진행 상황 업데이트 및 실제 렌더링 명령 실행을 수행합니다.


* ### Example
```typescript
// 렌더링 루프에서
skybox.render(renderViewState);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더링 상태 및 디버그 정보

#### Returns

`void`

***

### transition()

> **transition**(`transitionTexture`, `duration`, `transitionAlphaTexture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:299](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/skyboxs/skyBox/SkyBox.ts#L299)

다른 텍스처로의 부드러운 전환을 시작합니다.


* ### Example
```typescript
// 1초 동안 새 텍스처로 전환
skybox.transition(newTexture, 1000, noiseTexture);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `transitionTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | `undefined` | 전환할 대상 텍스처
| `duration` | `number` | `300` | 전환 지속 시간 (밀리초, 기본값: 300)
| `transitionAlphaTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | 전환 효과에 사용할 알파 노이즈 텍스처

#### Returns

`void`
