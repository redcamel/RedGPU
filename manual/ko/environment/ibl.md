---
order: 2
---

<script setup>
const iblGraph = `
    HDR["HDR 원본 (.hdr)"] -->|생성| IBL["RedGPU.Resource.IBL"]
    Cube["6면 이미지 (CubeMap)"] -->|생성| IBL
    
    subgraph Outputs ["생성되는 GPU 텍스처"]
        IBL --> Irradiance["irradianceTexture (난반사 환경광)"]
        IBL --> Specular["prefilterTexture (정반사 환경광)"]
        IBL --> Environment["environmentTexture (배경 큐브맵)"]
    end

    Irradiance -->|간접 조명| PBR["PBRMaterial"]
    Specular -->|환경 반사| PBR
    Environment -->|배경 연결| Skybox["RedGPU.Display.SkyBox"]

    %% 회색조 스타일 적용
    style HDR fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Cube fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Irradiance fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Specular fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Environment fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
    style Skybox fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`
</script>

# IBL

**이미지 기반 조명**(IBL, `RedGPU.Resource.IBL`)은 주변 환경 이미지를 광원으로 분석하여 물리 기반 렌더링 (PBR) 재질에 사실적인 반사광과 전역 확산광을 제공하는 리소스입니다.

## 1. 핵심 구성 요소

`IBL` 은 HDR 환경 맵 또는 큐브맵 이미지를 입력받아 세 가지 큐브 텍스처 리소스를 자동 생성합니다.

<ClientOnly>
  <MermaidResponsive :definition="iblGraph" />
</ClientOnly>

| 속성                     | 역할                  | 설명                                                                                                       |
|:-------------------------|:----------------------|:-----------------------------------------------------------------------------------------------------------|
| **`irradianceTexture`**  | 확산 주변광 (Diffuse) | 물체의 기본 명암과 주변광(Ambient) 역할을 담당하며 직접 광원이 없는 영역에도 자연스러운 색감을 부여합니다. |
| **`prefilterTexture`**   | 반사광 (Specular)     | 거칠기(Roughness) 단계별로 프리필터링된 반사 맵으로, 금속이나 유리 표면의 환경 반사를 표현합니다.          |
| **`environmentTexture`** | 배경 (Background)     | 원본 이미지를 고해상도 큐브맵으로 변환한 텍스처로, `SkyBox` 의 배경 텍스처로 사용됩니다.                   |

> [!TIP]
> `view.ibl` 속성에 `IBL` 인스턴스를 할당하면, 내부의 `irradianceTexture` 와 `prefilterTexture` 가 해당 뷰에서 렌더링되는 모든 PBR 객체 (glTF 모델 등)에 자동
적용됩니다.

---

## 2. 생성 및 적용

`IBL` 리소스를 생성한 뒤 `View3D` 의 `ibl` 및 `skybox` 속성에 연결합니다.

```javascript
// 1. IBL 리소스 생성 (HDR 파일 권장)
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// 2. View에 IBL 조명 적용
view.ibl = ibl;

// 3. View에 SkyBox 배경 적용
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
```

---

## 3. 라이브 예제

HDR 소스로부터 `IBL` 과 `SkyBox` 를 동시에 구성한 예제입니다. 외부에서 제작된 glTF 등 PBR 모델을 로드할 때 이 환경 데이터를 기반으로 실사 수준의 금속 반사와 환경광이 표현됩니다.

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

---

## 다음 단계

- **[스카이 대기](./skyatmosphere.md)** : 실시간 물리 기반 대기 산란 시뮬레이션으로 동적인 하늘 효과 구성하기
