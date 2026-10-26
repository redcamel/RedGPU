[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeWaveSimulator

# Class: LakeWaveSimulator

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L19)

호수 수면의 파동 전파를 시뮬레이션하고 리플 노멀 텍스처를 생성하는 클래스입니다.

`Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new LakeWaveSimulator**(`redGPUContext`, `textureSize?`): `LakeWaveSimulator`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L80)

`LakeWaveSimulator` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `textureSize?` | `number` | `512` | 시뮬레이션 텍스처 해상도 (기본값: `512`) |

#### Returns

`LakeWaveSimulator`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### damping

> **damping**: `number` = `0.012`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L46)

프레임당 파동 에너지 감쇠율입니다. (기본값: `0.012`)

***

***

### normalStrength

> **normalStrength**: `number` = `1.0`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L51)

생성되는 리플 노멀의 강도입니다. (기본값: `1.0`)

***

***

### rippleNormalTexture

> **rippleNormalTexture**: `GPUTexture`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L30)

시뮬레이션 결과 리플 노멀이 저장되는 `GPUTexture`입니다.

***

***

### rippleNormalTextureView

> **rippleNormalTextureView**: `GPUTextureView`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L35)

`rippleNormalTexture`의 `GPUTextureView`입니다.

***

***

### textureSize

> **textureSize**: `number` = `512`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L24)

파동 시뮬레이션 텍스처의 가로·세로 해상도(픽셀)입니다. (기본값: `512`)

***

***

### waveSpeed

> **waveSpeed**: `number` = `0.32`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L41)

파동 전파 속도입니다. (기본값: `0.32`)

## Accessors



## Methods



***

### clear()

> **clear**(`commandEncoder`): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L175)

파동 버퍼와 리플 노멀 텍스처를 0으로 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 클리어 패스를 기록할 `GPUCommandEncoder` |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L185)

할당된 GPU 리소스를 모두 해제합니다.

#### Returns

`void`

***

***

### simulate()

> **simulate**(`commandEncoder`, `shiftX?`, `shiftZ?`): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:140](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L140)

파동 시뮬레이션 컴퓨트 패스를 실행합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | `undefined` | 컴퓨트 패스를 기록할 `GPUCommandEncoder` |
| `shiftX?` | `number` | `0` | 도메인 이동에 따른 X축 텍셀 오프셋 (기본값: `0`) |
| `shiftZ?` | `number` | `0` | 도메인 이동에 따른 Z축 텍셀 오프셋 (기본값: `0`) |

#### Returns

`void`

***

***

### updateCaptureBinding()

> **updateCaptureBinding**(`captureTextureView`): `void`

Defined in: [src/water/lakeCore/interaction/LakeWaveSimulator.ts:97](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeWaveSimulator.ts#L97)

캡처 패스의 침투 깊이 텍스처 뷰를 바인드 그룹에 연결합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `captureTextureView` | `GPUTextureView` | 캡처 패스의 `GPUTextureView` |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
