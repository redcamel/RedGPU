---
order: 2
---

<script setup>
const iblGraph = `
    HDR["HDR Source"] -->|new| IBL["RedGPU.Resource.IBL"]
    Cube["6 Images (CubeMap)"] -->|new| IBL
    
    subgraph Outputs ["Generated Resources"]
        IBL --> Irradiance["irradianceTexture (Diffuse)"]
        IBL --> Specular["iblTexture (Specular)"]
        IBL --> Environment["environmentTexture (Background)"]
    end

    Irradiance -->|Lighting| PBR["PBR Material"]
    Specular -->|Reflection| PBR
    Environment -->|Background| Skybox["RedGPU.Display.SkyBox"]

    %% 커스텀 클래스 적용
    class IBL,Skybox mermaid-main;
    class Irradiance,Specular,Environment,PBR mermaid-component;
`
</script>

# IBL (Image-Based Lighting)

IBL은 주변 환경의 이미지를 광원으로 사용하여 물체를 비추는 방식입니다. 단순한 광원만으로는 표현하기 힘든 사실적인 반사와 전역 조명 효과를 제공하여 3D 씬의 사실감을 극대화합니다.

## 1. IBL의 핵심 구성

RedGPU의 **이미지 기반 조명**(IBL) 시스템은 HDR 환경 맵 또는 큐브맵 이미지를 분석하여 다음 세 가지 핵심 리소스를 자동으로 생성합니다.

<ClientOnly>
  <MermaidResponsive :definition="iblGraph" />
</ClientOnly>

### 1.1 방사 조도 텍스처 (Irradiance Texture)
물체의 기본 명암과 주변광(Ambient) 역할을 하며, 직접적인 광원이 없는 곳에서도 자연스러운 색감을 부여합니다.

### 1.2 IBL 텍스처 (Specular Texture)
물체 표면에 주변 환경이 비치는 효과를 담당합니다. 물리 기반 렌더링(PBR) 재질에서 금속이나 유리 같은 표면의 반사를 표현합니다.

### 1.3 환경 텍스처 (Environment Texture)
원본 이미지를 고해상도 큐브맵으로 유지한 데이터로, 주로 **SkyBox**의 배경 텍스처로 사용됩니다.

## 2. 구현하기: 생성 및 적용

IBL을 적용하려면 리소스를 생성한 후, 카메라 뷰(**View3D**)에 등록해야 합니다.

```javascript
// 1. IBL 리소스 생성 (HDR 파일 권장)
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 2. View에 IBL 적용 (조명 효과)
view.ibl = ibl;

// 3. View에 SkyBox 적용 (시각적 배경)
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

## 3. 라이브 샘플: 환경 구성

아래 예제는 HDR 소스로부터 IBL과 Skybox를 동시에 생성한 결과입니다. 지금은 단순히 360도 배경이 보일 뿐이지만, 이 공간은 이미 물리적으로 정확한 빛의 데이터를 머금고 있는 상태입니다.

<ClientOnly>
<CodePen title="RedGPU Basics - Environmental Setup" slugHash="env-setup">
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
    
    // IBL 및 Skybox 설정
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = skybox;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 4. 진정한 가치: GLTF와의 시너지

단순히 배경(Skybox)만 보았을 때는 큰 차이가 없게 느껴질 수 있습니다. 하지만 이 환경 설정의 진정한 가치는 다음 장에서 다룰 **GLTF 모델**을 로드할 때 드러납니다.

외부에서 제작된 정교한 모델들은 대부분 PBR(물리 기반 렌더링) 재질을 사용합니다. IBL은 이러한 모델들에게 현실적인 반사 데이터와 부드러운 환경광을 제공하여, 모델이 마치 실제 그 공간에 존재하는 것 같은 실사 수준의 질감을 구현하게 해줍니다.

## 다음 학습 추천

이제 완벽한 조명 환경이 준비되었습니다. 이 공간에 실제 고품질 모델을 불러오는 방법을 알아봅니다.

- **[모델 로딩 (GLTF Loader)](../model-loading/)**