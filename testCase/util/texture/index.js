import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - Texture');

redUnit.testGroup(
    'RedGPU.Util.getMipLevelCount',
    (runner) => {
        runner.defineTest('Success: 1024x1024 level check', (run) => {
            try { run(RedGPU.Util.getMipLevelCount(1024, 1024)); } catch (e) { run(null, e); }
        }, 11);
    }
);

redUnit.testGroup(
    'RedGPU.Util.calculateTextureByteSize',
    (runner) => {
        runner.defineTest('Success: rgba8unorm 2x2 check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const texture = redGPUContext.gpuDevice.createTexture({
                        size: [2, 2, 1],
                        format: 'rgba8unorm',
                        usage: GPUTextureUsage.TEXTURE_BINDING
                    });
                    const actual = RedGPU.Util.calculateTextureByteSize(texture);
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 16);
    }
);

redUnit.testGroup(
    'RedGPU.Util.loadAndCreateBitmapImage',
    (runner) => {
        runner.defineTest('Success: Load UV_Grid_Sm.jpg check width', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, async (redGPUContext) => {
                try {
                    const bitmap = await RedGPU.Util.loadAndCreateBitmapImage('../../../examples/assets/UV_Grid_Sm.jpg');
                    const actual = bitmap.width;
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(null, e);
                }
            }, (error) => run(null, error));
        }, 1024);
    }
);