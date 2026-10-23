---
title: Lighting & Shadow
order: 5
---

# Lighting & Shadow

Covers light sources (`Light`), lighting materials (`PhongMaterial`, `PBRMaterial`), and the shadow (`Shadow`) system
that create depth and realism in 3D space.

---

## Learning Roadmap

1. **[Light](./light.md)**: Physical light units (`Lux`, `Lumen`), characteristics of the 4 light types, and
   `LightManager` usage
2. **[Phong Material](./phong-material.md)**: Diffuse/specular lighting models and multi-texture maps (`Normal`,
   `Specular`, `Displacement`, etc.)
3. **[Shadow System](./shadow.md)**: Cascaded Shadow Maps (CSM), PCSS soft shadow principles, and quality configuration
4. **[PBR Material](./pbr-material.md)**: Metallic-Roughness workflow and glTF KHR extension-based physically based
   materials

---

## Related Examples

- [DirectionalLight](/RedGPU/examples/3d/light/directionalLight/)
- [PointLight](/RedGPU/examples/3d/light/pointLight/)
- [SpotLight](/RedGPU/examples/3d/light/spotLight/)
- [PhongMaterial Multi-Textures](/RedGPU/examples/3d/material/phongMaterialTextures/)
- [Cascaded Directional Shadow](/RedGPU/examples/3d/shadow/directionalShadow/)

---

## Next Steps

- **[Light](./light.md)**: Creating light sources and registering them in `LightManager`
