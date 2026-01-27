import * as RedGPU from "../../../../dist/index.js?t=1769498378009";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller); // 3D View로 변경
        redGPUContext.addView(view);

        // Texture와 Material 준비
        const texture_base = new RedGPU.Resource.BitmapTexture(
            redGPUContext,
            '../../../assets/UV_Grid_Sm.jpg'
        );
        const material_base = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_base); // 3D Material 사용

        // 중앙 Mesh 생성 (Box 예: 사각형 메쉬)
        const base = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2), material_base);

        scene.addChild(base); // Mesh를 Scene에 추가

        // Material Tint 설정 (색상 적용)
        base.material.tint.setColorByRGBA(255, 128, 0, 1);

        // 하위 Mesh 생성 (작은 Box)
        const material_subChild = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_base);
        material_subChild.baseTexture = texture_base;

        const subChild = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), material_subChild);

        subChild.setPosition(1.5, 1.5, 0);
        base.addChild(subChild); // 자식 Mesh 추가

        // Tint 테스트용 Tweakpane 설정
        renderTestPane(redGPUContext, base);

        // 애니메이션 설정 (회전)
        const renderer = new RedGPU.Renderer(redGPUContext);
        const render = () => {
            base.rotation.y += 1; // Y축 회전
            base.rotation.z += 0.5; // Z축 회전
        };
        renderer.start(redGPUContext, render);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

// Tint 조작용 Tweakpane 구성
const renderTestPane = async (redGPUContext, mesh) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1769498378009");
    const pane = new Pane();
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1769498378009");
    setDebugButtons(RedGPU, redGPUContext);
    // Tint 테스트 추가
    const folder = pane.addFolder({title: "Material Tint Test"});
    const targetTint = mesh.material.tint;
    const tintSettings = {
        tintR: targetTint.r,
        tintG: targetTint.g,
        tintB: targetTint.b,
        tintA: targetTint.a,
        tint: {r: targetTint.r, g: targetTint.g, b: targetTint.b, a: targetTint.a},
        useTint: mesh.material.useTint,
        tintBlendMode: RedGPU.Material.TINT_BLEND_MODE[mesh.material.tintBlendMode] // Default TINT_BLEND_MODE index
    };

    const refresh = () => {
        tintSettings.tintR = targetTint.r;
        tintSettings.tintG = targetTint.g;
        tintSettings.tintB = targetTint.b;
        tintSettings.tintA = targetTint.a;
        tintSettings.tint.r = targetTint.r;
        tintSettings.tint.g = targetTint.g;
        tintSettings.tint.b = targetTint.b;
        tintSettings.tint.a = targetTint.a;
        pane.refresh();
    };

    // useTint 토글
    folder.addBinding(tintSettings, "useTint", {label: "Use Tint"}).on("change", (ev) => {
        mesh.material.useTint = ev.value; // 사용 여부 반영
    });
    folder.addBinding(tintSettings, 'tintBlendMode', {
        label: 'tintBlendMode',
        options: RedGPU.Material.TINT_BLEND_MODE,
    }).on('change', (ev) => {
        // Find the key that corresponds to the selected value
        const selectedKey = Object.keys(RedGPU.Material.TINT_BLEND_MODE).find(
            (key) => RedGPU.Material.TINT_BLEND_MODE[key] === ev.value
        );
        console.log(`Selected Tint Mode: ${selectedKey}`); // Log the key name

        // Apply the value to the material
        mesh.material.tintBlendMode = ev.value; // TINT_BLEND_MODE 값 반영
        refresh();
    });
    // Tint 컬러 슬라이더 구성
    folder.addBinding(tintSettings, "tintR", {label: "Tint R", min: 0, max: 255, step: 1}).on("change", (ev) => {
        mesh.material.tint.r = ev.value;
        refresh();
    });
    folder.addBinding(tintSettings, "tintG", {label: "Tint G", min: 0, max: 255, step: 1}).on("change", (ev) => {
        mesh.material.tint.g = ev.value;
        refresh();
    });
    folder.addBinding(tintSettings, "tintB", {label: "Tint B", min: 0, max: 255, step: 1}).on("change", (ev) => {
        mesh.material.tint.b = ev.value;
        refresh();
    });
    folder.addBinding(tintSettings, "tintA", {
        label: "Tint A (Alpha)",
        min: 0,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        mesh.material.tint.a = ev.value;
        refresh();
    });
    folder.addBinding(tintSettings, "tint", {
        picker: "inline",
        view: "color",
        expanded: true
    }).on("change", (ev) => {
        const r = Math.floor(ev.value.r);
        const g = Math.floor(ev.value.g);
        const b = Math.floor(ev.value.b);
        const a = ev.value.a;
        mesh.material.tint.setColorByRGBA(r, g, b, a);
        refresh();
    });

};
