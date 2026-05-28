import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Core.AController');

redUnit.testGroup(
    'RedGPU.Camera.Core.AController',
    (runner) => {
        class MockController extends RedGPU.Camera.Core.AController {
            constructor(ctx, info) { super(ctx, info); }
        }

        const setup = (callback) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const controller = new MockController(redGPUContext, {});
                    callback(redGPUContext, controller);
                    redGPUContext.destroy();
                } catch (e) {
                    redGPUContext.destroy();
                    throw e;
                }
            }, (error) => { throw error; });
        };

        runner.defineTest('Success Test: Initial state and Getters', (run) => {
            setup((ctx, controller) => {
                const checkCamera = controller.camera instanceof RedGPU.Camera.PerspectiveCamera;
                const checkCoords = controller.x === 0 && controller.y === 0 && controller.z === 0;
                const checkHover = controller.hoveredView === null;
                const checkKeyboard = controller.keyboardActiveView === null;
                run(checkCamera && checkCoords && checkHover && checkKeyboard);
            });
        }, true);

        runner.defineTest('Success Test: coordinate passthrough', (run) => {
            setup((ctx, controller) => {
                controller.camera.setPosition(10, 20, 30);
                run(controller.x === 10 && controller.y === 20 && controller.z === 30);
            });
        }, true);

        runner.defineTest('Success Test: keyboardActiveView Setter/Getter', (run) => {
            setup((ctx, controller) => {
                // Mock View
                const view = { name: 'mockView' };
                controller.keyboardActiveView = view;
                const checkSet = controller.keyboardActiveView === view;
                const checkActive = controller.isKeyboardActiveController === true;
                
                controller.keyboardActiveView = null;
                const checkClear = controller.keyboardActiveView === null && controller.isKeyboardActiveController === false;
                
                run(checkSet && checkActive && checkClear);
            });
        }, true);

        runner.defineTest('Success Test: keyboardProcessedThisFrame property', (run) => {
            setup((ctx, controller) => {
                controller.keyboardProcessedThisFrame = true;
                run(controller.keyboardProcessedThisFrame);
            });
        }, true);

        runner.defineTest('Success Test: destroy method access', (run) => {
            setup((ctx, controller) => {
                try {
                    controller.destroy();
                    run(true);
                } catch (e) { run(false, e); }
            });
        }, true);
    }
);
