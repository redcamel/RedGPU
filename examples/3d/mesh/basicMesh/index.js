import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] Basic Mesh 예제
 * [EN] Basic Mesh Example
 *
 * [KO] 기본적인 3D 메시 생성 및 속성(위치, 크기, 회전) 제어 방법을 시연합니다.
 * [EN] Demonstrates basic 3D mesh creation and property control (position, scale, rotation).
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.speedDistance = 0.3;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        // 3. [KO] 샘플 메시 생성
        // [EN] Create Sample Mesh
        const mesh = createSampleMesh(redGPUContext, scene);

        // 4. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        const render = (time) => {
            // [KO] 매 프레임 실행될 로직
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
 * [KO] 실시간 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time property control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = (redGPUContext, mesh) => {
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
        gui: (pane) => {
            // [KO] 재질 변경
            // [EN] Material Change
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

            // [KO] 위치 제어
            // [EN] Position Controls
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

            // [KO] 크기 제어
            // [EN] Scale Controls
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

            // [KO] 회전 제어
            // [EN] Rotation Controls
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
