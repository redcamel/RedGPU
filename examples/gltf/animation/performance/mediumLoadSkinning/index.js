import * as RedGPU from "../../../../../dist/index.js?t=1783496184998";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1783496184998";

/**
 * [KO] Medium Load Skinning 예제
 * [EN] Medium Load Skinning example
 *
 * [KO] 중간 정도 부하를 가진 스키닝 애니메이션 객체를 다수 렌더링하여 성능을 테스트합니다.
 * [EN] Tests performance by rendering multiple skinning animation objects with medium load.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true
        redGPUContext.addView(view);

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
        view.ibl = ibl;
        view.skybox = newSkybox;

        {
            let i = redGPUContext.detector.isMobile ? 200 : 500
            while (i--) {
                loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf');
            }
        }
        const renderer = new RedGPU.Renderer();
        const render = () => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('RedGPU initialization failed:', failReason);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = failReason;
        document.body.appendChild(errorDiv);
    }
);

let num = 0
let first = true
let pane;
let helper;

/**
 * [KO] 테스트용 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.View3D} targetView
 */
const renderTestPane = (redGPUContext, targetView) => {
    helper = new RedGPUExampleHelper(redGPUContext, {
        gui: (gui) => {
            pane = gui;
            const moreNum = redGPUContext.detector.isMobile ? 10 : 50;
            pane.addButton({
                title: `Add ${moreNum} CesiumMan`,
            }).on('click', () => {
                let i = moreNum;
                while (i--) {
                    loadGLTF(targetView, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumMan/glTF/CesiumMan.gltf');
                }
            });

            pane.addBinding(targetView.scene.children, 'length', {
                readonly: true,
                label: `Count CesiumMan`,
                interval: 500
            });
        }
    });
};

/**
 * [KO] GLTF 모델을 로드합니다.
 * [EN] Loads a GLTF model.
 * @param {RedGPU.Display.View3D} view
 * @param {string} url
 */
function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    
    // [KO] 현재 로딩 중인 객체들 중 첫 번째 객체만 프로그레스바를 표시하도록 제한 (성능 및 React 업데이트 루프 방지)
    // [EN] Limit showing progress bar to only the first object being loaded (to prevent performance issues and React update loops)
    const isPrimaryLoader = first;
    if (first) first = false;

    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            if (num !== 0) {
                mesh.x = Math.random() * 30 - 15
                mesh.z = Math.random() * 30 - 15
            }
            num++
            pane?.refresh()
        },
        (e) => isPrimaryLoader ? RedGPUExampleHelper.loadingProgressInfoHandler(e) : null
    );
}
