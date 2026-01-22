---
title: GLTF Loader (모델 로딩)
order: 6
---

# GLTF Loader

**Primitive** 로 기본적인 형태를 만들 수 있지만, 복잡한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴(Blender 등)에서 제작하여 가져와야 합니다.
RedGPU는 웹 3D 표준 포맷인 **glTF**(GL Transmission Format) 로딩을 지원하는 **GLTFLoader** 를 제공합니다.

## 1. 모델 불러오기

`RedGPU.GLTFLoader` 를 사용하여 `.gltf` 또는 `.glb` 파일을 로드할 수 있습니다. 로딩은 비동기적으로 진행되며, 완료 시 콜백 함수를 통해 결과물을 받습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

// 로더 인스턴스 생성
const loader = new RedGPU.GLTFLoader(
    redGPUContext, // 컨텍스트
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', // 파일명
    (result) => {
        // [로드 성공]
        // result['modelMesh'] 가 로드된 메쉬 객체입니다.
        const mesh = result['modelMesh'];
        mesh.scaleX = mesh.scaleY = mesh.scaleZ = 2; // 크기 조절
        scene.addChild(mesh); // 씬에 추가
    },
    (progress) => {
        // [로딩 진행 중] (Optional)
        console.log('Loading...', progress);
    },
    (error) => {
        // [로드 실패] (Optional)
        console.error('Error:', error);
    }
);
```

## 2. 애니메이션 재생

로드된 모델에 애니메이션이 포함되어 있다면, `animationManager` 를 통해 재생할 수 있습니다.

```javascript
(result) => {
    const mesh = result['modelMesh'];
    scene.addChild(mesh);

    // 애니메이션이 있다면 첫 번째 동작 재생
    if (result['animations'].length > 0) {
        const animation = result['animations'][0];
        mesh.animationManager.play(animation);
    }
}
```

## 3. 실습 예제: 외부 모델 로드

실제 GLTF 모델을 로드하여 화면에 띄우고 회전시키는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 조명 설정 (모델을 잘 보이게 하기 위해)
    const light = new RedGPU.Light.DirectionalLight();
    light.x = 5; light.y = 5; light.z = 5;
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.5);

    // GLTF 로딩
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (result) => {
            const mesh = result['resultMesh'];
            mesh.scaleX = mesh.scaleY = mesh.scaleZ = 2;
            scene.addChild(mesh);

            // 렌더 루프에서 회전
            const renderer = new RedGPU.Renderer();
            renderer.start(redGPUContext, () => {
                mesh.rotationY += 1;
            });
        }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);
});
```

### 라이브 데모

외부에서 제작된 고품질 헬멧 모델을 로드하여 렌더링한 결과입니다.

<ClientOnly>
<CodePen title="RedGPU Basics - GLTF Loader" slugHash="gltf-loader">
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
    
    const light = new RedGPU.Light.DirectionalLight();
    light.x = 5; light.y = 5; light.z = 5;
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.5);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/gltf/basic/',
        'DamagedHelmet.gltf',
        (result) => {
            const mesh = result['modelMesh'];
            mesh.scaleX = mesh.scaleY = mesh.scaleZ = 2;
            scene.addChild(mesh);

            const renderer = new RedGPU.Renderer();
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