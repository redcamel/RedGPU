---
title: Interaction
order: 8
---

# 인터렉션

RedGPU는 3D 및 2D 객체에 대한 마우스 및 터치 이벤트를 처리하는 직관적인 **피킹**(Picking) 시스템을 제공합니다. `Mesh`, `Sprite3D`, `Sprite2D` 등 대부분의 디스플레이 객체는 사용자 입력을 수신하고 반응할 수 있습니다.

## 1. 이벤트 리스너 등록

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

## 2. 지원하는 이벤트 타입

`RedGPU.Picking.PICKING_EVENT_TYPE` 에 정의된 6가지 기본 이벤트를 지원합니다.

| 이벤트 상수 | 문자열 값 | 설명 |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | 마우스 클릭 또는 터치 탭 시 발생 |
| **`DOWN`** | `'down'` | 마우스 버튼을 누르거나 터치 시작 시 발생 |
| **`UP`** | `'up'` | 마우스 버튼을 떼거나 터치 종료 시 발생 |
| **`OVER`** | `'over'` | 마우스 커서가 객체 위로 진입할 때 발생 (Hover In) |
| **`OUT`** | `'out'` | 마우스 커서가 객체 밖으로 벗어날 때 발생 (Hover Out) |
| **`MOVE`** | `'move'` | 객체 위에서 마우스 포인터가 이동할 때 지속적으로 발생 |

## 3. 실습 예제: 인터렉티브 큐브

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

    // 4. 상태 표시를 위한 HTML UI 생성 (하단 중앙)
    const statusOverlay = document.createElement('div');
    Object.assign(statusOverlay.style, {
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '16px 32px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        borderRadius: '12px',
        fontFamily: 'monospace',
        fontSize: '16px',
        textAlign: 'center',
        pointerEvents: 'none',
        border: '1px solid #444',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    });
    
    // 두 줄 구조로 생성
    statusOverlay.innerHTML = `
        <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 4px;">Ready to Interact</div>
        <div id="event-detail" style="font-size: 14px; color: #aaa;">Move or Click the Cube</div>
    `;
    document.body.appendChild(statusOverlay);

    const typeEl = statusOverlay.querySelector('#event-type');
    const detailEl = statusOverlay.querySelector('#event-detail');

    // 3. 이벤트 리스너 등록
    
    // [CLICK] 클릭 시 랜덤 색상 변경 및 회전
    mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        e.target.material.color.setColorByRGB(r, g, b);
        
        e.target.rotationY += 45;
        e.target.rotationX += 45;

        typeEl.innerText = 'Event: CLICK';
        typeEl.style.color = '#ffcc00';
        detailEl.innerText = 'Color Changed!';
    });

    // [DOWN] 마우스 버튼을 눌렀을 때
    mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
        typeEl.innerText = 'Event: MOUSE_DOWN';
        typeEl.style.color = '#ff4444';
    });

    // [MOVE] 객체 위에서 마우스 이동 시 좌표 표시
    mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
        detailEl.innerText = `MOUSE_MOVE at (${e.mouseX.toFixed(2)}, ${e.mouseY.toFixed(2)})`;
    });

    // [OVER] 마우스 오버 시
    mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
        document.body.style.cursor = 'pointer';
        typeEl.innerText = 'Event: MOUSE_OVER';
        typeEl.style.color = '#00CC99';
    });

    // [OUT] 마우스 아웃 시
    mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
        document.body.style.cursor = 'default';
        typeEl.innerText = 'Event: MOUSE_OUT';
        typeEl.style.color = '#ffffff';
        detailEl.innerText = 'Move or Click the Cube';
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

## 핵심 요약

- `addListener` 를 통해 객체별로 독립적인 이벤트 처리가 가능합니다.
- `e.target` 을 통해 이벤트가 발생한 객체에 직접 접근할 수 있습니다.
- 마우스 커서 스타일 변경(`document.body.style.cursor`) 등 웹 표준 DOM API와 함께 사용하여 UX를 향상시킬 수 있습니다.

## 다음 학습 추천

인터렉션까지 더해진 풍성한 장면에 시각적인 완성도를 높여주는 후처리 효과를 적용해 봅니다.

- **[포스트 이펙트](../post-effect/index.md)**