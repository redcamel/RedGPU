import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Initialize');

redUnit.testGroup(
    'RedGPU.init - Success Cases',
    (runner) => {
        runner.defineTest('Success: Initialize and check instance', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const isInstanceOf = redGPUContext instanceof RedGPU.Context.RedGPUContext;
                        redGPUContext.destroy();
                        if (isInstanceOf) run(true);
                        else run(false);
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
                        if (hasManager) run(true);
                        else run(false);
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
                        const pass = redGPUContext.alphaMode === 'premultiplied';
                        redGPUContext.destroy();
                        if (pass) run(true);
                        else run(false);
                    } catch (e) {
                        redGPUContext.destroy();
                        run(e);
                    }
                },
                (error) => run(error),
                undefined,
                'premultiplied'
            );
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.init - Failure Cases',
    (runner) => {
        runner.defineTest('Failure: null canvas', (run) => {
            try {
                RedGPU.init(null, () => run(true), () => run(false));
            } catch (e) {
                run(false);
            }
        }, false);
        
        runner.defineTest('Failure: invalid alphaMode', (run) => {
            const canvas = document.createElement('canvas');
            try {
                RedGPU.init(canvas, () => run(true), () => run(false), undefined, 'invalid-mode');
            } catch (e) {
                run(false);
            }
        }, false);
    }
);