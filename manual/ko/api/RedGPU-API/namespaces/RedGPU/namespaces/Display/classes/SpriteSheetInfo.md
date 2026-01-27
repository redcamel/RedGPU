[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheetInfo

# Class: SpriteSheetInfo

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:25](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L25)

스프라이트 시트 애니메이션을 위한 정보를 담는 클래스입니다.


하나의 텍스처에 격자 형태로 배열된 애니메이션 프레임들의 구조와 재생 설정을 정의합니다. 스프라이트 시트 인스턴스들이 공유하는 애니메이션 메타데이터를 관리합니다.


* ### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(
   redGPUContext,
   'path/to/image.png',
   5, 3, // segmentW, segmentH
   15,   // totalFrame
   0     // startIndex
);
```

## Constructors

### Constructor

> **new SpriteSheetInfo**(`redGPUContext`, `src`, `segmentW`, `segmentH`, `totalFrame`, `startIndex`, `loop`, `frameRate`): `SpriteSheetInfo`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:95](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L95)

새로운 SpriteSheetInfo 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPU 렌더링 컨텍스트
| `src` | `string` | `undefined` | 스프라이트 시트 이미지 파일 경로 또는 URL
| `segmentW` | `number` | `undefined` | 가로 세그먼트 수 (양의 정수)
| `segmentH` | `number` | `undefined` | 세로 세그먼트 수 (양의 정수)
| `totalFrame` | `number` | `undefined` | 총 애니메이션 프레임 수 (양의 정수)
| `startIndex` | `number` | `undefined` | 시작 프레임 인덱스 (0 이상의 정수)
| `loop` | `boolean` | `true` | 반복 재생 여부 (기본값: true)
| `frameRate` | `number` | `60` | 애니메이션 프레임 레이트 (기본값: 60 FPS)

#### Returns

`SpriteSheetInfo`

#### Throws

redGPUContext가 유효하지 않거나 매개변수가 범위를 벗어나는 경우 에러 발생


## Accessors

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:161](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L161)

애니메이션 프레임 레이트를 반환합니다.

##### Returns

`number`

초당 프레임 수 (FPS)

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:169](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L169)

반복 재생 여부를 반환합니다.

##### Returns

`boolean`

true인 경우 애니메이션이 무한 반복, false인 경우 한 번만 재생

***

### segmentH

#### Get Signature

> **get** **segmentH**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:129](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L129)

세로 세그먼트 수를 반환합니다.

##### Returns

`number`

텍스처를 세로로 나누는 세그먼트 수

***

### segmentW

#### Get Signature

> **get** **segmentW**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:121](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L121)

가로 세그먼트 수를 반환합니다.

##### Returns

`number`

텍스처를 가로로 나누는 세그먼트 수

***

### startIndex

#### Get Signature

> **get** **startIndex**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:145](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L145)

시작 프레임 인덱스를 반환합니다.

##### Returns

`number`

애니메이션이 시작될 프레임의 인덱스 (0부터 시작)

***

### texture

#### Get Signature

> **get** **texture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:153](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L153)

스프라이트 시트 텍스처를 반환합니다.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

애니메이션에 사용되는 비트맵 텍스처

***

### totalFrame

#### Get Signature

> **get** **totalFrame**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:137](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L137)

총 애니메이션 프레임 수를 반환합니다.

##### Returns

`number`

애니메이션에 사용할 총 프레임 수
