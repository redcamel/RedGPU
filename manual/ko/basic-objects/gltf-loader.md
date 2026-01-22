---
title: GLTF Loader (모델 로딩)
order: 6
---

# GLTF Loader

**Primitive** 로 기본적인 형태를 만들 수 있지만, 복잡한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴(Blender, Maya 등)에서 제작하여 가져와야 합니다.
RedGPU는 웹 3D 표준 포맷인 **glTF**(GL Transmission Format) 2.0 로딩을 지원하는 **GLTFLoader** 를 제공합니다. `.gltf`(JSON) 및 `.glb`(Binary) 형식을 모두 지원합니다.

## 1. 모델 불러오기

`RedGPU.GLTFLoader` 를 사용하여 파일을 로드할 수 있습니다. 로딩은 비동기적으로 진행되며, 완료 시 콜백 함수(`onLoad`)를 통해 로더 인스턴스를 전달받습니다.

```javascript
import * as RedGPU from "dist/index.js";

// 로더 인스턴스 생성
new RedGPU.GLTFLoader(
    redGPUContext, // RedGPUContext 인스턴스
    'https://.../DamagedHelmet.glb', // 로드할 파일 URL
    (loader) => {
        // [로드 성공]
        // loader는 GLTFLoader 인스턴스 자체입니다.
        // loader.resultMesh 가 로드된 최종 메쉬 컨테이너(Mesh 객체)입니다.
        const mesh = loader.resultMesh;
        
        // 크기 조절 (필요 시)
        mesh.scaleX = mesh.scaleY = mesh.scaleZ = 2; 
        
        // 씬에 추가
        scene.addChild(mesh);
        
        console.log('Parsing Result:', loader.parsingResult);
    },
    (progress) => {
        // [로딩 진행 중] (Optional)
        // progress 객체: { url, model: { loaded, total, percent, ... } }
        console.log('Loading...', progress.model.percent + '%');
    },
    (error) => {
        // [로드 실패] (Optional)
        console.error('Error:', error);
    }
);
```

### 주요 속성 (GLTFLoader Instance)

- **`resultMesh`**: 로드된 모델을 담고 있는 `RedGPU.Display.Mesh` 객체입니다. 이 객체를 Scene에 `addChild`하여 렌더링합니다.
- **`parsingResult`**: glTF 파일 파싱 결과 데이터입니다.
  - `materials`: 정의된 재질 리스트
  - `groups`: 정의된 그룹 리스트
  - `textures`: 정의된 텍스처 리스트
- **`loadingProgressInfo`**: 현재 로딩 진행 상태 정보입니다.

## 2. 실습 예제: 외부 모델 로드 (with IBL)

다음은 외부 GLTF 모델을 로드하고, **HDR 텍스처를 기반으로 한 IBL(Image-Based Lighting)** 을 적용하여 사실적인 렌더링 결과를 만드는 예제입니다.

```javascript
import * as RedGPU from "dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    // 1. Scene & Camera 설정
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 2. IBL (Image-Based Lighting) 및 SkyBox 설정
    // HDR 텍스처를 로드하여 환경광과 배경으로 사용합니다.
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl; // PBR 재질에 환경광 적용
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture); // 배경 렌더링

    // 3. GLTF 로딩
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            const mesh = loader.resultMesh;
            mesh.scaleX = mesh.scaleY = mesh.scaleZ = 2;
            scene.addChild(mesh);
        }
    );

    // 4. 렌더러 시작
    const renderer = new RedGPU.Renderer(redGPUContext);
    renderer.start(redGPUContext, () => {
        // 매 프레임 실행될 로직
    });
});
```

### 라이브 데모

PBR 재질이 적용된 헬멧 모델에 HDR 환경광이 반사되는 것을 확인할 수 있습니다.

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
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // IBL Setup
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
            const mesh = loader.resultMesh;
            mesh.scaleX = mesh.scaleY = mesh.scaleZ = 2;
            scene.addChild(mesh);
            
            const renderer = new RedGPU.Renderer(redGPUContext);
            renderer.start(redGPUContext, () => {
                mesh.rotationY += 1;
            });
        }
    );
});
</pre>
</CodePen>
</ClientOnly>

## 다음 단계

이제 기본 객체와 모델 로딩까지 모두 마쳤습니다.
빛과 물체가 만나 생성되는 입체감의 완성, 그림자 시스템에 대해 알아봅니다.

- **[그림자 (Shadow)](../shadow-system/shadow.md)**
