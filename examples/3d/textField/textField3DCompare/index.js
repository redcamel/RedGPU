import * as RedGPU from "../../../../dist/index.js?t=1784264851335";
import RedGPUExampleHelper from "../../../exampleHelper/dist/index.js?t=1784264851335";

/**
 * [KO] TextField3D 비교 예제 (World Size vs Pixel Size)
 * [EN] TextField3D Comparison Example (World Size vs Pixel Size)
 *
 * [KO] TextField3D의 월드 단위 크기(worldSize)와 고정 픽셀 크기(usePixelSize) 모드의 차이점을 시연합니다.
 * [EN] Demonstrates the difference between World Size (worldSize) and fixed Pixel Size (usePixelSize) modes for TextField3D.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = 12;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        redGPUContext.addView(view);

        // [KO] 월드 사이즈 모드 (왼쪽): 실제 3D 오브젝트처럼 거리에 따라 크기가 변함
        // [EN] World Size Mode (Left): Size changes with distance like an actual 3D object
        const textWorld = new RedGPU.Display.TextField3D(redGPUContext, "World Size Mode");
        textWorld.x = -3;
        textWorld.y = 1;
        textWorld.worldSize = 1.5;
        textWorld.background = 'rgba(255, 0, 0, 0.8)';
        textWorld.padding = 10;
        scene.addChild(textWorld);

        // [KO] 픽셀 사이즈 모드 (오른쪽): 거리에 상관없이 화면상 크기가 고정됨
        // [EN] Pixel Size Mode (Right): Fixed size on screen regardless of distance
        const textPixel = new RedGPU.Display.TextField3D(redGPUContext, "Pixel Size Mode");
        textPixel.x = 3;
        textPixel.y = 1;
        textPixel.usePixelSize = true;
        textPixel.background = 'rgba(0, 102, 255, 0.8)';
        textPixel.padding = 10;
        scene.addChild(textPixel);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext, textWorld, textPixel);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext, textWorld, textPixel) => {
    new RedGPUExampleHelper(redGPUContext, {
        gui: (pane) => {
            const fWorld = pane.addFolder({title: 'World Size Mode (Left)', expanded: true});
            fWorld.addBinding(textWorld, 'text');
            fWorld.addBinding(textWorld, 'worldSize', {min: 0.1, max: 5, step: 0.1});
            fWorld.addBinding(textWorld, 'useBillboard');

            const fPixel = pane.addFolder({title: 'Pixel Size Mode (Right)', expanded: true});
            fPixel.addBinding(textPixel, 'text');
            fPixel.addBinding(textPixel, 'usePixelSize');
            fPixel.addBinding(textPixel, 'useBillboard');
        }
    });
};
