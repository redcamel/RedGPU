[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / init

# Function: init()

> **init**(`canvas`, `onWebGPUInitialized`, `onFailInitialized?`, `onDestroy?`, `alphaMode?`, `requestAdapterOptions?`): `Promise`\<`void`\>

Defined in: [src/init.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/init.ts#L56)

WebGPU 어댑터와 디바이스를 비동기로 초기화하고 `RedGPUContext` 인스턴스를 생성합니다.

### Example
```typescript
await RedGPU.init(
  canvas,
  (redGPUContext) => {
    // 초기화 성공 후 렌더링 시작
    console.log(redGPUContext);
  },
  (errorMessage) => {
    // 초기화 실패 처리
    console.error(errorMessage);
  }
);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `canvas` | `HTMLCanvasElement` | `undefined` | WebGPU 컨텍스트를 바인딩할 `HTMLCanvasElement` |
| `onWebGPUInitialized` | (`redGPUContext`) => `void` | `undefined` | 초기화 성공 시 생성된 `RedGPUContext`를 전달받는 콜백 함수 |
| `onFailInitialized?` | (`message?`) => `void` | `undefined` | 초기화 실패 시 에러 메시지를 전달받는 선택적 콜백 함수 |
| `onDestroy?` | (`info`) => `void` | `undefined` | GPU 디바이스 손실(`GPUDeviceLostInfo`) 발생 시 호출되는 선택적 콜백 함수 |
| `alphaMode?` | `GPUCanvasAlphaMode` | `'premultiplied'` | 캔버스 알파 합성 모드 (기본값: `'premultiplied'`) |
| `requestAdapterOptions?` | `GPURequestAdapterOptions` | `DEFAULT_REQUEST_ADAPTER_OPTIONS` | WebGPU 어댑터 요청 옵션 (기본값: `DEFAULT_REQUEST_ADAPTER_OPTIONS`) |

## Returns

`Promise`\<`void`\>

초기화 완료를 나타내는 `Promise<void>`
