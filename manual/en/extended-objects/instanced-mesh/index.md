---
title: Instancing Mesh
order: 2
---

<script setup>
const instancingGraph = `
    CPU["CPU (1 Draw Call)"] -->|Send| GPU["GPU (Buffer Operations)"]
    GPU --> Inst1["Instance 1"]
    GPU --> Inst2["Instance 2"]
    GPU --> InstN["Instance N..."]

    %% Grayscale styles applied
    style CPU fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GPU fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Inst1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Inst2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style InstN fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Instancing Mesh

**Instancing Mesh** is a high-performance object that renders thousands or tens of thousands of objects sharing the same
geometry and material in a single **Draw Call**. It is essential for representing forests (trees), grass, particles,
crowds, etc.

<ClientOnly>
  <MermaidResponsive :definition="instancingGraph" />
</ClientOnly>

## 1. Why Instancing?

Creating and adding 10,000 general **Mesh** instances to the scene results in 10,000 draw calls, which drops the frame
rate significantly due to CPU overhead. On the other hand, `InstancingMesh` bundles these data into a single buffer and
sends it to the GPU in a single draw call, providing outstanding rendering performance.

## 2. Basic Usage

When creating an `InstancingMesh`, you must specify the maximum number of instances (Capacity) and the initial count to
use.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Allocate space for up to 100,000 instances, set initial 5,000
const maxCount = 100000;
const initCount = 5000;

const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,   // Maximum buffer capacity (immutable after creation)
    initCount,  // Count to render currently (can be updated dynamically)
    geometry,
    material
);

scene.addChild(instancedMesh);
```

## 3. Individual Instance Control

You can control each instance's transform (position, rotation, scale) individually through the
`instancedMesh.instanceChildren` array.

```javascript
// Randomly position each instance
const instances = instancedMesh.instanceChildren;

for (let i = 0; i < instancedMesh.instanceCount; i++) {
    const instance = instances[i];
    
    // Set position
    instance.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    
    // Set rotation and scale
    instance.rotationY = Math.random() * 360;
    instance.scale = Math.random() * 2 + 0.5;
}
```

::: warning [Child Hierarchy Restriction]
Although the child instances of `InstancingMesh` (individual instance objects) have a similar interface to a standard
`Mesh`, they are not actual independent 3D objects. Instead, they are virtual delegate objects that control the GPU
instancing buffer data. Therefore, they cannot host hierarchical child objects via `addChild()`.
:::

---

## 4. Practical Example: 10,000 Cubes

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Set up lighting
    const light = new RedGPU.Light.DirectionalLight();
    light.x = 10; light.y = 20; light.z = 10;
    scene.lightManager.addDirectionalLight(light);

    // 2. Create Instancing Mesh (10,000 instances)
    const maxCount = 10000;
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    const instancedMesh = new RedGPU.Display.InstancingMesh(
        redGPUContext,
        maxCount,
        maxCount,
        geometry,
        material
    );
    scene.addChild(instancedMesh);

    // 3. Randomly distribute instances
    const instances = instancedMesh.instanceChildren;
    for (let i = 0; i < maxCount; i++) {
        const item = instances[i];
        item.x = Math.random() * 80 - 40;
        item.y = Math.random() * 80 - 40;
        item.z = Math.random() * 80 - 40;
        
        item.rotationX = Math.random() * 360;
        item.rotationY = Math.random() * 360;
        item.rotationZ = Math.random() * 360;
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 60;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        // Gently rotate all instances every frame
        for (let i = 0; i < maxCount; i++) {
            instances[i].rotationY += 0.5;
        }
    });
});
```

## Key Summary

- **Mass Rendering**: The best solution for rendering tens of thousands of objects in a single draw call.
- **Performance Maximization**: Eliminates CPU-to-GPU communication overhead to maintain high frame rates.
- **Dynamic Control**: You can control the active render count dynamically using the `instanceCount` property.

---

## Next Steps

Learn how to use image-based objects that always face the camera or how to utilize lightweight 2D assets effectively.

- **[Sprite](../sprite/index.md)**
