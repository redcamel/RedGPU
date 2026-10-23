---
title: Extended Objects
order: 7
---

# Extended Objects

Covers how to compose scene content using external 3D model loading, mass GPU instancing, 2D/3D sprites and text, and
GPU particle and line renderers.

## Learning Topics

1. **[GLTF Loader](./model-loading/index.md)**: Loading external 3D model files (`.gltf`, `.glb`), playing animations,
   and motion blending with `AnimStateMachine`
2. **[Instancing Mesh](./instanced-mesh/index.md)**: High-performance GPU instancing that renders tens of thousands of
   identical objects in a single draw call (`InstancingMesh`)
3. **[Sprite](./sprite/index.md)**: Billboard icons (`Sprite3D`), 2D sprites (`Sprite2D`), and frame-based animations
   (`SpriteSheet3D` / `SpriteSheet2D`)
4. **[Text Field](./text-field/index.md)**: Placing text in the 3D world and on the 2D screen (`TextField3D` /
   `TextField2D`)
5. **[Particle & Line](./particle/index.md)**: GPU compute shader particle systems (`ParticleEmitter`) and 3D/2D spline
   renderers (`Line3D` / `Line2D`)

---

[Next Step: Learn GLTF Loader](./model-loading/index.md)
