[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyBox

# Class: SkyBox

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:71](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L71)

3D 씬의 배경으로 사용되는 스카이박스 클래스입니다.


큐브 텍스처를 사용하여 360도 환경을 렌더링하며, 텍스처 간 부드러운 전환 효과와 블러, 노출, 투명도 조절 기능을 제공합니다.


일반적인 6장 이미지 큐브맵(`CubeTexture`)과 HDR 파일로부터 변환된 IBL 큐브맵(`IBLCubeTexture`)을 모두 지원합니다.


::: info
HDR(.hdr) 파일을 사용하려는 경우, `RedGPU.Resource.IBL`을 통해 큐브맵으로 변환된 `environmentTexture`를 전달해야 합니다.

:::

### Example
```typescript
// 1. 일반 큐브 텍스처 사용 (Using regular CubeTexture)
const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);

// 2. HDR 파일을 IBL을 통해 사용 (Using HDR file via IBL)
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'assets/env.hdr');
const skyboxHDR = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

view.skybox = skybox;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skybox/skybox/"></iframe>

## See

 - 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.

 - [Skybox using HDRTexture](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 - [Skybox using IBL](https://redcamel.github.io/RedGPU/examples/3d/skybox/skyboxWithIbl/)

## Constructors

### Constructor

> **new SkyBox**(`redGPUContext`, `cubeTexture`): `SkyBox`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:156](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L156)

새로운 SkyBox 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 렌더링 컨텍스트
| `cubeTexture` | [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | 스카이박스에 사용할 큐브 텍스처 (일반 또는 IBL)

#### Returns

`SkyBox`

#### Throws

redGPUContext가 유효하지 않은 경우 Error 발생


## Properties

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:81](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L81)

GPU 렌더링 정보 객체


***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:76](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L76)

모델 변환 행렬 (4x4 매트릭스)


## Accessors

### blur

#### Get Signature

> **get** **blur**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:196](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L196)

스카이박스 블러 정도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **blur**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:210](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L210)

스카이박스 블러 정도를 설정합니다.


##### Throws

값이 범위를 벗어나는 경우 Error 발생


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

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:220](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L220)

스카이박스의 불투명도를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:234](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L234)

스카이박스의 불투명도를 설정합니다.


##### Throws

값이 범위를 벗어나는 경우 Error 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 0.0에서 1.0 사이의 불투명도 값

##### Returns

`void`

***

### skyboxTexture

#### Get Signature

> **get** **skyboxTexture**(): [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:243](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L243)

현재 스카이박스 텍스처를 반환합니다.


##### Returns

[`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

#### Set Signature

> **set** **skyboxTexture**(`texture`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:257](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L257)

스카이박스 텍스처를 설정합니다.


##### Throws

텍스처가 유효하지 않은 경우 Error 발생


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `texture` | [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | 새로운 큐브 텍스처 (일반 또는 IBL)

##### Returns

`void`

***

### transitionDuration

#### Get Signature

> **get** **transitionDuration**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:172](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L172)

전환 지속 시간을 반환합니다. (ms)


##### Returns

`number`

***

### transitionElapsed

#### Get Signature

> **get** **transitionElapsed**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:180](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L180)

전환 경과 시간을 반환합니다. (ms)


##### Returns

`number`

***

### transitionProgress

#### Get Signature

> **get** **transitionProgress**(): `number`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:188](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L188)

현재 진행 중인 전환 진행률을 반환합니다. (0.0 ~ 1.0)


##### Returns

`number`

***

### transitionTexture

#### Get Signature

> **get** **transitionTexture**(): [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:270](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L270)

전환 대상 텍스처를 반환합니다.


##### Returns

[`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md)

## Methods

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:316](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L316)

스카이박스를 렌더링합니다.


이 메서드는 매 프레임마다 호출되어야 하며, MSAA 상태, 텍스처 전환 진행 상황 업데이트 및 실제 렌더링 명령 실행을 수행합니다.


### Example
```typescript
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

Defined in: [src/display/skyboxs/skyBox/SkyBox.ts:293](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/display/skyboxs/skyBox/SkyBox.ts#L293)

다른 텍스처로의 부드러운 전환을 시작합니다.


### Example
```typescript
// 1초 동안 새 텍스처로 전환
skybox.transition(newTexture, 1000, noiseTexture);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `transitionTexture` | [`IBLCubeTexture`](../../Resource/namespaces/CoreIBL/classes/IBLCubeTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) | `undefined` | 전환할 대상 큐브 텍스처 (일반 또는 IBL)
| `duration` | `number` | `300` | 전환 지속 시간 (밀리초, 기본값: 300)
| `transitionAlphaTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) | `undefined` | 전환 효과에 사용할 알파 노이즈 텍스처

#### Returns

`void`
