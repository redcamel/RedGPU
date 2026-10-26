[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / AntialiasingManager

# Class: AntialiasingManager

Defined in: [src/antialiasing/AntialiasingManager.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L25)

컨텍스트 전역의 안티앨리어싱(Anti-aliasing) 모드를 통합 관리하는 클래스입니다.

MSAA, FXAA, TAA 중 하나의 안티앨리어싱 기법만 선택해 적용할 수 있습니다. 처음 생성될 때는 화면 해상도(`window.devicePixelRatio > 1.0`)를 감지하여, 고해상도(Retina 등) 모니터에서는 `useTAA`가, 일반 모니터에서는 `useMSAA`가 기본으로 켜집니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// RedGPUContext로부터 AntialiasingManager 접근 및 모드 전환
const { antialiasingManager } = redGPUContext;
antialiasingManager.useTAA = true;
```

## Constructors

### Constructor

> **new AntialiasingManager**(): `AntialiasingManager`

Defined in: [src/antialiasing/AntialiasingManager.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L35)

`AntialiasingManager` 인스턴스를 초기화하고 디스플레이 픽셀 밀도에 따라 기본 안티앨리어싱 모드를 설정합니다.

#### Returns

`AntialiasingManager`

## Accessors

### msaaID

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **msaaID**(): `string`

Defined in: [src/antialiasing/AntialiasingManager.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L127)

MSAA 상태 변경을 추적하기 위한 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

MSAA 상태 식별용 UUID 문자열

***

### useFXAA

#### Get Signature

> **get** **useFXAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L109)

FXAA(Fast Approximate Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다. 활성화 시 기존 `useMSAA` 및 `useTAA`는 자동으로 해제됩니다.

#### Example
```typescript
// FXAA 활성화
redGPUContext.antialiasingManager.useFXAA = true;
```

##### Returns

`boolean`

FXAA 활성화 여부

#### Set Signature

> **set** **useFXAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:113](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L113)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### useMSAA

#### Get Signature

> **get** **useMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L83)

MSAA(Multi-Sample Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다. 상태 변경 시 새로운 `msaaID`가 발급되며 기존 `useFXAA` 및 `useTAA`는 자동으로 해제됩니다.

#### Example
```typescript
// MSAA 활성화
redGPUContext.antialiasingManager.useMSAA = true;
```

##### Returns

`boolean`

MSAA 활성화 여부

#### Set Signature

> **set** **useMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L87)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### useTAA

#### Get Signature

> **get** **useTAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L58)

TAA(Temporal Anti-Aliasing) 활성화 여부를 반환하거나 설정합니다. 활성화 시 기존 `useMSAA` 및 `useFXAA`는 자동으로 해제됩니다.

#### Example
```typescript
// TAA 활성화
redGPUContext.antialiasingManager.useTAA = true;
```

##### Returns

`boolean`

TAA 활성화 여부

#### Set Signature

> **set** **useTAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L62)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

## Methods

### resetHistory()

> **resetHistory**(`view?`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/antialiasing/AntialiasingManager.ts#L146)

지정된 뷰(`View3D`)의 TAA 누적 히스토리 프레임을 초기화합니다. 카메라가 컷 전환(순간 이동)되거나 씬 구성이 급격히 변경될 때 호출하면 이전 프레임 잔상(Ghosting)을 즉시 제거할 수 있습니다.

#### Example
```typescript
// 카메라 위치 급변 후 TAA 히스토리 리셋
redGPUContext.antialiasingManager.resetHistory(view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | \{ `taa?`: \{ `reset`(): `void`; \}; \} | TAA 히스토리를 리셋할 대상 뷰 객체 |
| `view.taa?` | \{ `reset`(): `void`; \} | - |
| `view.taa.reset` | () => `void` | - |

#### Returns

`void`
