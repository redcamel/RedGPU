import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Initialize');

redUnit.testGroup(
    'RedGPU.init - Success Cases',
    (runner) => {
        runner.defineTest('Success: Initialize RedGPUContext', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const isInstanceOf = redGPUContext instanceof RedGPU.Context.RedGPUContext;
                        redGPUContext.destroy();
                        run(isInstanceOf);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(e);
                    }
                },
                (error) => run(error)
            );
        }, true);

        runner.defineTest('Success: Check antialiasingManager existence', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const hasManager = redGPUContext.antialiasingManager instanceof RedGPU.Antialiasing.AntialiasingManager;
                        redGPUContext.destroy();
                        run(hasManager);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(e);
                    }
                },
                (error) => run(error)
            );
        }, true);

        runner.defineTest('Success: Check alphaMode: premultiplied', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const mode = redGPUContext.alphaMode;
                        redGPUContext.destroy();
                        run(mode);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(e);
                    }
                },
                (error) => run(error),
                undefined,
                'premultiplied'
            );
        }, 'premultiplied');
    }
);

redUnit.testGroup(
    'RedGPU.init - Failure Cases',
    (runner) => {
        runner.defineTest('Failure: null canvas', (run) => {
            try {
                RedGPU.init(null, () => run(true), (e) => run(false,e));
            } catch (e) {
                run(false);
            }
        }, false);
        
        runner.defineTest('Failure: invalid alphaMode', (run) => {
            const canvas = document.createElement('canvas');
            try {
                RedGPU.init(canvas, () => run(true), (e) => run(false,e), undefined, 'invalid-mode');
            } catch (e) {
                run(false);
            }
        }, false);
    }
);