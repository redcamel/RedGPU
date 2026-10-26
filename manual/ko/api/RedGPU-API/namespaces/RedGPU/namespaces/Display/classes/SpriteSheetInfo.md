[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheetInfo

# Class: SpriteSheetInfo

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L27)

스프라이트 시트 애니메이션의 격자 분할 정보와 재생 설정을 정의하는 데이터 클래스입니다.

***

### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'path/to/image.png',
    5, 3,
    15,
    0,
    true,
    60
);
```

## See

- [SpriteSheet2D Basic Example](https://redcamel.github.io/RedGPU/examples/2d/spriteSheet2D/basic/)
 - [SpriteSheet3D Basic Example](https://redcamel.github.io/RedGPU/examples/3d/sprite/spriteSheet3D/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SpriteSheetInfo**(`redGPUContext`, `src`, `segmentW`, `segmentH`, `totalFrame`, `startIndex`, `loop?`, `frameRate?`): `SpriteSheetInfo`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L73)

SpriteSheetInfo 인스턴스를 생성합니다.

#### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0, true, 60);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `src` | `string` | `undefined` | 스프라이트 시트 이미지 경로 또는 URL |
| `segmentW` | `number` | `undefined` | 가로 세그먼트 분할 수 (양의 정수) |
| `segmentH` | `number` | `undefined` | 세로 세그먼트 분할 수 (양의 정수) |
| `totalFrame` | `number` | `undefined` | 전체 프레임 수 (양의 정수) |
| `startIndex` | `number` | `undefined` | 시작 프레임 인덱스 (0 이상의 정수) |
| `loop?` | `boolean` | `true` | 반복 재생 여부 (기본값: `true`) |
| `frameRate?` | `number` | `60` | 초당 재생 프레임 수 (기본값: `60`) |

#### Returns

`SpriteSheetInfo`

#### Throws

숫자 매개변수가 유효한 부호 없는 정수 범위를 벗어날 경우 에러 발생

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### frameRate

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L163)

초당 애니메이션 프레임 수(FPS)를 반환합니다.

##### Returns

`number`

초당 프레임 수

***

***

### loop

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L175)

반복 재생 여부를 반환합니다.

##### Returns

`boolean`

반복 재생 여부

***

***

### segmentH

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **segmentH**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L115)

세로 세그먼트 분할 수를 반환합니다.

##### Returns

`number`

세로 세그먼트 수

***

***

### segmentW

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **segmentW**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L103)

가로 세그먼트 분할 수를 반환합니다.

##### Returns

`number`

가로 세그먼트 수

***

***

### startIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **startIndex**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:139](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L139)

시작 프레임 인덱스를 반환합니다.

##### Returns

`number`

시작 프레임 인덱스 (0부터 시작)

***

***

### texture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **texture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L151)

스프라이트 시트의 비트맵 텍스처를 반환합니다.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

비트맵 텍스처 인스턴스

***

***

### totalFrame

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalFrame**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L127)

총 애니메이션 프레임 수를 반환합니다.

##### Returns

`number`

총 프레임 수

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
