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

**Instancing Mesh** (`RedGPU.Display.InstancingMesh`) is a high-performance display object that bundles thousands or
tens of thousands of objects sharing the same geometry and material into a single buffer and renders them in a single
**Draw Call**.

<ClientOnly>
  <MermaidResponsive :definition="instancingGraph" />
</ClientOnly>

---

## 1. Creation and Individual Instance Control

Specify the maximum buffer capacity (`maxInstanceCount`) and the initial active render count (`instanceCount`) upon
creation.

| Property               | Type                       | Description                                                                                                          |
|:-----------------------|:---------------------------|:---------------------------------------------------------------------------------------------------------------------|
| **`maxInstanceCount`** | `number`                   | Maximum allocated instance buffer capacity (immutable after creation, read-only)                                     |
| **`instanceCount`**    | `number`                   | Number of active instances to render (`0 ~ maxInstanceCount`, dynamically adjustable)                                |
| **`instanceChildren`** | `InstancingMeshObject3D[]` | Array of virtual delegate objects controlling individual instance transforms (position, rotation, scale) and opacity |

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const maxCount = 100000;
const initCount = 5000;

const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

const instancedMesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,   // Maximum buffer capacity
    initCount,  // Initial render count
    geometry,
    material
);
scene.addChild(instancedMesh);

// Configure individual instance transforms
const instances = instancedMesh.instanceChildren;
for (let i = 0; i < instancedMesh.instanceCount; i++) {
    const instance = instances[i];
    instance.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    instance.rotationY = Math.random() * 360;
    instance.scale = Math.random() * 2 + 0.5;
}
```

> [!WARNING]
> Although each element (`InstancingMeshObject3D`) in `instanceChildren` exposes a transform interface similar to
`Mesh`, it is a virtual delegate object that directly updates GPU instancing buffer data and cannot host child objects
via `addChild()`.

---

## 2. Practical Example: 10,000 Cubes

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
        for (let i = 0; i < maxCount; i++) {
            instances[i].rotationY += 0.5;
        }
    });
});
```

---

## Next Steps

- **[Sprite](../sprite/index.md)**: Using camera-facing billboard sprites and frame-based animations
