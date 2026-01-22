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

# IBL

IBL은 주변 환경의 이미지를 광원으로 사용하여 물체를 비추는 방식입니다. 단순한 광원만으로는 표현하기 힘든 사실적인 반사와 전역 조명 효과를 제공하여 3D 씬의 사실감을 극대화합니다.

## 1. IBL의 핵심 구성

RedGPU의 **이미지 기반 조명**(IBL) 시스템은 HDR 환경 맵 또는 큐브맵 이미지를 분석하여 다음 세 가지 핵심 리소스를 자동으로 생성합니다.

<ClientOnly>
  <MermaidResponsive :definition="iblGraph" />
</ClientOnly>

### 1.1 방사 조도 텍스처 (Irradiance Texture)

**방사 조도 텍스처**(`irradianceTexture`)는 난반사(Diffuse) 조명 계산을 위해 생성된 텍스처입니다.
- **역할**: 물체의 기본 명암과 주변광(Ambient) 역할을 하며, 직접적인 광원이 없는 곳에서도 자연스러운 색감을 부여합니다.
- **기술적 특징**: 원본 환경 맵을 저해상도(32x32)로 다운샘플링하고 컨볼루션하여 생성됩니다.

### 1.2 IBL 텍스처 (Specular Texture)

**IBL 텍스처**(`iblTexture`)는 정반사(Specular) 조명 계산을 위해 생성된 텍스처입니다.
- **역할**: 물체 표면에 주변 환경이 비치는 효과를 담당합니다. **물리 기반 렌더링**(PBR) 재질에서 금속이나 유리 같은 표면의 반사를 표현합니다.
- **기술적 특징**: 거칠기(Roughness) 단계별로 미리 필터링된 밉맵(Mipmap)을 포함하고 있습니다.

### 1.3 환경 텍스처 (Environment Texture)

**환경 텍스처**(`environmentTexture`)는 원본 이미지를 고해상도 큐브맵으로 유지한 데이터입니다.
- **역할**: 주로 **SkyBox** 의 배경 텍스처로 사용되어 시각적인 배경을 제공합니다.

## 2. 구현하기: 생성 및 적용

IBL을 적용하려면 리소스를 생성한 후, 반드시 카메라 뷰(**View3D**)에 등록해야 합니다.

### 2.1 HDR 파일 사용 (권장)

가장 일반적이고 권장되는 방식으로, 빛의 세기 정보를 포함한 HDR 파일을 사용합니다.

```javascript
// 1. IBL 리소스 생성
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    '/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 2. View에 IBL 적용 (조명 효과)
view.ibl = ibl;

// 3. (선택) View에 SkyBox 적용 (시각적 배경)
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
view.skybox = skybox;
```

### 2.2 6장의 이미지 사용 (CubeMap)

HDR 파일이 없는 경우, 일반 이미지 6장을 사용하여 IBL 효과를 흉내 낼 수 있습니다.

```javascript
// 1. IBL 리소스 생성
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    [
        './posx.jpg', './negx.jpg', 
        './posy.jpg', './negy.jpg', 
        './posz.jpg', './negz.jpg'
    ]
);

// 2. View에 IBL 적용
view.ibl = ibl;
```

## 3. 실전 예제: GLTF 모델과 IBL

IBL은 특히 PBR 재질을 사용하는 GLTF 모델에서 그 진가를 발휘합니다. 금속 재질의 모델은 주변 환경을 반사하지 않으면 단순한 회색으로 보일 수 있지만, IBL을 적용하면 비로소 금속 특유의 광택과 질감을 가지게 됩니다.

아래 라이브 데모에서 IBL이 적용된 환경과 금속 헬멧 모델의 사실적인 반사를 확인해 보세요.

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
    
    // 1. IBL 생성
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    
    // 2. Skybox 생성 (배경용)
    const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 3. GLTF 모델 로딩
    const loader = new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (result) => {
            scene.addChild(result.resultMesh);
        }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 5;
    
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    
    // View에 IBL 및 Skybox 적용
    view.ibl = ibl;
    view.skybox = skybox;
    
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **방사 조도 텍스처**(`irradianceTexture`)는 난반사 조명을 담당합니다.
- **IBL 텍스처**(`iblTexture`)는 정반사(반사광) 조명을 담당합니다.
- 생성된 IBL 객체는 반드시 **`view.ibl`** 속성에 할당해야 씬에 조명이 적용됩니다.

## 다음 학습 추천

- **[모델 로딩 (GLTF Loader)](../basic-objects/gltf-loader.md)**