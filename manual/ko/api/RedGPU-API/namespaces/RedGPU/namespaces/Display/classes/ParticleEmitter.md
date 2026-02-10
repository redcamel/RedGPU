[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / ParticleEmitter

# Class: ParticleEmitter

Defined in: [src/display/paticle/ParticleEmitter.ts:18](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L18)

GPU 기반 파티클 시스템을 위한 이미터(Emitter) 클래스입니다.


다양한 파티클 속성(수명, 위치, 스케일, 회전, 알파, 이징 등)과 GPU 연산 기반의 대량 파티클 처리를 지원합니다. 파티클의 초기값/최종값 범위, 이징, 버퍼 구조, 컴퓨트 파이프라인 등 파티클 시뮬레이션에 필요한 모든 기능을 제공합니다.


* ### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.particleNum = 5000;
scene.addChild(emitter);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/particle/basic/"></iframe>

아래는 ParticleEmitter의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.


## See

[ParticleEmitter Performance](https://redcamel.github.io/RedGPU/examples/3d/particle/performance/)

## Roadmap
- **다양한 파티클 이미터 타입 지원**
- **

## Extends

- [`Mesh`](Mesh.md)

## Constructors

### Constructor

> **new ParticleEmitter**(`redGPUContext`): `ParticleEmitter`

Defined in: [src/display/paticle/ParticleEmitter.ts:165](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L165)

ParticleEmitter 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU 컨텍스트

#### Returns

`ParticleEmitter`

#### Inherited from

[`Mesh`](Mesh.md).[`constructor`](Mesh.md#constructor)

## Properties

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:374](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L374)

#### Inherited from

[`Mesh`](Mesh.md).[`_geometry`](Mesh.md#_geometry)

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:349](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L349)

#### Inherited from

[`Mesh`](Mesh.md).[`_material`](Mesh.md#_material)

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:33](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L33)

#### animationsList

> **animationsList**: `GLTFParsedSingleClip`[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Mesh`](Mesh.md).[`animationInfo`](Mesh.md#animationinfo)

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:93](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L93)

그림자 캐스팅 여부


#### Inherited from

[`Mesh`](Mesh.md).[`castShadow`](Mesh.md#castshadow)

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:98](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L98)

LOD 정보 변경 필요 여부


#### Inherited from

[`Mesh`](Mesh.md).[`dirtyLOD`](Mesh.md#dirtylod)

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:49](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L49)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyOpacity`](Mesh.md#dirtyopacity)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:47](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L47)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyPipeline`](Mesh.md#dirtypipeline)

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:48](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L48)

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyTransform`](Mesh.md#dirtytransform)

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L45)

#### Inherited from

[`Mesh`](Mesh.md).[`disableJitter`](Mesh.md#disablejitter)

***

### displacementTexture

> **displacementTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/mesh/Mesh.ts:88](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L88)

메시의 디스플레이스먼트 텍스처


#### Inherited from

[`Mesh`](Mesh.md).[`displacementTexture`](Mesh.md#displacementtexture)

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:46](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L46)

#### Inherited from

[`Mesh`](Mesh.md).[`gltfLoaderInfo`](Mesh.md#gltfloaderinfo)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:32](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L32)

#### Inherited from

[`Mesh`](Mesh.md).[`gpuRenderInfo`](Mesh.md#gpurenderinfo)

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:51](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L51)

#### Inherited from

[`Mesh`](Mesh.md).[`localMatrix`](Mesh.md#localmatrix)

***

### meshType

> **meshType**: `string`

Defined in: [src/display/mesh/Mesh.ts:46](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L46)

#### Inherited from

[`Mesh`](Mesh.md).[`meshType`](Mesh.md#meshtype)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:50](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L50)

이 객체의 모델 행렬입니다. 위치, 회전, 스케일 변환에 사용됩니다.

#### Inherited from

[`Mesh`](Mesh.md).[`modelMatrix`](Mesh.md#modelmatrix)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:52](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L52)

#### Inherited from

[`Mesh`](Mesh.md).[`normalModelMatrix`](Mesh.md#normalmodelmatrix)

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:103](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L103)

프러스텀 컬링 통과 여부


#### Inherited from

[`Mesh`](Mesh.md).[`passFrustumCulling`](Mesh.md#passfrustumculling)

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:44](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L44)

#### Inherited from

[`Mesh`](Mesh.md).[`receiveShadow`](Mesh.md#receiveshadow)

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/paticle/ParticleEmitter.ts:19](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L19)

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:47](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L47)

#### Inherited from

[`Mesh`](Mesh.md).[`useDisplacementTexture`](Mesh.md#usedisplacementtexture)

## Accessors

### boundingAABB

#### Get Signature

> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L783)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`boundingAABB`](Mesh.md#boundingaabb)

***

### boundingOBB

#### Get Signature

> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:770](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L770)

OBB(Oriented Bounding Box) 정보를 반환합니다.


##### Returns

[`OBB`](../../Bound/classes/OBB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`boundingOBB`](Mesh.md#boundingobb)

***

### children

#### Get Signature

> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:42](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L42)

현재 컨테이너에 포함된 자식 Mesh 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 객체 배열

#### Inherited from

[`Mesh`](Mesh.md).[`children`](Mesh.md#children)

***

### combinedBoundingAABB

#### Get Signature

> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:796](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L796)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.


##### Returns

[`AABB`](../../Bound/classes/AABB.md)

#### Inherited from

[`Mesh`](Mesh.md).[`combinedBoundingAABB`](Mesh.md#combinedboundingaabb)

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L79)

##### Returns

`string`

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:83](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`currentShaderModuleName`](Mesh.md#currentshadermodulename)

***

### depthStencilState

#### Get Signature

> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:92](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L92)

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

#### Inherited from

[`Mesh`](Mesh.md).[`depthStencilState`](Mesh.md#depthstencilstate)

***

### drawDebugger

#### Get Signature

> **get** **drawDebugger**(): `DrawDebuggerMesh`

Defined in: [src/display/mesh/Mesh.ts:345](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L345)

디버그 메시 객체를 반환합니다.


##### Returns

`DrawDebuggerMesh`

#### Inherited from

[`Mesh`](Mesh.md).[`drawDebugger`](Mesh.md#drawdebugger)

***

### easeAlpha

#### Get Signature

> **get** **easeAlpha**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:908](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L908)

알파 변화에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeAlpha**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:917](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L917)

알파 변화에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeRotationX

#### Get Signature

> **get** **easeRotationX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:942](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L942)

X축 회전에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeRotationX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:951](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L951)

X축 회전에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeRotationY

#### Get Signature

> **get** **easeRotationY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:959](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L959)

Y축 회전에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeRotationY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:968](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L968)

Y축 회전에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeRotationZ

#### Get Signature

> **get** **easeRotationZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:976](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L976)

Z축 회전에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeRotationZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:985](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L985)

Z축 회전에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeScale

#### Get Signature

> **get** **easeScale**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:925](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L925)

스케일 변화에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeScale**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:934](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L934)

스케일 변화에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeX

#### Get Signature

> **get** **easeX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:857](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L857)

X축 이동에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:866](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L866)

X축 이동에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeY

#### Get Signature

> **get** **easeY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:874](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L874)

Y축 이동에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:883](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L883)

Y축 이동에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### easeZ

#### Get Signature

> **get** **easeZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:891](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L891)

Z축 이동에 적용할 이징 타입을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **easeZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:900](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L900)

Z축 이동에 적용할 이징 타입을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | PARTICLE_EASE 값

##### Returns

`void`

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:325](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L325)

디버거 활성화 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:336](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L336)

디버거 활성화 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 활성화 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableDebugger`](Mesh.md#enabledebugger)

***

### events

#### Get Signature

> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:448](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L448)

등록된 이벤트들을 반환합니다.


##### Returns

`any`

#### Inherited from

[`Mesh`](Mesh.md).[`events`](Mesh.md#events)

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L379)

지오메트리를 반환합니다.


##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:390](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L390)

지오메트리를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) | 설정할 지오메트리

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`geometry`](Mesh.md#geometry)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:100](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L100)

Retrieves the GPU device associated with the current instance.

##### Returns

`GPUDevice`

The GPU device.

#### Inherited from

[`Mesh`](Mesh.md).[`gpuDevice`](Mesh.md#gpudevice)

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:421](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L421)

프러스텀 컬링 무시 여부를 반환합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:432](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L432)

