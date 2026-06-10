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

**SkyAtmosphere** is a physically-based atmospheric scattering simulation system. It calculates Rayleigh scattering, Mie
scattering, and Ozone absorption in real time to provide realistic skies, evening sunsets, and aerial perspective
effects based on altitude and distance.

<ClientOnly>
  <MermaidResponsive :definition="skyAtmosphereGraph" />
</ClientOnly>

## 1. Main Features

* **Real-time Physically Based Simulation**: The color of the sky changes naturally in real time according to the sun's
  altitude (light direction) and atmospheric density.
* **Atmospheric IBL Integration**: Analyzes the atmospheric state to generate dedicated LUTs (Transmittance, SkyView,
  MultiScattering, etc.) and atmospheric light (SkyLight), providing real-time atmospheric light information to other
  PBR objects in the scene.
* **Aerial Perspective**: Synthesizes color attenuation and scattering caused by the atmosphere as a post-effect based
  on the depth information of objects to maximize the sense of space.
* **Integrated Control**: By simply setting it on `View3D`, background rendering, IBL reflection updates, and
  post-effect processing are activated all at once.

---

## 2. Basic Usage

SkyAtmosphere uses the **first DirectionalLight** added to the Scene as the sun light source to compute atmospheric
scattering in real time.
The entire pipeline is automatically applied to `SkyAtmosphere` simply by assigning it to the `skyAtmosphere` property
of **View3D** without complex manual settings.

```javascript
// 1. Create a SkyAtmosphere instance
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);

// 2. Set to View (Automatically applies background and atmospheric post-effects)
view.skyAtmosphere = skyAtmosphere;
```

---

## 3. Controlling Sun Angle (DirectionalLight Integration)

The sun's position can be intuitively changed by controlling the angle properties of the first `DirectionalLight`
instance added to the scene. Instead of changing vector data directly, you can easily simulate time-of-day changes using
angle (degree) properties.

* **`elevation`**: Adjusts the sun's vertical altitude angle (degrees, `-90` to `90`).
    * `90`: Represents noon with the sun directly overhead, rendering a blue sky.
    * `0` to `10`: Represents sunrise/sunset with the sun on the horizon, rendering a red glow.
    * Negative values (e.g., `-10`): Represents a night state with the sun below the horizon.
* **`azimuth`**: Adjusts the horizontal rotation angle (degrees, `0` to `360`) as the sun moves from east to west.

```javascript
// Adjust the sun's position by changing the elevation and azimuth directly
sunLight.elevation = 5;  // Render a red sunset glow
sunLight.azimuth = 180;
```

::: tip [Controlling Other Physical Parameters]
More detailed atmospheric simulation physical parameters, such as Rayleigh/Mie scattering coefficients, ozone absorption
rate, ground radius, and cloud density, can be adjusted through the `skyAtmosphere.params` property.
Please refer to
the [SkyAtmosphere API Reference](../api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyAtmosphere.md) for
details.
:::

---

## 4. Example Code

The following example shows how the sky's atmospheric state changes in real time in response to changes in the direction
of `DirectionalLight` (the sun's movement).

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create a DirectionalLight to act as the sun
    const sunLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(sunLight);

    // 2. Create and apply SkyAtmosphere
    const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    
    // 3. Configure Camera and View
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    
    // 4. Set the atmospheric system to the View
    view.skyAtmosphere = skyAtmosphere;
    redGPUContext.addView(view);

    // 5. Update sun altitude (light direction) every frame
    let time = 0;
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (timeDelta) => {
        time += timeDelta * 0.001;
        
        // Simulate a trajectory where the sun rises in the east and sets in the west
        const x = Math.cos(time);
        const y = Math.sin(time); // When y becomes negative, night (darkness after sunset) is expressed.
        sunLight.direction = [x, y, 0];
    });
});
```

---

## 5. Comparison with Skybox

| Category               | Skybox                                           | SkyAtmosphere                                                                  |
|:-----------------------|:-------------------------------------------------|:-------------------------------------------------------------------------------|
| **Method**             | Static image based (CubeMap / IBL)               | Real-time physical mathematical calculation (LUT-based)                        |
| **Sun Responsiveness** | No (Background image is static)                  | Yes (Real-time color change according to the sun's direction)                  |
| **Aerial Perspective** | No                                               | Yes (Differential application of atmospheric effects based on object distance) |
| **Suitable Usage**     | Outer space, indoors, specific fixed backgrounds | Vast open-world outdoor scenes, real-time time-of-day change scenes            |

---

## Next Steps

Based on the objects and environment settings learned so far, let's explore more deeply how to load and control models
in actual projects.

- **[GLTF Loader](../assets/model-loading/index.md)**
