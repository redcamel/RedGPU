---
title: SkyAtmosphere
order: 3
---

<script setup>
const skyAtmosphereGraph = `
    Sun["Sun (DirectionalLight)"] -->|Provide Light Direction| Atmosphere["SkyAtmosphere (Atmospheric Scattering)"]
    Atmosphere -->|Background & Sky Light| View["View3D (Background, IBL & Aerial Perspective)"]

    %% Grayscale styles applied
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# SkyAtmosphere

`SkyAtmosphere` is a physically-based atmospheric scattering simulation system. It calculates Rayleigh scattering, Mie
scattering, and Ozone absorption in real time to provide realistic skies, evening sunsets, and distance-based aerial
perspective effects.

<ClientOnly>
  <MermaidResponsive :definition="skyAtmosphereGraph" />
</ClientOnly>

## 1. Main Features

- **Real-time Physically Based Simulation**: Sky colors change naturally in real time according to the sun's altitude
  (`DirectionalLight`) and atmospheric density.
- **Atmospheric IBL Integration**: Analyzes the atmospheric state to generate dedicated sky lighting (SkyLight),
  providing real-time reflections and indirect lighting to PBR objects in the scene.
- **Aerial Perspective**: Automatically composites atmospheric scattering and color attenuation based on object depth to
  maximize spatial depth.
- **Integrated Control**: Assigning `SkyAtmosphere` to `view.skyAtmosphere` activates background rendering, atmospheric
  IBL, and aerial perspective all at once.

---

## 2. Basic Usage

`SkyAtmosphere` uses the first `DirectionalLight` registered in the `Scene` as the sun light source to compute
atmospheric scattering in real time.

```javascript
// 1. Register a DirectionalLight to act as the sun
const sunLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(sunLight);

// 2. Create SkyAtmosphere and assign to the View
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
view.skyAtmosphere = skyAtmosphere;
```

---

## 3. Controlling Sun Angle and Atmospheric Properties

You can intuitively control the sun's position using the spherical angle properties (`elevation`, `azimuth`) of
`DirectionalLight`.

- **`elevation` (Altitude, `-90 ~ 90` degrees)**: Vertical angle of the sun.
  - `45 ~ 90`: Clear blue daytime sky
  - `0 ~ 10`: Golden/red sunrise or sunset near the horizon
  - Negative values (e.g., `-10`): Night sky after sunset
- **`azimuth` (Azimuth, `0 ~ 360` degrees)**: Horizontal rotation angle of the sun.

```javascript
// 1. Adjust sun altitude and azimuth (sunset glow)
sunLight.elevation = 5;
sunLight.azimuth = 180;

// 2. Adjust cloud and scattering properties
skyAtmosphere.cloudCoverage = 0.5; // Cloud coverage (0.0 ~ 1.0, Default: 0.4)
skyAtmosphere.cloudDensity = 0.7;  // Cloud density (0.0 ~ 1.0, Default: 0.7)
```

::: tip [Detailed Atmospheric Parameters]
For detailed properties such as Rayleigh/Mie scattering scales (`rayleighScatteringScale`, `mieScatteringScale`), ozone
absorption (`ozoneAbsorptionScale`), and planet radius (`groundRadius`), refer to the `SkyAtmosphere` API documentation.
:::

---

## 4. Practical Example: Dynamic Sky and Sunset by Sun Altitude

Let's animate the `elevation` of `DirectionalLight` over time to observe the sky transitioning in real time from midday
blue to sunset glow.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create and register the sun light (DirectionalLight)
    const sunLight = new RedGPU.Light.DirectionalLight();
    sunLight.azimuth = 180;
    scene.lightManager.addDirectionalLight(sunLight);

    // 2. Create SkyAtmosphere and assign to View
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.tilt = 10;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    redGPUContext.addView(view);

    // 3. Animate sun altitude (elevation) over time
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        sunLight.elevation = Math.sin(time * 0.0005) * 25 + 20;
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - SkyAtmosphere" slugHash="skyatmosphere-basic">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

    const sunLight = new RedGPU.Light.DirectionalLight();
    sunLight.azimuth = 180;
    scene.lightManager.addDirectionalLight(sunLight);

    const sphere = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 64, 64),
        new RedGPU.Material.PBRMaterial(redGPUContext)
    );
    sphere.material.metallicFactor = 0.9;
    sphere.material.roughnessFactor = 0.15;
    scene.addChild(sphere);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.tilt = 5;
    controller.distance = 10;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        sunLight.elevation = Math.sin(time * 0.0006) * 25 + 20;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 5. Comparison with SkyBox

| Category               | `SkyBox`                                   | `SkyAtmosphere`                                              |
|:-----------------------|:-------------------------------------------|:-------------------------------------------------------------|
| **Method**             | Static image based (`CubeTexture` / `IBL`) | Real-time physical scattering calculation (LUT-based)        |
| **Sun Responsiveness** | No (Static background image)               | Yes (Changes in real time with `DirectionalLight` direction) |
| **Aerial Perspective** | No                                         | Yes (Applies distance-based atmospheric scattering)          |
| **Suitable Usage**     | Indoors, outer space, fixed backgrounds    | Outdoor open worlds, scenes with dynamic time of day         |

---

## Related Examples

- [SkyAtmosphere Basics](/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
- [Atmospheric Scattering Parameter Test](/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
- [SkyAtmosphere + glTF Model](/RedGPU/examples/3d/skyAtmosphere/gltf/)

---

## Next Steps

Learn how to control global wind direction and strength across the scene for natural environmental motion.

- **[Global Wind System (WindManager)](./wind.md)**
