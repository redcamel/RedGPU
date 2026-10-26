[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheet3D

# Class: SpriteSheet3D

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L35)

3D 공간에서 스프라이트 시트 애니메이션을 표시하는 클래스입니다.

단일 프레임 세그먼트 종횡비에 맞춰 가로·세로 비율(`renderRatioX`, `renderRatioY`)이 자동 산출되며, 빌보드 회전(`useBillboard`)과 크기 모드(`usePixelSize`: `worldSize` 또는 `pixelSize`)가 서로 독립적으로 동작합니다.

***

### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
scene.addChild(spriteSheet);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/" style="width:100%; height:500px;"></iframe>

## See

- [SpriteSheet3D Basic Example](https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/)
 - [SpriteSheet3D Comparison (World vs Pixel)](https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
 - [SpriteSheet3D MouseEvent Example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)

## Extends

- [`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md)

## Constructors



***

### Constructor

> **new SpriteSheet3D**(`redGPUContext`, `spriteSheetInfo`): `SpriteSheet3D`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L62)

SpriteSheet3D 인스턴스를 생성합니다.

#### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `spriteSheetInfo` | [`SpriteSheetInfo`](SpriteSheetInfo.md) | 스프라이트 시트 정의 정보(`SpriteSheetInfo`) 인스턴스 |

#### Returns

`SpriteSheet3D`

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`constructor`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#constructor)

## Properties



## Accessors



***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:209](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L209)

내부 고정 `Plane` 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.

##### Throws

새 지오메트리 할당 시 에러가 발생합니다.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

지오메트리 인스턴스

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L213)

현재 지오메트리를 반환합니다. 지오메트리 변경 시도는 에러를 발생시킵니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

지오메트리 인스턴스

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`geometry`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#geometry)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:228](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L228)

내부 고정 머티리얼을 반환합니다. 외부에서 변경할 수 없습니다.

##### Throws

새 머티리얼 할당 시 에러가 발생합니다.

##### Returns

`any`

머티리얼 인스턴스

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:232](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L232)

현재 머티리얼을 반환합니다. 머티리얼 변경 시도는 에러를 발생시킵니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

머티리얼 인스턴스

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`material`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#material)

***

***

### pixelSize

#### Get Signature

> **get** **pixelSize**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L132)

고정 픽셀 크기 모드(`usePixelSize: true`)에서 표시할 세로 픽셀 크기(px 단위, 미지정 시 단일 세그먼트 세로 해상도)를 반환하거나 설정합니다.

##### Returns

`number`

세로 픽셀 크기 (단위: px)

#### Set Signature

> **set** **pixelSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### renderRatioX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioX**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L182)

세그먼트 종횡비와 현재 크기 모드에 따라 산출된 가로 렌더링 스케일 비율을 반환합니다.

##### Returns

`number`

가로 렌더링 비율

***

***

### renderRatioY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderRatioY**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:194](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L194)

현재 크기 모드에 따라 산출된 세로 렌더링 스케일 비율을 반환합니다.

##### Returns

`number`

세로 렌더링 비율

***

***

### useBillboard

#### Get Signature

> **get** **useBillboard**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L94)

카메라를 항상 정면으로 바라보는 빌보드 모드 사용 여부를 반환하거나 설정합니다. (기본값: `true`)

##### Returns

`boolean`

빌보드 모드 활성화 여부

#### Set Signature

> **set** **useBillboard**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L98)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### usePixelSize

#### Get Signature

> **get** **usePixelSize**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L156)

카메라 거리와 무관한 화면 고정 픽셀 크기(`pixelSize`) 모드 사용 여부를 반환하거나 설정합니다. (기본값: `false`)

##### Returns

`boolean`

고정 픽셀 크기 모드 활성화 여부

#### Set Signature

> **set** **usePixelSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L160)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### worldSize

#### Get Signature

> **get** **worldSize**(): `number`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L114)

월드 단위 크기 모드(`usePixelSize: false`)에서 기준 세로 크기(Unit 단위)를 반환하거나 설정합니다. (기본값: `1`)

##### Returns

`number`

월드 공간 기준 세로 크기

#### Set Signature

> **set** **worldSize**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:118](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L256)

`SpriteSheet3D` 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.

#### Returns

`GPUShaderModule`

생성된 `GPUShaderModule` 인스턴스

#### Overrides

`ASpriteSheet.createCustomMeshVertexShaderModule`

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts:244](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/spriteSheet3D/SpriteSheet3D.ts#L244)

현재 프레임 상태를 갱신하고 스프라이트 시트를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 뷰의 렌더링 상태 데이터 |

#### Returns

`void`

#### Overrides

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`render`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#render)

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L301)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`_geometry`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L279)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`_material`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#_material)

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L42)

GLTF 모프, 스킨 및 클립 애니메이션 정보입니다.

#### animationsList

> **animationsList**: [`ClipAnimState`](../../../classes/ClipAnimState.md)[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`animationInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#animationinfo)

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L99)

그림자 캐스팅 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`castShadow`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#castshadow)

***

***

### currentIndex

> **currentIndex**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L39)