프러스텀 컬링 무시 여부를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | 무시 여부

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`ignoreFrustumCulling`](Mesh.md#ignorefrustumculling)

***

### LODManager

#### Get Signature

> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:317](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L317)

LOD(Level of Detail) 매니저를 반환합니다.


##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스


#### Inherited from

[`Mesh`](Mesh.md).[`LODManager`](Mesh.md#lodmanager)

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:354](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L354)

머티리얼을 반환합니다.


##### Returns

`any`

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:365](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L365)

머티리얼을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | 설정할 머티리얼

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`material`](Mesh.md#material)

***

### maxEndAlpha

#### Get Signature

> **get** **maxEndAlpha**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:568](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L568)

최대 종료 알파를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxEndAlpha**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:577](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L577)

최대 종료 알파를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndRotationX

#### Get Signature

> **get** **maxEndRotationX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:806](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L806)

최대 종료 X 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **maxEndRotationX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:815](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L815)

최대 종료 X 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndRotationY

#### Get Signature

> **get** **maxEndRotationY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:823](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L823)

최대 종료 Y 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **maxEndRotationY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:832](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L832)

최대 종료 Y 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndRotationZ

#### Get Signature

> **get** **maxEndRotationZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:840](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L840)

최대 종료 Z 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **maxEndRotationZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:849](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L849)

