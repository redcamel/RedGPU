---
title: Particle & Line
order: 5
---

# Particle & Line

Covers `ParticleEmitter`, which simulates tens of thousands of particles in parallel using GPU compute shaders, and
`Line3D` / `Line2D`, which connect vertices in 3D or 2D space with straight lines or smooth curves.

## 1. GPU Particle System

`ParticleEmitter` simulates and renders large-scale particle effects—such as fire,
smoke, snow, and magic spells—in real time on the GPU (Compute Shader) with zero CPU overhead.

| Property                                  | Default         | Description                                                                                         |
|:------------------------------------------|:----------------|:----------------------------------------------------------------------------------------------------|
| **`particleNum`**                         | `2000`          | Total number of particles simulated simultaneously                                                  |
| **`useBillboard`**                        | `true`          | Whether particle planes always face the camera                                                      |
| **`minLife` / `maxLife`**                 | `1000` / `5000` | Minimum and maximum lifespan of individual particles (in milliseconds)                              |
| **`minStartX/Y/Z` ~ `maxStartX/Y/Z`**     | `0`             | Random spawn position range when particles are emitted                                              |
| **`minEndX/Y/Z` ~ `maxEndX/Y/Z`**         | `-5` ~ `5`      | Random end position range when particles expire                                                     |
| **`minStartScale` ~ `maxEndScale`**       | `0` ~ `1`       | Start and end scale range over particle lifetime                                                    |
| **`minStartAlpha` ~ `maxEndAlpha`**       | `1`             | Start and end opacity (Alpha) range over particle lifetime                                          |
| **`easeX/Y/Z`, `easeAlpha`, `easeScale`** | `PARTICLE_EASE` | Easing functions applied to position, alpha, and scale transitions (`RedGPU.Display.PARTICLE_EASE`) |

```javascript
// 1. Create a particle emitter and configure particle count
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.particleNum = 5000;
emitter.minLife = 1000;
emitter.maxLife = 3500;

// 2. Configure particle texture and blend mode
emitter.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/particle.png'
);
emitter.blendMode = RedGPU.GPU_BLEND_MODE.ADD;

scene.addChild(emitter);
```

---

## 2. 3D/2D Line and Spline Renderer

`Line3D` (`RedGPU.Display.Line3D`, or `RedGPU.Display.Line2D` in 2D views) connects spatial points (`addPoint`) into
straight lines, Bezier curves, or Catmull-Rom splines.

| Line Type                   | Description                                                                                                |
|:----------------------------|:-----------------------------------------------------------------------------------------------------------|
| **`LINE_TYPE.LINEAR`**      | Connects added points directly with straight segments.                                                     |
| **`LINE_TYPE.CATMULL_ROM`** | Generates a smooth spline curve passing through all control points; curvature is controlled via `tension`. |
| **`LINE_TYPE.BEZIER`**      | Draws Bezier curves using in/out tangent control points (`inX/Y/Z`, `outX/Y/Z`).                           |

```javascript
// Create a Catmull-Rom spline Line3D
const line = new RedGPU.Display.Line3D(
    redGPUContext,
    RedGPU.Display.LINE_TYPE.CATMULL_ROM,
    '#00ffff'
);

// Add points: addPoint(x, y, z, color, alpha)
line.addPoint(-5, 0, 0, '#ff0055');
line.addPoint(0, 4, 2, '#00ffff');
line.addPoint(5, 0, 0, '#ffcc00');

scene.addChild(line);
```

---

## Next Steps

- **[Interaction](../../interaction/index.md)**: Event system for clicking and controlling scene objects via mouse and
  touch input
