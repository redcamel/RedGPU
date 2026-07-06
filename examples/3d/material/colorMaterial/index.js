import * as RedGPU from "../../../../dist/index.js?t=1783326645983";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1783326645983";

/**
 * [KO] Color Material 예제
 * [EN] Color Material example
 *
 * [KO] ColorMaterial의 기본적인 사용법과 다양한 색상 지정 메서드를 시연합니다.
 * [EN] Demonstrates the basic usage of ColorMaterial and various color setting methods.
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
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
    const geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2);
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    return mesh;
};

/**
 * [KO] 실시간 색상 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for real-time color control.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} mesh
 */
const renderTestPane = (redGPUContext, mesh) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const params = {
                color: {r: 255, g: 0, b: 0},
            };

            // [KO] UI 값을 현재 머티리얼 색상에 동기화
            // [EN] Sync UI values with current material color
            const refreshUI = () => {
                params.color.r = mesh.material.color.r;
                params.color.g = mesh.material.color.g;
                params.color.b = mesh.material.color.b;
                pane.refresh();
            };

            // [KO] 컬러 피커 바인딩
            // [EN] Color Picker Binding
            pane.addBinding(params, 'color', {
                picker: 'inline',
                view: 'color',
                expanded: true,
            }).on('change', (ev) => {
                const {r, g, b} = ev.value;
                mesh.material.color.setColorByRGB(Math.floor(r), Math.floor(g), Math.floor(b));
                refreshUI();
            });

            // [KO] RGB 개별 슬라이더
            // [EN] Individual RGB Sliders
            ['r', 'g', 'b'].forEach(key => {
                pane.addBinding(params.color, key, {min: 0, max: 255, step: 1})
                    .on('change', (e) => {
                        mesh.material.color[key] = e.value;
                        refreshUI();
                    });
            });

            // [KO] 투명도 조절
            // [EN] Opacity Control
            pane.addBinding(mesh.material, 'opacity', {min: 0, max: 1, step: 0.01});

            // [KO] 다양한 색상 설정 메서드 테스트
            // [EN] Various Color Setting Method Tests
            const buttonFolder = pane.addFolder({title: 'Color Methods'});
            
            buttonFolder.addButton({title: 'setColorByRGB(0, 128, 255)'})
                .on('click', () => {
                    mesh.material.color.setColorByRGB(0, 128, 255);
                    refreshUI();
                });

            buttonFolder.addButton({title: 'setColorByHEX("#ff00ff")'})
                .on('click', () => {
                    mesh.material.color.setColorByHEX('#ff00ff');
                    refreshUI();
                });

            buttonFolder.addButton({title: 'setColorByRGBString("rgb(34, 139, 34)")'})
                .on('click', () => {
                    mesh.material.color.setColorByRGBString('rgb(34, 139, 34)');
                    refreshUI();
                });
        }
    });
};