현재 프레임 인덱스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`currentIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#currentindex)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L104)

LOD 정보 변경 필요 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyLOD`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L74)

불투명도(Opacity) 갱신이 필요한지 여부입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyOpacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L64)

렌더 파이프라인 갱신이 필요한지 여부입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyPipeline`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L69)

트랜스폼 행렬 갱신이 필요한지 여부입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`dirtyTransform`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#dirtytransform)

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L50)

TAA 지터(Jitter) 비활성화 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`disableJitter`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#disablejitter)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L59)

이 객체를 로드한 GLTFLoader 인스턴스 정보입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gltfLoaderInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L37)

GPU 버텍스 렌더링 정보 객체입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gpuRenderInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L60)

Mesh 인스턴스 여부 판별 식별자

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`isInstanceofMesh`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#isinstanceofmesh)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L84)

부모 기준 로컬 변환 행렬입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`localMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L79)

월드 변환이 적용된 모델 행렬입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`modelMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L89)

법선 벡터 변환에 사용되는 노멀 모델 행렬입니다.

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`normalModelMatrix`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#normalmodelmatrix)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L109)

프러스텀 컬링 통과 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`passFrustumCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L45)

그림자 수신 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`receiveShadow`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#receiveshadow)

***

***

### segmentH

> **segmentH**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L29)

세로 세그먼트 분할 수

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`segmentH`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#segmenth)

***

***

### segmentW

> **segmentW**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L24)

가로 세그먼트 분할 수

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`segmentW`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#segmentw)

***

***

### totalFrame

> **totalFrame**: `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L34)

총 프레임 수

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`totalFrame`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#totalframe)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L55)

변위 텍스처(Displacement Texture) 사용 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`useDisplacementTexture`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#usedisplacementtexture)

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:751](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L751)

AABB(Axis-Aligned Bounding Box) 정보를 반환합니다. (Zero-GC 인플레이스 재사용)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

계산된 AABB 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`boundingAABB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#boundingaabb)

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:736](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L736)

OBB(Oriented Bounding Box) 정보를 반환합니다.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

계산된 OBB 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`boundingOBB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#boundingobb)

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L46)

자식 객체 배열을 반환합니다.

##### Returns

[`Mesh`](Mesh.md)[]

자식 Mesh 배열 (`Mesh[]`)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`children`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#children)

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:771](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L771)

자식 객체들을 포함한 통합 AABB 정보를 반환합니다.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

통합된 AABB 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`combinedBoundingAABB`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#combinedboundingaabb)

***

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L121)

현재 적용된 버텍스 셰이더 모듈의 이름을 가져오거나 설정합니다.

##### Returns

`string`

현재 버텍스 셰이더 모듈 이름

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`currentShaderModuleName`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#currentshadermodulename)

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L149)

객체의 깊이/스텐실 렌더링 상태(`DepthStencilState`)를 반환합니다.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`depthStencilState`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#depthstencilstate)

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L234)

드로우 버퍼 매니저를 반환합니다.

##### Returns

`DrawBufferManager`

DrawBufferManager 인스턴스 또는 `null`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawBufferManager`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawbuffermanager)

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:222](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L222)

드로우 커맨드 슬롯을 반환합니다.

##### Returns

`DrawCommandSlot`

DrawCommandSlot 인스턴스 또는 `null`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawCommandSlot`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawcommandslot)

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L275)

디버그 메시 객체를 반환합니다.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`drawDebugger`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#drawdebugger)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L258)

디버거 활성화 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

디버거 활성화 여부

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`enableDebugger`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#enabledebugger)

***

***

### enableWaterInteraction

#### Get Signature

> **get** **enableWaterInteraction**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L447)

물(Lake)과의 실시간 파동 인터랙션 활성화 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

물 파동 인터랙션 활성화 여부

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L451)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`enableWaterInteraction`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#enablewaterinteraction)

***

***

### events

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:407](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L407)

등록된 이벤트 맵 객체를 반환합니다.

##### Returns

`any`

등록된 이벤트 객체

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`events`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#events)

***

***

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L131)

초당 프레임 수(FPS)를 반환하거나 설정합니다. 음수 입력 시 `0`으로 보정됩니다.

##### Returns

`number`

초당 프레임 수 (FPS)

#### Set Signature

> **set** **frameRate**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:135](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L135)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`frameRate`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#framerate)

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L210)

글로벌 버퍼 슬롯 인덱스를 반환합니다.

##### Returns

`number`

글로벌 버텍스 슬롯 인덱스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`globalVertexSlotIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#globalvertexslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L161)

