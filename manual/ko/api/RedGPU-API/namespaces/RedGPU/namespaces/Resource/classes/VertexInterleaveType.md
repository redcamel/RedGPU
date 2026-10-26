[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexInterleaveType

# Class: VertexInterleaveType

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L25)

정점 데이터의 인터리브 포맷 규격을 제공하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
const type = RedGPU.Resource.VertexInterleaveType.float32x3;
```

## Constructors

### Constructor

> **new VertexInterleaveType**(): `VertexInterleaveType`

#### Returns

`VertexInterleaveType`

## Accessors

### float32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L34)

float32 포맷 (요소 1개, 4바이트)을 반환합니다.

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32 인터리브 포맷 정보

***

### float32x2

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32x2**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L46)

float32x2 포맷 (요소 2개, 8바이트)을 반환합니다.

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32x2 인터리브 포맷 정보

***

### float32x3

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32x3**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L58)

float32x3 포맷 (요소 3개, 12바이트)을 반환합니다.

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32x3 인터리브 포맷 정보

***

### float32x4

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **float32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L70)

float32x4 포맷 (요소 4개, 16바이트)을 반환합니다.

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

float32x4 인터리브 포맷 정보

***

### uint32x4

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **uint32x4**(): [`TypeInterleave`](../type-aliases/TypeInterleave.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexInterleaveType.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexInterleaveType.ts#L82)

uint32x4 포맷 (요소 4개, 16바이트)을 반환합니다.

##### Returns

[`TypeInterleave`](../type-aliases/TypeInterleave.md)

uint32x4 인터리브 포맷 정보