최대 종료 Z 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndScale

#### Get Signature

> **get** **maxEndScale**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:636](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L636)

최대 종료 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxEndScale**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:645](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L645)

최대 종료 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndX

#### Get Signature

> **get** **maxEndX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:466](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L466)

최대 종료 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxEndX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:475](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L475)

최대 종료 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndY

#### Get Signature

> **get** **maxEndY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:483](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L483)

최대 종료 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxEndY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:492](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L492)

최대 종료 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxEndZ

#### Get Signature

> **get** **maxEndZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:500](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L500)

최대 종료 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxEndZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:509](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L509)

최대 종료 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxLife

#### Get Signature

> **get** **maxLife**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:293](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L293)

파티클의 최대 수명을 반환합니다. (ms)


##### Returns

`number`

최대 수명


#### Set Signature

> **set** **maxLife**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:305](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L305)

파티클의 최대 수명을 설정합니다. (ms)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최대 수명

##### Returns

`void`

***

### maxStartAlpha

#### Get Signature

> **get** **maxStartAlpha**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:534](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L534)

최대 시작 알파를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxStartAlpha**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:543](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L543)

최대 시작 알파를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartRotationX

#### Get Signature

> **get** **maxStartRotationX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:704](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L704)

최대 시작 X 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **maxStartRotationX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:713](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L713)

최대 시작 X 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartRotationY

#### Get Signature

> **get** **maxStartRotationY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:721](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L721)

최대 시작 Y 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **maxStartRotationY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:730](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L730)

최대 시작 Y 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartRotationZ

#### Get Signature

> **get** **maxStartRotationZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:738](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L738)

최대 시작 Z 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **maxStartRotationZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:747](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L747)

최대 시작 Z 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartScale

#### Get Signature

> **get** **maxStartScale**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:602](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L602)

최대 시작 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxStartScale**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:611](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L611)

최대 시작 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartX

#### Get Signature

> **get** **maxStartX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:364](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L364)

최대 시작 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxStartX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:373](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L373)

최대 시작 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartY

#### Get Signature

> **get** **maxStartY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:381](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L381)

최대 시작 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxStartY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:390](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L390)

최대 시작 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### maxStartZ

#### Get Signature

> **get** **maxStartZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:398](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L398)

최대 시작 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **maxStartZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:407](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L407)

최대 시작 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndAlpha

#### Get Signature

> **get** **minEndAlpha**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:551](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L551)

최소 종료 알파를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minEndAlpha**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:560](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L560)

최소 종료 알파를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndRotationX

#### Get Signature

> **get** **minEndRotationX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:755](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L755)

최소 종료 X 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **minEndRotationX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:764](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L764)

최소 종료 X 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndRotationY

#### Get Signature

> **get** **minEndRotationY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:772](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L772)

최소 종료 Y 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **minEndRotationY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:781](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L781)

최소 종료 Y 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndRotationZ

#### Get Signature

> **get** **minEndRotationZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:789](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L789)

최소 종료 Z 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **minEndRotationZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:798](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L798)

최소 종료 Z 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndScale

#### Get Signature

> **get** **minEndScale**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:619](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L619)

최소 종료 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minEndScale**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:628](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L628)

최소 종료 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndX

