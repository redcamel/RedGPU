import * as RedGPU from "../../../../../dist/index.js";
import RedGPUExampleHelper from "../../../../exampleHelper/dist/index.js";

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
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

        // [KO] IBL 리소스 생성 및 환경 텍스처를 스카이박스에 연결
        // [EN] Create IBL resource and bind its environment texture to the skybox
        const ibl = new RedGPU.Resource.IBL(
            redGPUContext,
            '../../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
        );
        view.ibl = ibl;
        view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error("Initialization failed:", failReason);
        const errorMessage = document.createElement("div");
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, view) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const skybox = view.skybox;
            const ibl = view.ibl;
            if (!skybox || !ibl) return;

            const folder = pane.addFolder({title: 'SkyBox', expanded: true});
            folder.addBinding(skybox, 'blur', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'opacity', {min: 0, max: 1, step: 0.01});
            folder.addBinding(skybox, 'intensityMultiplier', {min: 0, max: 5, step: 0.1}).on('change', (ev) => {
                ibl.intensityMultiplier = ev.value;
            });
            folder.addBinding(skybox, 'luminance', {min: 0, max: 100000, step: 100}).on('change', (ev) => {
                ibl.luminance = ev.value;
            });
        }
    });
};
