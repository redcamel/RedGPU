[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / init

# Function: init()

> **init**(`canvas`, `onWebGPUInitialized`, `onFailInitialized?`, `onDestroy?`, `alphaMode?`, `requestAdapterOptions?`): `Promise`\<`void`\>

Defined in: [src/init.ts:49](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/init.ts#L49)

WebGPU를 비동기적으로 초기화하고 RedGPUContext를 생성합니다.


브라우저의 WebGPU 지원 여부를 확인하고, GPU 어댑터와 디바이스를 요청한 후 최종적으로 RedGPUContext 인스턴스를 생성하여 콜백을 통해 전달합니다.


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
| `canvas` | `HTMLCanvasElement` | `undefined` | WebGPU를 초기화할 HTML 캔버스 요소
| `onWebGPUInitialized` | (`redGPUContext`) => `void` | `undefined` | 성공 시 호출될 콜백 함수 (RedGPUContext 인스턴스가 인자로 전달됨)
| `onFailInitialized?` | (`message?`) => `void` | `undefined` | 실패 시 호출될 선택적 콜백 함수 (에러 메시지가 인자로 전달됨)
| `onDestroy?` | (`info`) => `void` | `undefined` | 디바이스 유실 시 호출될 선택적 콜백 함수
| `alphaMode?` | `GPUCanvasAlphaMode` | `'premultiplied'` | 캔버스 알파 모드 (기본값: 'premultiplied')
| `requestAdapterOptions?` | `GPURequestAdapterOptions` | `...` | 어댑터 요청 옵션 (기본값: 고성능 설정)

## Returns

`Promise`\<`void`\>

초기화 프로세스 완료를 나타내는 Promise