#### Get Signature

> **get** **minEndX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:415](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L415)

최소 종료 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minEndX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:424](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L424)

최소 종료 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndY

#### Get Signature

> **get** **minEndY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:432](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L432)

최소 종료 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minEndY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:441](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L441)

최소 종료 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minEndZ

#### Get Signature

> **get** **minEndZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:449](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L449)

최소 종료 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minEndZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:458](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L458)

최소 종료 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minLife

#### Get Signature

> **get** **minLife**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:269](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L269)

파티클의 최소 수명을 반환합니다. (ms)


##### Returns

`number`

최소 수명


#### Set Signature

> **set** **minLife**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:281](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L281)

파티클의 최소 수명을 설정합니다. (ms)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 최소 수명

##### Returns

`void`

***

### minStartAlpha

#### Get Signature

> **get** **minStartAlpha**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:517](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L517)

최소 시작 알파를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minStartAlpha**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:526](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L526)

최소 시작 알파를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartRotationX

#### Get Signature

> **get** **minStartRotationX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:653](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L653)

최소 시작 X 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **minStartRotationX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:662](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L662)

최소 시작 X 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartRotationY

#### Get Signature

> **get** **minStartRotationY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:670](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L670)

최소 시작 Y 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **minStartRotationY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:679](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L679)

최소 시작 Y 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartRotationZ

#### Get Signature

> **get** **minStartRotationZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:687](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L687)

최소 시작 Z 회전을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **minStartRotationZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:696](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L696)

최소 시작 Z 회전을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartScale

#### Get Signature

> **get** **minStartScale**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:585](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L585)

최소 시작 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minStartScale**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:594](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L594)

최소 시작 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartX

#### Get Signature

> **get** **minStartX**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:313](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L313)

최소 시작 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minStartX**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:322](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L322)

최소 시작 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartY

#### Get Signature

> **get** **minStartY**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:330](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L330)

최소 시작 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minStartY**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:339](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L339)

최소 시작 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### minStartZ

#### Get Signature

> **get** **minStartZ**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:347](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L347)

최소 시작 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **minStartZ**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:356](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L356)

최소 시작 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 값

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/display/mesh/Mesh.ts:456](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L456)

메시의 이름을 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:468](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L468)

메시의 이름을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 메시 이름

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`name`](Mesh.md#name)

***

### numChildren

#### Get Signature

> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:50](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L50)

자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 수

#### Inherited from

[`Mesh`](Mesh.md).[`numChildren`](Mesh.md#numchildren)

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:400](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L400)

메시의 투명도를 반환합니다. (0~1)


##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:411](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L411)

메시의 투명도를 설정합니다. (0~1)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 투명도 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`opacity`](Mesh.md#opacity)

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:484](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L484)

설정된 부모 객체를 반환합니다.


##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:495](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L495)

부모 객체를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) | 부모 컨테이너

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`parent`](Mesh.md#parent)

***

### particleBuffers

#### Get Signature

> **get** **particleBuffers**(): `GPUBuffer`[]

Defined in: [src/display/paticle/ParticleEmitter.ts:992](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L992)

파티클 버퍼(GPUBuffer) 배열 반환

##### Returns

`GPUBuffer`[]

***

### particleNum

#### Get Signature

> **get** **particleNum**(): `number`

Defined in: [src/display/paticle/ParticleEmitter.ts:243](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L243)

파티클 개수를 반환합니다. (최대 500,000, 최소 1)


##### Returns

`number`

파티클 개수


#### Set Signature

> **set** **particleNum**(`value`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:255](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L255)

파티클 개수를 설정합니다. 설정 시 시뮬레이션 버퍼가 재구성됩니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 파티클 개수 (1 ~ 500,000)

##### Returns

`void`

***

### pickingId

#### Get Signature

> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:440](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L440)

피킹 ID를 반환합니다.


##### Returns

`number`

#### Inherited from

[`Mesh`](Mesh.md).[`pickingId`](Mesh.md#pickingid)

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:503](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L503)

피벗 X 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:514](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L514)

피벗 X 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotX`](Mesh.md#pivotx)

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:523](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L523)

피벗 Y 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L534)

피벗 Y 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotY`](Mesh.md#pivoty)

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:543](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L543)

피벗 Z 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:554](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L554)

