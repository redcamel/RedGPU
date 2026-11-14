import * as RedGPU from "../../../dist/index.js?t=1794650694512";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794650694512";

/**
 * [KO] 독립적인 컨텍스트 영역을 설정하고 이벤트를 연결하는 함수 (최소화된 클로저 패턴)
 * [EN] Function to setup independent context region and bind events (Minimalist Closure pattern)
 */
const setupContext = (containerId, statusMsgId, colorHex, btnDestroyId, btnCreateId) => {
    const container = document.getElementById(containerId);
    const statusMsg = document.getElementById(statusMsgId);
    const btnDestroy = document.getElementById(btnDestroyId);
    const btnCreate = document.getElementById(btnCreateId);

    let activeContext = null;

    // [KO] 초기화 및 구동 함수
    // [EN] Initialization and run function
    const init = () => {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        statusMsg.style.display = 'none';
        container.classList.remove('destroyed');

        RedGPU.init(canvas, (redGPUContext) => {
            activeContext = redGPUContext;

            const controller = new RedGPU.Camera.OrbitController(redGPUContext);
            controller.distance = 6;
            controller.tilt = -15;

            const scene = new RedGPU.Display.Scene();


            scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

            const material = new RedGPU.Material.PhongMaterial(redGPUContext, colorHex);
            const geometry = new RedGPU.Primitive.TorusKnot(redGPUContext, 1, 0.4, 128, 64);
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            scene.addChild(mesh);

            const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
            view.skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
            redGPUContext.addView(view);

            const renderer = new RedGPU.Renderer();
            renderer.start(redGPUContext, () => {
                mesh.rotationY += 1;
            });

            console.log(`[RedGPU] Initialized ${containerId}`);
        });

        btnDestroy.style.display = 'inline-block';
        btnCreate.style.display = 'none';
    };

    // [KO] 소멸 및 리소스 해제 함수
    // [EN] Destruction and resource release function
    const destroy = () => {
        if (activeContext) {
            console.log(`[RedGPU] 💥 Destroying ${containerId}`);
            activeContext.destroy();
            activeContext = null;
        }

        const canvas = container.querySelector('canvas');
        if (canvas) canvas.remove();

        statusMsg.style.display = 'block';
        container.classList.add('destroyed');

        btnDestroy.style.display = 'none';
        btnCreate.style.display = 'inline-block';
    };

    btnDestroy.addEventListener('click', destroy);
    btnCreate.addEventListener('click', init);

    init();
};

const renderTestPane = () => {
    new RedGPUExampleHelper();
};

// [KO] Canvas A(적색) 및 Canvas B(청색)에 대해 각각 초기 실행 및 바인딩
// [EN] Initialize and bind for Canvas A (Red) and Canvas B (Blue) respectively
setupContext('containerA', 'statusA', '#ff3333', 'btnDestroyA', 'btnCreateA');
setupContext('containerB', 'statusB', '#3333ff', 'btnDestroyB', 'btnCreateB');
renderTestPane();
