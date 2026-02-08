---
title: Interaction
order: 8
---

# 인터렉션

RedGPU는 3D 및 2D 객체에 대한 마우스 및 터치 이벤트를 처리하는 직관적인 **피킹**(Picking) 시스템과 키보드 상태를 실시간으로 관리하는 **키보드 버퍼**(keyboardKeyBuffer) 기능을 제공합니다. 이를 통해 마우스 클릭부터 복잡한 캐릭터 컨트롤까지 다양한 사용자 입력을 손쉽게 처리할 수 있습니다.

## 1. 마우스 및 터치 인터렉션 (Picking)

RedGPU의 피킹 시스템은 `Mesh`, `Sprite3D`, `Sprite2D` 등 대부분의 디스플레이 객체에 대해 사용자 입력을 수신하고 반응할 수 있는 기능을 제공합니다.

### 1.1 이벤트 리스너 등록

객체에 이벤트를 등록하려면 `addListener` 메서드를 사용합니다. 이벤트가 발생하면 등록된 콜백 함수가 실행되며, 이벤트 정보 객체(`e`)가 전달됩니다.

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

이벤트 콜백에 전달되는 객체(`e`)는 발생 시점의 다양한 정보를 담고 있습니다. 이를 통해 정밀한 상호작용 로직을 구현할 수 있습니다.

| 속성명 | 타입 | 설명 |
| :--- | :--- | :--- |
| **`target`** | `Mesh` | 이벤트가 발생한 대상 객체입니다. |
| **`type`** | `string` | 발생한 이벤트의 타입입니다. |
| **`pickingId`** | `number` | 피킹에 사용되는 고유 ID입니다. |
| **`mouseX`**, **`mouseY`** | `number` | 캔버스 내에서의 마우스/터치 좌표입니다. |
| **`movementX`**, **`movementY`** | `number` | 이전 이벤트 대비 마우스 이동량입니다. |
| **`point`** | `vec3` | 월드 공간상의 정확한 교차 지점 좌표입니다. |
| **`localPoint`** | `vec3` | 객체의 로컬 공간상의 교차 지점 좌표입니다. |
| **`localX`**, **`localY`**, **`localZ`** | `number` | 로컬 공간상의 개별 좌표값입니다. |
| **`uv`** | `vec2` | 교차 지점의 텍스처 좌표(UV)입니다. |
| **`distance`** | `number` | 카메라와 교차 지점 사이의 거리입니다. |
| **`faceIndex`** | `number` | 교차된 삼각형(Polygon)의 인덱스입니다. (없을 경우 -1) |
| **`time`** | `number` | 이벤트가 발생한 시간(ms)입니다. |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | 이벤트 발생 시 조합 키의 눌림 상태입니다. |

### 1.4 실습 예제: 인터렉티브 큐브

마우스 오버 시 크기가 변하고, 클릭 시 색상이 바뀌며, 이동 시 좌표를 확인할 수 있는 인터렉티브 예제입니다.

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

    // 4. 상태 표시를 위한 HTML UI 생성 (하단 좌측)
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
    
    // [CLICK] 클릭 시 랜덤 색상 변경 및 회전
    mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        e.target.material.color.setColorByRGB(r, g, b);
        
        
        updateUI(e);
        typeEl.style.color = '#ffcc00';
    });

    // [DOWN] 마우스 버튼을 눌렀을 때
    mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
        updateUI(e);
        typeEl.style.color = '#ff4444';
    });

    // [MOVE] 객체 위에서 마우스 이동 시 좌표 표시
    mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
        updateUI(e);
    });

    // [OVER] 마우스 오버 시
    mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
        document.body.style.cursor = 'pointer';
        updateUI(e);
        typeEl.style.color = '#00CC99';
    });

    // [OUT] 마우스 아웃 시
    mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
        document.body.style.cursor = 'default';
        updateUI(e); // 마우스 아웃 시 UI 업데이트 (대시 표시)
        typeEl.innerText = 'Event: MOUSE_OUT';
        typeEl.style.color = '#ffffff';
    });

    // 4. 카메라 및 뷰 설정
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 5. 렌더링 시작
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 2. 키보드 인터렉션 (keyboardKeyBuffer)

객체 피킹 외에도, `redGPUContext.keyboardKeyBuffer`를 통해 키보드의 실시간 눌림 상태를 확인할 수 있습니다. 이는 캐릭터 이동, 카메라 컨트롤 등 매 프레임마다 키 상태를 체크해야 하는 로직에 매우 유용합니다.

### 2.1 기본 사용법

`keyboardKeyBuffer`는 현재 눌려있는 키의 이름을 키(Key)로, 눌림 여부를 값(Value)으로 가지는 객체입니다.

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

### 2.2 주요 특징

- **실시간 상태 관리**: 별도의 `keydown`, `keyup` 리스너를 직접 관리할 필요 없이 `redGPUContext`에서 통합 관리됩니다.
- **대소문자 구분**: `e.key` 값을 그대로 사용하므로 대소문자를 구분합니다. 보편적인 입력을 위해서는 `'w'`와 `'W'`를 모두 체크하는 것이 좋습니다.
- **조합 키 지원**: `Shift`, `Control`, `Alt` 등의 특수 키 상태도 동일하게 확인할 수 있습니다.

## 3. 라이브 예제

RedGPU가 제공하는 다양한 인터렉션 동작을 아래 예제들을 통해 직접 확인할 수 있습니다.

### 3.1 마우스 및 터치 예제
- [일반 메시 인터렉션](/RedGPU/examples/3d/mouseEvent/mesh/)
- [스프라이트 인터렉션](/RedGPU/examples/3d/mouseEvent/sprite3D/)
- [텍스트 필드 인터렉션](/RedGPU/examples/3d/mouseEvent/textField3D/)
- [고정밀 레이캐스팅 (Raycasting)](/RedGPU/examples/3d/mouseEvent/raycasting/)

### 3.2 키보드 인터렉션 예제
- [캐릭터 컨트롤러 (WASD)](/RedGPU/examples/3d/controller/characterController/)
- [레이캐스트 차량 시뮬레이션](/RedGPU/examples/3d/physics/raycastVehicle/)

## 핵심 요약

- `addListener` 를 통해 객체별로 독립적인 이벤트 처리가 가능합니다.
- `keyboardKeyBuffer` 를 통해 프레임 단위의 정밀한 키보드 상태 제어가 가능합니다.
- 웹 표준 DOM API와 함께 사용하여 풍부한 사용자 경험(UX)을 제공할 수 있습니다.

## 다음 학습 추천

인터렉션까지 더해진 풍성한 장면에 시각적인 완성도를 높여주는 후처리 효과를 적용해 봅니다.

- **[포스트 이펙트](../post-effect/index.md)**