피벗 Z 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotZ`](Mesh.md#pivotz)

***

### position

#### Get Signature

> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:626](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L626)

현재 위치를 반환합니다. [x, y, z]


##### Returns

`Float32Array`

위치 배열


#### Inherited from

[`Mesh`](Mesh.md).[`position`](Mesh.md#position)

***

### primitiveState

#### Get Signature

> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:88](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L88)

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

#### Inherited from

[`Mesh`](Mesh.md).[`primitiveState`](Mesh.md#primitivestate)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:109](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L109)

Retrieves the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

The RedGPUContext instance.

#### Inherited from

[`Mesh`](Mesh.md).[`redGPUContext`](Mesh.md#redgpucontext)

***

### rotation

#### Get Signature

> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:762](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L762)

현재 회전값을 반환합니다. [x, y, z] (도)


##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](Mesh.md).[`rotation`](Mesh.md#rotation)

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:702](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L702)

X축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:713](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L713)

X축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationX`](Mesh.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:722](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L722)

Y축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:733](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L733)

Y축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationY`](Mesh.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:742](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L742)

Z축 회전값을 반환합니다. (도)


##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:753](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L753)

Z축 회전값을 설정합니다. (도)


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 회전값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationZ`](Mesh.md#rotationz)

***

### scale

#### Get Signature

> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L694)

현재 스케일을 반환합니다. [x, y, z]


##### Returns

`Float32Array`

#### Inherited from

[`Mesh`](Mesh.md).[`scale`](Mesh.md#scale)

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:634](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L634)

X축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:645](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L645)

X축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleX`](Mesh.md#scalex)

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:654](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L654)

Y축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:665](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L665)

Y축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleY`](Mesh.md#scaley)

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:674](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L674)

Z축 스케일을 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:685](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L685)

Z축 스케일을 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 스케일 값

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleZ`](Mesh.md#scalez)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:75](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L75)

Retrieves the UUID of the object.

##### Returns

`string`

The UUID of the object.

#### Inherited from

[`Mesh`](Mesh.md).[`uuid`](Mesh.md#uuid)

***

### vertexStateBuffers

#### Get Signature

> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/paticle/ParticleEmitter.ts:181](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L181)

버텍스 상태 버퍼 레이아웃을 반환합니다.


##### Returns

`GPUVertexBufferLayout`[]

#### Inherited from

[`Mesh`](Mesh.md).[`vertexStateBuffers`](Mesh.md#vertexstatebuffers)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:563](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L563)

X 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:574](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L574)

X 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`x`](Mesh.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:583](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L583)

Y 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:594](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L594)

Y 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`y`](Mesh.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:603](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L603)

Z 위치 좌표를 반환합니다.


##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L614)

Z 위치 좌표를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z 좌표

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`z`](Mesh.md#z)

## Methods

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:130](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L130)

Fires the dirty listeners list.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Indicates whether to reset the dirty listeners list after firing. |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`__fireListenerList`](Mesh.md#__firelistenerlist)

***

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:69](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L69)

자식 Mesh를 컨테이너에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 객체 또는 실패 시 null

#### Inherited from

[`Mesh`](Mesh.md).[`addChild`](Mesh.md#addchild)

***

### addChildAt()

> **addChildAt**(`child`, `index`): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:87](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L87)

자식 Mesh를 특정 인덱스에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입 위치 |

#### Returns

`ParticleEmitter`

현재 컨테이너

#### Inherited from

[`Mesh`](Mesh.md).[`addChildAt`](Mesh.md#addchildat)

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:897](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L897)

이벤트 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름
| `callback` | `Function` | 콜백 함수

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`addListener`](Mesh.md#addlistener)

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1007](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L1007)

**`Experimental`**

메시를 복제합니다.


#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스


#### Inherited from

[`Mesh`](Mesh.md).[`clone`](Mesh.md#clone)

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:59](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L59)

특정 Mesh가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`Mesh`](Mesh.md).[`contains`](Mesh.md#contains)

***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/paticle/ParticleEmitter.ts:1011](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L1011)

커스텀 버텍스 셰이더 모듈을 생성합니다.

#### Returns

`GPUShaderModule`

생성된 셰이더 모듈

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1711](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L1711)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` |
| `SHADER_INFO` | `any` |
| `UNIFORM_STRUCT_BASIC` | `any` |
| `vertexModuleSource` | `any` |

#### Returns

`GPUShaderModule`

#### Inherited from

