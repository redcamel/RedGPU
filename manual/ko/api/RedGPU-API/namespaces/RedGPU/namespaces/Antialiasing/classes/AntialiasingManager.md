[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / AntialiasingManager

# Class: AntialiasingManager

Defined in: [src/antialiasing/AntialiasingManager.ts:22](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L22)

안티앨리어싱(Anti-aliasing) 설정을 관리하는 클래스입니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// RedGPUContext 또는 View를 통해 접근합니다.
// Access via RedGPUContext or View.
const antialiasingManager = redGPUContext.antialiasingManager;
```

## Constructors

### Constructor

> **new AntialiasingManager**(`redGPUContext`): `AntialiasingManager`

Defined in: [src/antialiasing/AntialiasingManager.ts:39](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L39)

AntialiasingManager 생성자입니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`AntialiasingManager`

## Accessors

### changedMSAA

#### Get Signature

> **get** **changedMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:168](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L168)

**`Internal`**

MSAA 설정 변경 여부를 반환합니다.


##### Returns

`boolean`

MSAA 변경 여부


#### Set Signature

> **set** **changedMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:181](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L181)

**`Internal`**

MSAA 설정 변경 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | MSAA 변경 여부

##### Returns

`void`

***

### msaaID

#### Get Signature

> **get** **msaaID**(): `string`

Defined in: [src/antialiasing/AntialiasingManager.ts:194](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L194)

**`Internal`**

현재 MSAA의 고유 ID를 반환합니다.


##### Returns

`string`

MSAA 고유 ID


***

### useFXAA

#### Get Signature

> **get** **useFXAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:136](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L136)

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

Defined in: [src/antialiasing/AntialiasingManager.ts:153](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L153)

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

Defined in: [src/antialiasing/AntialiasingManager.ts:98](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L98)

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

Defined in: [src/antialiasing/AntialiasingManager.ts:115](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L115)

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

Defined in: [src/antialiasing/AntialiasingManager.ts:62](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L62)

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

Defined in: [src/antialiasing/AntialiasingManager.ts:79](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/antialiasing/AntialiasingManager.ts#L79)

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
