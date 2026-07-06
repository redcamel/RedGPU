import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] GLTF Directional Light 그림자 예제
 * [EN] GLTF Directional Light Shadow example
 *
 * [KO] GLTF 모델에 Directional Light에 의한 실시간 그림자를 적용하고 설정하는 방법을 보여줍니다.
 * [EN] Demonstrates how to apply and configure real-time shadows from a Directional Light on GLTF models.
 */

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 카메라 및 뷰 설정
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 15;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 2. 조명 설정
        // [KO] 그림자를 생성할 방향성 조명을 추가합니다.
        // [EN] Add a directional light that will generate shadows.
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // 3. 바닥 및 GLTF 모델 로드
        addGround(redGPUContext, scene);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', -1, 1);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb', 1, 0);

        // 4. 애니메이션 렌더 루프 및 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // 로드된 모델들의 애니메이션 처리 (첫 번째 자식인 바닥 제외)
            let i = scene.numChildren;
            while (i--) {
                if (i === 0) continue; // 바닥 메시 제외
                const model = scene.children[i];
                model.rotationY += 0.5;
            }
        });

        // 5. 테스트 GUI 설정
        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] GLTF 모델을 로드하고 그림자 설정을 적용합니다.
 * [EN] Loads a GLTF model and applies shadow settings.
 */
const loadGLTF = (redGPUContext, scene, url, xPosition, yPosition) => {
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            const mesh = v['resultMesh'];
            mesh.x = xPosition;
            mesh.y = yPosition;

            // [KO] 모델의 모든 하위 노드에 그림자 생성 및 수신 설정을 적용합니다.
            // [EN] Apply shadow casting and receiving settings to all child nodes of the model.
            mesh.setCastShadowRecursively(true);
            mesh.setReceiveShadowRecursively(true);

            scene.addChild(mesh);
        }
    );
};

/**
 * [KO] 그림자를 수신할 바닥 메시를 추가합니다.
 * [EN] Adds a ground mesh to receive shadows.
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
 */
const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
        gui: (pane) => {
            const {shadowManager} = scene;
            const {directionalShadowManager} = shadowManager;

            const folder = pane.addFolder({title: 'Directional Shadow', expanded: true});
            folder.addBinding(directionalShadowManager, 'shadowDepthTextureSize', {
                min: 128,
                max: 4096,
                step: 1,
                label: 'Texture Size'
            });
            folder.addBinding(directionalShadowManager, 'strength', {
                min: 0.0,
                max: 1.0,
                step: 0.01,
                label: 'Shadow Strength'
            });
            folder.addBinding(directionalShadowManager, 'filterScale', {
                min: 0.0,
                max: 15.0,
                step: 0.1,
                label: 'Filter Scale'
            });
        }
    });
};
