[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / AutoExposure

# Class: AutoExposure

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:47](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L47)

컴퓨트 셰이더 기반 256-bin 로그 휘도 히스토그램 분석을 통해 자동 노출(Auto-Exposure)과 눈 적응(Eye Adaptation)을 수행하는 클래스입니다. `BuiltInEffectManager` 내부에서 자동으로 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 builtInEffectManager를 통해 접근
const autoExposure = view.builtInEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5;
autoExposure.meteringMode = RedGPU.PostEffect.BuiltIn.METERING_MODE.CENTER_WEIGHTED;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/autoExposure/" />

## See

[AutoExposure Example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/autoExposure/)

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new AutoExposure**(`view`): `AutoExposure`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:128](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L128)

`AutoExposure` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |

#### Returns

`AutoExposure`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### adaptationSpeedDown

#### Get Signature

> **get** **adaptationSpeedDown**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:245](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L245)

밝은 곳에서 어두운 곳으로 이동할 때(암순응, EV100 하강)의 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `1.0`)

##### Returns

`number`

암순응 속도

#### Set Signature

> **set** **adaptationSpeedDown**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:249](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L249)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### adaptationSpeedUp

#### Get Signature

> **get** **adaptationSpeedUp**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:228](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L228)

어두운 곳에서 밝은 곳으로 이동할 때(명순응, EV100 상승)의 적응 속도를 가져오거나 설정합니다. (`0` 이상, 기본값: `3.0`)

##### Returns

`number`

명순응 속도

#### Set Signature

> **set** **adaptationSpeedUp**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:232](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### currentAdaptedEV100

#### Get Signature

> **get** **currentAdaptedEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:410](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L410)

현재 적응된 EV100 값을 가져오거나 설정합니다. 값을 설정하면 내부 GPU 상태 버퍼도 즉시 동기화됩니다.

##### Returns

`number`

현재 적응된 EV100 값

#### Set Signature

> **set** **currentAdaptedEV100**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:414](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L414)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### effectiveEV100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **effectiveEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:374](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L374)

노출 보정(`exposureCompensation`)까지 반영된 최종 유효 EV100(`currentAdaptedEV100 - exposureCompensation`) 값을 반환합니다.

##### Returns

`number`

최종 유효 EV100 값

***

***

### exposureCompensation

#### Get Signature

> **get** **exposureCompensation**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:152](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L152)

EV 스탑 단위의 노출 보정(Exposure Compensation) 값을 가져오거나 설정합니다. 양수 값일수록 화면이 밝아집니다. (기본값: `0.0`)

##### Returns

`number`

노출 보정 값 (EV)

#### Set Signature

> **set** **exposureCompensation**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:156](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L156)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### highPercentile

#### Get Signature

> **get** **highPercentile**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:279](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L279)

