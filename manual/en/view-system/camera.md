---
title: Camera
order: 4
---

# Camera

If **Scene** is the 'stage' where all objects are placed, **Camera** is the 'observer's eye' looking at that stage. It is a core object that manages the **Projection Matrix** and **View Matrix** for converting from the **World Coordinate** system to the **Screen Coordinate** system.

RedGPU supports three standard projection methods depending on the use case.

## 1. PerspectiveCamera

**PerspectiveCamera** uses the **Perspective Projection** method. Operating similarly to the human eye or a real camera
lens, objects that are far away appear smaller and closer objects appear larger, providing a realistic sense of depth.

In particular, RedGPU's **PerspectiveCamera** aims for **Physical Camera** modeling that simulates a real-world lens. It
features **automatic exposure (`useAutoExposure`) enabled by default (`true`)**, which dynamically calculates and adapts
the optimal screen brightness in real-time based on the environmental lighting.

```javascript
// Create an instance (Context injection required)
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);

// 1. Control automatic exposure activation (Default: true)
camera.useAutoExposure = true;

// 2. Field of View setup (Default: 60 degrees)
// Larger values show a wider area but may result in more edge distortion.
camera.fieldOfView = 45;

// 3. Clipping Planes setup
// Only objects between near and far are rendered on the screen.
camera.nearClipping = 0.1; 
camera.farClipping = 1000;

// 4. Transform setup
camera.x = 0;
camera.y = 5;
camera.z = -15;
```

## 2. Camera2D

**Camera2D** is a 2D-dedicated camera optimized for rendering UI and 2D elements. This camera is not explicitly
instantiated by the developer using the `new` keyword. Instead, it is **automatically created and registered internally
** when initializing a **View2D** instance.

## 3. OrthographicCamera

**OrthographicCamera** uses the **Orthographic Projection** method, which preserves the actual dimensions of objects
without distance-based perspective distortion. It is typically used for visualizations like blueprint drawings, 2.5D, or
isometric gaming environments where perspective is not required.

---

## 4. Gaze Control (lookAt)

To move the camera's position and then make it look directly at a specific point, use the `lookAt()` method. This method automatically recalculates the **View Matrix** to look at the target point.

```javascript
// Set the camera to look at the world origin (0, 0, 0)
camera.lookAt(0, 0, 0);

// When tracking a moving object (call every frame)
// camera.lookAt(mesh.x, mesh.y, mesh.z);
```

## 4. Practical Example: Camera Orbit Rotation

An example of moving the camera's position in a circular orbit and using `lookAt()` to always gaze at the central object.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. PerspectiveCamera setup
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 8; // Look down from a slightly high position
    
    // Field of View setup
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

    // 3. Animation: Change camera position in real-time
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        
        // Update to always look at the origin (0, 0, 0) after moving
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

    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.y = 8;
    
    // Field of View setup
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

Instead of manually calculating camera positions in code, learn how to control it intuitively using a mouse or touch.

- **[Camera Controller](./controller.md)**