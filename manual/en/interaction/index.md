---
title: Interaction
order: 8
---

# Interaction

RedGPU's **Interaction** system consists of the **Picking** system, which handles mouse and touch events for 3D and 2D
display objects, and `keyboardKeyBuffer`, which provides frame-by-frame keyboard input states.

## 1. Mouse and Touch Interaction

Display objects such as `Mesh`, `Sprite3D`, `Sprite2D`, and `TextField3D` receive mouse and touch events via the
`addListener` method.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const { PICKING_EVENT_TYPE } = RedGPU.Picking;

mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked object:', e.target);
    e.target.rotationY += 45;
});
```

### 1.1 Supported Event Types

Supports the 6 events defined in `RedGPU.Picking.PICKING_EVENT_TYPE`.

| Event Constant | String Value | Description |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | Occurs on a mouse click or touch tap |
| **`DOWN`** | `'down'` | Occurs when a mouse button is pressed or touch starts |
| **`UP`** | `'up'` | Occurs when a mouse button is released or touch ends |
| **`OVER`** | `'over'` | Occurs when the mouse cursor enters the object's area (Hover In) |
| **`OUT`** | `'out'` | Occurs when the mouse cursor leaves the object's area (Hover Out) |
| **`MOVE`** | `'move'` | Occurs continuously as the mouse pointer moves over the object |

### 1.2 `PickingEvent` Key Properties

Properties of the `PickingEvent` object (`e`) passed to the event callback.

| Property                                    | Type      | Description                                                |
|:--------------------------------------------|:----------|:-----------------------------------------------------------|
| **`target`**                                | `Mesh`    | Target object where the event occurred                     |
| **`type`**                                  | `string`  | Type of the event that occurred                            |
| **`pickingId`**                             | `number`  | Unique ID used for picking                                 |
| **`mouseX`**, **`mouseY`**                  | `number`  | Mouse or touch coordinates within the canvas               |
| **`movementX`**, **`movementY`**            | `number`  | Mouse movement delta compared to the previous event        |
| **`point`**                                 | `vec3`    | Intersection point coordinates in world space              |
| **`localPoint`**                            | `vec3`    | Intersection point coordinates in the object's local space |
| **`localX`**, **`localY`**, **`localZ`**    | `number`  | Individual coordinate values in local space                |
| **`uv`**                                    | `vec2`    | Texture coordinates (UV) at the intersection point         |
| **`distance`**                              | `number`  | Distance between the camera and the intersection point     |
| **`faceIndex`**                             | `number`  | Index of the intersected triangle (`-1` if unavailable)    |
| **`time`**                                  | `number`  | Time when the event occurred (in ms)                       |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | State of modifier keys at the time of the event            |

### 1.3 Practical Example: Interactive Cube

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

    // 1. Create a basic cube
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    // 2. Create an HTML UI for status display (bottom left)
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

    // 3. Register event listeners
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

    // 4. Camera and View Setup
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 5. Start Rendering
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 2. Keyboard Interaction

`redGPUContext.keyboardKeyBuffer` is a real-time state buffer that stores the name of each currently pressed key
(`KeyboardEvent.key`) as its key and a boolean pressed state as its value.

- Queries key states per frame inside the render loop without registering separate `keydown` or `keyup` listeners.
- Uses `e.key` directly, making it case-sensitive (`'w'` and `'W'`), and supports modifier keys such as `Shift`,
  `Control`, and `Alt`.

```javascript
RedGPU.init(canvas, (redGPUContext) => {
    const render = (time) => {
        const { keyboardKeyBuffer } = redGPUContext;

        if (keyboardKeyBuffer['w'] || keyboardKeyBuffer['W']) {
            console.log('Moving forward...');
        }
        if (keyboardKeyBuffer[' ']) {
            console.log('Jump!');
        }
    };
    
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, render);
});
```

---

## 3. Live Examples

- **Mouse &
  Touch**: [Mesh](/RedGPU/examples/3d/interaction/mouseEvent/mesh/) · [Sprite3D](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/) · [SpriteSheet3D](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/) · [TextField3D](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/) · [High-Precision Raycasting](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
-

**Keyboard**: [3D Keyboard Interaction](/RedGPU/examples/3d/interaction/keyboardEvent/) · [2D Keyboard Interaction](/RedGPU/examples/2d/interaction/keyboardEvent/)

---

## Next Steps

- **[Post-Effect](../post-effect/index.md)**: Applying visual post-processing effects to rendered scenes