현재 인스턴스에 연결된 WebGPU 디바이스를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`gpuDevice`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#gpudevice)

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L347)

프러스텀 컬링 무시 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

프러스텀 컬링 무시 여부

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L351)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`ignoreFrustumCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#ignorefrustumculling)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`instanceId`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#instanceid)

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L246)

LOD(Level of Detail) 매니저를 반환합니다.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`LODManager`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#lodmanager)

***

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L115)

애니메이션 반복 재생 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

반복 재생 여부

#### Set Signature

> **set** **loop**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`loop`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#loop)

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L379)

투영 면적 컬링의 화면상 크기 비율 임계값을 가져오거나 설정합니다.

##### Returns

`number`

화면상 크기 비율 임계값

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:383](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L383)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`minScreenSpaceSize`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#minscreenspacesize)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`name`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L58)

등록된 자식 객체의 개수를 반환합니다.

##### Returns

`number`

자식 객체 개수

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`numChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#numchildren)

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L329)

메시의 투명도를 가져오거나 설정합니다 (0~1).

##### Returns

`number`

투명도 값 (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`opacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#opacity)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L431)

설정된 부모 컨테이너 객체를 가져오거나 설정합니다.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

부모 Object3DContainer 인스턴스

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L435)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`parent`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#parent)

***

***

### pickingId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:395](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L395)

피킹 ID를 반환합니다.

##### Returns

`number`

피킹 식별자 값

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pickingId`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pickingid)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L496)

피벗 X 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 X 좌표

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:500](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L500)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L513)

피벗 Y 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 Y 좌표

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:517](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L517)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L530)

피벗 Z 좌표를 가져오거나 설정합니다.

##### Returns

`number`

피벗 Z 좌표

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pivotZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L598)

현재 위치를 반환합니다. [x, y, z]

##### Returns

`Float32Array`

위치 배열

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`position`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#position)

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L137)

객체의 프리미티브 렌더링 상태(`PrimitiveState`)를 반환합니다.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`primitiveState`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#primitivestate)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L173)

현재 인스턴스에 연결된 RedGPUContext를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`redGPUContext`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#redgpucontext)

***

***

### rotation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:724](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L724)

현재 회전값을 반환합니다. [x, y, z] (도)

##### Returns

`Float32Array`

회전값 배열 (도)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotation`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotation)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L673)

X축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

X축 회전값 (도)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:677](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L677)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:690](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L690)

Y축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

Y축 회전값 (도)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:707](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L707)

Z축 회전값을 가져오거나 설정합니다 (도).

##### Returns

`number`

Z축 회전값 (도)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:711](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L711)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`rotationZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L661)

현재 스케일을 반환합니다. [x, y, z]

##### Returns

`Float32Array`

스케일 배열

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scale`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L610)

X축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

X축 스케일 값

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleX`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:627](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L627)

