---
title: TextField3D
order: 3
---

# TextField3D

`TextField3D` 는 3D 월드 좌표 (`x, y, z`)에 배치되는 텍스트 디스플레이 객체입니다. 표지판, 캐릭터 이름표, 객체 라벨 등을 표현할 때
사용합니다.

```javascript
const textField = new RedGPU.Display.TextField3D(redGPUContext, "3D World Text");
textField.y = 5;
scene.addChild(textField);
```

---

## 1. 빌보드 및 크기 제어

`TextField3D` 의 화면 출력 크기와 해상도는 `fontSize`, `worldSize`, `usePixelSize` 세 속성의 조합으로 결정됩니다.

| 속성               | 타입      | 기본값  | 설명                                                                                                                            |
|:-------------------|:----------|:--------|:--------------------------------------------------------------------------------------------------------------------------------|
| **`useBillboard`** | `boolean` | `true`  | 카메라가 회전해도 항상 텍스트가 정면을 향하도록 유지할지 여부                                                                   |
| **`fontSize`**     | `number`  | `16`    | 내부 비트맵 텍스처를 생성할 때의 폰트 해상도(`px`). 값이 클수록 텍스처 선명도가 높아집니다.                                     |
| **`worldSize`**    | `number`  | `1`     | `usePixelSize: false` 일 때 적용되는 3D 월드 세로 높이(Unit 단위, 카메라 거리에 따라 원근감 적용)                               |
| **`usePixelSize`** | `boolean` | `false` | 고정 픽셀 크기 모드 사용 여부 (`true` 설정 시 `worldSize` 를 무시하고 `fontSize` 로 생성된 텍스처 픽셀 크기 그대로 화면에 표시) |

```javascript
// 1. 월드 단위 크기 설정 (거리에 따라 원근감 적용)
textField.worldSize = 2;

// 2. 고정 픽셀 크기 설정 (거리에 관계없이 일정한 가독성 유지)
textField.usePixelSize = true;
```

> [!TIP]
> - `usePixelSize: true` 모드에서 글자 크기를 바꾸려면 `worldSize` 가 아닌 `fontSize` 를 조절하세요.
> - `usePixelSize: false` 모드에서는 선명한 화질을 위해 `fontSize` 를 충분히 높은 값 (예: `24 ~ 48`)으로 두고, 3D 공간상의 크기는 `worldSize` 로 조절하는 것이
    좋습니다.

---

## 2. 실습 예제: 3D 텍스트 렌더링 모드 비교

glTF 헬멧 모델 위에 빌보드 해제 (`useBillboard: false`), 월드 크기 (`worldSize`), 고정 픽셀 크기 (`usePixelSize: true`) 세 가지 설정의
`TextField3D` 를 배치한 예제입니다.

<ClientOnly>
<CodePen title="RedGPU Basics - TextField3D Showcase" slugHash="textfield3d-showcase">
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

    // IBL 설정
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    // 헬멧 및 텍스트 필드 그룹 생성 헬퍼 함수
    const createCase = (x, label, color, useBB, usePS) => {
        new RedGPU.GLTFLoader(
            redGPUContext,
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
            (loader) => {
                const mesh = loader.resultMesh;
                mesh.x = x;
                scene.addChild(mesh);
            }
        );

        const text = new RedGPU.Display.TextField3D(redGPUContext, label);
        text.x = x; text.y = 1.5;
        text.background = color;
        text.padding = 15;
        text.useBillboard = useBB;
        text.usePixelSize = usePS;
        scene.addChild(text);
    };

    createCase(-3, "Billboard: OFF", "rgba(255, 0, 0, 0.8)", false, false);
    createCase(0, "World Size", "rgba(0, 204, 153, 0.8)", true, false);
    createCase(3, "Pixel Size", "rgba(0, 102, 255, 0.8)", true, true);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 10;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 관련 예제

- [TextField3D 기본](/RedGPU/examples/3d/textField/textField3D/)
- [TextField3D 크기 모드 비교](/RedGPU/examples/3d/textField/textField3DCompare/)
- [TextField3D 마우스 이벤트](/RedGPU/examples/3d/interaction/mouseEvent/textField3D/)

---

## 다음 단계

- **[파티클 및 라인](../particle/index.md)** : GPU 컴퓨트 셰이더 기반 파티클 (`ParticleEmitter`) 및 3D 곡선 렌더러 (`Line3D`) 활용하기
