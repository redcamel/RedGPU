[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / ShadowManager

# Class: ShadowManager

Defined in: [src/shadow/ShadowManager.ts:24](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L24)

씬의 전체적인 그림자 렌더링을 총괄하는 관리자 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ShadowManager**(): `ShadowManager`

Defined in: [src/shadow/ShadowManager.ts:28](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L28)

#### Returns

`ShadowManager`

## Accessors

### directionalShadowManager

#### Get Signature

> **get** **directionalShadowManager**(): [`DirectionalShadowManager`](DirectionalShadowManager.md)

Defined in: [src/shadow/ShadowManager.ts:39](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L39)

직사광(Directional Light) 섀도우 매니저를 반환합니다.

##### Returns

[`DirectionalShadowManager`](DirectionalShadowManager.md)

DirectionalShadowManager 인스턴스

***

### shadowPassDescriptor

#### Get Signature

> **get** **shadowPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/shadow/ShadowManager.ts:51](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L51)

섀도우 렌더 패스 디스크립터를 반환합니다.

##### Returns

`GPURenderPassDescriptor`

GPURenderPassDescriptor 객체

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/ShadowManager.ts:114](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L114)

사용 중인 그림자 GPU 리소스를 해제합니다.

#### Returns

`void`

***

### render()

> **render**(`view`): `void`

Defined in: [src/shadow/ShadowManager.ts:63](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L63)

그림자 렌더링을 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 View3D

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `void`

Defined in: [src/shadow/ShadowManager.ts:106](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/shadow/ShadowManager.ts#L106)

매니저의 상태를 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`void`
