import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper2/dist/index.js";

/**
 * [KO] Skybox With IBL 예제
 * [EN] Skybox With IBL example
 *
 * [KO] IBL(Image Based Lighting) 객체를 생성하고, 해당 객체의 environmentTexture를 사용하여 스카이박스를 설정하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create an IBL (Image Based Lighting) object and set up a skybox using its environmentTexture.
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

        // [KO] IBL 객체 생성
        // [EN] Create IBL object
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;

        // [KO] IBL의 environmentTexture를 사용하여 스카이박스 생성 및 설정
        // [EN] Create and set up a skybox using the IBL's environmentTexture
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture, 25000);

        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
        });

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
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.Display.View3D} view
 */
const renderTestPane = async (view) => {
    new RedGPUExampleHelper(view.redGPUContext, {
        RedGPU,
        guiCallback: (pane) => {
            const skybox = view.skybox;
            const ibl = view.ibl;
            if (!skybox || !ibl) return;

            const folder = pane.addFolder({title: 'SkyBox Control (Custom)', expanded: true});

            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});

            // [KO] IBL과 스카이박스 개별 속성 동기화 테스트
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1})
                .on('change', (ev) => { ibl.intensityMultiplier = ev.value; });

            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100})
                .on('change', (ev) => { ibl.luminance = ev.value; });
        }
    });
};
