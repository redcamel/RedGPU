[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / Renderer

# Class: Renderer

Defined in: [src/renderer/Renderer.ts:34](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L34)

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

Defined in: [src/renderer/Renderer.ts:38](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L38)

#### Returns

`Renderer`

## Methods

### renderFrame()

> **renderFrame**(`redGPUContext`, `time`): `void`

Defined in: [src/renderer/Renderer.ts:99](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L99)

Renders a single frame. (Called internally)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `time` | `number` | Current time (ms) |

#### Returns

`void`

***

### renderView()

> **renderView**(`view`): `object`

Defined in: [src/renderer/Renderer.ts:144](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L144)

Renders a specific View3D.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../namespaces/Display/classes/View3D.md) | View3D instance to render |

#### Returns

`object`

Generated render pass descriptor

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `renderPassDescriptor` | `GPURenderPassDescriptor` | [src/renderer/Renderer.ts:145](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L145) |

***

### start()

> **start**(`redGPUContext`, `render`): `void`

Defined in: [src/renderer/Renderer.ts:59](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L59)

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
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `render` | `Function` | User-defined callback function to be executed every frame |

#### Returns

`void`

***

### stop()

> **stop**(`redGPUContext`): `void`

Defined in: [src/renderer/Renderer.ts:83](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/renderer/Renderer.ts#L83)

Stops the rendering loop.

* ### Example
```typescript
renderer.stop(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
