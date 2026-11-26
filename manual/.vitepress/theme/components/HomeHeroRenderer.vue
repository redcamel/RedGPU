<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useData} from 'vitepress'

const {page} = useData()
const isKo = computed(() => page.value.relativePath?.startsWith('ko/'))

const canvasRef = ref(null)
const error = ref(null)
let gpuContext
let resizeObserver
let RedGPU

onMounted(async () => {
  if (!canvasRef.value) return
  if (window.matchMedia('(max-width: 639px)').matches) return

  // 1. Initialize RedGPU
  RedGPU = await import(/* @vite-ignore */ `${window.location.origin}/RedGPU/dist/index.js?t=${Date.now()}`)
  RedGPU.init(
      canvasRef.value,
      (redGPUContext) => {
        gpuContext = redGPUContext;

        // Match project example style: Create controller, scene, view
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.01;
        controller.tilt = -15;

        redGPUContext.onResize = (resizeEvent) => {
          const {width, height} = resizeEvent.screenRectObject;
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
        redGPUContext.onResize({
          target: redGPUContext,
          screenRectObject: redGPUContext.screenRectObject,
          pixelRectObject: redGPUContext.pixelRectObject
        });
        redGPUContext.backgroundColor.a = 0; // 배경 투명

        // 2. Setup HDR Environment (IBL only)
        const hdrUrl = `${window.location.origin}/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr`;
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
            redGPUContext.onResize({
              target: redGPUContext,
              screenRectObject: redGPUContext.screenRectObject,
              pixelRectObject: redGPUContext.pixelRectObject
            });
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
  <section aria-label="RedGPU Live WebGPU Showcase" class="home-live-showcase">
    <div class="container">
      <div class="hero-renderer-wrapper">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <canvas ref="canvasRef" class="hero-canvas"></canvas>
        <div class="showcase-hint">
          {{ isKo ? '드래그하여 회전 · 스크롤하여 확대/축소' : 'Drag to orbit · Scroll to zoom' }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-live-showcase {
  padding: 0 24px;
  margin: 0 0 32px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.hero-renderer-wrapper {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(60% 80% at 50% 45%, rgba(235, 58, 42, 0.14) 0%, rgba(235, 58, 42, 0) 70%),
  var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
}

.hero-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  pointer-events: auto;
}

.hero-canvas:active {
  cursor: grabbing;
}

.showcase-hint {
  position: absolute;
  right: 16px;
  bottom: 12px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  color: var(--vp-c-text-2);
  background: color-mix(in srgb, var(--vp-c-bg) 68%, transparent);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(8px);
  pointer-events: none;
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

@media (min-width: 640px) {
  .home-live-showcase {
    padding: 0 48px;
    margin: 0 0 40px;
  }

  .hero-renderer-wrapper {
    height: 360px;
  }
}

@media (min-width: 960px) {
  .home-live-showcase {
    padding: 0 64px;
    margin: 0 0 48px;
  }

  .hero-renderer-wrapper {
    height: 380px;
  }
}

@media (max-width: 639px) {
  .home-live-showcase {
    display: none;
  }
}
</style>