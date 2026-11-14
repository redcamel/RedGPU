import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1794646734270";
import * as RedGPU from "../../../../dist/index.js?t=1794646734270";

/**
 * [KO] Helmets 예제
 * [EN] Helmets example
 *
 * [KO] 여러 GLTF 헬멧 모델을 로드하고 비교 렌더링합니다.
 * [EN] Loads and renders multiple GLTF helmet models for comparison.
 */
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        scene.lightManager.addDirectionalLight(directionalLight);

        loadGLTFGrid(view,
            [
                'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
                'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlightHelmet/glTF/FlightHelmet.gltf',
                'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet.gltf',
                'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf',
            ]
        );

        const renderer = new RedGPU.Renderer();
        const render = () => {

        };
        renderer.start(redGPUContext, render);
        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

function loadGLTFGrid(view, urls, gridSize = 4, spacing = 3) {
    const {redGPUContext, scene} = view;

    const totalCols = Math.min(gridSize, urls.length);
    const totalRows = Math.ceil(urls.length / gridSize);
    const totalWidth = (totalCols - 1) * spacing;
    const totalDepth = (totalRows - 1) * spacing;

    // [KO] GLTF 모델 로드 및 그리드 배치
    // [EN] Load GLTF models and arrange them in a grid
    let loadedNum = 0
    const container = new RedGPU.Display.Mesh(view.redGPUContext)
    view.scene.addChild(container)
    urls.forEach((url, index) => {
        new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
                const mesh = v['resultMesh'];
                container.addChild(mesh);

                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const x = col * spacing - totalWidth / 2;
                const z = row * spacing - totalDepth / 2;

                mesh.x = x;
                mesh.y = 0;
                mesh.z = z;
                if (index === 0) {
                    mesh.setScale(1.5)
                }
                if (index === 1) {
                    mesh.setScale(5)
                    mesh.y = -1.7
                }

                if (loadedNum === urls.length) {
                    RedGPUExampleHelper.fitMeshToScreenCenter(container, view)
                }
            },
            (info) => {
                RedGPUExampleHelper.loadingProgressInfoHandler(info);
            }
        );
    });
}

const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true
    });
};
