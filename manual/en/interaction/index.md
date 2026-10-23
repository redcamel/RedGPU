---
title: Interaction
order: 8
---

# Interaction

RedGPU provides tools to intuitively and easily handle various user inputs:

- **Picking System**: Handles mouse and touch events for both 3D and 2D objects.
- **Keyboard Buffer (`keyboardKeyBuffer`)**: Manages keyboard states in real-time to support fine-grained,
  frame-by-frame control.

## 1. Mouse and Touch Interaction (Picking)

RedGPU's picking system enables user input reception and reaction for most display objects, such as `Mesh`, `Sprite3D`,
and `Sprite2D`.

### 1.1 Registering Event Listeners

To register events on an object, use the `addListener` method. When an event occurs, the registered callback function is
executed, and an event information object (`e`) is passed to it.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// Reference event type constants
const { PICKING_EVENT_TYPE } = RedGPU.Picking;

mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked object:', e.target);
    // Rotate upon click
    e.target.rotationY += 45;
});
```

### 1.2 Supported Event Types

The system supports the 6 basic events defined in `RedGPU.Picking.PICKING_EVENT_TYPE`.

| Event Constant | String Value | Description |
| :--- | :--- | :--- |
| **`CLICK`** | `'click'` | Occurs on a mouse click or touch tap |
| **`DOWN`** | `'down'` | Occurs when a mouse button is pressed or touch starts |
| **`UP`** | `'up'` | Occurs when a mouse button is released or touch ends |
| **`OVER`** | `'over'` | Occurs when the mouse cursor enters the object's area (Hover In) |
| **`OUT`** | `'out'` | Occurs when the mouse cursor leaves the object's area (Hover Out) |
| **`MOVE`** | `'move'` | Occurs continuously as the mouse pointer moves over the object |

### 1.3 Detailed Event Information (PickingEvent)

The object (`e`) passed to the event callback contains various pieces of information about the event at the moment it
occurred. This allows for the implementation of precise interaction logic.

| Property Name                               | Type      | Description                                                            |
|:--------------------------------------------|:----------|:-----------------------------------------------------------------------|
| **`target`**                                | `Mesh`    | The target object where the event occurred.                            |
| **`type`**                                  | `string`  | The type of the event that occurred.                                   |
| **`pickingId`**                             | `number`  | A unique ID used for picking.                                          |
| **`mouseX`**, **`mouseY`**                  | `number`  | Mouse or touch coordinates within the canvas.                          |
| **`movementX`**, **`movementY`**            | `number`  | The amount of mouse movement compared to the previous event.           |
| **`point`**                                 | `vec3`    | Precise intersection point coordinates in world space.                 |
| **`localPoint`**                            | `vec3`    | Intersection point coordinates in the object's local space.            |
| **`localX`**, **`localY`**, **`localZ`**    | `number`  | Individual coordinate values in local space.                           |
| **`uv`**                                    | `vec2`    | Texture coordinates (UV) at the intersection point.                    |
| **`distance`**                              | `number`  | The distance between the camera and the intersection point.            |
| **`faceIndex`**                             | `number`  | The index of the intersected triangle (polygon). (-1 if not available) |
| **`time`**                                  | `number`  | The time when the event occurred (in ms).                              |
| **`altKey`**, **`ctrlKey`**, **`shiftKey`** | `boolean` | The state of modifier keys at the time of the event.                   |

### 1.4 Practical Example: Mouse Picking & Precision Raycasting

Move the mouse over the 3D geometries to see how triangle-level intersection data (`point`, `localPoint`, `faceIndex`,
`uv`) is detected in real time.

<iframe src="/RedGPU/examples/3d/interaction/mouseEvent/raycasting/" style="width:100%; height:500px;"></iframe>

## 2. Keyboard Interaction (keyboardKeyBuffer)

In addition to object picking, you can check the real-time state of the keyboard via `redGPUContext.keyboardKeyBuffer`.
This is useful for logic that checks key states every frame, such as character movement or camera control.

```javascript
RedGPU.init(canvas, (redGPUContext) => {
    // Check state within the render loop
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

> [!TIP]
> `keyboardKeyBuffer` uses standard browser `KeyboardEvent.key` values as keys (`'w'`, `'W'`, `' '`, `'ArrowUp'`,
`'Shift'`, etc.).

---

## Related Examples

- **Mouse & Touch**
    - [Mesh](/RedGPU/examples/3d/interaction/mouseEvent/mesh/)
    - [Sprite3D](/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/)
    - [SpriteSheet3D](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)
    - [TextField3D](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)
    - [High-Precision Raycasting](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
- **Keyboard**
    - [3D Keyboard Interaction](/RedGPU/examples/3d/interaction/keyboardEvent/)
    - [2D Keyboard Interaction](/RedGPU/examples/2d/interaction/keyboardEvent/)

---

## Next Steps

Apply post-processing effects that enhance the visual completion of scenes enriched with interaction.

- **[Post-Effect](../post-effect/index.md)**
