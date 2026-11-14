[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / TAA

# Class: TAA

Defined in: [src/antialiasing/taa/TAA.ts:34](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L34)

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

- [`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md)

## Constructors



***

### Constructor

> **new TAA**(`redGPUContext`): `TAA`

Defined in: [src/antialiasing/taa/TAA.ts:54](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L54)

`TAA` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`TAA`

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`constructor`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#constructor)

## Properties



## Accessors



***

### frameIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frameIndex**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:158](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L158)

현재까지 누적된 TAA 렌더링 프레임 인덱스를 반환합니다.

##### Returns

`number`

누적 프레임 인덱스

***

***

### prevNoneJitterProjectionViewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevNoneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/antialiasing/taa/TAA.ts:146](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L146)

이전 프레임의 지터가 제거된 투영-뷰 행렬(`mat4`)을 반환합니다.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

이전 프레임의 투영-뷰 행렬(`mat4`)

***

***

### sharpness

#### Get Signature

> **get** **sharpness**(): `number`

Defined in: [src/antialiasing/taa/TAA.ts:87](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L87)

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

Defined in: [src/antialiasing/taa/TAA.ts:91](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L91)

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

Defined in: [src/antialiasing/taa/TAA.ts:170](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L170)

TAA 히스토리 텍스처 및 유니폼 버퍼가 점유 중인 총 비디오 메모리 크기(Byte)를 반환합니다.

##### Returns

`number`

점유 중인 총 비디오 메모리 크기 (Byte)

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`videoMemorySize`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#videomemorysize)

***

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:193](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L193)

할당된 핑퐁 히스토리 텍스처와 캐시 리소스를 모두 정리하고 초기 상태로 되돌립니다.

#### Returns

`void`

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`clear`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:213](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L213)

TAA 인스턴스와 모든 GPU 리소스를 영구 파기합니다.

#### Returns

`void`

#### Overrides

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`destroy`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/antialiasing/taa/TAA.ts:116](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L116)

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

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`render`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#render)

***

***

### reset()

> **reset**(): `void`

Defined in: [src/antialiasing/taa/TAA.ts:185](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/antialiasing/taa/TAA.ts#L185)

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

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L19)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`isInstanceofPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`antialiasingManager`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`commandEncoderManager`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`gpuDevice`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`instanceId`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:102](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L102)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`isLdr`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#isldr)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`name`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`redGPUContext`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`resourceManager`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#resourcemanager)

***

***

### shaderInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shaderInfo**(): `any`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L126)

WGSL 셰이더 파싱 정보를 반환합니다.

##### Returns

`any`

WGSL 셰이더 파싱 정보

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`shaderInfo`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#shaderinfo)

***

***

### uniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:138](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L138)

이펙트 전용 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

`UniformBuffer` 인스턴스

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uniformBuffer`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#uniformbuffer)

***

***

### uniformsInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformsInfo**(): `any`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:150](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L150)

이펙트 전용 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uniformsInfo`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#uniformsinfo)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`uuid`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#uuid)

***

***

### WORK\_SIZE\_X

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_X**(): `number` = `16`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:163](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L163)

컴퓨트 워크그룹 X축 크기를 반환합니다.

##### Returns

`number`

워크그룹 X 크기

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_X`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_x)

***

***

### WORK\_SIZE\_Y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Y**(): `number` = `16`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:176](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L176)

컴퓨트 워크그룹 Y축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Y 크기

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Y`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_y)

***

***

### WORK\_SIZE\_Z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **WORK\_SIZE\_Z**(): `number` = `1`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:189](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L189)

컴퓨트 워크그룹 Z축 크기를 반환합니다.

##### Returns

`number`

워크그룹 Z 크기

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`WORK_SIZE_Z`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#work_size_z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### executePass()

> `protected` **executePass**(`view`, `width`, `height`, `result`, ...`sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:339](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L339)

지정된 출력 타겟(`result`)에 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `result` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 결과를 기록할 출력 텍스처 및 뷰 (`IPostEffectResult`) |
| ...`sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)[] | 입력 소스 텍스처 정보 목록 |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`executePass`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#executepass)

***

***

### init()

> **init**(`redGPUContext`, `name`, `computeCode`): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L236)

컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `name` | `string` | 이펙트 식별 이름 |
| `computeCode` | `string` | 컴퓨트 셰이더 WGSL 코드 문자열 |

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`init`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#init)

***

***

### updateUniform()

> **updateUniform**(`key`, `value`): `void`

Defined in: [src/postEffect/core/ASingleComputePassPostEffect.ts:309](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/ASingleComputePassPostEffect.ts#L309)

지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | 유니폼 멤버 키 이름 |
| `value` | `number` \| `boolean` \| `number`[] | 기록할 값 |

#### Returns

`void`

#### Inherited from

[`ASingleComputePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md).[`updateUniform`](../../PostEffect/namespaces/Core/classes/ASingleComputePassPostEffect.md#updateuniform)

</details>
