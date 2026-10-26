[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Renderer

# Class: Renderer

Defined in: [src/renderer/Renderer.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L33)

RedGPU의 핵심 렌더러 클래스입니다.

렌더링 루프를 관리하고, 각 뷰(View3D)의 렌더링 패스를 실행하며, 최종적으로 화면에 결과를 표시합니다. 디버그 렌더링 및 애니메이션 업데이트도 담당합니다.

### Example
```typescript
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    // 사용자 정의 렌더링 로직 (User custom rendering logic)
});
```

## Constructors

### Constructor

> **new Renderer**(): `Renderer`

Defined in: [src/renderer/Renderer.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L38)

#### Returns

`Renderer`

## Methods

### destroy()

> **destroy**(`redGPUContext?`): `void`

Defined in: [src/renderer/Renderer.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L81)

렌더러 리소스를 정리하고 렌더 루프를 중단합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext?` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 (선택적) |

#### Returns

`void`

***

### renderFrame()

> **renderFrame**(`redGPUContext`, `time`): `void`

Defined in: [src/renderer/Renderer.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L120)

단일 프레임을 렌더링합니다. (내부적으로 호출됨)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `time` | `number` | 현재 시간 (ms) |

#### Returns

`void`

***

### renderView()

> **renderView**(`view`): `object`

Defined in: [src/renderer/Renderer.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L160)

특정 View3D를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../namespaces/Display/classes/View3D.md) | 렌더링할 View3D 인스턴스 |

#### Returns

`object`

생성된 렌더 패스 디스크립터

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `renderPassDescriptor` | `GPURenderPassDescriptor` | [src/renderer/Renderer.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L161) |

***

### start()

> **start**(`redGPUContext`, `render`): `void`

Defined in: [src/renderer/Renderer.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L59)

렌더링 루프를 시작합니다.

#### Example
```typescript
renderer.start(redGPUContext, (time) => {
    // 매 프레임 호출되는 콜백 (Callback called every frame)
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `render` | `Function` | 매 프레임 실행될 사용자 정의 콜백 함수 |

#### Returns

`void`

***

### stop()

> **stop**(`redGPUContext`): `void`

Defined in: [src/renderer/Renderer.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderer/Renderer.ts#L104)

렌더링 루프를 정지합니다.

#### Example
```typescript
renderer.stop(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`void`
