---
title: Texture
order: 3
---

<script setup>
const textureGraph = `
    Img["Image URL (.png / .jpg / .ktx2 / .svg)"] -->|Async Load & Transcode| Texture["BitmapTexture / TextureArray (Resource)"]
    Texture -->|Reference| Material["BitmapMaterial / PhongMaterial / PBRMaterial"]
    Material -->|Apply| Mesh["Mesh (Display Object)"]

    %% Grayscale styles applied
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Texture

A **Texture** converts external image files or compressed texture assets into GPU resources and maps them onto material
surfaces (`BitmapMaterial`, `PhongMaterial`, `PBRMaterial`, etc.).

<ClientOnly>
  <MermaidResponsive :definition="textureGraph" />
</ClientOnly>

---

## 1. Texture Classes and Supported Formats

RedGPU provides 3 texture resource classes depending on the rendering use case, and automatically updates the rendering
pipeline as soon as asynchronous network loading completes.

| Class               | Supported Formats and Primary Role                                                                                                                                                                  |
|:--------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`BitmapTexture`** | Standard 2D texture supporting web bitmaps (`.png`, `.jpg`, `.webp`, `.avif`), vector graphics (`.svg`), and **`.ktx2` GPU-compressed textures** (Basis Universal / UASTC & ETC1S auto-transcoding) |
| **`TextureArray`**  | Bundles multiple images of identical resolution into a single `texture_2d_array` GPU resource to minimize bind group slot usage in multi-layer shaders (supports bitmaps and `.ktx2` arrays)        |
| **`PackedTexture`** | Merges individual channels (R, G, B, A) from separate textures into a single ORM (Occlusion-Roughness-Metallic) packed texture on the GPU                                                           |

---

## 2. Creating BitmapTexture and Options

```javascript
// 1. Load a standard bitmap (JPG/PNG/WebP) or SVG
const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);

// 2. Load a KTX2 (Basis Universal GPU-compressed texture)
// Automatically transcoded to the optimal hardware format (BC7/ASTC/ETC2).
const ktx2Texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    './assets/terrain/rock_diff.ktx2'
);

// 3. Bundle multiple image URLs into a single 2D TextureArray
const layerTextureArray = new RedGPU.Resource.TextureArray(
    redGPUContext,
    ['./assets/layer0.ktx2', './assets/layer1.ktx2', './assets/layer2.ktx2'],
    true // useMipmap
);
```

### Constructor Parameters and Event Listeners

| Parameter                 | Type                          | Default        | Description                                                                    |
|:--------------------------|:------------------------------|:---------------|:-------------------------------------------------------------------------------|
| **`redGPUContext`**       | `RedGPUContext`               | Required       | Engine context instance                                                        |
| **`src`**                 | `string \| { src, cacheKey }` | Optional       | Image URL path to load, or an object specifying a custom cache key             |
| **`useMipMap`**           | `boolean`                     | `true`         | Enables multi-level mipmap generation to prevent distance aliasing (Moire)     |
| **`onLoad`**              | `(textureInstance) => void`   | Optional       | Callback invoked when image loading and GPU upload complete                    |
| **`onError`**             | `(error) => void`             | Optional       | Callback invoked when an error occurs (e.g., network load failure)             |
| **`format`**              | `GPUTextureFormat`            | `'rgba8unorm'` | GPU texture format (automatically selects compressed format when loading KTX2) |
| **`usePremultiplyAlpha`** | `boolean`                     | `false`        | Whether to apply premultiplied alpha                                           |

> You can also register additional load/error listeners after instantiation using
> `texture.addLoadListeners(onLoad, onError)`.

---

## 3. Practical Example: Rendering a Textured Mesh

An example of creating a `BitmapTexture`, binding it to a `BitmapMaterial`, and rendering it on a mesh.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. Create a texture
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    // 2. Create a BitmapMaterial and link the texture
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    // 3. Create a Mesh (Box)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        material
    );
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationX += 1;
        box.rotationY += 1;
    });
});
```

### Live Demo

<ClientOnly>
<CodePen title="RedGPU Basics - Texture" slugHash="mesh-texture">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    const texture = new RedGPU.Resource.BitmapTexture(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
    );

    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext), 
        material
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## Related Examples

- [BitmapTexture Sampler Options](/RedGPU/examples/3d/texture/bitmapTextureSampler/)
- [Anisotropic Filtering (Max Anisotropy)](/RedGPU/examples/3d/texture/maxAnisotropy/)
- [KTX2 Compressed Texture Basics](/RedGPU/examples/3d/texture/ktx2/basic/)
- [KTX2 Texture Array & CubeMap](/RedGPU/examples/3d/texture/ktx2/arrayCube3d/)

---

## Next Steps

- **[Lighting and Shadow](../lighting-and-shadow/index.md)**: Configuring light sources (`Light`), lit materials
  (`PhongMaterial`, `PBRMaterial`), and shadows (`Shadow`)
