---
title: GLTF Loader
order: 1
---

<script setup>
const loaderGraph = `
    GLTF[".gltf / .glb File"] -->|Async Load & Parse| Loader["GLTFLoader (Loader)"]
    Loader -->|Create PBRMaterial| Mat["Material (Surface)"]
    Loader -->|Parse Geometry| Geo["Geometry (Skeleton)"]
    Mat --> Mesh["resultMesh (Final Mesh)"]
    Geo --> Mesh

    %% Grayscale styles applied
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# GLTF Loader

While you can create basic shapes with **Primitives**, high-quality assets such as detailed characters or buildings need
to be created in external 3D tools (Blender, Maya, etc.) and then imported.
RedGPU provides the `GLTFLoader`, which supports loading the web 3D standard format **glTF** (GL Transmission Format)
2.0.

<ClientOnly>
  <MermaidResponsive :definition="loaderGraph" />
</ClientOnly>

## 1. Loading a Model

Creating a `GLTFLoader` instance asynchronously loads and parses the file. Once complete, add `loader.resultMesh` passed
to the callback function to the `Scene`.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext, 
    'https://.../DamagedHelmet.glb', // Model path
    (loader) => {
        // Add the loaded root mesh (resultMesh) to the scene
        scene.addChild(loader.resultMesh);
    }
);
```

- **`resultMesh`**: The root `Mesh` object containing the loaded model hierarchy.
- **`parsingResult`**: Detailed parsed data including `materials`, `textures`, and `animations`.

> [!TIP]
> Since most glTF models use `PBRMaterial`, we recommend configuring `IBL` environment lighting on `view.ibl` for
realistic metallic reflections and shading.

## 2. Practical Example: Environment Light and Model Loading

