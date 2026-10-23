---
title: Interaction
order: 8
---

# 인터렉션

RedGPU는 다양한 사용자 입력을 직관적이고 손쉽게 처리할 수 있는 도구를 제공합니다:

- **피킹 (Picking) 시스템**: 3D 및 2D 객체에 대한 마우스 및 터치 이벤트를 직관적으로 처리합니다.
- **키보드 버퍼 (keyboardKeyBuffer)**: 키보드 상태를 실시간으로 관리하여 프레임 단위의 세밀한 컨트롤을 지원합니다.

## 1. 마우스 및 터치 인터렉션 (Picking)

RedGPU의 피킹 시스템은 `Mesh`, `Sprite3D`, `Sprite2D` 등 대부분의 디스플레이 객체에 대해 사용자 입력을 수신하고 반응할 수 있는 기능을 제공합니다.

### 1.1 이벤트 리스너 등록

객체에 이벤트를 등록하려면 `addListener` 메서드를 사용합니다. 이벤트가 발생하면 등록된 콜백 함수가 실행되며, 이벤트 정보 객체 (`e`)가 전달됩니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 이벤트 타입 상수 참조
const { PICKING_EVENT_TYPE } = RedGPU.Picking;

mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('클릭된 객체:', e.target);
    // 클릭 시 회전
    e.target.rotationY += 45;
});
```

### 1.2 지원하는 이벤트 타입

`RedGPU.Picking.PICKING_EVENT_TYPE` 에 정의된 6가지 기본 이벤트를 지원합니다.

| 이벤트 상수 | 문자열 값 | 설명 |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | 마우스 클릭 또는 터치 탭 시 발생 |
| **`DOWN`** | `'down'` | 마우스 버튼을 누르거나 터치 시작 시 발생 |
| **`UP`** | `'up'` | 마우스 버튼을 떼거나 터치 종료 시 발생 |
| **`OVER`** | `'over'` | 마우스 커서가 객체 위로 진입할 때 발생 (Hover In) |
| **`OUT`** | `'out'` | 마우스 커서가 객체 밖으로 벗어날 때 발생 (Hover Out) |
| **`MOVE`** | `'move'` | 객체 위에서 마우스 포인터가 이동할 때 지속적으로 발생 |

### 1.3 상세 이벤트 정보 (PickingEvent)

이벤트 콜백에 전달되는 객체 (`e`)는 발생 시점의 다양한 정보를 담고 있습니다. 이를 통해 정밀한 상호작용 로직을 구현할 수 있습니다.

| 속성명                                      | 타입      | 설명                                                  |
|:--------------------------------------------|:----------|:------------------------------------------------------|
| **`target`**                                | `Mesh`    | 이벤트가 발생한 대상 객체입니다.                      |
| **`type`**                                  | `string`  | 발생한 이벤트의 타입입니다.                           |
| **`pickingId`**                             | `number`  | 피킹에 사용되는 고유 ID입니다.                        |
| **`mouseX`**, **`mouseY`**                  | `number`  | 캔버스 내에서의 마우스/터치 좌표입니다.               |
| **`movementX`**, **`movementY`**            | `number`  | 이전 이벤트 대비 마우스 이동량입니다.                 |
| **`point`**                                 | `vec3`    | 월드 공간상의 정확한 교차 지점 좌표입니다.            |
| **`localPoint`**                            | `vec3`    | 객체의 로컬 공간상의 교차 지점 좌표입니다.            |
| **`localX`**, **`localY`**, **`localZ`**    | `number`  | 로컬 공간상의 개별 좌표값입니다.                      |
| **`uv`**                                    | `vec2`    | 교차 지점의 텍스처 좌표(UV)입니다.                    |
| **`distance`**                              | `number`  | 카메라와 교차 지점 사이의 거리입니다.                 |
| **`faceIndex`**                             | `number`  | 교차된 삼각형(Polygon)의 인덱스입니다. (없을 경우 -1) |
| **`time`**                                  | `number`  | 이벤트가 발생한 시간(ms)입니다.                       |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | 이벤트 발생 시 조합 키의 눌림 상태입니다.             |

### 1.4 실습 예제: 마우스 피킹 및 정밀 레이캐스팅

복잡한 3D 지오메트리 위에서 마우스를 움직여 삼각형 단위의 정밀 교차 지점 (`point`, `localPoint`, `faceIndex`, `uv`)이 검출되는 과정을 확인해 보세요.

<iframe src="/RedGPU/examples/3d/interaction/mouseEvent/raycasting/" style="width:100%; height:500px;"></iframe>

## 2. 키보드 인터렉션 (keyboardKeyBuffer)

객체 피킹 외에도, `redGPUContext.keyboardKeyBuffer`를 통해 키보드의 실시간 눌림 상태를 확인할 수 있습니다. 이는 캐릭터 이동이나 카메라 컨트롤처럼 매 프레임마다 키 입력 상태를 체크해야
하는 로직에 유용합니다.

```javascript
RedGPU.init(canvas, (redGPUContext) => {
    // 렌더 루프 내에서 상태 확인
    const render = (time) => {
        const { keyboardKeyBuffer } = redGPUContext;

        if (keyboardKeyBuffer['w'] || keyboardKeyBuffer['W']) {
            console.log('앞으로 이동 중...');
        }
        if (keyboardKeyBuffer[' ']) {
            console.log('점프!');
        }
    };
    
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, render);
});
```

> [!TIP]
> `keyboardKeyBuffer`는 브라우저 표준 `KeyboardEvent.key` 값을 키 (Key)로 사용합니다 (`'w'`, `'W'`, `' '`, `'ArrowUp'`, `'Shift'` 등).

---

## 관련 예제

- **마우스 및 터치**
    - [일반 메시](/RedGPU/examples/3d/interaction/mouseEvent/mesh/)
    - [스프라이트 3D](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/)
    - [스프라이트 시트 3D](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)
    - [텍스트 필드 3D](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)
    - [고정밀 레이캐스팅](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
- **키보드**
    - [3D 키보드 인터랙션](/RedGPU/examples/3d/interaction/keyboardEvent/)
    - [2D 키보드 인터랙션](/RedGPU/examples/2d/interaction/keyboardEvent/)

---

## 다음 학습 추천

인터렉션까지 더해진 풍성한 장면에 시각적인 완성도를 높여주는 후처리 효과를 적용해 봅니다.

- **[포스트 이펙트](../post-effect/index.md)**