[`Mesh`](Mesh.md).[`createMeshVertexShaderModuleBASIC`](Mesh.md#createmeshvertexshadermodulebasic)

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:109](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L109)

지정된 인덱스의 자식 Mesh를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 또는 undefined

#### Inherited from

[`Mesh`](Mesh.md).[`getChildAt`](Mesh.md#getchildat)

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:123](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L123)

특정 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 조회할 자식 객체 |

#### Returns

`number`

인덱스 또는 -1

#### Inherited from

[`Mesh`](Mesh.md).[`getChildIndex`](Mesh.md#getchildindex)

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:879](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L879)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.


#### Returns

`number`

통합 투명도 값


#### Inherited from

[`Mesh`](Mesh.md).[`getCombinedOpacity`](Mesh.md#getcombinedopacity)

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L121)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

\[`number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`getScreenPoint`](Mesh.md#getscreenpoint)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1697](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L1697)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`initGPURenderInfos`](Mesh.md#initgpurenderinfos)

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:117](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L117)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`localToWorld`](Mesh.md#localtoworld)

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:915](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L915)

메시가 특정 좌표를 바라보도록 회전시킵니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 대상 X 좌표 또는 [x, y, z] 배열
| `targetY?` | `number` | 대상 Y 좌표 (targetX가 배열인 경우 무시됨)
| `targetZ?` | `number` | 대상 Z 좌표 (targetX가 배열인 경우 무시됨)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`lookAt`](Mesh.md#lookat)

***

### removeAllChildren()

> **removeAllChildren**(): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:232](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L232)

모든 자식 객체를 제거합니다.

#### Returns

`ParticleEmitter`

현재 컨테이너

#### Inherited from

[`Mesh`](Mesh.md).[`removeAllChildren`](Mesh.md#removeallchildren)

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:201](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L201)

특정 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChild`](Mesh.md#removechild)

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:217](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L217)

지정된 인덱스의 자식 객체를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 위치 |

#### Returns

[`Mesh`](Mesh.md)

제거된 객체

#### Inherited from

[`Mesh`](Mesh.md).[`removeChildAt`](Mesh.md#removechildat)

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/paticle/ParticleEmitter.ts:1000](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/paticle/ParticleEmitter.ts#L1000)

파티클 렌더링 및 시뮬레이션을 수행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 렌더 상태 데이터 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`render`](Mesh.md#render)

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:825](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L825)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 캐스팅 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setCastShadowRecursively`](Mesh.md#setcastshadowrecursively)

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:138](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L138)

자식 객체의 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 대상 자식 객체 |
| `index` | `number` | 새 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setChildIndex`](Mesh.md#setchildindex)

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:807](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L807)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger` | `boolean` | `false` | 활성화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setEnableDebuggerRecursively`](Mesh.md#setenabledebuggerrecursively)

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:861](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L861)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 무시 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setIgnoreFrustumCullingRecursively`](Mesh.md#setignorefrustumcullingrecursively)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:966](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L966)

위치를 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표
| `y?` | `number` | Y 좌표 (생략 시 x와 동일)
| `z?` | `number` | Z 좌표 (생략 시 x와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setPosition`](Mesh.md#setposition)

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:843](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L843)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `boolean` | `false` | 수신 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setReceiveShadowRecursively`](Mesh.md#setreceiveshadowrecursively)

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:989](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L989)

회전값을 설정합니다. (도)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전
| `rotationY?` | `number` | Y축 회전 (생략 시 rotationX와 동일)
| `rotationZ?` | `number` | Z축 회전 (생략 시 rotationX와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setRotation`](Mesh.md#setrotation)

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:943](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/Mesh.ts#L943)

스케일을 설정합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일)
| `z?` | `number` | Z축 스케일 (생략 시 x와 동일)

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setScale`](Mesh.md#setscale)

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:161](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L161)

두 자식 객체의 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 객체 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildren`](Mesh.md#swapchildren)

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:181](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/Object3DContainer.ts#L181)

두 인덱스의 자식 객체 위치를 서로 바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildrenAt`](Mesh.md#swapchildrenat)

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:113](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/display/mesh/core/MeshBase.ts#L113)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `x` | `number` |
| `y` | `number` |
| `z` | `number` |

#### Returns

\[`number`, `number`, `number`\]

#### Inherited from

[`Mesh`](Mesh.md).[`worldToLocal`](Mesh.md#worldtolocal)
