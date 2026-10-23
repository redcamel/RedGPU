---
title: Camera
order: 4
---

# Camera

`Camera` is the viewpoint object that manages the **Projection Matrix** and **View Matrix** for transforming the 3D
**World Coordinate** system into the 2D **Screen Coordinate** system.

---

## 1. Camera Types

RedGPU provides three camera classes depending on the projection use case.

| Class                    | Projection Method | Description and Primary Usage                                                                                                                                                               |
|:-------------------------|:------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`PerspectiveCamera`**  | Perspective       | Standard 3D camera with realistic depth perception. Features physical exposure (`useAutoExposure`) and a default far clipping distance (`farClipping`) of `50000` for open-world rendering. |
| **`OrthographicCamera`** | Orthographic      | Preserves exact object proportions without distance-based perspective distortion. Used for CAD/blueprint viewers and 2.5D isometric environments.                                           |
| **`Camera2D`**           | 2D Orthographic   | Dedicated camera for UI and 2D element rendering. Automatically instantiated inside `View2D`; do not instantiate directly with `new`.                                                       |

```javascript
// Create PerspectiveCamera (Context injection not required)
const camera = new RedGPU.Camera.PerspectiveCamera();

camera.fieldOfView = 45;     // Field of View (default: 60 degrees)
camera.nearClipping = 0.1;   // Near clipping plane (default: 0.1)
camera.farClipping = 50000;  // Far clipping plane (default: 50000)

// Set position and gaze target (lookAt)
camera.setPosition(0, 5, -15);
camera.lookAt(0, 0, 0);
```

---

## 2. Physical Camera Exposure and Auto Exposure Control

`PerspectiveCamera` possesses physical photographic exposure parameters (`aperture`, `shutterSpeed`, `iso`). When
`useAutoExposure = true` (default), it performs real-time screen luminance adaptation according to
`view.postEffectManager.autoExposure`. When `false`, it operates on manual exposure (`ev100`).

| Category           | Property                         | Default             | Description                                                                       |
|:-------------------|:---------------------------------|:--------------------|:----------------------------------------------------------------------------------|
| **`ACamera`**      | **`useAutoExposure`**            | `true`              | Enables real-time luminance-based automatic exposure adaptation                   |
| **`ACamera`**      | **`aperture`**                   | `16.0`              | Lens aperture value (f-stop, range: `1.0 ~ 32.0`)                                 |
| **`ACamera`**      | **`shutterSpeed`**               | `1 / 125`           | Shutter speed (exposure time in seconds)                                          |
| **`ACamera`**      | **`iso`**                        | `100`               | Sensor light sensitivity (ISO, range: `50 ~ 25600`)                               |
| **`ACamera`**      | **`ev100`**                      | Read-only           | EV100 exposure value automatically computed from aperture, shutter speed, and ISO |
| **`AutoExposure`** | **`exposureCompensation`**       | `0.0`               | Exposure bias added to the auto exposure result (in EV units)                     |
| **`AutoExposure`** | **`meteringMode`**               | `'center-weighted'` | Metering mode (`AVERAGE` full-screen average / `CENTER_WEIGHTED` center priority) |
| **`AutoExposure`** | **`minEV100` / `maxEV100`**      | `6.0` / `15.0`      | Minimum and maximum EV100 adaptation limits                                       |
| **`AutoExposure`** | **`adaptationSpeedUp` / `Down`** | `3.0` / `1.0`       | Eye adaptation speed when transitioning to bright or dark environments            |
| **`AutoExposure`** | **`targetLuminance`**            | `0.18`              | Target average screen luminance for auto exposure (18% middle grey)               |

```javascript
// Example: Adjusting AutoExposure parameters
const autoExposure = view.postEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5; // +0.5 EV brighter
autoExposure.meteringMode = RedGPU.Camera.AutoExposure.METERING_MODE.CENTER_WEIGHTED;
autoExposure.minEV100 = 6.0;
autoExposure.maxEV100 = 15.0;
```

---

## 3. Practical Example: Camera Orbit Rotation and `lookAt()`

An example of moving the camera along a circular orbit while calling `lookAt(0, 0, 0)` every frame to keep the view
matrix aimed at the central object.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. PerspectiveCamera setup
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
    camera.fieldOfView = 45;
    camera.lookAt(0, 0, 0);

    // 2. Scene composition (TorusKnot + Light)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    // 3. Animation: Update camera orbit position and gaze target
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Camera lookAt" slugHash="camera-lookat">
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
    
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
    camera.fieldOfView = 45;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[Camera Controller](./controller.md)**: Interactive camera and character control using mouse, touch, and keyboard
