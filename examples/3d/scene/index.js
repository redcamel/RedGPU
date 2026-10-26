import * as RedGPU from "../../../dist/index.js?t=1792986333865";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1792986333865";

/**
 * [KO] Scene 예제
 * [EN] Scene example
 *
 * [KO] Scene을 생성하고 배경 색상 등 기본 씬 속성을 설정하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a Scene and configure basic scene properties such as background color.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // [KO] Scene 생성 및 커스텀 배경 색상·투명도(alpha) 설정
        // [EN] Create a Scene and configure custom background color and alpha
        const scene = new RedGPU.Display.Scene();
        scene.useBackgroundColor = true;
        scene.backgroundColor.setColorByHEX('#5259c3');
        scene.backgroundColor.a = 0.5;

        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, (time) => {
        });

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

const renderTestPane = (redGPUContext) => {
    new RedGPUExampleHelper(redGPUContext, {
        scene: true
    });
};
