[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / DOF

# Class: DOF

Defined in: [src/postEffect/builtIn/dof/DOF.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L44)

35mm 풀프레임 센서(`sensorSize = 24mm`) 기하광학 Thin-Lens 착란원(CoC), CoC-Aware 양방향 3단 밉체인(`Mip 0 ~ Mip 2`), 타일 최대 착란원 확장(`DOFTileMaxCoC`), 전/배경 Dual-Buffer 분리 정다각형 개더링, 및 풀해상도 Slight Out-of-Focus 8-Tap 직접 개더링·Recombine 기반의 차세대 물리 보케 피사계 심도(Physical Bokeh Depth of Field) 후처리 이펙트입니다.

`View3D`의 `builtInEffectManager.useDOF`를 `true`로 설정하여 시스템 내부에서 자동 활성화하며, `view.builtInEffectManager.dof`를 통해 카메라 렌즈 파라미터 및 프리셋을 제어합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 builtInEffectManager를 통해 DOF 활성화 및 프리셋 적용
view.builtInEffectManager.useDOF = true;
view.builtInEffectManager.dof.setCinematic();
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/dof/" />

## See

- [DOF example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/dof/)
 - [DOF Auto Focus example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/dofAutoFocus/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new DOF**(`redGPUContext`): `DOF`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:90](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L90)

`DOF` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트 |

#### Returns

`DOF`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### aperture

#### Get Signature

> **get** **aperture**(): `number` = `2.0`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:182](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L182)

조리개 F-값($N$, F-number)을 반환하거나 설정합니다. 낮을수록(`f/1.4`) 심도가 얕아지고 보케가 커지며, 높을수록(`f/8.0`) 전 영역이 선명해집니다. (`0.5 ~ 32.0`, 기본값: `2.0`)

##### Returns

`number`

조리개 F-값

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:186](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### bladeCount

#### Get Signature

> **get** **bladeCount**(): `number` = `6`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:224](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L224)

조리개 날 개수(`0 ~ 9`)를 반환하거나 설정합니다. `0 ~ 2`는 완전 원형 보케, `3 ~ 9`는 정다각형 조리개 보케를 생성합니다. (기본값: `6`)

##### Returns

`number`

조리개 날 개수

#### Set Signature

> **set** **bladeCount**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:228](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L228)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### bokehBrightness

#### Get Signature

> **get** **bokehBrightness**(): `number` = `1.5`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:245](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L245)

고휘도 HDR 하이라이트 보케 디스크 강조 강도를 반환하거나 설정합니다. (`0.0 ~ 5.0`, 기본값: `1.5`)

##### Returns

`number`

보케 하이라이트 강조 강도

#### Set Signature

> **set** **bokehBrightness**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:249](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L249)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### focalLength

#### Get Signature

> **get** **focalLength**(): `number` = `65.0`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:203](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L203)

렌즈 초점 거리 $f$(단위: `mm`)를 반환하거나 설정합니다. 망원(`85mm ~ 135mm`)일수록 배경 압축과 보케 크기가 증가합니다. (`12.0 ~ 300.0`, 기본값: `65.0`)

##### Returns

`number`

렌즈 초점 거리 (`mm`)

#### Set Signature

> **set** **focalLength**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:207](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L207)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### focusDistance

#### Get Signature

> **get** **focusDistance**(): `number` = `10.0`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:160](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L160)

초점이 맺히는 피사체 거리 $S_1$을 반환하거나 설정합니다. (단위: 월드 미터 `m`, 허용 범위: `0.1 ~ 10000`, 기본값: `10.0`)

##### Returns

`number`

피사체 초점 거리 (`m`)

#### Set Signature

> **set** **focusDistance**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:164](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L164)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### useAutoFocus

#### Get Signature

> **get** **useAutoFocus**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:266](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L266)

화면 깊이 버퍼 기반 9-Point Zone 연속 자동 초점(AF-C) 활성화 여부를 반환하거나 설정합니다. (기본값: `false`)

##### Returns

`boolean`

자동 초점 활성화 여부

#### Set Signature

> **set** **useAutoFocus**(`value`): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:270](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L270)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:140](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L140)

모든 내부 서브패스 및 영구 초점·착란원 히스토리 텍스처의 총 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

총 비디오 메모리 사용량 (단위: 바이트)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../../Core/classes/AMultiPassPostEffect.md#videomemorysize)

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:286](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L286)

할당된 영구 초점·착란원 히스토리 텍스처 및 내부 서브패스의 바인드 그룹 캐시를 모두 정리합니다.

#### Returns

`void`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`clear`](../../Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:297](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L297)

내부 서브패스 및 영구 초점·착란원 상태 텍스처 리소스를 영구 파기합니다.

#### Returns

`void`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`destroy`](../../Core/classes/AMultiPassPostEffect.md#destroy)

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/dof/DOF.ts:408](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L408)

3단 CoC 밉체인(`Mip 0 ~ Mip 2`), `1/16` 타일 확장, 전/배경 Dual-Buffer 정다각형 보케 개더링, 전/배경 독립 9-Tap Tent 스무딩, 및 풀해상도 Slight-DoF 8-Tap 직접 개더링·Recombine 패스를 순차 실행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | 입력 원본 HDR 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

DOF 처리된 최종 HDR 결과 텍스처 정보 (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:320](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L320)

대구경 시네마 프라임 렌즈 스타일의 시네마틱(`85mm f/1.4`, 8날 조리개) 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setGameDefault()

> **setGameDefault**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:308](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L308)

표준 게임 카메라(`65mm f/2.0`, 6날 조리개) 기본 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setLandscape()

> **setLandscape**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:344](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L344)

깊은 피사계 심도를 제공하는 광각 풍경 사진(`24mm f/8.0`) 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setMacro()

> **setMacro**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:356](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L356)

근접 피사체에 초점을 맞추고 배경을 부드럽게 날리는 매크로(`105mm f/2.0`, 원형 보케) 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setNightMode()

> **setNightMode**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:380](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L380)

야간 하이라이트 보케 디스크를 극대화하는 야간 촬영(`75mm f/1.2`, 6날 정육각 보케) 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setPortrait()

> **setPortrait**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:332](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L332)

원형 조리개 기반의 인물 사진(`85mm f/1.4`, 원형 보케) 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setSports()

> **setSports**(): `void`

Defined in: [src/postEffect/builtIn/dof/DOF.ts:368](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/dof/DOF.ts#L368)

망원 액션 및 스포츠 촬영(`135mm f/2.8`) 프리셋을 적용합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:14](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L14)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../../Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../../Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../../Core/classes/AMultiPassPostEffect.md#commandencodermanager)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../../Core/classes/AMultiPassPostEffect.md#gpudevice)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`instanceId`](../../Core/classes/AMultiPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L68)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isLdr`](../../Core/classes/AMultiPassPostEffect.md#isldr)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`name`](../../Core/classes/AMultiPassPostEffect.md#name)

***

***

### passList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **passList**(): ([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L93)

등록된 내부 단일 패스 이펙트 배열을 반환합니다.

##### Returns

([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

내부 단일 패스 이펙트 배열 (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`passList`](../../Core/classes/AMultiPassPostEffect.md#passlist)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../../Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../../Core/classes/AMultiPassPostEffect.md#resourcemanager)

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

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`uuid`](../../Core/classes/AMultiPassPostEffect.md#uuid)

***

</details>
