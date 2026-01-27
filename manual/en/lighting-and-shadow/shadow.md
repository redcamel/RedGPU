---
title: Shadow System
order: 3
---

# Shadow System

In 3D space, shadows are a key element determining an object's three-dimensionality and spatial relationships. RedGPU provides a physically based shadow system, allowing you to express realistic shadows with simple settings.

## 1. 3 Elements of Shadow Generation

For shadows to appear on the screen, the following three elements must be configured organically:

1.  **Light**: The light that will create the shadow. Currently, **DirectionalLight** supports shadow generation.
2.  **Caster**: The object that **creates** the shadow. (e.g., character, building) -> `mesh.castShadow = true`
3.  **Receiver**: The object that **receives** the shadow. (e.g., floor, wall) -> `mesh.receiveShadow = true`

::: warning [Performance Attention]
Shadow calculations consume a lot of GPU resources. Therefore, instead of applying it to all objects, it is better for performance optimization to selectively apply it to visually important objects and floors.
:::

## 2. Object Configuration (Cast & Receive)

Every **Mesh** object in RedGPU has independent properties determining whether to create and receive shadows.

```javascript
// 1. Object creating the shadow (Caster)
const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, boxMaterial);
box.castShadow = true;

// 2. Object receiving the shadow (Receiver)
const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeometry, floorMaterial);
floor.receiveShadow = true;
```

## 3. Shadow Quality Management (ShadowManager)

The **Scene** owns a **ShadowManager** internally, allowing you to manage shadow resolution or quality globally.

```javascript
// Set shadow map resolution (Default: 1024)
// Larger values lead to sharper shadow edges but increase performance cost.
scene.shadowManager.directionalShadowManager.shadowDepthTextureSize = 2048;
```

## 4. Practical Example: Configuring a Scene with Shadows

An example of casting a rotating hexahedron's shadow onto the floor using a DirectionalLight.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Setup light and shadows
    const light = new RedGPU.Light.DirectionalLight();
    light.x = -5; light.y = 10; light.z = 5;
    scene.lightManager.addDirectionalLight(light);

    // 2. Create floor (Receiver)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 20, 20),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#cccccc')
    );
    floor.receiveShadow = true; 
    scene.addChild(floor);

    // 3. Create box (Caster)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    box.y = 2;
    box.castShadow = true; 
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationX += 1;
        box.rotationY += 1;
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Shadow" slugHash="shadow-basic">
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
    
    // Light
    const light = new RedGPU.Light.DirectionalLight();
    light.x = -3; light.y = 5; light.z = 3;
    scene.lightManager.addDirectionalLight(light);

    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.3);

    // Floor (Receiver)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#555555')
    );
    floor.receiveShadow = true;
    scene.addChild(floor);

    // Box (Caster)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ffcc00')
    );
    box.y = 3;
    box.castShadow = true;
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationZ += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## Key Summary

-   **castShadow**: Set an object to create a shadow.
-   **receiveShadow**: Set a shadow to be cast on the object surface.
-   **Quality Control**: You can adjust the balance between performance and sharpness through `ShadowManager`.

## Next Steps

Learn how to add infinite backgrounds and photorealistic environment light to spaces where three-dimensionality has been brought to life with added shadows.

- **[Environment](../environment/index.md)**
