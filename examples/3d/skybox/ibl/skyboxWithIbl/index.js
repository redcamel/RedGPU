import * as RedGPU from "../../../../../dist/index.js?t=1781132303147";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js?t=1781132303147";

/**
 * [KO] Skybox With IBL 예제
 * [EN] Skybox With IBL example
 *
 * [KO] IBL(Image Based Lighting)의 환경 텍스처를 배경 스카이박스로 활용하는 방법을 시연합니다.
 * [EN] Demonstrates how to utilize the environment texture from IBL (Image Based Lighting) as a background skybox.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. [KO] 카메라 컨트롤러 설정
        // [EN] Setup Camera Controller
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.tilt = 0;

        // 2. [KO] 씬 및 뷰 구성
        // [EN] Configure Scene and View
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // 3. [KO] IBL 리소스 생성
        // [EN] Create IBL Resource
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        // 4. [KO] IBL 환경 텍스처를 사용하여 스카이박스 설정
        // [EN] Setup SkyBox using IBL environment texture
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);

        // 5. [KO] 렌더러 생성 및 루프 시작
        // [EN] Create Renderer and Start Loop
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);

        // 6. [KO] 테스트용 GUI 렌더링
        // [EN] Render Test GUI
        renderTestPane(view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] IBL과 스카이박스의 속성 제어를 위한 GUI를 구성합니다.
 * [EN] Configures GUI for IBL and SkyBox property control.
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = (view) => {
    new RedGPUExampleHelper(view.redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            const ibl = view.ibl;
            if (!skybox || !ibl) return;

            const folder = pane.addFolder({title: 'SkyBox Control', expanded: true});

            // [KO] 스카이박스 단독 속성 제어
            // [EN] SkyBox independent properties
            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});

            // [KO] IBL과 스카이박스 동기화 속성 제어
            // [EN] Properties synchronized between IBL and SkyBox
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1})
                .on('change', (ev) => { ibl.intensityMultiplier = ev.value; });

            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100})
                .on('change', (ev) => { ibl.luminance = ev.value; });
        }
    });
};
