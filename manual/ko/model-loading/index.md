---
title: GLTF Loader (모델 로딩)
order: 1
---

# GLTF Loader

**Primitive**로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴(Blender, Maya 등)에서 제작하여 가져와야 합니다.
RedGPU는 웹 3D 표준 포맷인 **glTF**(GL Transmission Format) 2.0 로딩을 지원하는 **GLTFLoader**를 제공합니다.

## 1. 모델 불러오기

`RedGPU.GLTFLoader`를 사용하여 `.gltf` 또는 `.glb` 파일을 로드할 수 있습니다. 로딩은 비동기적으로 진행되며, 완료 시 콜백 함수를 통해 결과를 전달받습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

new RedGPU.GLTFLoader(
    redGPUContext, 
    'https://.../DamagedHelmet.glb', // 모델 경로
    (loader) => {
        // [로드 성공] loader.resultMesh가 최종 모델 객체입니다.
        scene.addChild(loader.resultMesh);
    }
);
```

### 주요 속성 (GLTFLoader 인스턴스)
- **`resultMesh`**: 로드된 모델을 담고 있는 `RedGPU.Display.Mesh` 객체입니다.
- **`parsingResult`**: 재질, 그룹, 텍스처 등 glTF 파일의 상세 파싱 데이터입니다.

## 2. IBL과의 시너지 (필수 권장)

외부에서 가져온 고품질 모델들은 대부분 **PBR(물리 기반 렌더링)** 재질을 사용합니다. 이러한 재질은 주변 환경의 빛 정보를 반사하여 질감을 표현하기 때문에, 앞서 배운 **IBL**과 함께 사용할 때 가장 사실적인 결과를 얻을 수 있습니다.

IBL이 없는 환경에서 PBR 모델을 로드하면 금속 질감이 검게 보이거나 매우 어색하게 출력될 수 있습니다.

## 3. 실습 예제: 환경광과 모델 로딩

IBL로 환경을 구성하고, 정교한 금속 헬멧 모델을 로드하는 전체 과정입니다. 카메라 컨트롤러의 `distance` 속성을 조절하여 모델을 적절한 크기로 관찰할 수 있습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    
    // 1. 카메라 거리 설정 (모델 크기에 맞춰 조절)
    controller.distance = 3; 

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 2. IBL 및 SkyBox 설정 (PBR 재질의 핵심)
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 3. GLTF 모델 로딩
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            scene.addChild(loader.resultMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

### 라이브 데모

IBL 환경광을 받아 정교하게 반사되는 금속 헬멧 모델을 확인해 보세요.

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

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3; // 카메라 거리 조절

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // IBL 및 Skybox 설정
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

## 다음 단계

이제 모든 준비가 끝났습니다. 최종적으로 생성된 화면에 시각적인 깊이를 더하는 후처리 효과에 대해 알아봅니다.

- **[포스트 이펙트 (Post-Effect)](../post-effect/)**