---
title: Plugins
order: 14
---

# Plugins

RedGPU's **Plugin System** is an interface for integrating external extension modules—such as WASM-based physics
engines—into `Scene` and the rendering loop while keeping the core engine bundle lightweight.

---

## Available Plugins

| Plugin                             | Core Class      | Description                                                                                                                        |
|:-----------------------------------|:----------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| **[Physics Plugin](./physics.md)** | `RapierPhysics` | Integrates the WASM-based Rapier physics engine for rigid body simulation, collision detection, character controllers, and joints. |

---

## Next Steps

- **[Physics Plugin](./physics.md)**: Initializing `RapierPhysics` and binding physics bodies (`createBody`)