히스토그램 평균 산출 시 제외할 상위 명부(극단 광원 하이라이트) 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.983`)

##### Returns

`number`

상위 백분위 값 (`0` ~ `1`)

#### Set Signature

> **set** **highPercentile**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:283](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L283)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lowPercentile

#### Get Signature

> **get** **lowPercentile**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:262](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L262)

히스토그램 평균 산출 시 제외할 하위 암부 백분위 기준값을 가져오거나 설정합니다. (`0` ~ `1`, 기본값: `0.8`)

##### Returns

`number`

하위 백분위 값 (`0` ~ `1`)

#### Set Signature

> **set** **lowPercentile**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:266](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L266)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEV100

#### Get Signature

> **get** **maxEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:211](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L211)

자동 노출이 허용하는 최대 EV100 상한값을 가져오거나 설정합니다. `minEV100`과 동일한 값으로 설정하면 해당 EV100으로 노출이 잠깁니다. (기본값: `16.0`)

##### Returns

`number`

최대 EV100 값

#### Set Signature

> **set** **maxEV100**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:215](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L215)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxExposureMultiplier

#### Get Signature

> **get** **maxExposureMultiplier**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:296](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L296)

어두운 장면에서 허용할 최대 노출 증폭 배율을 가져오거나 설정합니다. (`1.0` 이상, 기본값: `64.0`)

##### Returns

`number`

최대 노출 증폭 배율

#### Set Signature

> **set** **maxExposureMultiplier**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:300](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L300)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### meteringMode

#### Get Signature

> **get** **meteringMode**(): [`METERING_MODE`](../type-aliases/METERING_MODE.md)

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:315](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L315)

화면 휘도 측정 시 사용할 측광 모드(`METERING_MODE`)를 가져오거나 설정합니다. (기본값: `METERING_MODE.CENTER_WEIGHTED`)

##### Returns

[`METERING_MODE`](../type-aliases/METERING_MODE.md)

현재 측광 모드

#### Set Signature

> **set** **meteringMode**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:319](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L319)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`METERING_MODE`](../type-aliases/METERING_MODE.md) |

##### Returns

`void`

***

***

### minEV100

#### Get Signature

> **get** **minEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:194](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L194)

자동 노출이 허용하는 최소 EV100 하한값을 가져오거나 설정합니다. `maxEV100`과 동일한 값으로 설정하면 해당 EV100으로 노출이 잠깁니다. (기본값: `-2.0`)

##### Returns

`number`

최소 EV100 값

#### Set Signature

> **set** **minEV100**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:198](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L198)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### preExposure

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **preExposure**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:350](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L350)

현재 적응된 `currentAdaptedEV100`과 `exposureCompensation`을 반영하여 계산된 사전 노출 배율(`preExposure`)을 반환합니다.

##### Returns

`number`

사전 노출 배율

***

***

### preExposureRatio

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **preExposureRatio**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:362](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L362)

직전 프레임 대비 현재 프레임의 사전 노출 변화 비율(`preExposureRatio`)을 반환합니다.

##### Returns

`number`

프레임 간 사전 노출 비율

***

***

### sceneAvgEV100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sceneAvgEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:386](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L386)

히스토그램 분석을 통해 측정된 현재 장면의 평균 EV100 값을 반환합니다.

##### Returns

`number`

장면 평균 EV100 값

***

***

### targetEV100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetEV100**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:398](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L398)

목표 휘도 바이어스 및 범위 클램핑이 반영된 목표 EV100 값을 반환합니다.

##### Returns

`number`

목표 EV100 값

***

***

### targetLuminance

#### Get Signature

> **get** **targetLuminance**(): `number`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:175](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L175)

자동 노출이 수렴하려는 목표 평균 휘도(18% 미들 그레이 기준)를 가져오거나 설정합니다. (`0` 이상, 기본값: `0.18`)

##### Returns

`number`

목표 휘도 값

#### Set Signature

> **set** **targetLuminance**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:179](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L179)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### useDebugOverlay

#### Get Signature

> **get** **useDebugOverlay**(): `boolean`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:334](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L334)

256-bin 히스토그램 분포 및 장면 평균·목표·적응 EV100 마커를 화면 좌측 하단 LDR 오버레이로 시각화할지 여부를 가져오거나 설정합니다. (기본값: `false`)

##### Returns

`boolean`

디버그 오버레이 활성화 여부

#### Set Signature

> **set** **useDebugOverlay**(`value`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:338](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L338)

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

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:435](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L435)

할당된 GPU 버퍼들의 총 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:661](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L661)

캐시된 소스 텍스처 바인드 그룹을 비웁니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:672](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L672)

할당된 GPU 버퍼 및 컴퓨트·오버레이 파이프라인 리소스를 모두 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(`sourceTextureInfo`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:514](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L514)

소스 HDR 컬러 텍스처를 바탕으로 256-bin 로그 휘도 히스토그램 생성 및 눈 적응 컴퓨트 패스를 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | 후처리 입력 HDR 텍스처 정보 (`IPostEffectResult`) |

#### Returns

`void`

***

***

### renderDebugOverlay()

> **renderDebugOverlay**(`targetTextureView`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:615](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L615)

후처리가 완료된 LDR 타겟 텍스처 위에 실시간 256-bin 히스토그램 및 노출 마커 HUD 오버레이를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetTextureView` | `GPUTextureView` | 후처리가 완료된 LDR 컬러 타겟 텍스처 뷰 (`rgba8unorm`) |

#### Returns

`void`

***

***

### resetAdaptation()

> **resetAdaptation**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:449](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L449)

카메라 컷 전환, 씬 이동, 텔레포트 직후 시간 지연 없이 다음 프레임에서 목표 노출로 즉시 수렴하도록 리셋을 예약합니다.

#### Returns

`void`

***

***

### resolveReadback()

> **resolveReadback**(): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:631](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L631)

GPU에서 계산된 최신 노출 상태(적응 EV100, 유효 EV100, 장면 평균 EV100, 목표 EV100)를 리드백 버퍼로부터 비동기 매핑하여 CPU 게터에 동기화합니다.

#### Returns

`void`

***

***

### syncPostEffectSystemUniformBuffer()

> **syncPostEffectSystemUniformBuffer**(`postEffectBuffer`, `preExposureByteOffset`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:498](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L498)

GPU 상태 버퍼의 최신 `preExposure` 및 `preExposureRatio`(연속 8B)를 후처리 시스템 유니폼 버퍼로 직접 복사합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `postEffectBuffer` | `GPUBuffer` | 후처리 시스템 유니폼 `GPUBuffer` |
| `preExposureByteOffset` | `number` | `preExposure` 필드의 시작 바이트 오프셋 |

#### Returns

`void`

***

***

### syncVertexSystemUniformBuffers()

> **syncVertexSystemUniformBuffers**(`vertexBuffer`, `preExposureByteOffset`, `cascadeBuffers`, `activeCascadeCount`): `void`

Defined in: [src/postEffect/builtIn/autoExposure/AutoExposure.ts:471](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/AutoExposure.ts#L471)

GPU 상태 버퍼의 최신 `preExposure`(4B)를 뷰의 정점·프래그먼트 시스템 유니폼 버퍼 및 활성 캐스케이드 버퍼로 직접 복사합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexBuffer` | `GPUBuffer` | 메인 시스템 유니폼 `GPUBuffer` |
| `preExposureByteOffset` | `number` | `preExposure` 필드의 바이트 오프셋 |
| `cascadeBuffers` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)[] | 그림자 캐스케이드 시스템 유니폼 버퍼 목록 (`Array<UniformBuffer>`) |
| `activeCascadeCount` | `number` | 현재 활성화된 캐스케이드 개수 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
