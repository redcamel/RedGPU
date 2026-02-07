---
title: Interaction
order: 8
---

# Interaction

RedGPU provides an intuitive **Picking** system that handles mouse and touch events for 3D and 2D objects. Most display objects such as `Mesh`, `Sprite3D`, and `Sprite2D` can receive and react to user input.

## 1. Registering Event Listeners

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

## 2. Supported Event Types

The system supports 6 basic events defined in `RedGPU.Picking.PICKING_EVENT_TYPE`.

| Event Constant | String Value | Description |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | Occurs upon mouse click or touch tap |
| **`DOWN`** | `'down'` | Occurs upon mouse button press or touch start |
| **`UP`** | `'up'` | Occurs upon mouse button release or touch end |
| **`OVER`** | `'over'` | Occurs when the mouse cursor enters over the object (Hover In) |
| **`OUT`** | `'out'` | Occurs when the mouse cursor leaves the object (Hover Out) |
| **`MOVE`** | `'move'` | Occurs continuously while the mouse pointer moves over the object |

## 3. Detailed Event Information (PickingEvent)

The object (`e`) passed to the event callback contains various pieces of information at the time of occurrence. This allows for the implementation of precise interaction logic.

| Property Name | Type | Description |
| :--- | :--- | :--- |
| **`target`** | `Mesh` | The target object where the event occurred. |
| **`type`** | `string` | The type of the event that occurred. |
| **`mouseX`**, **`mouseY`** | `number` | Mouse/touch coordinates within the canvas. |
| **`movementX`**, **`movementY`** | `number` | Mouse movement amount compared to the previous frame. |
| **`point`** | `vec3` | Precise intersection point coordinates in world space. |
| **`localPoint`** | `vec3` | Intersection point coordinates in the object's local space. |
| **`localX`**, **`localY`**, **`localZ`** | `number` | Individual coordinate values in local space. |
| **`uv`** | `vec2` | Texture coordinates (UV) at the intersection point. |
| **`distance`** | `number` | Distance between the camera and the intersection point. |
| **`faceIndex`** | `number` | Index of the intersected triangle (Polygon). |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | State of modifier keys when the event occurred. |

## 4. Practical Example: Interactive Cube

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

    // 4. Create HTML UI for status display (bottom center)
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
    
    // Create two-line structure
    statusOverlay.innerHTML = `
        <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 4px;">Ready to Interact</div>
        <div id="event-detail" style="font-size: 14px; color: #aaa;">Move or Click the Cube</div>
    `;
    document.body.appendChild(statusOverlay);

    const typeEl = statusOverlay.querySelector('#event-type');
    const detailEl = statusOverlay.querySelector('#event-detail');

    // 3. Register event listeners
    
    // [CLICK] Random color change and rotation on click
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

    // [DOWN] When mouse button is pressed
    mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
        typeEl.innerText = 'Event: MOUSE_DOWN';
        typeEl.style.color = '#ff4444';
    });

    // [MOVE] Display coordinates when moving mouse over the object
    mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
        detailEl.innerText = `MOUSE_MOVE at (${e.mouseX.toFixed(2)}, ${e.mouseY.toFixed(2)})`;
    });

    // [OVER] On mouse over
    mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
        document.body.style.cursor = 'pointer';
        typeEl.innerText = 'Event: MOUSE_OVER';
        typeEl.style.color = '#00CC99';
    });

    // [OUT] On mouse out
    mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
        e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
        document.body.style.cursor = 'default';
        typeEl.innerText = 'Event: MOUSE_OUT';
        typeEl.style.color = '#ffffff';
        detailEl.innerText = 'Move or Click the Cube';
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

## 5. Live Examples (Interaction by Object)

You can directly check the interaction behavior of various objects provided by RedGPU through the examples below.

### 5.1 Mesh Interaction
Mouse event handling example for the most basic `Mesh` object.
<iframe src="/RedGPU/examples/3d/mouseEvent/mesh/"></iframe>

### 5.2 Sprite Interaction
Example of handling events while maintaining the billboard characteristics of `Sprite3D` and `SpriteSheet3D` objects.
<iframe src="/RedGPU/examples/3d/mouseEvent/sprite3D/"></iframe>
<br/>
<iframe src="/RedGPU/examples/3d/mouseEvent/spriteSheet3D/"></iframe>

### 5.3 Text Field Interaction
Example of applying styles and events to a `TextField3D` object.
<iframe src="/RedGPU/examples/3d/mouseEvent/textField3D/"></iframe>

### 5.4 High-Precision Raycasting
Example of extracting precise intersection points and face information from complex geometry.
<iframe src="/RedGPU/examples/3d/mouseEvent/raycasting/"></iframe>

## Key Summary

- Independent event processing per object is possible through `addListener`.
- You can directly access the object that triggered the event via `e.target`.
- UX can be enhanced by using it along with web standard DOM APIs such as mouse cursor style changes (`document.body.style.cursor`).

## Next Learning Recommendation

Apply post-processing effects that enhance the visual completion of scenes enriched with interaction.

- **[Post-Effect](../post-effect/index.md)**