An example of setting up an environment with `IBL` and loading a metallic helmet model.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 1. Configure IBL and SkyBox
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 2. Load GLTF Model
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            scene.addChild(loader.resultMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - GLTF Loader with IBL" slugHash="gltf-loader">
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

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    let targetMesh;
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            targetMesh = loader.resultMesh;
            scene.addChild(targetMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        if (targetMesh) targetMesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 3. Async Loading, Cancellation, and Material Variants

In addition to callbacks, `GLTFLoader` supports `Promise`-based `loadAsync()`, cancellation via `abort()` /
`AbortSignal`, and runtime switching for `KHR_materials_variants`.

```javascript
// 1. Promise-based async loading with cancellation support
const controller = new AbortController();
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'
);

await loader.loadAsync({signal: controller.signal});
scene.addChild(loader.resultMesh);

// 2. Inspect and switch KHR_materials_variants at runtime
console.log('Available variants:', loader.materialVariants);
console.log('Active variant:', loader.activeMaterialVariant);
if (loader.materialVariants.length > 0) {
    loader.applyMaterialVariant(loader.materialVariants[0]);
}

// Cancel in-flight loading or dispose resources during SPA route teardown
// loader.abort();
// loader.destroy();
```

---

## 4. Supported glTF 2.0 Extensions

In addition to the standard Metallic-Roughness workflow, `GLTFLoader` and `PBRMaterial` automatically parse and render
23 official Khronos glTF 2.0 extensions out of the box. Compression decoders (`Draco`, `Meshopt`, `KTX2 BasisU`) are
loaded on demand via WASM only when a model actually uses them, keeping the core bundle overhead at `0 KB`.

### Material Extensions

| glTF Extension                                  | Visual Effect & Role                                              | Live Sample                                                                                                        |
|:------------------------------------------------|:------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------|
| `KHR_materials_clearcoat`                       | Transparent clearcoat reflective layer for car paint and lacquers | [ClearCoat Car Paint](/RedGPU/examples/gltf/gltfExtensions/clearcoat/clearCoatCarPaint/)                           |
| `KHR_materials_transmission`                    | Physical light transmission with refraction for glass and liquids | [Mosquito In Amber](/RedGPU/examples/gltf/gltfExtensions/transmission/mosquitoInAmber/)                            |
| `KHR_materials_volume`                          | Volumetric medium with thickness and light attenuation            | [Dragon Attenuation](/RedGPU/examples/gltf/gltfExtensions/volume/dragonAttenuation/)                               |
| `KHR_materials_ior`                             | Index of Refraction control for dielectric media                  | [IOR Test Grid](/RedGPU/examples/gltf/gltfExtensions/volume/IORTestGrid/)                                          |
| `KHR_materials_dispersion`                      | Wavelength-dependent chromatic dispersion in prisms and gemstones | [Dragon Dispersion](/RedGPU/examples/gltf/gltfExtensions/dispersion/dragonDispersion/)                             |
| `KHR_materials_sheen`                           | Microfiber grazing-angle scattering for velvet and cloth fabrics  | [Glam Velvet Sofa](/RedGPU/examples/gltf/gltfExtensions/sheen/glamVelvetSofa/)                                     |
| `KHR_materials_iridescence`                     | Thin-film interference rainbow shift on soap bubbles and coatings | [Iridescence Lamp](/RedGPU/examples/gltf/gltfExtensions/iridescence/iridescenceLamp/)                              |
| `KHR_materials_anisotropy`                      | Directional anisotropic highlights on brushed metal and silk      | [Anisotropy Barn Lamp](/RedGPU/examples/gltf/gltfExtensions/anisotropy/anisotropyBarnLamp/)                        |
| `KHR_materials_specular`                        | Fine control over dielectric specular strength and specular color | [Specular Silk Pouf](/RedGPU/examples/gltf/gltfExtensions/specular/specularSilkPouf/)                              |
| `KHR_materials_diffuse_transmission`            | Translucent diffuse transmission for porcelain teacups and leaves | [Diffuse Transmission Teacup](/RedGPU/examples/gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTeacup/) |
| `KHR_materials_emissive_strength`               | High-intensity HDR emissive multiplier above `1.0`                | [Emissive Strength](/RedGPU/examples/gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest/)                   |
| `KHR_materials_unlit` / `KHR_texture_transform` | Unlit shading bypassing lighting and UV offset/rotation/scale     | [Texture Transform](/RedGPU/examples/gltf/gltfExtensions/textureTransform/textureTransformTest/)                   |
| `KHR_materials_variants`                        | Runtime material preset switching and initial variant detection   | [Materials Variants Shoe](/RedGPU/examples/gltf/gltfExtensions/materialsVariants/)                                 |
| `KHR_materials_pbrSpecularGlossiness`           | Legacy Specular-Glossiness PBR workflow compatibility             | [Sponza](/RedGPU/examples/gltf/models/sponza/)                                                                     |

### Compression, Texture, Quantization, and Scene Extensions

| glTF Extension                                        | Role & Features                                                       | Live Sample                                                                                        |
|:------------------------------------------------------|:----------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| `KHR_draco_mesh_compression`                          | Google Draco geometry decompression (on-demand WASM)                  | [CarConcept (KTX2 + Draco)](/RedGPU/examples/gltf/gltfExtensions/dracoMeshCompression/carConcept/) |
| `KHR_meshopt_compression` / `EXT_meshopt_compression` | meshoptimizer vertex, index, and animation decompression (on-demand)  | [BrainStem (Meshopt)](/RedGPU/examples/gltf/gltfExtensions/meshoptCompression/brainStem/)          |
| `KHR_texture_basisu` / `EXT_texture_webp`             | KTX2 BasisU GPU-compressed textures (on-demand WASM) and WebP images  | [Chronograph Watch](/RedGPU/examples/gltf/gltfExtensions/textureBasisu/chronographWatch/)          |
| `KHR_mesh_quantization`                               | Integer-quantized vertex attribute decoding and normalization         | [Mesh Quantization](/RedGPU/examples/gltf/gltfExtensions/meshQuantization/)                        |
| `KHR_lights_punctual`                                 | Automatic import of `Directional`, `Point`, and `Spot` lights         | —                                                                                                  |
| `KHR_node_visibility`                                 | Initial node visibility and animation-driven visibility toggling      | [Node Visibility](/RedGPU/examples/gltf/gltfExtensions/nodeVisibility/)                            |
| `KHR_animation_pointer`                               | Arbitrary JSON Pointer property animation (color, emissive, UV, etc.) | [Pot of Coals](/RedGPU/examples/gltf/gltfExtensions/animationPointer/potOfCoalsAnimationPointer/)  |

---

## Related Examples

- [DamagedHelmet Model Loading](/RedGPU/examples/gltf/models/helmets/)
- [glTF Format Comparison — BrainStem (6 Formats)](/RedGPU/examples/gltf/formats/brainStemAllFormats/)
- [glTF Format Comparison — CarConcept (5 Formats)](/RedGPU/examples/gltf/formats/carConceptAllFormats/)
- [glTF 7 Primitive Topologies](/RedGPU/examples/gltf/basic/meshPrimitiveModes/)
- [glTF Basic Animations](/RedGPU/examples/gltf/animation/basicAnimations/)
- [Animation Motion Blending](/RedGPU/examples/gltf/animation/motionBlending/)
- [Sponza Scene Model](/RedGPU/examples/gltf/models/sponza/)

---

## Next Steps

Learn how to render thousands of identical objects with high performance in a single draw call.

- **[Instancing Mesh](../instanced-mesh/index.md)**
