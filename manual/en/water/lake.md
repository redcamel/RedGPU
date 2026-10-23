---
title: Lake
order: 1
---

# Physically Based Lake Water

`Lake` is a lake water class that provides depth-based Beer-Lambert light attenuation, refraction, underwater caustics,
real-time Screen Space Reflections (**SSR**), and **real-time 2D wave equation surface interactions** triggered by
object collisions.

## 1. Creating Water and Registering to Scene

Because `Lake` captures the background color and depth buffers after opaque geometry and terrain rendering finish to
compute refraction and shoreline depth fades, you must register it using the dedicated `scene.addWater(lake)` method
rather than `scene.addChild()`.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 1. Create a 200m x 200m lake with 64x64 segments
const lake = new RedGPU.Water.Lake(redGPUContext, 200, 200, 64, 64);

// 2. Configure water surface elevation (Y coordinate) and vertex waves
lake.waterLevel = 15.0;       // Equivalent to lake.y = 15.0
lake.waveAmplitude = 0.03;    // Vertex wave amplitude (default: 0.025)
lake.waveWavelength = 16.0;   // Vertex wave wavelength (default: 16.0)

// 3. Register to the Scene's dedicated water render layer (Required)
scene.addWater(lake);
```

---

## 2. Optical Water Material

When a `Lake` instance is created, a `LakeMaterial` is automatically assigned to `lake.material`.

| Property                                    | Default         | Description                                                                                |
|:--------------------------------------------|:----------------|:-------------------------------------------------------------------------------------------|
| **`baseColor`**                             | `'#18d8b6'`     | Shallow water base color (`ColorRGB` — `lake.material.baseColor.setColorByHEX('#18d8b6')`) |
| **`deepColor`**                             | `'#065279'`     | Deep water color (`ColorRGB`)                                                              |
| **`extinctionFactor`**                      | `0.22`          | Light attenuation coefficient as water depth increases                                     |
| **`depthFadeDistance`**                     | `0.8`           | Water depth distance over which shoreline edges softly fade into terrain                   |
| **`turbidity`**                             | `0.35`          | Water turbidity (`0.0 ~ 1.0`)                                                              |
| **`refractionStrength`**                    | `1.0`           | Underwater background refraction distortion strength (`0.0 ~ 1.0`)                         |
| **`roughness`**                             | `0.07`          | Water surface roughness (`0.0 ~ 1.0`)                                                      |
| **`normalTexture` / `normalDetailTexture`** | `null`          | Base wave normal map and fine detail wave normal map (`BitmapTexture`)                     |
| **`normalScale` / `normalDetailScale`**     | `1.0` / `0.5`   | Base normal and detail normal intensity (`0.0 ~ 1.0`)                                      |
| **`normalTiling` / `normalDetailTiling`**   | `20.0` / `40.0` | Normal texture repeat count per `100m` in world space                                      |
| **`flowRateScale`**                         | `0.025`         | Wave flow speed multiplier synchronized with global wind (`scene.windManager`)             |
| **`causticsStrength`**                      | `1.0`           | Intensity of underwater caustics projected onto the lake bed (`0.0 ~ 2.0`)                 |
| **`causticsScale` / `causticsSpeed`**       | `1.0` / `1.0`   | Pattern scale and animation speed of underwater caustics                                   |
| **`enableSSR`**                             | `true`          | Enables Screen Space Reflections (SSR)                                                     |
| **`ssrMaxDistance` / `ssrStepCount`**       | `100.0` / `64`  | Maximum raymarching trace distance and step count for SSR                                  |

```javascript
const waterMat = lake.material;

// Assign normal maps and adjust optical parameters
waterMat.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, './assets/water/water_normal.png');
waterMat.normalDetailTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, './assets/water/water_detail_normal.png');
waterMat.baseColor.setColorByHEX('#18d8b6');
waterMat.deepColor.setColorByHEX('#065279');
waterMat.depthFadeDistance = 1.2;
waterMat.causticsStrength = 1.2;
waterMat.enableSSR = true;
```

---

## 3. Real-Time 2D Wave Equation Surface Interaction

`Lake` includes a built-in GPU 2D wave simulator (`LakeWaveSimulator`) that propagates concentric water ripples in real
time when characters or objects contact the water.

1. **Configure Interactive Objects**: Set `mesh.enableWaterInteraction = true` on any `Mesh` that should generate
   ripples. (Setting this on a glTF character root mesh automatically propagates it to all child meshes.)
2. **Set Water Follow Target**: Assign the target mesh to `lake.interactionFollowTarget` so the wave simulation area
   follows the target.

```javascript
// 1. Enable water wave interaction on the character (or standard Mesh)
characterMesh.enableWaterInteraction = true;
characterMesh.waterWaveStrength = 1.2; // Wave generation intensity multiplier (default: 1.0)

// 2. Make the lake's wave simulation center follow the character
lake.interactionEnabled = true;
lake.interactionFollowTarget = characterMesh;

// 3. Fine-tune ripple propagation speed, damping, and normal strength
lake.rippleWaveSpeed = 0.32;      // Ripple propagation speed (default: 0.32)
lake.rippleDamping = 0.012;       // Ripple damping rate (default: 0.012)
lake.rippleNormalStrength = 1.0;  // Ripple normal strength (default: 1.0)
```

---

## Related Examples

- [Basic Lake](/RedGPU/examples/3d/water/lake/basicLake/)
- [Lake Material](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [Water Wave Interaction](/RedGPU/examples/3d/water/lake/interaction/)
- [Character Walking Ripples](/RedGPU/examples/3d/water/lake/characterWalking/)
- [Multi Lake](/RedGPU/examples/3d/water/lake/multiLake/)

---

## Next Steps

- **[Plugins](../plugins/index.md)**: RedGPU's plugin system, including the WASM-powered Rapier physics engine
