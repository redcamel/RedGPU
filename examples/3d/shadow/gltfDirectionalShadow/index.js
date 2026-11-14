import * as RedGPU from "../../../../dist/index.js?t=1794639759027";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794639759027";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 20;
        controller.speedDistance = 0.3;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
        redGPUContext.addView(view);

        // [KO] 그림자를 생성할 방향성 조명을 추가합니다.
        // [EN] Add a directional light that will generate shadows.
        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        // [KO] 바닥 및 GLTF 모델 로드
        // [EN] Load ground mesh and GLTF models
        addGround(redGPUContext, scene);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb', -3, 3, 3);
        loadGLTF(redGPUContext, scene, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BrainStem/glTF-Binary/BrainStem.glb', 3, 0, 3);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
            // [KO] 로드된 모델 애니메이션 처리 (첫 번째 자식인 바닥 제외)
            // [EN] Animate loaded models (excluding the ground mesh at index 0)
            let i = scene.numChildren;
            while (i--) {
                if (i === 0) continue;
                const model = scene.children[i];
                model.rotationY += 0.5;
            }
        });

        renderTestPane(redGPUContext, scene);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const loadGLTF = (redGPUContext, scene, url, xPosition, yPosition, scale = 1) => {
    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (v) => {
            const mesh = v['resultMesh'];
            mesh.setScale(scale);
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

const renderTestPane = (redGPUContext, scene) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        directionalShadow: true,
    });
};
