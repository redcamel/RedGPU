import * as RedGPU from "../../../../dist/index.js?t=1781137785306";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1781137785306";

/**
 * [KO] Bitmap Material 예제
 * [EN] Bitmap Material example
 *
 * [KO] BitmapMaterial의 기본적인 사용법과 런타임 텍스처 교체 기능을 시연합니다.
 * [EN] Demonstrates the basic usage of BitmapMaterial and runtime texture replacement.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 5;
        controller.speedDistance = 0.1;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 샘플 메시 생성
        // [EN] Create Sample Mesh
        const mesh = createSampleMesh(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 로직
            // [EN] Logic per frame
        };
        renderer.start(redGPUContext, render);

        // 5. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(redGPUContext, mesh);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 샘플 메시를 생성하여 씬에 추가합니다.
 * [EN] Creates a sample mesh and adds it to the scene.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createSampleMesh = (redGPUContext, scene) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

    // [KO] 양면 렌더링 설정 (박스 내부 확인용)
    // [EN] Set cullMode to none (to see inside the box)
    mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 실시간 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time property control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = (redGPUContext, mesh) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            // [KO] 투명도 조절
            // [EN] Opacity Control
            pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01});

            // [KO] 텍스처 교체 테스트 리스트
            // [EN] Texture Swap Test List
            const textures = [
                {name: 'set diffuseTexture : png', path: '../../../assets/imageFormat/webgpu.png'},
                {name: 'set diffuseTexture : jpg', path: '../../../assets/imageFormat/webgpu.jpg'},
                {name: 'set diffuseTexture : webp', path: '../../../assets/imageFormat/webgpu.webp'},
                {name: 'set diffuseTexture : svg', path: '../../../assets/imageFormat/webgpu.svg'},
            ];

            const folder = pane.addFolder({title: 'Textures'});
            textures.forEach(({name, path}) => {
                folder.addButton({title: name}).on('click', () => {
                    // [KO] 새로운 비트맵 텍스처 할당
                    // [EN] Assign new BitmapTexture
                    mesh.material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, path);
                    console.log(`Texture applied: ${path}`);
                });
            });
        }
    });
};
