[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Debugger](../README.md) / LandscapeDebuggerManager

# Class: LandscapeDebuggerManager

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L24)

지형(`Landscape`)의 와이어프레임, LOD 색상 시각화, 디버그 렌더링 모드를 관리하는 매니저 클래스입니다. `Landscape` 생성 시 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// Landscape 인스턴스로부터 디버거 매니저 접근 및 디버그 렌더링 활성화
const debuggerManager = landscape.debuggerManager;
debuggerManager.landscapeWireframe = true;
debuggerManager.landscapeLodColoration = true;
```

## Constructors

### Constructor

> **new LandscapeDebuggerManager**(`onDebugPropertyChange?`): `LandscapeDebuggerManager`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L38)

`LandscapeDebuggerManager` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `onDebugPropertyChange?` | `DebuggerPropertyChangeHandler` | 디버그 속성 변경 시 호출될 콜백 핸들러 |

#### Returns

`LandscapeDebuggerManager`

## Accessors

### landscapeDebugMode

#### Get Signature

> **get** **landscapeDebugMode**(): `number`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L69)

지형 디버그 렌더링 모드를 반환하거나 설정합니다. (`LANDSCAPE_DEBUG_MODE` 상수 참조)

##### Returns

`number`

디버그 모드 값

#### Set Signature

> **set** **landscapeDebugMode**(`value`): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L73)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### landscapeLodColoration

#### Get Signature

> **get** **landscapeLodColoration**(): `boolean`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:88](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L88)

지형 LOD 단계별 색상 시각화 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

LOD 색상 시각화 활성화 여부

#### Set Signature

> **set** **landscapeLodColoration**(`value`): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L92)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### landscapeWireframe

#### Get Signature

> **get** **landscapeWireframe**(): `boolean`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L50)

지형 와이어프레임 렌더링 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

와이어프레임 활성화 여부

#### Set Signature

> **set** **landscapeWireframe**(`value`): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L54)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/debugger/LandscapeDebuggerManager.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/debugger/LandscapeDebuggerManager.ts#L103)

디버거 상태를 초기화하고 콜백 참조를 해제합니다.

#### Returns

`void`
