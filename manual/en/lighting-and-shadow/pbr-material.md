---
title: PBR Material
order: 4
---

# PBR Material

**`PBRMaterial`** is a **Physically Based Rendering** material built on energy
conservation and microfacet theory, accurately simulating real-world physical surface properties such as **Metallic**,
**Roughness**, refraction, and multi-layer clearcoat.

It is automatically created and assigned when loading external `.gltf` / `.glb` models with `GLTFLoader`, and can also
be instantiated directly via `new RedGPU.Material.PBRMaterial(redGPUContext)` to apply to primitives or custom meshes.

## 1. Core PBR Properties and Texture Channels

`PBRMaterial` follows the standard glTF 2.0 Metallic-Roughness workflow.

| Property                       | Type                               | Default         | Description                                                             |
|:-------------------------------|:-----------------------------------|:----------------|:------------------------------------------------------------------------|
| **`baseColorFactor`**          | `[number, number, number, number]` | `[1, 1, 1, 1]`  | Base surface RGBA color multiplier (`0.0 ~ 1.0`)                        |
| **`baseColorTexture`**         | `BitmapTexture`                    | `null`          | Base surface color (Albedo) texture                                     |
| **`metallicFactor`**           | `number`                           | `1.0`           | Metallic factor (`0.0`: dielectric non-metal ~ `1.0`: pure metal)       |
| **`roughnessFactor`**          | `number`                           | `1.0`           | Surface roughness factor (`0.0`: perfect mirror ~ `1.0`: fully diffuse) |
| **`metallicRoughnessTexture`** | `BitmapTexture`                    | `null`          | Texture storing Roughness (G channel) and Metallic (B channel)          |
| **`normalTexture`**            | `BitmapTexture`                    | `null`          | Tangent-space normal map texture                                        |
| **`normalScale`**              | `number`                           | `1.0`           | Normal map bump intensity multiplier                                    |
| **`occlusionTexture`**         | `BitmapTexture`                    | `null`          | Ambient occlusion (AO, R channel) texture                               |
| **`occlusionStrength`**        | `number`                           | `1.0`           | Ambient occlusion strength (`0.0 ~ 1.0`)                                |
| **`emissiveFactor`**           | `[number, number, number]`         | `[0, 0, 0]`     | Self-illumination RGB color intensity                                   |
| **`emissiveTexture`**          | `BitmapTexture`                    | `null`          | Self-illumination (Emissive) texture                                    |
| **`emissiveStrength`**         | `number`                           | `1.0`           | Emissive brightness multiplier (`KHR_materials_emissive_strength`)      |
| **`doubleSided`**              | `boolean`                          | `false`         | Disables back-face culling to render both sides of faces                |
| **`useCutOff` / `cutOff`**     | `boolean` / `number`               | `false` / `0.5` | Enables alpha mask (`MASK`) cutoff and sets the threshold value         |

```javascript
const pbrMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);

// Example: Smooth golden metal material
pbrMaterial.baseColorFactor = [1.0, 0.85, 0.35, 1.0];
pbrMaterial.metallicFactor = 1.0;
pbrMaterial.roughnessFactor = 0.15;

const sphere = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 64, 64),
    pbrMaterial
);
scene.addChild(sphere);
```

::: tip [Recommended: Use with IBL Environment Lighting]
Metallic surfaces (high `metallicFactor`) and smooth surfaces express their material quality by reflecting their
surroundings. To get the best results from `PBRMaterial`, configure
**[IBL (Image-Based Lighting)](../environment/ibl.md)** on `view.ibl` or enable
**[SkyAtmosphere](../environment/skyatmosphere.md)**.
:::

## 2. Supported glTF KHR Advanced Material Extensions

Beyond the baseline Metallic-Roughness model, RedGPU's `PBRMaterial` supports a wide range of official Khronos (`KHR`)
extensions for rendering glass, automotive clearcoat paint, velvet fabric, and thin-film iridescence.

| KHR Extension                            | Key Control Properties                                                                              | Example Materials                                                                |
|:-----------------------------------------|:----------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------|
| **`KHR_materials_clearcoat`**            | `useKHR_materials_clearcoat`, `KHR_clearcoatFactor`, `KHR_clearcoatRoughnessFactor`                 | Automotive clearcoat paint, varnished wood, wet surfaces                         |
| **`KHR_materials_transmission`**         | `useKHR_materials_transmission`, `KHR_transmissionFactor`, `KHR_transmissionTexture`                | Transparent glass, water bottles, acrylic                                        |
| **`KHR_materials_volume`**               | `useKHR_materials_volume`, `KHR_thicknessFactor`, `KHR_attenuationColor`, `KHR_attenuationDistance` | Colored glass and gemstones with thickness-based light absorption and refraction |
| **`KHR_materials_ior`**                  | `KHR_materials_ior` (default: `1.5`)                                                                | Index of refraction per medium (water `1.33`, glass `1.5`, diamond `2.42`)       |
| **`KHR_materials_sheen`**                | `useKHR_materials_sheen`, `KHR_sheenColorFactor`, `KHR_sheenRoughnessFactor`                        | Grazing-angle sheen on fabrics such as velvet, satin, and microfiber             |
| **`KHR_materials_specular`**             | `useKHR_materials_specular`, `KHR_specularFactor`, `KHR_specularColorFactor`                        | Fine control over reflectance and specular color on dielectric materials         |
| **`KHR_materials_anisotropy`**           | `useKHR_materials_anisotropy`, `KHR_anisotropyStrength`, `KHR_anisotropyRotation`                   | Brushed metal, vinyl records                                                     |
| **`KHR_materials_iridescence`**          | `useKHR_materials_iridescence`, `KHR_iridescenceFactor`, `KHR_iridescenceIor`                       | Rainbow thin-film interference on soap bubbles, oil slicks, and beetle shells    |
| **`KHR_materials_diffuse_transmission`** | `useKHR_materials_diffuse_transmission`, `KHR_diffuseTransmissionFactor`                            | Translucent diffuse materials such as leaves, paper, and wax candles             |
| **`KHR_materials_unlit`**                | `useKHR_materials_unlit`                                                                            | Unlit materials that bypass lighting calculations and output base color directly |

---

## Next Step

With lighting, physically based materials, and shadows in place, learn how to add infinite backgrounds and realistic
environment lighting to your scene.

- **[Environment](../environment/index.md)**

---

## Related Examples

- [Metallic-Roughness Spheres](/RedGPU/examples/gltf/basic/metalRoughSpheres/)
- [Transmission & Refraction](/RedGPU/examples/gltf/gltfExtensions/transmission/transmissionTest/)
- [Clearcoat](/RedGPU/examples/gltf/gltfExtensions/clearcoat/clearCoatCarPaint/)
- [Sheen](/RedGPU/examples/gltf/gltfExtensions/sheen/glamVelvetSofa/)
- [Iridescence](/RedGPU/examples/gltf/gltfExtensions/iridescence/iridescenceLamp/)
