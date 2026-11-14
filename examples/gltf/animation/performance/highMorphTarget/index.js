import * as RedGPU from "../../../../../dist/index.js?t=1794645384845";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1794645384845";

/**
 * [KO] High Morph Target Performance 예제
 * [EN] High Morph Target Performance example
 *
 * [KO] 다수의 모프 타겟 애니메이션 객체를 렌더링하여 성능을 테스트합니다.
 * [EN] Tests performance by rendering a large number of morph target animation objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {

        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 10;
        controller.speedDistance = 0.5

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);
        view.builtInEffectManager.useBloom = true;

        const directionalLight = new RedGPU.Light.DirectionalLight();
        directionalLight.lux = 30000;
        directionalLight.elevation = 3.4;
        directionalLight.azimuth = 147.5;
        directionalLight.color.setColorByHEX('#ffa973');
        scene.lightManager.addDirectionalLight(directionalLight);

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
        const newSkybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
        view.ibl = ibl;
        view.skybox = newSkybox;

        {
            let i = redGPUContext.detector.isMobile ? 25 : 100
            while (i--) {
                loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MorphStressTest/glTF/MorphStressTest.gltf');
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

let num = 0;
const gridSpacingV = 5;
const gridSpacingH = 2;

function getGridPosition(index, totalCount) {
    const gridSize = Math.ceil(Math.sqrt(totalCount));
    const halfGrid = Math.floor(gridSize / 2);

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    const x = (col - halfGrid) * gridSpacingV;
    const z = (row - halfGrid) * gridSpacingH;

    return {x, z};
}

function redistributeGrid(scene) {
    const meshes = scene.children.filter(child => child);
    const totalCount = meshes.length;

    meshes.forEach((mesh, index) => {
        const position = getGridPosition(index, totalCount);
        mesh.x = position.x;
        mesh.z = position.z;
        mesh.y = 0;
    });
}

let first = true
let pane;
let helper;

const renderTestPane = (redGPUContext, targetView) => {
    helper = new RedGPUExampleHelper(redGPUContext, {

        gui: (gui) => {
            pane = gui;
            const moreNum = redGPUContext.detector.isMobile ? 5 : 10;
            pane.addButton({
                title: `Add ${moreNum} MorphStressTest`,
            }).on('click', () => {
                let i = moreNum;
                while (i--) {
                    loadGLTF(targetView, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MorphStressTest/glTF/MorphStressTest.gltf');
                }
            });

            pane.addBinding(targetView.scene.children, 'length', {
                readonly: true,
                label: `Count MorphStressTest`,
                interval: 500
            });
        }
    });
};

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;

    // [KO] 현재 로딩 중인 객체들 중 첫 번째 객체만 프로그레스바를 표시하도록 제한 (성능 및 React 업데이트 루프 방지)
    // [EN] Limit showing progress bar to only the first object being loaded (to prevent performance issues and React update loops)
    const isPrimaryLoader = first;
    if (first) first = false;

    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
            const mesh = result.resultMesh
            result.playAnimation(result.parsingResult.animations[2])

            scene.addChild(mesh)
            num++

            // [KO] 새 메시가 추가될 때마다 전체 격자 재배치
            // [EN] Redistribute the entire grid whenever a new mesh is added
            redistributeGrid(scene);
            
            pane?.refresh();
        },
        (e) => isPrimaryLoader ? RedGPUExampleHelper.loadingProgressInfoHandler(e) : null
    );
}
