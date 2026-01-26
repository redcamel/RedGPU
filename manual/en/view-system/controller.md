---
title: Camera Controller
order: 5
---

# Camera Controller

If the **Camera** learned earlier is the 'eye', the **Controller** is the 'joystick' that moves that eye.
It is an **Interaction Module** that detects user input (mouse, touch, keyboard) and updates the camera's position and rotation in real-time. Using it allows you to build an intuitive 3D navigation environment without complex matrix operations.

## 1. Controller Types

RedGPU provides standard controllers that respond to various interaction scenarios.

| Class Name | Control Method | Main Usage |
| :--- | :--- | :--- |
| **`OrbitController`** | **Left Click**: Rotate<br>**Wheel**: Zoom | Product 360 viewer, character observation, exploration centered on a specific target |
| **`FollowController`** | Automatic target tracking (smooth interpolation) | TPS (3rd-person) games, character tracking camera |
| **`FreeController`** | **W,A,S,D**: Move<br>**Mouse**: Gaze rotation | FPS games, architectural interior tours, debugging |
| **`IsometricController`** | Maintains a fixed 45-degree angle | Real-time strategy (RTS) games, isometric views |

::: tip [Camera Instance Management]
All **Controller** classes internally create and own a dedicated **Camera** instance.
Therefore, you don't need to create a separate camera when creating a **Controller**; just pass the controller into the camera argument when creating `View3D`, and it will be linked automatically.
:::

## 2. Experience Controller Samples

Please experience the actual behavior of each controller directly through the previews below.

### OrbitController
Optimized for observing while rotating around a specific target.
<iframe src="/RedGPU/examples/3d/controller/orbitController/" ></iframe>

### FreeController
Explore space freely from a first-person perspective using **W, A, S, D** keys and the mouse.
<iframe src="/RedGPU/examples/3d/controller/freeController/" ></iframe>

### IsometricController
Suitable for strategy simulations or infographics by maintaining a fixed angle.
<iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:400px; border:none; border-radius:8px;"></iframe>


### FollowController
Provides a viewpoint that smoothly follows characters or moving objects.
<iframe src="/RedGPU/examples/3d/controller/followController/" ></iframe>

---

## Next Steps

Now you've learned how to configure and move around the screen. But the objects we've displayed so far had only simple colors.

Now, let's move on to the **Basic Objects** section to learn how to represent 3D objects more realistically through refined meshes and **Textures** with text and images applied.

- **[Basic Objects Overview](../basic-objects/)**
