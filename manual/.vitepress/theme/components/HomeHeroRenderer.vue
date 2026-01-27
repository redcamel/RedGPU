<script setup>
import {onMounted, onUnmounted, ref} from 'vue'

const canvasRef = ref(null)
const error = ref(null)
let gpuContext
let resizeObserver
let RedGPU

onMounted(async () => {
  if (!canvasRef.value) return

  // 1. Initialize RedGPU
  RedGPU = await import(/* @vite-ignore */ `https://redcamel.github.io/RedGPU/dist/index.js?t=${Date.now()}`)
  RedGPU.init(
      canvasRef.value,
      (redGPUContext) => {
        gpuContext = redGPUContext;

        // Match project example style: Create controller, scene, view
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.01;
        controller.tilt = -15;

        redGPUContext.onResize = () => {
          const {width,height} = view.screenRectObject;
          if (width < 250) {
            controller.distance = 0.7;
            controller.centerY = 0.289;
          } else if (width < 350) {
            if(height<=200){
              controller.distance = 0.45;
              controller.centerY = 0.11;
            }else{
              controller.distance = 0.65;
              controller.centerY = 0.25;
            }

          } else if (width < 410) {
            controller.distance = 0.48;
            controller.centerY = 0.13;
          } else if (width < 500) {
            controller.distance = 0.45;
            controller.centerY = 0.11;
          } else {
            controller.distance = 0.42;
            controller.centerY = 0.09;
          }
        }

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // Initial size setup
        redGPUContext.setSize('100%', '100%');
        redGPUContext.backgroundColor.a = 0; // 배경 투명

        // 2. Setup HDR Environment (IBL only)
        const hdrUrl = 'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr';
        const ibl = new RedGPU.Resource.IBL(redGPUContext, hdrUrl);
        view.ibl = ibl;

        // 3. Load GLB Model
        let loadedModel;
        const glbUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/IridescentDishWithOlives/glTF-Binary/IridescentDishWithOlives.glb';

        new RedGPU.GLTFLoader(
            redGPUContext,
            glbUrl,
            (result) => {
              loadedModel = result.resultMesh;
              scene.addChild(loadedModel);
            },
            (progress) => { /* progress logic */
            },
            (err) => console.error('GLTFLoader error:', err)
        );

        // 4. Animation Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
          if (loadedModel) {
            loadedModel.rotationY += 0.5;

          }

        };
        renderer.start(redGPUContext, render);

        // 5. Handle Resize using ResizeObserver on the parent element
        resizeObserver = new ResizeObserver(() => {
          if (redGPUContext) {
            redGPUContext.setSize('100%', '100%');
          }
        });
        if (canvasRef.value.parentElement) {
          resizeObserver.observe(canvasRef.value.parentElement);
        }
      },
      (failReason) => {
        console.error('Failed to initialize RedGPU:', failReason);
        error.value = 'WebGPU is not available in your browser.';
      }
  );
})

onUnmounted(() => {
  if (gpuContext && RedGPU) {
    const renderer = new RedGPU.Renderer();
    renderer.stop(gpuContext);
  }
  if (resizeObserver) resizeObserver.disconnect();
})
</script>

<template>
  <div class="hero-renderer-wrapper">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <canvas ref="canvasRef" class="hero-canvas"></canvas>
  </div>
</template>

<style scoped>
.hero-renderer-wrapper {
  position: absolute;
  width: 50%;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  transform:translate(0,20px);
}

.hero-canvas {
  pointer-events: auto;
}

.hero-canvas:active {
  cursor: grabbing;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--vp-c-text-2);
  text-align: center;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  z-index: 10;
  max-width: 300px;
}


/* 테블릿 및 작은 화면 대응 */
@media (max-width: 1280px) {
  .hero-renderer-wrapper {
    width: 450px;
  }
}
@media (max-width: 1120px) {
  .hero-renderer-wrapper {
    width: 400px;
  }
}

@media (max-width: 1024px) {
  .hero-renderer-wrapper {
    width: 300px;
  }
}
@media (max-width: 900px) {
  .hero-renderer-wrapper {
    width: 300px;
    height:200px;
    top:auto;
    transform:translate(0,20px);
  }
}
@media (max-width: 800px) {
  .hero-renderer-wrapper {
    width: 200px;
    height:200px;
    top:auto;
    transform:translate(0,6px);
  }
}
/* 모바일 사이즈: 영역을 그리지 않음 */
@media (max-width: 640px) {
  .hero-renderer-wrapper {
    opacity:0
  }
}
</style>