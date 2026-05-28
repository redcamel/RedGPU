import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Initialize');

redUnit.testGroup(
    'RedGPU.init - Basic Initialization',
    (runner) => {
        runner.defineTest('Success Test: Initialize RedGPUContext with minimal arguments', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const isInstanceOf = redGPUContext instanceof RedGPU.Context.RedGPUContext;
                        redGPUContext.destroy();
                        run(isInstanceOf);
                    } catch (e) {
                        if (redGPUContext) redGPUContext.destroy();
                        run(false, e);
                    }
                },
                (error) => run(false, error)
            );
        }, true);

        runner.defineTest('Success Test: Initialize with alphaMode = opaque', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const mode = redGPUContext.alphaMode;
                        redGPUContext.destroy();
                        run(mode);
                    } catch (e) {
                        if (redGPUContext) redGPUContext.destroy();
                        run(null, e);
                    }
                },
                (error) => run(null, error),
                undefined,
                'opaque'
            );
        }, 'opaque');

        runner.defineTest('Success Test: Initialize with custom requestAdapterOptions', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        const isInstanceOf = redGPUContext instanceof RedGPU.Context.RedGPUContext;
                        redGPUContext.destroy();
                        run(isInstanceOf);
                    } catch (e) {
                        if (redGPUContext) redGPUContext.destroy();
                        run(false, e);
                    }
                },
                (error) => run(false, error),
                undefined,
                'premultiplied',
                {powerPreference: 'low-power'}
            );
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.init - Argument Validation (Negative Testing)',
    (runner) => {
        runner.defineTest('Failure Test: canvas is null', (run) => {
            try {
                RedGPU.init(null, (ctx) => {
                    ctx.destroy();
                    run(true);
                }, (e) => run(false, e));
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Failure Test: canvas is not HTMLCanvasElement', (run) => {
            try {
                RedGPU.init(document.createElement('div'), (ctx) => {
                    ctx.destroy();
                    run(true);
                }, (e) => run(false, e));
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Failure Test: onWebGPUInitialized is null', (run) => {
            const canvas = document.createElement('canvas');
            try {
                RedGPU.init(canvas, null, (e) => run(false, e));
            } catch (e) {
                run(false, e);
            }
        }, false);

        runner.defineTest('Failure Test: onWebGPUInitialized is not a function', (run) => {
            const canvas = document.createElement('canvas');
            try {
                RedGPU.init(canvas, {}, (e) => run(false, e));
            } catch (e) {
                run(false, e);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.init - Resource Cleanup',
    (runner) => {
        runner.defineTest('Success Test: Context destruction cleanup', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(
                canvas,
                (redGPUContext) => {
                    try {
                        redGPUContext.destroy();
                        run(redGPUContext.gpuDevice === null || redGPUContext.gpuDevice === undefined);
                    } catch (e) {
                        run(false, e);
                    }
                },
                (error) => run(false, error)
            );
        }, true);
    }
);
