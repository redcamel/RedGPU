---
title: Lake
order: 1
---

# Lake

`RedGPU.Water.Lake` is a lake water class supporting depth-based light attenuation, underwater refraction, caustics,
Screen Space Reflections (**SSR**), and **real-time water surface interactions** that propagate concentric ripples when
objects collide with the water.

---

## 1. Creation & Scene Registration

`Lake` operates as a 2-Pass mesh that references the background color and depth buffers after opaque objects are
rendered. Register it to the scene using `scene.addWater(lake)`.

> [!NOTE]
> Because wave normal maps (`normalTexture`, `normalDetailTexture`) store normal vectors rather than color values, pass
**`'rgba8unorm'`** as the format when creating the `BitmapTexture` for accurate wave undulations.

```javascript
// 1. Create a lake (width = 100, height = 100, widthSegments = 64, heightSegments = 64)
const lake = new RedGPU.Water.Lake(redGPUContext, 100, 100, 64, 64);

// 2. Configure water elevation (Y coordinate) and vertex waves
lake.waterLevel = 0.0;        // Water surface height (equivalent to lake.y)
lake.waveAmplitude = 0.025;   // Vertex wave amplitude (default: 0.025)
lake.waveWavelength = 16.0;   // Vertex wave wavelength (default: 16.0)

// 3. Assign linear ('rgba8unorm') normal textures
lake.material.normalTexture = new RedGPU.Resource.BitmapTexture(
    redGPUContext, './assets/water/lake_normal.png', true, null, null, 'rgba8unorm'
);
lake.material.normalDetailTexture = new RedGPU.Resource.BitmapTexture(
    redGPUContext, './assets/water/lake_normal_detail.png', true, null, null, 'rgba8unorm'
);

// 4. Register lake to the scene
scene.addWater(lake);
```

### Live Example: Basic Lake & Water Level Control

<iframe src="/RedGPU/examples/3d/water/lake/basicLake/" style="width:100%; height:500px;"></iframe>

---

## 2. Optical Material Configuration (`LakeMaterial`)

When a `Lake` instance is created, `LakeMaterial` is automatically assigned to `lake.material`. You can adjust
depth-based colors (`baseColor`, `deepColor`), refraction (`refractionStrength`), underwater caustics
(`causticsStrength`), and Screen Space Reflections (`enableSSR`).

```javascript
const mat = lake.material;
mat.baseColor.setColorByHEX('#18d8b6'); // Shallow water color
mat.deepColor.setColorByHEX('#065279'); // Deep water color
mat.extinctionFactor = 0.22;            // Light attenuation by depth
mat.refractionStrength = 1.0;           // Underwater refraction strength
mat.causticsStrength = 1.0;             // Underwater caustics intensity
mat.enableSSR = true;                   // Enable Screen Space Reflections (SSR)
```

---

## 3. Real-Time Water Wave Interaction

`Lake` includes a built-in GPU 2D wave simulation that propagates concentric ripples in real time when characters or
objects touch or move across the water surface.

1. **Configure Interactive Objects (`Mesh`)**: Set `mesh.enableWaterInteraction = true` on any mesh that should generate
   ripples (automatically propagates to child meshes when set on a root mesh).
2. **Set Simulation Follow Target**: Assign `lake.interactionFollowTarget = characterMesh` to focus wave simulation
   resolution around a character across a large lake.

```javascript
// 1. Enable water interaction on the target mesh
characterMesh.enableWaterInteraction = true;
characterMesh.waterWaveStrength = 1.0; // Wave generation strength (default: 1.0)

// 2. Configure lake wave simulation
lake.interactionEnabled = true;
lake.interactionFollowTarget = characterMesh; // Operates around lake center if omitted

// 3. Adjust ripple propagation properties
lake.rippleWaveSpeed = 0.32;      // Ripple propagation speed (default: 0.32)
lake.rippleDamping = 0.012;       // Ripple damping factor (default: 0.012)
lake.rippleNormalStrength = 1.0;  // Ripple normal strength (default: 1.0)
```

### Live Example: Water Wave Interaction

<iframe src="/RedGPU/examples/3d/water/lake/interaction/" style="width:100%; height:500px;"></iframe>

---

## Related Examples

- [Basic Lake](/RedGPU/examples/3d/water/lake/basicLake/)
- [Lake Material](/RedGPU/examples/3d/water/lake/lakeMaterial/)
- [Water Wave Interaction](/RedGPU/examples/3d/water/lake/interaction/)
- [Character Walking Ripples](/RedGPU/examples/3d/water/lake/characterWalking/)
- [Multi Lake](/RedGPU/examples/3d/water/lake/multiLake/)
- [Lake with Landscape](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)

---

[Next Step: Learn Plugin System](../plugins/index.md)
