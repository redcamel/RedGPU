import * as RedGPU from "../../../../../dist/index.js";

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

        scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight())

        {
            let i = redGPUContext.detector.isMobile ? 25 : 100
            while (i--) {
                loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MorphStressTest/glTF/MorphStressTest.gltf');
            }
        }
        const renderer = new RedGPU.Renderer(redGPUContext);
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
const gridSpacingV = 5; // 격자 간격 (고정)
const gridSpacingH = 2; // 격자 간격 (고정)

// 격자 위치 계산 함수
function getGridPosition(index, totalCount) {
    // 전체 개수를 기준으로 격자 크기 계산
    const gridSize = Math.ceil(Math.sqrt(totalCount));
    const halfGrid = Math.floor(gridSize / 2);

    // index를 2D 격자 좌표로 변환
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    const x = (col - halfGrid) * gridSpacingV;
    const z = (row - halfGrid) * gridSpacingH;

    return {x, z};
}

// 모든 메시의 위치를 재계산하는 함수
function redistributeGrid(scene) {
    const meshes = scene.children.filter(child => child); // 유효한 메시들만
    const totalCount = meshes.length;

    meshes.forEach((mesh, index) => {
        const position = getGridPosition(index, totalCount);
        mesh.x = position.x;
        mesh.z = position.z;
        mesh.y = 0;
    });
}

function loadGLTF(view, url) {
    const {redGPUContext, scene} = view;
    new RedGPU.GLTFLoader(redGPUContext, url, (result) => {
        const mesh = result.resultMesh
        result.playAnimation(result.parsingResult.animations[2])

        scene.addChild(mesh)
        num++

        // 새 메시가 추가될 때마다 전체 격자 재배치
        redistributeGrid(scene);

        pane?.refresh()
    });
}

let pane
const renderTestPane = async (redGPUContext, targetView) => {
    const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
    const {setDebugButtons} = await import('../../../../exampleHelper/createExample/panes/index.js');
    setDebugButtons(redGPUContext);
    pane = new Pane();

    const moreNum = redGPUContext.detector.isMobile ? 5 : 10
    pane.addButton({
        title: `Add ${moreNum} BreakDance`,
    }).on('click', () => {
        let i = moreNum
        while (i--) {
            loadGLTF(targetView, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MorphStressTest/glTF/MorphStressTest.gltf');
        }
    })


    pane.addBinding(targetView.scene.children, 'length', {
        disabled: true,
        label: `Count BreakDance`,
        step: 1
    })
};
