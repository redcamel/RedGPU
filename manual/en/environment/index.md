---
title: Environment
order: 6
---

# Environment

Now that shadows have been applied and a sense of three-dimensionality has been formed, it's time to add infinite
backgrounds and photorealistic light information. RedGPU provides the following features to maximize the realism of 3D
scenes:

- **Skybox**: Represents the infinite background of the scene.
- **Image-Based Lighting (IBL)**: Uses surrounding environment images as light sources for physical reflections and
  global lighting.
- **SkyAtmosphere**: Simulates real-time physically-based atmospheric scattering.

> [!NOTE]
> **Tone Mapping**, which fine-tunes the final color scheme of the screen, will be covered in detail in the later
> post-effects section.

## Main Learning Topics

- **[SkyBox](./skybox.md)**: Fills the scene background with 360-degree textures to provide a vast sense of space.
- **[IBL](./ibl.md)**: Analyzes light information from the surrounding environment to apply realistic reflection and lighting to objects.
- **[SkyAtmosphere](./skyatmosphere.md)**: Provides a real-time, physically-based atmospheric scattering simulation to
  add dynamic sky and atmosphere scattering effects to the scene.

::: info [Learning Guide]
First, we will look at **SkyBox**, which defines the background of the space, then **IBL**, where the background acts as
actual lighting on objects, and finally **SkyAtmosphere** for real-time physical simulation of atmospheric scattering.
:::

---

[Next Step: Learn SkyBox](./skybox.md)
