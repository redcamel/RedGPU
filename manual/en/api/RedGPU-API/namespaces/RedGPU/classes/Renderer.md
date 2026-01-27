[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Renderer

# Class: Renderer

Defined in: [src/renderer/Renderer.ts:34](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/renderer/Renderer.ts#L34)


The core renderer class of RedGPU.


Manages the rendering loop, executes rendering passes for each View3D, and finally displays the result on the screen. It also handles debug rendering and animation updates.

* ### Example
```typescript
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    // 사용자 정의 렌더링 로직 (User custom rendering logic)
});
```

## Constructors

### Constructor

> **new Renderer**(): `Renderer`

Defined in: [src/renderer/Renderer.ts:40](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/renderer/Renderer.ts#L40)

#### Returns

`Renderer`

## Methods

### renderFrame()

> **renderFrame**(`redGPUContext`, `time`): `void`

Defined in: [src/renderer/Renderer.ts:102](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/renderer/Renderer.ts#L102)


Renders a single frame. (Called internally)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |
| `time` | `number` | Current time (ms) |

#### Returns

`void`

***

### renderView()

> **renderView**(`view`, `time`): `GPURenderPassDescriptor`

Defined in: [src/renderer/Renderer.ts:136](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/renderer/Renderer.ts#L136)


Renders a specific View3D.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../namespaces/Display/classes/View3D.md) | View3D instance to render |
| `time` | `number` | Current time (ms) |

#### Returns

`GPURenderPassDescriptor`


Generated render pass descriptor

***

### start()

> **start**(`redGPUContext`, `render`): `void`

Defined in: [src/renderer/Renderer.ts:61](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/renderer/Renderer.ts#L61)


Starts the rendering loop.

* ### Example
```typescript
renderer.start(redGPUContext, (time) => {
    // 매 프레임 호출되는 콜백 (Callback called every frame)
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |
| `render` | `Function` | User-defined callback function to be executed every frame |

#### Returns

`void`

***

### stop()

> **stop**(`redGPUContext`): `void`

Defined in: [src/renderer/Renderer.ts:86](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/renderer/Renderer.ts#L86)


Stops the rendering loop.

* ### Example
```typescript
renderer.stop(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
