[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AutoExposure

# Class: AutoExposure

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:26](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L26)

자동 노출(Auto-Exposure) 및 눈 적응(Eye Adaptation)을 수행하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new AutoExposure**(`view`): `AutoExposure`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:65](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L65)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) |

#### Returns

`AutoExposure`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### adaptationSpeedDown

#### Get Signature

> **get** **adaptationSpeedDown**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:200](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L200)

눈 적응 속도(어두워질 때)를 반환합니다.

##### Returns

`number`

눈 적응 속도 (하강)

#### Set Signature

> **set** **adaptationSpeedDown**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:212](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L212)

눈 적응 속도(어두워질 때)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 눈 적응 속도 (하강)

##### Returns

`void`

***

### adaptationSpeedUp

#### Get Signature

> **get** **adaptationSpeedUp**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:176](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L176)

눈 적응 속도(밝아질 때)를 반환합니다.

##### Returns

`number`

눈 적응 속도 (상승)

#### Set Signature

> **set** **adaptationSpeedUp**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:188](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L188)

눈 적응 속도(밝아질 때)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 눈 적응 속도 (상승)

##### Returns

`void`

***

### adaptedLuminanceBuffer

#### Get Signature

> **get** **adaptedLuminanceBuffer**(): [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:359](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L359)

적응된 EV100 데이터가 저장되는 GPU 스토리지 버퍼를 반환합니다.

##### Returns

[`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md)

스토리지 버퍼 인스턴스

***

### currentAdaptedEV100

#### Get Signature

> **get** **currentAdaptedEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:333](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L333)

현재 적응된 EV100 값을 반환합니다.

##### Returns

`number`

적응된 EV100 값

#### Set Signature

> **set** **currentAdaptedEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:345](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L345)

현재 적응된 EV100 값을 설정합니다. (GPU 버퍼도 함께 갱신)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 EV100 값

##### Returns

`void`

***

### exposureCompensation

#### Get Signature

> **get** **exposureCompensation**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:80](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L80)

노출 보정(Exposure Compensation) 값을 반환합니다.

##### Returns

`number`

노출 보정 값

#### Set Signature

> **set** **exposureCompensation**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:92](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L92)

노출 보정(Exposure Compensation) 값을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 노출 보정 값

##### Returns

`void`

***

### highPercentile

#### Get Signature

> **get** **highPercentile**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:248](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L248)

히스토그램 분석 범위(상위 퍼센트 제외)를 반환합니다.

##### Returns

`number`

상위 백분위 값 (0 ~ 1)

#### Set Signature

> **set** **highPercentile**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:260](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L260)

히스토그램 분석 범위(상위 퍼센트 제외)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 상위 백분위 값 (0 ~ 1)

##### Returns

`void`

***

### lowPercentile

#### Get Signature

> **get** **lowPercentile**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:224](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L224)

히스토그램 분석 범위(하위 퍼센트 제외)를 반환합니다.

##### Returns

`number`

하위 백분위 값 (0 ~ 1)

#### Set Signature

> **set** **lowPercentile**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:236](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L236)

히스토그램 분석 범위(하위 퍼센트 제외)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 하위 백분위 값 (0 ~ 1)

##### Returns

`void`

***

### maxEV100

#### Get Signature

> **get** **maxEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:152](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L152)

자동 노출 최대 EV100을 반환합니다.

##### Returns

`number`

최대 EV100 값

#### Set Signature

> **set** **maxEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:164](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L164)

자동 노출 최대 EV100을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 최대 EV100 값

##### Returns

`void`

***

### maxExposureMultiplier

#### Get Signature

> **get** **maxExposureMultiplier**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:272](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L272)

자동 노출의 최대 증폭 배율을 반환합니다.

##### Returns

`number`

최대 노출 증폭 배율

#### Set Signature

> **set** **maxExposureMultiplier**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:284](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L284)

자동 노출의 최대 증폭 배율을 설정합니다. (기본값: 16.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 최대 노출 증폭 배율

##### Returns

`void`

***

### meteringMode

#### Get Signature

> **get** **meteringMode**(): [`METERING_MODE`](../enumerations/METERING_MODE.md)

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:296](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L296)

자동 노출의 측광 모드(Metering Mode)를 반환합니다.

##### Returns

[`METERING_MODE`](../enumerations/METERING_MODE.md)

측광 모드

#### Set Signature

> **set** **meteringMode**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:308](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L308)

자동 노출의 측광 모드(Metering Mode)를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`METERING_MODE`](../enumerations/METERING_MODE.md) | 설정할 측광 모드

##### Returns

`void`

***

### minEV100

#### Get Signature

> **get** **minEV100**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:128](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L128)

자동 노출 최소 EV100을 반환합니다.

##### Returns

`number`

최소 EV100 값

#### Set Signature

> **set** **minEV100**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:140](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L140)

자동 노출 최소 EV100을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 최소 EV100 값

##### Returns

`void`

***

### preExposure

#### Get Signature

> **get** **preExposure**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:320](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L320)

현재 적응된 노출 배율(preExposure)을 반환합니다.

##### Returns

`number`

현재 노출 배율

***

### targetLuminance

#### Get Signature

> **get** **targetLuminance**(): `number`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:104](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L104)

목표 휘도를 반환합니다.

##### Returns

`number`

목표 휘도 값

#### Set Signature

> **set** **targetLuminance**(`value`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:116](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L116)

목표 휘도를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 설정할 목표 휘도 값

##### Returns

`void`

***

### render()

> **render**(`sourceTextureInfo`): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:371](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L371)

자동 노출 처리를 수행합니다. (커맨드 기록)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceTextureInfo` | [`IPostEffectResult`](../../../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 소스 텍스처 정보

#### Returns

`void`

***

### resolveReadback()

> **resolveReadback**(): `void`

Defined in: [src/camera/core/autoExposure/AutoExposure.ts:479](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/autoExposure/AutoExposure.ts#L479)

GPU 작업 완료 후 데이터를 비동기적으로 읽어옵니다. (Renderer에서 호출)

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
