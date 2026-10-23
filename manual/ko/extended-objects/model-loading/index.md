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

`GLTFLoader` 는 웹 3D 표준 포맷인 **glTF**(GL Transmission Format) 2.0 파일 (`.gltf`, `.glb`)을 비동기로 로드하고, PBR
재질, 스켈레탈 (Skinning)·모프 (Morph Target) 애니메이션, 상태 머신 기반 모션 블렌딩을 구성하는 로더입니다.

<ClientOnly>
  <MermaidResponsive :definition="loaderGraph" />
</ClientOnly>

---

## 1. 모델 로드 및 주요 속성

`RedGPU.GLTFLoader` 생성자에 파일 경로와 완료·진행·에러 콜백을 전달하여 모델을 비동기 로드합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

new RedGPU.GLTFLoader(
    redGPUContext,
    'https://.../DamagedHelmet.glb',
    (loader) => {
        scene.addChild(loader.resultMesh);
    },
    (progress) => {
        // 로딩 진행 상태 확인 (progress.model.percent 등)
    },
    (error) => {
        console.error('GLTF 로드 실패:', error);
    }
);
```

| 속성 / 메서드                  | 타입                  | 설명                                                                                                                |
|:-------------------------------|:----------------------|:--------------------------------------------------------------------------------------------------------------------|
| **`resultMesh`**               | `Mesh`                | 로드된 모델의 계층 구조를 담고 있는 루트 `RedGPU.Display.Mesh` 컨테이너                                             |
| **`parsingResult`**            | `Object`              | 파싱된 재질(`materials`), 그룹(`groups`), 텍스처(`textures`), 애니메이션 클립 배열(`animations`: `ClipAnimState[]`) |
| **`playAnimation(clipState)`** | `(clipState) => void` | `parsingResult.animations` 에 포함된 특정 애니메이션 클립(`ClipAnimState`)을 재생합니다.                            |
| **`stopAnimation()`**          | `() => void`          | 현재 재생 중인 모든 애니메이션을 즉시 중지합니다.                                                                   |
| **`destroy()`**                | `() => void`          | 로더가 생성한 애니메이션 트랙 및 참조 리소스를 해제합니다.                                                          |

> [!TIP]
> glTF 모델은 대부분 물리 기반 렌더링 재질 (`PBRMaterial`)을 사용하므로, `View3D` 에 `IBL` 을 함께 설정해야 금속 및 표면 반사가 정상적으로 표현됩니다.

---

## 2. 애니메이션 재생 및 상태 머신

모델에 포함된 애니메이션 클립은 `loader.parsingResult.animations` 에 `ClipAnimState` 배열로 파싱됩니다. 단일 클립은 `loader.playAnimation(clip)` 으로
재생하며, 대기 (`Idle`) ↔ 걷기 (`Walk`) ↔ 달리기 (`Run`) 등 조건부 크로스페이드 전환 (Crossfade Blending)에는 `AnimStateMachine` 을 사용합니다.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext,
    'https://threejs.org/examples/models/gltf/Soldier.glb',
    (loader) => {
        scene.addChild(loader.resultMesh);

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

            // 2. 상태 전이 규칙(duration: 크로스페이드 시간(초), conditions: 전이 조건 함수) 등록
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

## 3. 라이브 데모: IBL과 모델 로딩

`IBL` 환경광과 `SkyBox` 가 적용된 공간에 glTF 헬멧 모델을 로드한 예제입니다.

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

---

## 관련 예제

- [glTF 기본 애니메이션](/RedGPU/examples/gltf/animation/basicAnimations/)
- [애니메이션 상태 머신 모션 블렌딩](/RedGPU/examples/gltf/animation/motionBlending/)
- [키보드 캐릭터 애니메이션 제어](/RedGPU/examples/gltf/animation/keyboardCharacterControl/)
- [Sponza 씬 모델](/RedGPU/examples/gltf/models/sponza/)

---

## 다음 단계

- **[Instancing Mesh](../instanced-mesh/index.md)** : 수만 개의 동일 객체를 단일 드로우 콜로 렌더링하기
