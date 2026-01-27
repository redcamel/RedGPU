---
title: LOD (Level of Detail)
order: 9
---

# LOD

**LOD** (Level of Detail) is an optimization technique that shows different levels of detail (Geometry) depending on the distance between the camera and the object.
By using high-resolution models for objects that are close and low-resolution models for objects that are far away, you can maximize rendering performance while maintaining visual quality.

RedGPU supports LOD in a consistent way by embedding **`LODManager`** in both `Mesh` and `InstancingMesh`.

## Learning Guide

The way LOD works differs depending on the object type. Refer to the document that suits your situation.

1. **[Mesh LOD](./mesh-lod.md)**: Applied to general single objects (CPU-based)
2. **[Instancing Mesh LOD](./instanced-lod.md)**: Applied to massive instancing objects (GPU-based)

---

[Next Step: Learn Mesh LOD](./mesh-lod.md)
