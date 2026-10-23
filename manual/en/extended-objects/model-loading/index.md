---
title: GLTF Loader
order: 1
---

<script setup>
const loaderGraph = `
    GLTF[".gltf / .glb File"] -->|Async Load & Parse| Loader["GLTFLoader (Loader)"]
    Loader -->|Create PBRMaterial| Mat["Material (Surface)"]
    Loader -->|Parse Geometry| Geo["Geometry (Skeleton)"]
    Loader -->|Parse ClipAnimState| Anim["parsingResult.animations"]
    Mat --> Mesh["resultMesh (Final Mesh)"]
    Geo --> Mesh
    Anim -->|playAnimation / AnimStateMachine| Mesh

    %% Grayscale styles applied
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Anim fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# GLTF Loader

`GLTFLoader` asynchronously loads web 3D standard **glTF** (GL Transmission Format) 2.0 files (`.gltf`, `.glb`) and sets
up PBR materials, skeletal (skinning) and morph target animations, and state-machine-based
motion blending.

<ClientOnly>
  <MermaidResponsive :definition="loaderGraph" />
</ClientOnly>

---

## 1. Loading Models and Key Properties

Pass the file URL and completion, progress, and error callbacks to the `RedGPU.GLTFLoader` constructor to load a model
asynchronously.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

new RedGPU.GLTFLoader(
    redGPUContext,
        'https://.../DamagedHelmet.glb',
    (loader) => {
        scene.addChild(loader.resultMesh);
    },
        (progress) => {
          // Check loading progress (e.g., progress.model.percent)
        },
        (error) => {
          console.error('GLTF load failed:', error);
    }
);
```

| Property / Method              | Type                  | Description                                                                                                                                    |
|:-------------------------------|:----------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------|
| **`resultMesh`**               | `Mesh`                | Root `RedGPU.Display.Mesh` container holding the hierarchy of the loaded model                                                                 |
| **`parsingResult`**            | `Object`              | Parsed data including materials (`materials`), groups (`groups`), textures (`textures`), and animation clips (`animations`: `ClipAnimState[]`) |
| **`playAnimation(clipState)`** | `(clipState) => void` | Plays a specific animation clip (`ClipAnimState`) from `parsingResult.animations`.                                                             |
| **`stopAnimation()`**          | `() => void`          | Immediately stops all currently playing animations.                                                                                            |
| **`destroy()`**                | `() => void`          | Releases animation tracks and referenced resources created by the loader.                                                                      |

> [!TIP]
> Since most glTF models use Physically Based Rendering materials (`PBRMaterial`), configure `IBL` on the `View3D` so
metallic and surface reflections render accurately.

---

## 2. Animation Playback and State Machine

Animation clips embedded in the model are parsed into `loader.parsingResult.animations` as an array of `ClipAnimState`
instances. Play a single clip with `loader.playAnimation(clip)`, or use `AnimStateMachine`
for conditional crossfade blending between states (such as `Idle` ↔ `Walk` ↔ `Run`).

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
        'https://threejs.org/examples/models/gltf/Soldier.glb',
        (loader) => {
          scene.addChild(loader.resultMesh);

          const clips = loader.parsingResult.animations;
          if (clips.length > 0) {
            const idleState = clips[0];
            const runState = clips[1];
            const walkState = clips[3];

            idleState.name = 'Idle';
            walkState.name = 'Walk';
            runState.name = 'Run';

            // 1. Create AnimStateMachine with initial state (Idle) and register states
            const stateMachine = new RedGPU.AnimStateMachine(idleState);
            stateMachine.addState(walkState);
            stateMachine.addState(runState);

            // 2. Register transition rules (duration: crossfade time in seconds, conditions: predicate function)
            stateMachine.addTransition({
              fromState: 'Idle',
              toState: 'Walk',
              duration: 0.25,
              conditions: () => charController.isMoving && !charController.isRunning
            });
            stateMachine.addTransition({
              fromState: 'Walk',
              toState: 'Idle',
              duration: 0.25,
              conditions: () => !charController.isMoving
            });

            // 3. Start default animation and bind the state machine
            loader.stopAnimation();
            loader.playAnimation(idleState);
            loader.activeAnimations[0].animStateMachine = stateMachine;
          }
        }
);
```

---

## 3. Live Demo: IBL and Model Loading

An example loading a glTF helmet model into a scene configured with `IBL` ambient lighting and a `SkyBox`.

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
    controller.distance = 3; // Adjust camera distance

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // Set up IBL and a Skybox
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            scene.addChild(loader.resultMesh);
            
            const renderer = new RedGPU.Renderer();
            renderer.start(redGPUContext, () => {
                loader.resultMesh.rotationY += 1;
            });
        }
    );
});
</pre>
</CodePen>
</ClientOnly>

---

## Next Steps

- **[Instancing Mesh](../instanced-mesh/index.md)**: Rendering tens of thousands of identical objects in a single draw
  call