Y축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Y축 스케일 값

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L631)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleY`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L644)

Z축 스케일을 가져오거나 설정합니다.

##### Returns

`number`

Z축 스케일 값

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:648](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L648)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`scaleZ`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#scalez)

***

***

### spriteSheetInfo

#### Get Signature

> **get** **spriteSheetInfo**(): [`SpriteSheetInfo`](SpriteSheetInfo.md)

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L184)

적용된 스프라이트 시트 정보를 반환하거나 설정합니다.

##### Returns

[`SpriteSheetInfo`](SpriteSheetInfo.md)

SpriteSheetInfo 인스턴스

#### Set Signature

> **set** **spriteSheetInfo**(`value`): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:188](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L188)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`SpriteSheetInfo`](SpriteSheetInfo.md) |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`spriteSheetInfo`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#spritesheetinfo)

***

***

### state

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **state**(): `string`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L103)

현재 애니메이션 재생 상태를 반환합니다.

##### Returns

`string`

재생 상태 문자열 (`'play'`, `'pause'`, `'stop'`)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`state`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#state)

***

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:363](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L363)

투영 면적 컬링(Screen Space Size Culling) 사용 여부를 가져오거나 설정합니다.

##### Returns

`boolean`

투영 면적 컬링 사용 여부

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:367](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L367)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`useScreenSpaceSizeCulling`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#usescreenspacesizeculling)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`uuid`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#uuid)

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/mesh/Mesh.ts:419](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L419)

버텍스 상태 버퍼 레이아웃 배열을 반환합니다.

##### Returns

`GPUVertexBufferLayout`[]

GPUVertexBufferLayout 배열

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`vertexStateBuffers`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#vertexstatebuffers)

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:472](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L472)

물 파동 생성 강도 배율을 가져오거나 설정합니다 (기본값: 1.0).

##### Returns

`number`

물 파동 생성 강도 배율

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L476)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`waterWaveStrength`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#waterwavestrength)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:547](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L547)

X 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

X 위치 좌표

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L551)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`x`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:564](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L564)

Y 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Y 위치 좌표

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:568](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L568)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`y`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L581)

Z 위치 좌표를 가져오거나 설정합니다.

##### Returns

`number`

Z 위치 좌표

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:585](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`z`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#z)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L89)

자식 객체를 컨테이너 끝에 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

추가된 자식 객체 (실패 시 `null`)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addChild`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `SpriteSheet3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L115)

지정한 인덱스 위치에 자식 객체를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 추가할 자식 객체 |
| `index` | `number` | 삽입할 인덱스 위치 |

#### Returns

`SpriteSheet3D`

현재 컨테이너 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addchildat)

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:888](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L888)

이벤트 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | 이벤트 이름 |
| `callback` | `Function` | 콜백 함수 |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`addListener`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#addlistener)

***

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1002](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1002)

**`Experimental`**

메시를 복제합니다.

#### Returns

[`Mesh`](Mesh.md)

복제된 Mesh 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`clone`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#clone)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L73)

지정한 객체가 현재 컨테이너의 자식인지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 확인할 자식 객체 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`contains`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#contains)

***

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1721](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1721)

기본 메시 버텍스 셰이더 모듈과 유니폼 바인드 그룹을 생성하고 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` | 버텍스 셰이더 모듈 이름 |
| `SHADER_INFO` | `any` | 파싱된 WGSL 셰이더 정보 |
| `UNIFORM_STRUCT_BASIC` | `any` | 버텍스 유니폼 구조체 정보 |
| `vertexModuleSource` | `any` | 버텍스 셰이더 WGSL 소스 코드 |

#### Returns

`GPUShaderModule`

생성된 GPUShaderModule 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`createMeshVertexShaderModuleBASIC`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1740](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1740)

Mesh 인스턴스를 파기하고 할당된 드로우 커맨드 슬롯, 전역 버퍼 슬롯 및 리소스를 즉시 해제합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`destroy`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L143)

지정한 인덱스에 위치한 자식 객체를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 인덱스 위치 |

#### Returns

[`Mesh`](Mesh.md)

해당 위치의 자식 객체 (범위 초과 시 `undefined`)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L163)

지정한 자식 객체의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 인덱스를 조회할 자식 객체 |

#### Returns

`number`

자식 객체의 인덱스 (존재하지 않으면 `-1`)

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getChildIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getchildindex)

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:869](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L869)

부모 계층을 고려한 통합 투명도를 계산하여 반환합니다.

#### Returns

`number`

통합 투명도 값

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getCombinedOpacity`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getcombinedopacity)

***

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L245)

지정된 뷰를 기준으로 이 객체의 2D 화면 좌표를 반환합니다.

#### Example
```typescript
const screenPos = mesh.getScreenPoint(view3D);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | 기준이 되는 View3D 인스턴스 |

#### Returns

\[`number`, `number`\]

화면 좌표 `[x, y]`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`getScreenPoint`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1687)

메시의 GPU 렌더링 정보(VertexGPURenderInfo)를 초기화하고 파이프라인을 갱신합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`initGPURenderInfos`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#initgpurenderinfos)

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L225)

이 객체의 로컬 공간 좌표를 월드 공간 좌표로 변환합니다.

