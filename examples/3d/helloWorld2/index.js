import * as RedGPU from "../../../dist/index.js";
import RedGPUExampleHelper from "../../exampleHelper2/dist/index.js";

/**
 * [KO] Hello World 3D 예제 (Helper2 테스트)
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.axis = true;
        view.grid = true;
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        const render = (time) => {
        };
        renderer.start(redGPUContext, render);

        renderTestPane(redGPUContext, view);
    },
    (failReason) => {
        console.error('초기화 실패:', failReason);
    }
);

const renderTestPane = async (redGPUContext, view) => {
    const helper = new RedGPUExampleHelper(redGPUContext,{
        redGPUContext:true
    });
};
