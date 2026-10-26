---
title: PBR Material
order: 3
---

<script setup>
const pbrGraph = `
    BaseColor["BaseColor (Albedo)"] --> PBR["PBRMaterial (Physically Based Material)"]
    MetalRough["Metallic / Roughness"] --> PBR
    Detail["Normal / Occlusion / Emissive"] --> PBR

    %% Grayscale styles applied
    style BaseColor fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style MetalRough fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Detail fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# PBR Material

`PBRMaterial` is a **Physically Based Rendering** material built on energy conservation and microfacet theory,
realistically expressing physical surface properties such as **Metallic** and **Roughness**.

It is automatically created as the default material when loading external `.gltf` / `.glb` models via `GLTFLoader`, and
can also be instantiated directly and applied to primitive meshes.

<ClientOnly>
  <MermaidResponsive :definition="pbrGraph" />
</ClientOnly>

## 1. Implementing Physical Surfaces with Texture Maps

`PBRMaterial` follows the standard glTF 2.0 **Metallic-Roughness** workflow and combines the following core texture maps
to achieve photorealistic surfaces.

| Texture Map                  | Role                       | Effect                                                                             |
|:-----------------------------|:---------------------------|:-----------------------------------------------------------------------------------|
| **baseColorTexture**         | Albedo Map                 | Defines the intrinsic surface color and pattern without lighting information       |
| **metallicRoughnessTexture** | Metallic-Roughness Map     | Defines surface roughness in the G channel and metallicness in the B channel       |
| **normalTexture**            | Normal Map                 | Expresses fine surface bumps and depth without subdividing geometry                |
| **occlusionTexture**         | Ambient Occlusion (AO) Map | Adds subtle contact shadows in crevices where ambient light is blocked (R channel) |
| **emissiveTexture**          | Emissive Map               | Specifies areas that emit light independently of scene lighting                    |

## 2. Key Property Control

Even without textures, you can express a wide range of surfaces—from non-metallic plastic to smooth pure metal—by
adjusting the core factor values.

```javascript
const material = new RedGPU.Material.PBRMaterial(redGPUContext);

// 1. Base color (RGBA: 0.0 ~ 1.0)
material.baseColorFactor = [1.0, 0.85, 0.35, 1.0];

// 2. Metallic and roughness control (0.0 ~ 1.0)
material.metallicFactor = 1.0;  // 0.0: Dielectric (plastic, wood) ~ 1.0: Pure metal
material.roughnessFactor = 0.2; // 0.0: Smooth mirror surface ~ 1.0: Rough matte surface
```

::: tip [Recommended: Use with IBL Environment Lighting]
Highly metallic and smooth surfaces reveal their material quality by reflecting their surroundings. For realistic
reflections with `PBRMaterial`, we recommend using it together with
**[IBL (Image-Based Lighting)](../environment/ibl.md)**.
:::

## 3. Practical Example: Surface Variation by Roughness

Let's place five identical golden metallic spheres (`metallicFactor = 1.0`) and vary `roughnessFactor` from `0.0` to
`1.0` to observe how surface reflections change.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();

    // 1. Configure lighting and IBL environment map
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    // 2. Place 5 PBR spheres with different roughness values
    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 64, 64);

    for (let i = 0; i < 5; i++) {
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.baseColorFactor = [1.0, 0.82, 0.35, 1.0];
        material.metallicFactor = 1.0;
        material.roughnessFactor = i / 4; // 0.0 (mirror) ~ 1.0 (matte)

        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i - 2) * 3;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    new RedGPU.Renderer().start(redGPUContext);
});
```

### Live Demo

Observe how highlights and environment reflections change from left (`roughnessFactor: 0.0`, sharp mirror reflection) to
right (`roughnessFactor: 1.0`, diffuse matte reflection).

<ClientOnly>
<CodePen title="RedGPU Basics - PBR Material" slugHash="pbr-material-basic">
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

    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 64, 64);

    for (let i = 0; i < 5; i++) {
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.baseColorFactor = [1.0, 0.82, 0.35, 1.0];
        material.metallicFactor = 1.0;
        material.roughnessFactor = i / 4;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i - 2) * 3;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    new RedGPU.Renderer().start(redGPUContext);

});
</pre>
</CodePen>
</ClientOnly>


## Related Examples

- [Metallic-Roughness Spheres](/RedGPU/examples/gltf/basic/metalRoughSpheres/)
- [DamagedHelmet (PBR Texture Maps)](/RedGPU/examples/gltf/models/helmets/)
- [Transmission & Refraction](/RedGPU/examples/gltf/gltfExtensions/transmission/transmissionTest/)
- [Clearcoat](/RedGPU/examples/gltf/gltfExtensions/clearcoat/clearCoatCarPaint/)
- [Sheen](/RedGPU/examples/gltf/gltfExtensions/sheen/glamVelvetSofa/)

---

## Next Steps

Learn how to implement shadows cast when light is blocked and add a realistic sense of space to the scene.

- **[Shadow](./shadow.md)**
