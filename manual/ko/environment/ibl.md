---
order: 2
---

# IBL (Image-Based Lighting)

IBL은 주변 환경의 이미지를 광원으로 사용하여 물체를 비추는 방식입니다. 단순한 광원(Point, Directional)만으로는 표현하기 힘든 사실적인 반사와 전역 조명 효과를 제공하여 3D 씬의 사실감을 극대화합니다.

## 1. IBL의 두 가지 핵심 요소

RedGPU의 IBL 시스템은 HDR 환경 맵을 분석하여 다음 두 가지 텍스처 데이터를 생성하고 사용합니다.

### 1.1 Diffuse Texture (난반사)
환경 맵의 전체적인 색상 정보를 아주 부드럽게 블러(Blur) 처리한 데이터입니다.
- **역할**: 물체의 기본 명암과 주변광(Ambient) 역할을 하며, 직접적인 광원이 없는 곳에서도 자연스러운 색감을 부여합니다.
- **비유**: 안개가 낀 날 전체적으로 퍼지는 은은한 빛과 같습니다.

### 1.2 Specular Texture (정반사)
환경 맵의 고해상도 정보를 유지하면서 거칠기(Roughness) 단계별로 미리 계산된 데이터입니다.
- **역할**: 물체 표면에 주변 환경이 비치는 효과를 담당합니다. 금속(Metal)이나 유리 같은 재질에서 빛나는 하이라이트와 주변 풍경의 반사를 표현합니다.
- **비유**: 거울이나 매끄러운 금속 표면에 비치는 선명한 풍경과 같습니다.

## 2. 구현하기: IBL 리소스 생성

RedGPU에서는 단 한 줄의 코드로 HDR 파일을 로드하고 필요한 모든 조명 맵을 자동으로 생성할 수 있습니다.

```javascript
// HDR 환경 맵 로드 및 IBL 리소스 생성
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
```

## 3. GLTF 모델과 IBL의 시너지

IBL은 특히 PBR(Physically Based Rendering) 재질을 사용하는 GLTF 모델에서 그 진가를 발휘합니다. 금속 재질의 모델은 주변 환경을 반사하지 않으면 단순한 회색으로 보일 수 있지만, IBL을 적용하면 비로소 금속 특유의 광택을 가지게 됩니다.

```javascript
// GLTF 로더를 통해 모델 로드
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => {
        scene.addChild(result.model);
    }
);
```

## 4. 라이브 데모 (Live Demo)

IBL이 적용된 환경에서 금속 헬멧 모델의 사실적인 반사와 질감을 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - IBL with GLTF" slugHash="ibl-gltf">
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
    
    // 1. IBL 생성 (배경 및 조명 데이터)
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    
    // 배경을 함께 보기 위해 Skybox 추가
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 2. GLTF 모델 로딩 (금속 재질이 포함된 모델)
    const loader = new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (result) => {
            scene.addChild(result.model);
        }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.skybox = skybox;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **Diffuse Map**은 전역적인 조명과 색감을 제공합니다.
- **Specular Map**은 금속성 재질의 사실적인 반사를 담당합니다.
- **IBL**은 PBR 재질(GLTF 모델 등)의 완성도를 결정하는 필수 요소입니다.

## 다음 학습 추천

지금까지 배운 객체와 환경 설정을 바탕으로, 실제 프로젝트에서 어떻게 모델을 불러오고 제어하는지 더 깊이 알아봅시다.

- **[모델 로딩 (GLTF Loader)](../basic-objects/gltf-loader.md)**