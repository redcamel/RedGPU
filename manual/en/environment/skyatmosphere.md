---
title: SkyAtmosphere
order: 3
---

<script setup>
const skyAtmosphereGraph = `
    Sun["Sun (DirectionalLight)"] -->|Provide Light Direction| Atmosphere["SkyAtmosphere (Calculate Atmosphere Scattering)"]
    Atmosphere -->|Render Background| View["View3D (Apply Background & Post Effect)"]

    %% Grayscale styles applied
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# SkyAtmosphere

`SkyAtmosphere` is a physically based atmospheric simulation system that computes
Rayleigh scattering, Mie scattering, and Ozone absorption in real time to render dynamic sky colors and aerial
perspective effects.

<ClientOnly>
  <MermaidResponsive :definition="skyAtmosphereGraph" />
</ClientOnly>

## 1. Key Features and Comparison

- **Real-time Scattering & IBL Integration**: Generates dedicated LUTs (Transmittance, SkyView, MultiScattering) and sky
  lighting based on sun elevation and atmospheric density, providing real-time ambient light to PBR objects in the
  scene.
- **Aerial Perspective**: Synthesizes distance-based atmospheric color attenuation and scattering as a post-effect using
  scene depth.

| Category               | SkyBox                                     | SkyAtmosphere                                         |
|:-----------------------|:-------------------------------------------|:------------------------------------------------------|
| **Method**             | Static image-based (`CubeTexture` / `IBL`) | Real-time physical calculation (LUT-based)            |
| **Sun Responsiveness** | No (Static background image)               | Yes (Real-time color changes with sun direction)      |
| **Aerial Perspective** | No                                         | Yes (Distance-based atmospheric scattering)           |
| **Primary Usage**      | Outer space, indoors, fixed backgrounds    | Open-world outdoor scenes, dynamic time-of-day scenes |

---

## 2. Basic Usage and Sun Angle Control

`SkyAtmosphere` uses the **first `DirectionalLight`** added to the `Scene` as the sun light source. Assigning it to
`view.skyAtmosphere` automatically activates background rendering, atmospheric IBL, and aerial perspective at once.

```javascript
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
view.skyAtmosphere = skyAtmosphere;
```

Simulate time-of-day changes by modifying the `direction` vector or angle properties of the first `DirectionalLight`:

- **`elevation`** (`-90` to `90`): Vertical sun altitude angle in degrees. `90` represents noon (blue sky), `0` to `10`
  represents sunrise/sunset (red glow), and negative values represent night below the horizon.
- **`azimuth`** (`0` to `360`): Horizontal rotation angle in degrees as the sun moves from east to west.

```javascript
sunLight.elevation = 5;  // Render a red sunset glow
sunLight.azimuth = 180;
```

> [!TIP]
> For detailed physical parameters such as Rayleigh/Mie scattering colors (`ColorRGB`) and scale multipliers (`*Scale`),
ozone absorption (`absorption`, `absorptionScale`), ground radius (`groundRadius`), and clouds (`cloudCoverage`,
`cloudDensity`), refer to the `SkyAtmosphere` API documentation.

---

## 3. Example Code

The following example updates the atmospheric state in real time as the `DirectionalLight` direction changes.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create a DirectionalLight to act as the sun
    const sunLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(sunLight);

  // 2. Create SkyAtmosphere and assign to View
    const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skyAtmosphere = skyAtmosphere;
    redGPUContext.addView(view);

  // 3. Update sun altitude (light direction) every frame
    let time = 0;
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (timeDelta) => {
        time += timeDelta * 0.001;

      // Simulate sun trajectory from east to west (negative y represents night)
        const x = Math.cos(time);
      const y = Math.sin(time);
        sunLight.direction = [x, y, 0];
    });
});
```

---

## Related Examples

- [SkyAtmosphere Basics](/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
- [Atmospheric Scattering Parameter Test](/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
- [SkyAtmosphere + glTF Model](/RedGPU/examples/3d/skyAtmosphere/gltf/)

---

## Next Steps

- **[Global Wind System](./wind.md)**: Controlling scene-wide wind direction and strength with `WindManager`
