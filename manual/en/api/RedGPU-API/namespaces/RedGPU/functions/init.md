[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / init

# Function: init()

> **init**(`canvas`, `onWebGPUInitialized`, `onFailInitialized?`, `onDestroy?`, `alphaMode?`, `requestAdapterOptions?`): `Promise`\<`void`\>

Defined in: [src/init.ts:49](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/init.ts#L49)


Asynchronously initializes WebGPU and creates a RedGPUContext.


Checks for WebGPU support in the browser, requests a GPU adapter and device, and finally creates a RedGPUContext instance, passing it through a callback.

* ### Example
```typescript
await RedGPU.init(
  canvas,
  (redGPUContext) => {
    console.log('WebGPU 초기화 성공!', redGPUContext);
    // 렌더링 루프 시작 (Start rendering loop)
  },
  (errorMessage) => {
    console.error('초기화 실패:', errorMessage);
  }
);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `canvas` | `HTMLCanvasElement` | `undefined` | HTML canvas element to initialize WebGPU |
| `onWebGPUInitialized` | (`redGPUContext`) => `void` | `undefined` | Callback function to be called on success (RedGPUContext instance is passed as an argument) |
| `onFailInitialized?` | (`message?`) => `void` | `undefined` | Optional callback function to be called on failure (error message is passed as an argument) |
| `onDestroy?` | (`info`) => `void` | `undefined` | Optional callback function to be called when the device is lost |
| `alphaMode?` | `GPUCanvasAlphaMode` | `'premultiplied'` | Canvas alpha mode (Default: 'premultiplied') |
| `requestAdapterOptions?` | `GPURequestAdapterOptions` | `...` | Adapter request options (Default: high-performance setup) |

## Returns

`Promise`\<`void`\>


Promise representing the completion of the initialization process
