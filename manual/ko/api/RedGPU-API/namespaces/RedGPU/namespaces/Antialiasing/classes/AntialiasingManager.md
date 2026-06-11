[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / AntialiasingManager

# Class: AntialiasingManager

Defined in: [src/antialiasing/AntialiasingManager.ts:21](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L21)

안티앨리어싱(Anti-aliasing) 설정을 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

* ### Example
```typescript
// RedGPUContext, View 또는 RedGPUObject 상속 객체를 통해 접근합니다.
const antialiasingManager = redGPUContext.antialiasingManager;
```

## Constructors

### Constructor

> **new AntialiasingManager**(): `AntialiasingManager`

Defined in: [src/antialiasing/AntialiasingManager.ts:38](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L38)

AntialiasingManager 생성자입니다.
`window.devicePixelRatio` 값에 따라 초기 안티앨리어싱 모드가 결정됩니다:
- `devicePixelRatio > 1.0` (고해상도 화면): TAA가 활성화됩니다.
- `devicePixelRatio <= 1.0` (일반 해상도 화면): MSAA가 활성화됩니다.

#### Returns

`AntialiasingManager`

## Accessors

### msaaID

#### Get Signature

> **get** **msaaID**(): `string`

Defined in: [src/antialiasing/AntialiasingManager.ts:165](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L165)

**`Internal`**

현재 MSAA의 고유 ID를 반환합니다.

##### Returns

`string`

MSAA 고유 ID

***

### useFXAA

#### Get Signature

> **get** **useFXAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:133](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L133)

FXAA(Fast Approximate Anti-Aliasing) 사용 여부를 반환합니다.

* ### Example
```typescript
const useFXAA = antialiasingManager.useFXAA;
```

##### Returns

`boolean`

FXAA 사용 여부

#### Set Signature

> **set** **useFXAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:150](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L150)

FXAA(Fast Approximate Anti-Aliasing) 사용 여부를 설정합니다.

* ### Example
```typescript
antialiasingManager.useFXAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | FXAA 사용 여부

##### Returns

`void`

***

### useMSAA

#### Get Signature

> **get** **useMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:96](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L96)

MSAA(Multi-Sample Anti-Aliasing) 사용 여부를 반환합니다.

* ### Example
```typescript
const useMSAA = antialiasingManager.useMSAA;
```

##### Returns

`boolean`

MSAA 사용 여부

#### Set Signature

> **set** **useMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:113](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L113)

MSAA(Multi-Sample Anti-Aliasing) 사용 여부를 설정합니다.

* ### Example
```typescript
antialiasingManager.useMSAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | MSAA 사용 여부

##### Returns

`void`

***

### useTAA

#### Get Signature

> **get** **useTAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:60](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L60)

TAA(Temporal Anti-Aliasing) 사용 여부를 반환합니다.

* ### Example
```typescript
const useTAA = antialiasingManager.useTAA;
```

##### Returns

`boolean`

TAA 사용 여부

#### Set Signature

> **set** **useTAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:77](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/antialiasing/AntialiasingManager.ts#L77)

TAA(Temporal Anti-Aliasing) 사용 여부를 설정합니다.

* ### Example
```typescript
antialiasingManager.useTAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | TAA 사용 여부

##### Returns

`void`
