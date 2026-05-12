import * as RedGPU from "../../../../dist/index.js";
import RedGPUExampleHelper from "../../../exampleHelper2/dist/index.js";

/**
 * [KO] Basic Mesh 예제
 * [EN] Basic Mesh Example
 *
 * [KO] 기본적인 3D 메시 생성 및 속성(위치, 크기, 회전) 제어 방법을 보여줍니다.
 * [EN] Demonstrates basic 3D mesh creation and property control (position, scale, rotation).
 */

// [KO] 캔버스 생성 및 문서에 추가
// [EN] Create canvas and append to document
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// [KO] RedGPU 초기화
// [EN] Initialize RedGPU
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // [KO] 카메라 컨트롤러 생성 (OrbitController)
        // [EN] Create camera controller (OrbitController)
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        // [KO] 씬 및 뷰 생성
        // [EN] Create scene and view
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

        // [KO] 디버그 헬퍼 활성화 (축 및 그리드)
        // [EN] Enable debug helpers (axis and grid)
        view.axis = true;
        view.grid = true;

        // [KO] 컨텍스트에 뷰 추가
        // [EN] Add view to context
        redGPUContext.addView(view);

        // [KO] 샘플 메시 생성
        // [EN] Create sample mesh
        const mesh = createSampleMesh(redGPUContext, scene);

        // [KO] 렌더러 생성 및 루프 시작
        // [EN] Create renderer and start loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직 작성
            // [EN] Write logic to be executed every frame
        };
        renderer.start(redGPUContext, render);

        // [KO] 테스트용 GUI 렌더링
        // [EN] Render GUI for testing
        renderTestPane(redGPUContext, mesh);
    },
    (failReason) => {
        // [KO] 초기화 실패 시 에러 처리
        // [EN] Error handling on initialization failure
        console.error('초기화 실패:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 샘플 메시를 생성합니다.
 * [EN] Creates a sample mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @returns {RedGPU.Display.Mesh}
 */
const createSampleMesh = (redGPUContext, scene) => {
    const material = new RedGPU.Material.BitmapMaterial(
        redGPUContext,
        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
    );

    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 테스트를 위한 GUI 패널을 렌더링합니다.
 * [EN] Renders a GUI panel for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = async (redGPUContext, mesh) => {
    const config = {
        material: 'Bitmap',
        x: mesh.x,
        y: mesh.y,
        z: mesh.z,
        scaleX: mesh.scaleX,
        scaleY: mesh.scaleY,
        scaleZ: mesh.scaleZ,
        rotationX: mesh.rotationX,
        rotationY: mesh.rotationY,
        rotationZ: mesh.rotationZ,
        opacity: 1
    };

    new RedGPUExampleHelper(redGPUContext, {
        guiCallback: (pane) => {
            pane.addBinding(config, 'material', {
                options: {
                    Color: 'Color',
                    Bitmap: 'Bitmap'
                }
            }).on('change', (evt) => {
                if (evt.value === 'Color') {
                    mesh.material = new RedGPU.Material.ColorMaterial(redGPUContext);
                } else {
                    mesh.material = new RedGPU.Material.BitmapMaterial(
                        redGPUContext,
                        new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg')
                    );
                }
            });

            const positionFolder = pane.addFolder({title: 'Position', expanded: true});
            positionFolder.addBinding(config, 'x', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
                mesh.setPosition(evt.value, config.y, config.z);
            });
            positionFolder.addBinding(config, 'y', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
                mesh.setPosition(config.x, evt.value, config.z);
            });
            positionFolder.addBinding(config, 'z', {min: -10, max: 10, step: 0.1}).on('change', (evt) => {
                mesh.setPosition(config.x, config.y, evt.value);
            });

            const scaleFolder = pane.addFolder({title: 'Scale', expanded: true});
            scaleFolder.addBinding(config, 'scaleX', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
                mesh.setScale(evt.value, config.scaleY, config.scaleZ);
            });
            scaleFolder.addBinding(config, 'scaleY', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
                mesh.setScale(config.scaleX, evt.value, config.scaleZ);
            });
            scaleFolder.addBinding(config, 'scaleZ', {min: 0.1, max: 5, step: 0.1}).on('change', (evt) => {
                mesh.setScale(config.scaleX, config.scaleY, evt.value);
            });

            const rotationFolder = pane.addFolder({title: 'Rotation', expanded: true});
            rotationFolder.addBinding(config, 'rotationX', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
                mesh.setRotation(evt.value, config.rotationY, config.rotationZ);
            });
            rotationFolder.addBinding(config, 'rotationY', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
                mesh.setRotation(config.rotationX, evt.value, config.rotationZ);
            });
            rotationFolder.addBinding(config, 'rotationZ', {min: 0, max: 360, step: 0.01}).on('change', (evt) => {
                mesh.setRotation(config.rotationX, config.rotationY, evt.value);
            });
        }
    });
};
