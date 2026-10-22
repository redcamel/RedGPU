---
title: GLTF Loader
order: 1
---

<script setup>
const loaderGraph = `
    GLTF[".gltf / .glb 파일"] -->|비동기 로드 및 파싱| Loader["GLTFLoader (로더)"]
    Loader -->|PBRMaterial 생성| Mat["Material (재질)"]
    Loader -->|Geometry 파싱| Geo["Geometry (지오메트리)"]
    Loader -->|ClipAnimState 파싱| Anim["parsingResult.animations"]
    Mat --> Mesh["resultMesh (최종 메시)"]
    Geo --> Mesh
    Anim -->|playAnimation / AnimStateMachine| Mesh

    %% 회색조 스타일 적용
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Anim fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# GLTF Loader

**Primitive** 로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴 (Blender, Maya 등)에서 제작하여 가져와야 합니다.
RedGPU는 웹 3D 표준 포맷인 **glTF**(GL Transmission Format) 2.0 로딩과 스켈레탈 (Skinning)/모프 (Morph Target) 애니메이션, 그리고 상태 머신 기반 모션
블렌딩을 지원하는 **GLTFLoader** 를 제공합니다.

<ClientOnly>
  <MermaidResponsive :definition="loaderGraph" />
</ClientOnly>

## 1. 모델 불러오기

`RedGPU.GLTFLoader` 를 사용하여 `.gltf` 또는 `.glb` 파일을 로드할 수 있습니다. 로딩은 비동기적으로 진행되며, 완료 시 콜백 함수를 통해 결과를 전달받습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

new RedGPU.GLTFLoader(
    redGPUContext, 
    'https://.../DamagedHelmet.glb', // 모델 경로
    (loader) => {
        // [로드 성공] loader.resultMesh가 최종 모델 객체입니다.
        scene.addChild(loader.resultMesh);
    },
    (progress) => {
        // [선택] 로딩 진행 상태 확인 (progress.model.percent 등)
    },
    (error) => {
        console.error('GLTF 로드 실패:', error);
    }
);
```

### GLTFLoader 주요 속성 및 메서드

- **`resultMesh`** (`Mesh`): 로드된 모델의 계층 구조를 담고 있는 루트 `RedGPU.Display.Mesh` 컨테이너입니다.
- **`parsingResult`**: 재질 (`materials`), 그룹 (`groups`), 텍스처 (`textures`), 애니메이션 클립 배열 (`animations`: `ClipAnimState[]`)
  등 파싱된 상세 데이터입니다.
- **`playAnimation(clipState)`**: `loader.parsingResult.animations`에 포함된 특정 애니메이션 클립 (`ClipAnimState`)을 재생합니다.
- **`stopAnimation()`**: 현재 재생 중인 모든 애니메이션을 즉시 중지합니다.
- **`destroy()`**: 로더가 생성한 애니메이션 트랙 및 참조 리소스를 해제합니다.

---

## 2. 애니메이션 재생 및 상태 머신 (`AnimStateMachine`)

glTF 파일에 스켈레탈 애니메이션이 포함되어 있으면 `loader.parsingResult.animations` 배열에 각 클립이 `RedGPU.ClipAnimState` 인스턴스로 자동 파싱됩니다.

단일 클립 재생은 `loader.playAnimation(clip)`으로 제어하며, 캐릭터의 대기 (`Idle`) ↔ 걷기 (`Walk`) ↔ 달리기 (`Run`)처럼 조건에 따라 부드럽게 모션을 섞어 전환
(Crossfade Blending)하려면 **`RedGPU.AnimStateMachine`** 을 사용합니다.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
    'https://threejs.org/examples/models/gltf/Soldier.glb',
    (loader) => {
        const mesh = loader.resultMesh;
        scene.addChild(mesh);

        const clips = loader.parsingResult.animations;
        if (clips.length > 0) {
            const idleState = clips[0];
            const runState = clips[1];
            const walkState = clips[3];

            idleState.name = 'Idle';
            walkState.name = 'Walk';
            runState.name = 'Run';

            // 1. 초기 상태(Idle)로 AnimStateMachine 생성 및 상태 등록
            const stateMachine = new RedGPU.AnimStateMachine(idleState);
            stateMachine.addState(walkState);
            stateMachine.addState(runState);

            // 2. 상태 전이 규칙(duration: 크로스페이드 초 단위 시간, conditions: 전이 조건 함수) 등록
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

            // 3. 기본 애니메이션 재생 시작 후 상태 머신 연결
            loader.stopAnimation();
            loader.playAnimation(idleState);
            loader.activeAnimations[0].animStateMachine = stateMachine;
        }
    }
);
```

---

## 3. IBL과의 시너지

외부에서 가져온 고품질 모델들은 대부분 **물리 기반 렌더링**(PBR) 재질 (`PBRMaterial`)을 사용합니다. 이러한 재질은 주변 환경의 빛 정보를 반사하여 질감을 표현하기 때문에, 앞서 배운
**IBL** 과 함께 사용할 때 가장 사실적인 결과를 얻을 수 있습니다.

IBL이 없는 환경에서 PBR 모델을 로드하면 금속 질감이 검게 보이거나 매우 어색하게 출력될 수 있습니다.

## 4. 실습 예제: 환경광과 모델 로딩

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

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

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

텍스트와 함께 3D 공간을 풍성하게 채워줄 이미지 기반의 객체들에 대해 알아봅니다.

- **[스프라이트](../sprite/index.md)**
