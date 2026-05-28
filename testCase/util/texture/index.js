import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - Texture');

redUnit.testGroup(
    'RedGPU.Util.getMipLevelCount',
    (runner) => {
        runner.defineTest('Success Test: 1024x1024', (run) => {
            run(RedGPU.Util.getMipLevelCount(1024, 1024));
        }, 11);

        runner.defineTest('Failure Test: NaN', (run) => {
            try { RedGPU.Util.getMipLevelCount(NaN, 1024); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.calculateTextureByteSize',
    (runner) => {
        runner.defineTest('Success Test: rgba8unorm 2x2', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const texture = redGPUContext.gpuDevice.createTexture({
                        size: [2, 2, 1],
                        format: 'rgba8unorm',
                        usage: GPUTextureUsage.TEXTURE_BINDING
                    });
                    const size = RedGPU.Util.calculateTextureByteSize(texture);
                    redGPUContext.destroy();
                    run(size);
                } catch (e) { redGPUContext.destroy(); run(null, e); }
            }, (error) => run(null, error));
        }, 16);

        runner.defineTest('Failure Test: null', (run) => {
            try { RedGPU.Util.calculateTextureByteSize(null); run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.loadAndCreateBitmapImage',
    (runner) => {
        runner.defineTest('Success Test: Valid URL', (run) => {
            // This test needs an actual image file. We use a known asset from examples.
            const url = '../../../examples/assets/UV_Grid_Sm.jpg';
            RedGPU.Util.loadAndCreateBitmapImage(url).then(bitmap => {
                run(bitmap instanceof ImageBitmap && bitmap.width > 0);
            }).catch(e => run(false, e));
        }, true);

        runner.defineTest('Failure Test: Invalid URL', (run) => {
            RedGPU.Util.loadAndCreateBitmapImage('invalid-url.png').then(() => {
                run(true);
            }).catch(() => run(false));
        }, false);
    }
);
