---
title: Interaction
order: 8
---

# 인터렉션

RedGPU의 **인터렉션** 시스템은 3D·2D 디스플레이 객체에 대한 마우스·터치 이벤트를 처리하는 **피킹**(Picking) 시스템과, 프레임 단위 키보드 입력 상태를 제공하는
`keyboardKeyBuffer` 로 구성됩니다.

## 1. 마우스 및 터치 인터렉션

`Mesh`, `Sprite3D`, `Sprite2D`, `TextField3D` 등 디스플레이 객체에서 `addListener` 메서드로 마우스 및 터치 이벤트를 수신합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const { PICKING_EVENT_TYPE } = RedGPU.Picking;

mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('클릭된 객체:', e.target);
    e.target.rotationY += 45;
});
```

### 1.1 지원 이벤트 타입

`RedGPU.Picking.PICKING_EVENT_TYPE` 에 정의된 6가지 이벤트를 지원합니다.

| 이벤트 상수 | 문자열 값 | 설명 |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | 마우스 클릭 또는 터치 탭 시 발생 |
| **`DOWN`** | `'down'` | 마우스 버튼을 누르거나 터치 시작 시 발생 |
| **`UP`** | `'up'` | 마우스 버튼을 떼거나 터치 종료 시 발생 |
| **`OVER`** | `'over'` | 마우스 커서가 객체 위로 진입할 때 발생 (Hover In) |
| **`OUT`** | `'out'` | 마우스 커서가 객체 밖으로 벗어날 때 발생 (Hover Out) |
| **`MOVE`** | `'move'` | 객체 위에서 마우스 포인터가 이동할 때 지속적으로 발생 |

### 1.2 `PickingEvent` 주요 속성

이벤트 콜백에 전달되는 `PickingEvent` 객체 (`e`)의 속성 목록입니다.

| 속성명                                      | 타입      | 설명                                           |
|:--------------------------------------------|:----------|:-----------------------------------------------|
| **`target`**                                | `Mesh`    | 이벤트가 발생한 대상 객체                      |
| **`type`**                                  | `string`  | 발생한 이벤트 타입                             |
| **`pickingId`**                             | `number`  | 피킹 식별용 고유 ID                            |
| **`mouseX`**, **`mouseY`**                  | `number`  | 캔버스 내 마우스/터치 좌표                     |
| **`movementX`**, **`movementY`**            | `number`  | 이전 이벤트 대비 마우스 이동량                 |
| **`point`**                                 | `vec3`    | 월드 공간상의 교차 지점 좌표                   |
| **`localPoint`**                            | `vec3`    | 객체 로컬 공간상의 교차 지점 좌표              |
| **`localX`**, **`localY`**, **`localZ`**    | `number`  | 로컬 공간상의 개별 좌표값                      |
| **`uv`**                                    | `vec2`    | 교차 지점의 텍스처 좌표(UV)                    |
| **`distance`**                              | `number`  | 카메라와 교차 지점 사이의 거리                 |
| **`faceIndex`**                             | `number`  | 교차된 삼각형(Polygon) 인덱스 (없을 경우 `-1`) |
| **`time`**                                  | `number`  | 이벤트 발생 시간 (ms)                          |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | 이벤트 발생 시 조합 키 눌림 상태               |

### 1.3 실습 예제: 인터렉티브 큐브

```javascript
const {PICKING_EVENT_TYPE} = RedGPU.Picking;

mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    e.target.material.color.setColorByRGB(
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    );
});

mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.setScale(1.2);
});

mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.setScale(1.0);
});
```

<ClientOnly>
<CodePen title="RedGPU - Interaction Example" slugHash="interaction-basic">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const { PICKING_EVENT_TYPE } = RedGPU.Picking;

    // 1. 기본 큐브 생성
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    // 2. 상태 표시를 위한 HTML UI 생성 (하단 좌측)
    const statusOverlay = document.createElement('div');
    Object.assign(statusOverlay.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '12px 16px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        textAlign: 'left',
        pointerEvents: 'none',
        border: '1px solid #444',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        minWidth: '240px'
    });
    
    statusOverlay.innerHTML = `
        <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #444; padding-bottom: 4px;">Ready to Interact</div>
        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px;">
            <div style="color: #888;">Canvas:</div><div id="canvas-pos">-</div>
            <div style="color: #888; border-top: 1px solid #222; padding-top: 4px;">World:</div><div id="world-pos" style="border-top: 1px solid #222; padding-top: 4px;">-</div>
            <div style="color: #888;">Local:</div><div id="local-pos">-</div>
            <div style="color: #888; border-top: 1px solid #222; padding-top: 4px;">UV:</div><div id="uv-pos" style="border-top: 1px solid #222; padding-top: 4px;">-</div>
            <div style="color: #888;">Distance:</div><div id="distance">-</div>
            <div style="color: #888;">FaceIdx:</div><div id="face-index">-</div>
        </div>
    `;
    document.body.appendChild(statusOverlay);

    const typeEl = statusOverlay.querySelector('#event-type');
    const updateUI = (e) => {
        typeEl.innerText = `Event: ${e.type.toUpperCase()}`;
     
        statusOverlay.querySelector('#world-pos').innerText = `${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}`;
        statusOverlay.querySelector('#local-pos').innerText = `${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}`;
        statusOverlay.querySelector('#uv-pos').innerText = `${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}`;
        statusOverlay.querySelector('#distance').innerText = e.distance.toFixed(3);
        statusOverlay.querySelector('#face-index').innerText = e.faceIndex;
    };

    // 3. 이벤트 리스너 등록
    mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        e.target.material.color.setColorByRGB(r, g, b);
        updateUI(e);
        typeEl.style.color = '#ffcc00';
    });

    mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
        updateUI(e);
        typeEl.style.color = '#ff4444';
    });

    mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
        updateUI(e);
    });

    mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
        document.body.style.cursor = 'pointer';
        updateUI(e);
        typeEl.style.color = '#00CC99';
    });

    mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
        document.body.style.cursor = 'default';
        updateUI(e);
        typeEl.innerText = 'Event: MOUSE_OUT';
        typeEl.style.color = '#ffffff';
    });

    // 4. 카메라 및 뷰 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 5. 렌더링 시작
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 2. 키보드 인터렉션

`redGPUContext.keyboardKeyBuffer` 는 현재 눌려 있는 키의 이름 (`KeyboardEvent.key`)을 키 (Key)로, 눌림 여부를 불리언 값 (Value)으로 저장하는 실시간 상태
버퍼입니다.

- 별도의 `keydown`, `keyup` 리스너 등록 없이 렌더 루프 내에서 프레임 단위로 키 상태를 조회합니다.
- `e.key` 값을 그대로 사용하므로 대소문자를 구분하며 (`'w'` 와 `'W'`), `Shift`, `Control`, `Alt` 등 특수 키 상태도 동일하게 확인할 수 있습니다.

```javascript
RedGPU.init(canvas, (redGPUContext) => {
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

---

## 3. 라이브 예제

- **마우스 및
  터치**: [일반 메시](/RedGPU/examples/3d/interaction/mouseEvent/mesh/) · [스프라이트 3D](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/) · [스프라이트 시트 3D](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/) · [텍스트 필드 3D](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/) · [고정밀 레이캐스팅](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
-

**키보드**: [3D 키보드 인터렉션](/RedGPU/examples/3d/interaction/keyboardEvent/) · [2D 키보드 인터렉션](/RedGPU/examples/2d/interaction/keyboardEvent/)

---

## 다음 단계

- **[포스트 이펙트](../post-effect/index.md)** : 렌더링된 화면에 시각적 후처리 효과를 적용하는 방법
