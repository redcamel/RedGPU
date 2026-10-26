[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / TAA

# Class: TAA

Defined in: [src/antialiasing/taa/TAA.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L34)

이전 프레임의 화면 정보와 픽셀 이동 경로(모션 벡터)를 활용해 고품질 안티앨리어싱을 수행하는 TAA(Temporal Anti-Aliasing) 클래스입니다.

물체 외곽선의 계단 현상은 물론, 빛 반사(하이라이트)가 깜빡이거나 얇은 선이 끊어져 보이는 현상까지 자연스럽게 잡아주며, 내장된 샤프닝(CAS) 처리로 원본의 선명함을 유지합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// TAA 활성화 및 뷰별 TAA 샤프닝 강도 설정
redGPUContext.antialiasingManager.useTAA = true;
view.taa.sharpness = 0.5;
```

## Extends

- [`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md)

## Constructors



***

### Constructor

> **new TAA**(`redGPUContext`): `TAA`

Defined in: [src/antialiasing/taa/TAA.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L74)

`TAA` 인스턴스 및 내부 `TAACASPass`를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`TAA`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`constructor`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#constructor)

## Properties



## Accessors



***

### casPass

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **casPass**(): `TAACASPass`

Defined in: [src/antialiasing/taa/TAA.ts:159](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L159)

TAA의 시간적 블렌딩 블러를 보완하는 내장 `TAACASPass` 인스턴스를 반환합니다.

##### Returns

`TAACASPass`

내장 `TAACASPass` 인스턴스

***

***

### frameIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frameIndex**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:183](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L183)

현재까지 누적된 TAA 렌더링 프레임 인덱스를 반환합니다.

##### Returns

`number`

누적 프레임 인덱스

***

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/antialiasing/taa/TAA.ts:171](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L171)

이전 프레임의 지터가 제거된 투영-뷰 행렬(`mat4`)을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

이전 프레임의 투영-뷰 행렬(`mat4`)

***

***

### sharpness

#### Get Signature

> **get** **sharpness**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L62)

TAA 후속 CAS(Contrast Adaptive Sharpening) 패스의 선명도 강도를 반환하거나 설정합니다. 허용 범위는 `0.0` ~ `1.0`이며 기본값은 `0.5`입니다.

#### Example
```typescript
// TAA 샤프닝 강도 조절
view.taa.sharpness = 0.6;
```

##### Returns

`number`

CAS 선명도 강도 (`0.0` ~ `1.0`)

#### Set Signature

> **set** **sharpness**(`value`): `void`

Defined in: [src/antialiasing/taa/TAA.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:195](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L195)

TAA 히스토리 텍스처, 유니폼 버퍼 및 CAS 패스가 점유 중인 총 비디오 메모리 크기(Byte)를 반환합니다.

##### Returns

`number`

점유 중인 총 비디오 메모리 크기 (Byte)

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`videoMemorySize`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#videomemorysize)

***

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:218](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L218)

할당된 핑퐁 히스토리 텍스처와 CAS 패스의 캐시 리소스를 모두 정리하고 초기 상태로 되돌립니다.

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`clear`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L241)

TAA 인스턴스와 내부 CAS 패스 및 모든 GPU 리소스를 영구 파기합니다.

#### Returns

`void`

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`destroy`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/antialiasing/taa/TAA.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L117)

현재 프레임의 소스 텍스처와 이전 프레임 히스토리를 결합하여 TAA 패스를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 렌더링 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더 타겟 너비 (픽셀 단위) |
| `height` | `number` | 렌더 타겟 높이 (픽셀 단위) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 입력 소스 텍스처 및 뷰 정보 |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

TAA가 적용된 출력 텍스처 결과(`IPostEffectResult`)

#### Overrides

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`render`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#render)

***

***

### reset()

> **reset**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/taa/TAA.ts#L210)

누적된 프레임 인덱스를 `0`으로 초기화하여 다음 프레임에서 이전 히스토리 블렌딩 없이 새로 수렴하도록 설정합니다.

#### Example
```typescript
// TAA 누적 히스토리 초기화
view.taa.reset();
```

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L19)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`isInstanceofPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`antialiasingManager`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#antialiasingmanager)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`commandEncoderManager`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#commandencodermanager)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`gpuDevice`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#gpudevice)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`instanceId`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L112)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`isLdr`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#isldr)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`name`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#name)

***

***

### outputTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **outputTextureView**(): `GPUTextureView`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L235)

현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

출력 `GPUTextureView`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`outputTextureView`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#outputtextureview)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`redGPUContext`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#redgpucontext)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`resourceManager`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L148)

현재 MSAA 상태에 대응하는 WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`shaderInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#shaderinfo)

***

***

### storageInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **storageInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L136)

파싱된 셰이더의 스토리지 바인딩 구조 정보를 반환합니다.

##### Returns

`any`

스토리지 바인딩 구조 정보

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`storageInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#storageinfo)

***

***

### systemUniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **systemUniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L184)

시스템 공용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

시스템 유니폼 구조체 정보

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`systemUniformsInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#systemuniformsinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L160)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformBuffer`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L172)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uniformsInfo`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uniformsinfo)

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

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`uuid`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#uuid)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:197](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L197)

컴퓨트 워크그룹 X축 크기를 반환합니다.

##### Returns

`number`

워크그룹 X 크기

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_X`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L210)

컴퓨트 워크그룹 Y축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Y 크기

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Y`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L223)

컴퓨트 워크그룹 Z축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Z 크기

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`WORK_SIZE_Z`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#work_size_z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### init()

> **init**(`redGPUContext`, `name`, `computeCodes`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:283](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L283)

MSAA/Non-MSAA 컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `name` | `string` | 이펙트 식별 이름 |
| `computeCodes` | \{ `msaa`: `string`; `nonMsaa`: `string`; \} | MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드 객체 |
| `computeCodes.msaa` | `string` | - |
| `computeCodes.nonMsaa` | `string` | - |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`init`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#init)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASinglePassPostEffect.ts:387](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/ASinglePassPostEffect.ts#L387)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

#### Inherited from

[`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md).[`updateUniform`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md#updateuniform)

</details>
