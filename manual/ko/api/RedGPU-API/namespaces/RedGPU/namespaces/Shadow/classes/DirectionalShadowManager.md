[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / DirectionalShadowManager

# Class: DirectionalShadowManager

Defined in: [src/shadow/DirectionalShadowManager.ts:20](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L20)

직사광(Directional Light)의 그림자 뎁스 텍스처와 관련 설정을 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new DirectionalShadowManager**(): `DirectionalShadowManager`

#### Returns

`DirectionalShadowManager`

## Accessors

### bias

#### Get Signature

> **get** **bias**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:89](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L89)

그림자 바이어스(Bias) 값을 반환합니다.

##### Returns

`number`

바이어스 값

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:101](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L101)

그림자 바이어스(Bias) 값을 설정합니다. (0.0 ~ 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 바이어스 값

##### Returns

`void`

***

### castingList

#### Get Signature

> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/shadow/DirectionalShadowManager.ts:53](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L53)

그림자를 생성할 대상 객체 리스트를 반환합니다.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

섀도우 캐스팅 대상 배열

***

### filterScale

#### Get Signature

> **get** **filterScale**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:139](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L139)

그림자 필터 번짐 반경(Filter Scale) 값을 반환합니다.

##### Returns

`number`

필터 스케일 값 (기본값: 4.0)

#### Set Signature

> **set** **filterScale**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:151](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L151)

그림자 필터 번짐 반경(Filter Scale) 값을 설정합니다. (0.0 이상)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 필터 스케일 값

##### Returns

`void`

***

### shadowDepthTextureSize

#### Get Signature

> **get** **shadowDepthTextureSize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:165](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L165)

섀도우 뎁스 텍스처의 크기(해상도)를 반환합니다.

##### Returns

`number`

해상도 값

#### Set Signature

> **set** **shadowDepthTextureSize**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:177](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L177)

섀도우 뎁스 텍스처의 크기(해상도)를 설정합니다. (정수)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 해상도 값

##### Returns

`void`

***

### shadowDepthTextureView

#### Get Signature

> **get** **shadowDepthTextureView**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:65](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L65)

섀도우 뎁스 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

섀도우 뎁스 GPUTextureView

***

### shadowDepthTextureViewEmpty

#### Get Signature

> **get** **shadowDepthTextureViewEmpty**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:77](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L77)

그림자가 없는 상태를 위한 빈(1x1) 뎁스 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

빈 뎁스 GPUTextureView

***

### strength

#### Get Signature

> **get** **strength**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:114](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L114)

그림자의 세기(Strength) 값을 반환합니다.

##### Returns

`number`

세기 값 (0.0 ~ 1.0)

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:126](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L126)

그림자의 세기(Strength) 값을 설정합니다. (0.0 ~ 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 세기 값

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:41](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L41)

현재 섀도우 맵이 사용하는 비디오 메모리 크기(Bytes)를 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (Bytes)

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:215](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L215)

사용 중인 GPU 리소스를 해제합니다.

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:186](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L186)

매니저를 리셋하고 리소스를 파기합니다.

#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:194](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L194)

섀도우 캐스팅 대상 리스트를 초기화합니다.

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:206](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/DirectionalShadowManager.ts#L206)

내부 상태를 업데이트합니다. (주로 해상도 변경 체크)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`void`
