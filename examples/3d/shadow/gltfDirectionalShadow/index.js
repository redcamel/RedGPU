import * as RedGPU from "../../../../dist/index.js?t=1770637396475";

/**
 * [KO] GLTF Directional Shadow 예제
 * [EN] GLTF Directional Shadow example
 *
 * [KO] GLTF 모델에 Directional Light 그림자를 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply Directional Light shadows to GLTF models.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        controller.distance = 15;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        addGround(redGPUContext, scene);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', -1, 1);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb', 1, 0);

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext, (time) => {
            redGPUContext.viewList.forEach(view => {
                const {scene} = view;
                let i = scene.numChildren;
                while (i--) {
                    if (i === 0) continue;
                    let testObj = scene.children[i];
                    testObj.rotationY += 0.5;
                }
            });
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {string} url
 * @param {number} xPosition
 * @param {number} yPosition
 */
function loadGLTF(redGPUContext, scene, url, xPosition, yPosition) {
    let mesh;
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            mesh = scene.addChild(v['resultMesh']);
            mesh.x = xPosition;
            mesh.y = yPosition;
            mesh.setCastShadowRecursively(true);
            mesh.setReceiveShadowRecursively(true);
        }
    );
}

/**
 * [KO] 바닥을 추가합니다.
 * [EN] Adds a ground.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 */
const addGround = (redGPUContext, scene) => {
    const ground = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    ground.setScale(200);
    ground.receiveShadow = true;
    scene.addChild(ground);
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import("https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770637396475");
    const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1770637396475");
    setDebugButtons(RedGPU, redGPUContext);
    const {createIblHelper} = await import('../../../exampleHelper/createExample/panes/index.js?t=1770637396475');

    const pane = new Pane();
    const {shadowManager} = targetView.scene;
    const {directionalShadowManager} = shadowManager;

    pane.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
        min: 128,
        max: 2048,
        step: 1
    }).on("change", (ev) => {
        directionalShadowManager.shadowDepthTextureSize = ev.value;
    });
    createIblHelper(pane, targetView, RedGPU, {useLight: true});

};