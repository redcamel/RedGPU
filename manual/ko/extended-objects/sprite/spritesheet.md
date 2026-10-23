---
title: SpriteSheet3D
order: 3
---

# SpriteSheet3D

**`SpriteSheet3D`** 는 하나의 이미지에 여러 애니메이션 프레임이 포함된 **스프라이트 시트**(Sprite Sheet) 를 사용하여 3D 공간 내에서 연속된 동작을 구현하는 객체입니다. 폭발 효과,
불꽃, 걷는 캐릭터 등 역동적인 2D 애니메이션을 3D 공간에 배치할 때 유용합니다.

## 1. 스프라이트 시트 이해

스프라이트 시트는 여러 프레임의 이미지를 격자 형태로 나열한 하나의 커다란 텍스처입니다. RedGPU는 이 텍스처를 지정된 구획 (Segment)으로 나누어 프레임별로 순차적으로 보여줌으로써 애니메이션을 완성합니다.

![SpriteSheet Image](https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png)

## 2. 기본 사용법

스프라이트 시트를 사용하기 위해서는 먼저 시트의 구조를 정의하는 `SpriteSheetInfo` 객체를 생성한 뒤, 이를 `SpriteSheet3D` 에 전달해야 합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. 스프라이트 시트 정보 정의
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png', 
    5, 3, // 가로 5개, 세로 3개 세그먼트
    15,   // 총 프레임 수
    0,    // 시작 프레임 인덱스
    true, // 반복 재생 여부 (loop)
    24    // 초당 프레임 수 (FPS)
);

// 2. SpriteSheet3D 인스턴스 생성 및 추가
const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
scene.addChild(spriteSheet);
```

## 3. 핵심 속성 제어

애니메이션 재생 상태 및 스프라이트의 크기를 제어하는 주요 속성들입니다.

### 3.1 애니메이션 제어

- **`play()`**: 애니메이션을 시작합니다.
- **`stop()`**: 현재 프레임에서 애니메이션을 일시 정지합니다.
- **`gotoAndPlay(frameIndex)`**: 지정한 프레임으로 이동한 즉시 재생합니다.
- **`gotoAndStop(frameIndex)`**: 지정한 프레임으로 이동한 후 정지합니다.

### 3.2 빌보드 및 크기 설정

`SpriteSheet3D`는 `Sprite3D`와 동일한 빌보드 및 크기 설정 옵션을 제공합니다. 상세한 모드별 차이점과 작동 원리는
**[Sprite3D 매뉴얼의 크기 관계 섹션](./sprite.md#_3-3-월드-사이즈와-픽셀-사이즈의-관계)** 을 참조하십시오.

| 속성명             | 설명                                   | 기본값  |
|:-------------------|:---------------------------------------|:--------|
| **`useBillboard`** | 카메라를 항상 향하게 할지 여부         | `true`  |
| **`worldSize`**    | 월드 공간에서의 세로 크기 (Unit 단위). | `1`     |
| **`usePixelSize`** | 고정 픽셀 크기 모드 사용 여부.         | `false` |
| **`pixelSize`**    | 고정 픽셀 크기 값 (`px` 단위).         | `0`     |

```javascript
// 고정 픽셀 크기로 캐릭터 애니메이션 표시
spriteSheet.usePixelSize = true;
spriteSheet.pixelSize = 128;
```

## 4. 실습 예제: 스프라이트 시트 애니메이션 제어

격자 형태의 시트 이미지가 `SpriteSheet3D`를 통해 어떻게 연속된 애니메이션으로 동작하는지, 그리고 FPS 및 재생 제어 (`play`, `pause`, `stop`)가 어떻게 반영되는지 확인해 보세요.

<iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/" style="width:100%; height:500px;"></iframe>

---

## 관련 예제

- [SpriteSheet3D 기본](/RedGPU/examples/3d/sprite/spriteSheet3D/)
- [SpriteSheet3D 옵션 비교](/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
- [SpriteSheet3D 마우스 이벤트](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)

---

## 다음 학습 추천

3D 공간 내에 입체적인 텍스트 레이블을 구성하고 배치하는 방법에 대해 알아봅니다.

- **[TextField3D](../text-field/textfield3d.md)**
