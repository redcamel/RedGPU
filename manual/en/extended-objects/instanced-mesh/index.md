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
geometry and material in a single **Draw Call**. It is essential for representing forests (trees), grass, crowds, etc.

<ClientOnly>
  <MermaidResponsive :definition="instancingGraph" />
</ClientOnly>

## 1. Why Instancing?

Creating and adding 10,000 general `Mesh` instances to the scene results in 10,000 draw calls, which drops the frame
rate significantly due to CPU overhead. On the other hand, `InstancingMesh` bundles these data into a single buffer and
sends it to the GPU in a single draw call, providing outstanding rendering performance.

## 2. Basic Usage

When creating an `InstancingMesh`, you must specify the maximum number of instances (`maxInstanceCount`) and the initial
active count (`instanceCount`).

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
    initCount,  // Count to render currently (can be updated dynamically via `instanceCount`)
    geometry,
    material
);

scene.addChild(instancedMesh);
```

## 3. Individual Instance Control

You can control each instance's (`InstancingMeshObject3D`) transform (position, rotation, scale) and `opacity`
individually through the `instancedMesh.instanceChildren` array.

```javascript
// Set position, rotation, scale, and opacity for each instance
const instances = instancedMesh.instanceChildren;

for (let i = 0; i < instancedMesh.instanceCount; i++) {
    const instance = instances[i];
    
    // Set position
    instance.setPosition(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    
    // Set rotation, scale, and opacity
    instance.rotationY = Math.random() * 360;
    instance.scale = Math.random() * 2 + 0.5;
    instance.opacity = Math.random() * 0.5 + 0.5;
}
```

::: warning [Child Hierarchy Restriction]
Although the child instances of `InstancingMesh` (`InstancingMeshObject3D`) have a transform interface similar to a
standard `Mesh`, they are not independent 3D objects. Instead, they are delegate objects that control the GPU instancing
buffer data. Therefore, they cannot host hierarchical child objects via `addChild()`.
:::

## 4. Practical Example: Controlling Mass Instances

Use the sliders to change the active instance count (`instanceCount`) in real time and observe the performance.

<iframe src="/RedGPU/examples/3d/instancedMesh/simple/" style="width:100%; height:500px;"></iframe>

---

## Related Examples

- [InstancingMesh Basics](/RedGPU/examples/3d/instancedMesh/simple/)
- [InstancingMesh Sphere Grid](/RedGPU/examples/3d/instancedMesh/sphere/)
- [InstancingMesh GPU LOD](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)

---

## Next Steps

Learn how to use image-based objects that always face the camera or how to utilize lightweight 2D assets effectively.

- **[Sprite](../sprite/index.md)**
