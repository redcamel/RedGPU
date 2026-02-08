---
title: Interaction
order: 8
---

# Interaction

RedGPU provides an intuitive **Picking** system that handles mouse and touch events for 3D and 2D objects, as well as a **Keyboard Buffer** (`keyboardKeyBuffer`) feature that manages the real-time state of the keyboard. This allows you to easily handle various user inputs, from mouse clicks to complex character controls.

## 1. Mouse and Touch Interaction (Picking)

RedGPU's picking system provides the ability to receive and react to user input for most display objects, such as `Mesh`, `Sprite3D`, and `Sprite2D`.

### 1.1 Registering Event Listeners

Use the `addListener` method to register events on an object. When an event occurs, the registered callback function is executed, and an event information object (`e`) is passed.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// Reference event type constant
const { PICKING_EVENT_TYPE } = RedGPU.Picking;

mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked object:', e.target);
    // Rotate upon click
    e.target.rotationY += 45;
});
```

### 1.2 Supported Event Types

The system supports 6 basic events defined in `RedGPU.Picking.PICKING_EVENT_TYPE`.

| Event Constant | String Value | Description |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | Occurs upon mouse click or touch tap |
| **`DOWN`** | `'down'` | Occurs upon mouse button press or touch start |
| **`UP`** | `'up'` | Occurs upon mouse button release or touch end |
| **`OVER`** | `'over'` | Occurs when the mouse cursor enters over the object (Hover In) |
| **`OUT`** | `'out'` | Occurs when the mouse cursor leaves the object (Hover Out) |
| **`MOVE`** | `'move'` | Occurs continuously while the mouse pointer moves over the object |

### 1.3 Detailed Event Information (PickingEvent)

The object (`e`) passed to the event callback contains various pieces of information at the time of occurrence. This allows for the implementation of precise interaction logic.

| Property Name | Type | Description |
| :--- | :--- | :--- |
| **`target`** | `Mesh` | The target object where the event occurred. |
| **`type`** | `string` | The type of the event that occurred. |
| **`pickingId`** | `number` | Unique ID used for picking. |
| **`mouseX`**, **`mouseY`** | `number` | Mouse/touch coordinates within the canvas. |
| **`movementX`**, **`movementY`** | `number` | Mouse movement amount compared to the previous event. |
| **`point`** | `vec3` | Precise intersection point coordinates in world space. |
| **`localPoint`** | `vec3` | Intersection point coordinates in the object's local space. |
| **`localX`**, **`localY`**, **`localZ`** | `number` | Individual coordinate values in local space. |
| **`uv`** | `vec2` | Texture coordinates (UV) at the intersection point. |
| **`distance`** | `number` | Distance between the camera and the intersection point. |
| **`faceIndex`** | `number` | Index of the intersected triangle (Polygon). (-1 if not available) |
| **`time`** | `number` | Time when the event occurred (ms). |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | State of modifier keys when the event occurred. |

### 1.4 Practical Example: Interactive Cube

This is an interactive example where the size changes on mouse over, the color changes upon clicking, and coordinates can be checked during movement.

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

    // 1. Create basic cube
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    // 4. Create HTML UI for status display (bottom left)
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
        statusOverlay.querySelector('#canvas-pos').innerText = `${e.mouseX.toFixed(1)}, ${e.mouseY.toFixed(1)}`;
        
        // Check if hit information is available
        const hasHit = e.faceIndex !== -1 || (e.point && (e.point[0] !== 0 || e.point[1] !== 0 || e.point[2] !== 0));
        
        if (hasHit) {
            statusOverlay.querySelector('#world-pos').innerText = `${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}`;
            statusOverlay.querySelector('#local-pos').innerText = `${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}`;
            statusOverlay.querySelector('#uv-pos').innerText = `${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}`;
            statusOverlay.querySelector('#distance').innerText = e.distance.toFixed(3);
            statusOverlay.querySelector('#face-index').innerText = e.faceIndex;
        } else {
            statusOverlay.querySelector('#world-pos').innerText = '-';
            statusOverlay.querySelector('#local-pos').innerText = '-';
            statusOverlay.querySelector('#uv-pos').innerText = '-';
            statusOverlay.querySelector('#distance').innerText = '-';
            statusOverlay.querySelector('#face-index').innerText = '-';
        }
    };

    // 3. Register event listeners
    
    // [CLICK] Random color change and rotation on click
    mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        e.target.material.color.setColorByRGB(r, g, b);
        
        e.target.rotationY += 45;
        e.target.rotationX += 45;
        
        updateUI(e);
        typeEl.style.color = '#ffcc00';
    });

    // [DOWN] When mouse button is pressed
    mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
        updateUI(e);
        typeEl.style.color = '#ff4444';
    });

    // [MOVE] Display coordinates when moving mouse over the object
    mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
        updateUI(e);
    });

    // [OVER] On mouse over
    mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
        document.body.style.cursor = 'pointer';
        updateUI(e);
        typeEl.style.color = '#00CC99';
    });

    // [OUT] On mouse out
    mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
        document.body.style.cursor = 'default';
        updateUI(e); // Update UI on mouse out (show dashes)
        typeEl.innerText = 'Event: MOUSE_OUT';
        typeEl.style.color = '#ffffff';
    });

    // 4. Camera and View Setup
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 5. Start Rendering
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 2. Keyboard Interaction (keyboardKeyBuffer)

In addition to object picking, you can check the real-time pressed state of the keyboard through `redGPUContext.keyboardKeyBuffer`. This is very useful for logic that needs to check key states every frame, such as character movement or camera control.

### 2.1 Basic Usage

`keyboardKeyBuffer` is an object that has the name of the currently pressed key as the key and the pressed state as the value.

```javascript
RedGPU.init(canvas, (redGPUContext) => {
    // Check state within render loop
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

### 2.2 Key Features

- **Real-time State Management**: Integrated management is provided in `redGPUContext` without the need to directly manage separate `keydown` and `keyup` listeners.
- **Case Sensitivity**: Since it uses the `e.key` value directly, it is case-sensitive. For universal input, it is recommended to check both `'w'` and `'W'`.
- **Modifier Key Support**: The state of special keys such as `Shift`, `Control`, and `Alt` can be checked in the same way.

## 3. Live Examples

You can directly check various interaction behaviors provided by RedGPU through the examples below.

### 3.1 Mouse and Touch Examples
- [Basic Mesh Interaction](/RedGPU/examples/3d/mouseEvent/mesh/)
- [Sprite Interaction](/RedGPU/examples/3d/mouseEvent/sprite3D/)
- [Text Field Interaction](/RedGPU/examples/3d/mouseEvent/textField3D/)
- [High-Precision Raycasting (Raycasting)](/RedGPU/examples/3d/mouseEvent/raycasting/)

### 3.2 Keyboard Interaction Examples
- [Character Controller (WASD)](/RedGPU/examples/3d/controller/characterController/)
- [Raycast Vehicle Simulation](/RedGPU/examples/3d/physics/raycastVehicle/)

## Key Summary

- Independent event processing per object is possible through `addListener`.
- Precise frame-by-frame keyboard state control is possible through `keyboardKeyBuffer`.
- A rich user experience (UX) can be provided by using it along with web standard DOM APIs.

## Next Learning Recommendation

Apply post-processing effects that enhance the visual completion of scenes enriched with interaction.

- **[Post-Effect](../post-effect/index.md)**