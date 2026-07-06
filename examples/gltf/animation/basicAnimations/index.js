import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783323704031";
import * as RedGPU from "../../../../dist/index.js?t=1783323704031";
/**
 * [KO] Basic Animations 예제
 * [EN] Basic Animations example
 *
 * [KO] GLTF 모델의 기본 애니메이션 재생을 시연합니다.
 * [EN] Demonstrates basic animation playback of GLTF models.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        const glbUrls = [
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedCube/glTF/AnimatedCube.gltf',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedMorphCube/glTF-Binary/AnimatedMorphCube.glb',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/AnimatedTriangle/glTF/AnimatedTriangle.gltf',
            'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoxAnimated/glTF-Binary/BoxAnimated.glb',
        ];

        loadGLTFGrid(view, glbUrls);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

/**
 * [KO] GLTF 모델들을 그리드 형태로 로드합니다.
 * [EN] Loads GLTF models in a grid layout.
 * @param {RedGPU.Display.View3D} view
 * @param {string[]} urls
 * @param {number} gridSize
 * @param {number} spacing
 */
function loadGLTFGrid(view, urls, gridSize = 5, spacing = 5) {
    const {redGPUContext, scene} = view;

    const totalCols = Math.min(gridSize, urls.length);
    const totalRows = Math.ceil(urls.length / gridSize);
    const totalWidth = (totalCols - 1) * spacing;
    const totalDepth = (totalRows - 1) * spacing;

    urls.forEach((url, index) => {
        new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
                const mesh = result.resultMesh;
                scene.addChild(mesh);

                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const x = col * spacing - totalWidth / 2;
                const z = row * spacing - totalDepth / 2;

                mesh.x = x;
                mesh.y = 0;
                mesh.z = z;
            },
            RedGPUExampleHelper.loadingProgressInfoHandler
        );
    });
}

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = (redGPUContext, targetView) => {
    new RedGPUExampleHelper(redGPUContext, {
        RedGPU: RedGPU,
        ibl: true,
        skybox: true,
    });
};