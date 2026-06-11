[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / ShadowManager

# Class: ShadowManager

Defined in: [src/shadow/ShadowManager.ts:23](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/shadow/ShadowManager.ts#L23)

씬의 전체적인 그림자 렌더링을 총괄하는 관리자 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new ShadowManager**(): `ShadowManager`

Defined in: [src/shadow/ShadowManager.ts:27](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/shadow/ShadowManager.ts#L27)

#### Returns

`ShadowManager`

## Accessors

### directionalShadowManager

#### Get Signature

> **get** **directionalShadowManager**(): [`DirectionalShadowManager`](DirectionalShadowManager.md)

Defined in: [src/shadow/ShadowManager.ts:38](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/shadow/ShadowManager.ts#L38)

직사광(Directional Light) 섀도우 매니저를 반환합니다.

##### Returns

[`DirectionalShadowManager`](DirectionalShadowManager.md)

DirectionalShadowManager 인스턴스

***

### shadowPassDescriptor

#### Get Signature

> **get** **shadowPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/shadow/ShadowManager.ts:50](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/shadow/ShadowManager.ts#L50)

섀도우 렌더 패스 디스크립터를 반환합니다.

##### Returns

`GPURenderPassDescriptor`

GPURenderPassDescriptor 객체

## Methods

### render()

> **render**(`view`): `void`

Defined in: [src/shadow/ShadowManager.ts:62](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/shadow/ShadowManager.ts#L62)

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

Defined in: [src/shadow/ShadowManager.ts:105](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/shadow/ShadowManager.ts#L105)

매니저의 상태를 업데이트합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`void`
