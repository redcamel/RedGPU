[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / init

# Function: init()

> **init**(`canvas`, `onWebGPUInitialized`, `onFailInitialized?`, `onDestroy?`, `alphaMode?`, `requestAdapterOptions?`): `Promise`\<`void`\>

Defined in: [src/init.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/init.ts#L56)

Asynchronously initializes the WebGPU adapter and device, and creates a `RedGPUContext` instance.

### Example
```typescript
await RedGPU.init(
  canvas,
  (redGPUContext) => {
    // Start rendering after successful initialization
    console.log(redGPUContext);
  },
  (errorMessage) => {
    // Handle initialization failure
    console.error(errorMessage);
  }
);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `canvas` | `HTMLCanvasElement` | `undefined` | `HTMLCanvasElement` to bind the WebGPU context |
| `onWebGPUInitialized` | (`redGPUContext`) => `void` | `undefined` | Callback function receiving the created `RedGPUContext` upon successful initialization |
| `onFailInitialized?` | (`message?`) => `void` | `undefined` | Optional callback function receiving an error message upon initialization failure |
| `onDestroy?` | (`info`) => `void` | `undefined` | Optional callback function invoked when the GPU device is lost (`GPUDeviceLostInfo`) |
| `alphaMode?` | `GPUCanvasAlphaMode` | `'premultiplied'` | Canvas alpha compositing mode (default: `'premultiplied'`) |
| `requestAdapterOptions?` | `GPURequestAdapterOptions` | `DEFAULT_REQUEST_ADAPTER_OPTIONS` | WebGPU adapter request options (default: `DEFAULT_REQUEST_ADAPTER_OPTIONS`) |

## Returns

`Promise`\<`void`\>

`Promise<void>` representing the completion of initialization