#### Example
```typescript
const worldPos = mesh.localToWorld(0, 1, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 로컬 X 좌표 |
| `y` | `number` | 로컬 Y 좌표 |
| `z` | `number` | 로컬 Z 좌표 |

#### Returns

\[`number`, `number`, `number`\]

변환된 월드 좌표 `[x, y, z]`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`localToWorld`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#localtoworld)

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:907](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L907)

메시가 특정 좌표를 바라보도록 회전시킵니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | 대상 X 좌표 또는 [x, y, z] 배열 |
| `targetY?` | `number` | 대상 Y 좌표 (targetX가 배열인 경우 무시됨) |
| `targetZ?` | `number` | 대상 Z 좌표 (targetX가 배열인 경우 무시됨) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`lookAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#lookat)

***

***

### pause()

> **pause**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L214)

현재 프레임에서 애니메이션을 일시정지하고 상태를 `'pause'`로 변경합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`pause`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#pause)

***

***

### play()

> **play**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L204)

애니메이션 재생을 시작하고 상태를 `'play'`로 변경합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`play`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#play)

***

***

### removeAllChildren()

> **removeAllChildren**(): `SpriteSheet3D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L309)

컨테이너의 모든 자식 객체를 제거합니다.

#### Returns

`SpriteSheet3D`

현재 컨테이너 인스턴스

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeAllChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L265)

지정한 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 제거할 자식 객체 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeChild`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L290)

지정한 인덱스의 자식 객체를 컨테이너에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 자식 객체의 인덱스 |

#### Returns

[`Mesh`](Mesh.md)

제거된 자식 객체

#### Throws

해당 인덱스에 자식 객체가 존재하지 않을 경우 Error 발생

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`removeChildAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#removechildat)

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:802](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L802)

하위 계층의 모든 객체에 그림자 캐스팅 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 캐스팅 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setCastShadowRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setcastshadowrecursively)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L184)

자식 객체의 인덱스 위치를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | 위치를 변경할 자식 객체 |
| `index` | `number` | 새로 지정할 인덱스 |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setChildIndex`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setchildindex)

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L783)

하위 계층의 모든 객체에 디버거 활성화 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | 활성화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setEnableDebuggerRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setenabledebuggerrecursively)

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:840](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L840)

하위 계층의 모든 객체에 프러스텀 컬링 무시 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 무시 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setIgnoreFrustumCullingRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setignorefrustumcullingrecursively)

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:959](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L959)

위치를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X 좌표 |
| `y?` | `number` | Y 좌표 (생략 시 x와 동일) |
| `z?` | `number` | Z 좌표 (생략 시 x와 동일) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setPosition`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setposition)

***

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:821](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L821)

하위 계층의 모든 객체에 그림자 수신 여부를 설정합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | 수신 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setReceiveShadowRecursively`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setreceiveshadowrecursively)

***

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:983](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L983)

회전값을 설정합니다. (도)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X축 회전 |
| `rotationY?` | `number` | Y축 회전 (생략 시 rotationX와 동일) |
| `rotationZ?` | `number` | Z축 회전 (생략 시 rotationX와 동일) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setRotation`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L935)

스케일을 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X축 스케일 |
| `y?` | `number` | Y축 스케일 (생략 시 x와 동일) |
| `z?` | `number` | Z축 스케일 (생략 시 x와 동일) |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`setScale`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#setscale)

***

***

### stop()

> **stop**(): `void`

Defined in: [src/display/sprites/spriteSheets/core/ASpriteSheet.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/core/ASpriteSheet.ts#L223)

애니메이션을 정지하고 첫 번째 프레임(`0`)으로 초기화한 뒤 상태를 `'stop'`으로 변경합니다.

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`stop`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#stop)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L213)

두 자식 객체의 배열 내 순서(인덱스)를 서로 맞바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | 첫 번째 자식 객체 |
| `child2` | [`Mesh`](Mesh.md) | 두 번째 자식 객체 |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`swapChildren`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L239)

지정된 두 인덱스에 있는 자식 객체들의 위치를 서로 맞바꿉니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 인덱스 |
| `index2` | `number` | 두 번째 인덱스 |

#### Returns

`void`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`swapChildrenAt`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#swapchildrenat)

***

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L199)

월드 공간 좌표를 이 객체의 로컬 공간 좌표로 변환합니다.

#### Example
```typescript
const localPos = mesh.worldToLocal(10, 5, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | 월드 X 좌표 |
| `y` | `number` | 월드 Y 좌표 |
| `z` | `number` | 월드 Z 좌표 |

#### Returns

\[`number`, `number`, `number`\]

변환된 로컬 좌표 `[x, y, z]`

#### Inherited from

[`ASpriteSheet`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md).[`worldToLocal`](../namespaces/CoreSpriteSheet/classes/ASpriteSheet.md#worldtolocal)

</details>
