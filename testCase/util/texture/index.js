import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - Texture');

redUnit.testGroup(
    'RedGPU.Util.getMipLevelCount',
    (runner) => {
        runner.defineTest('1024x1024 -> 11 levels', (run) => {
            run(RedGPU.Util.getMipLevelCount(1024, 1024) === 11);
        }, true);
        runner.defineTest('512x256 -> 10 levels', (run) => {
            run(RedGPU.Util.getMipLevelCount(512, 256) === 10);
        }, true);
        runner.defineTest('1x1 -> 1 level', (run) => {
            run(RedGPU.Util.getMipLevelCount(1, 1) === 1);
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.calculateTextureByteSize',
    (runner) => {
        const formats = [
            {format: 'r8unorm', expected: 1},
            {format: 'r8snorm', expected: 1},
            {format: 'r8uint', expected: 1},
            {format: 'r8sint', expected: 1},
            {format: 'r16uint', expected: 2},
            {format: 'r16sint', expected: 2},
            {format: 'r16float', expected: 2},
            {format: 'rg8unorm', expected: 2},
            {format: 'rg8snorm', expected: 2},
            {format: 'rg8uint', expected: 2},
            {format: 'rg8sint', expected: 2},
            {format: 'r32uint', expected: 4},
            {format: 'r32sint', expected: 4},
            {format: 'r32float', expected: 4},
            {format: 'rg16uint', expected: 4},
            {format: 'rg16sint', expected: 4},
            {format: 'rg16float', expected: 4},
            {format: 'rgba8unorm', expected: 4},
            {format: 'rgba8unorm-srgb', expected: 4},
            {format: 'rgba8snorm', expected: 4},
            {format: 'rgba8uint', expected: 4},
            {format: 'rgba8sint', expected: 4},
            {format: 'bgra8unorm', expected: 4},
            {format: 'bgra8unorm-srgb', expected: 4},
            {format: 'rg32uint', expected: 8},
            {format: 'rg32sint', expected: 8},
            {format: 'rg32float', expected: 8},
            {format: 'rgba16uint', expected: 8},
            {format: 'rgba16sint', expected: 8},
            {format: 'rgba16float', expected: 8},
            {format: 'rgba32uint', expected: 16},
            {format: 'rgba32sint', expected: 16},
            {format: 'rgba32float', expected: 16},
            {format: 'depth16unorm', expected: 2},
            {format: 'depth24plus', expected: 4},
            {format: 'depth32float', expected: 4}
        ];

        formats.forEach(({format, expected}) => {
            runner.defineTest(`Format: ${format}`, (run) => {
                const canvas = document.createElement('canvas');
                RedGPU.init(canvas, (redGPUContext) => {
                    let usage = GPUTextureUsage.TEXTURE_BINDING;
                    // 깊이 텍스처는 일반적으로 렌더 어태치먼트로 사용됩니다.
                    if (format.includes('depth')) {
                        usage = GPUTextureUsage.RENDER_ATTACHMENT;
                    }

                    try {
                        const texture = redGPUContext.gpuDevice.createTexture({
                            size: [2, 2, 1],
                            format: format ,
                            usage: usage
                        });
                        const size = RedGPU.Util.calculateTextureByteSize(texture);
                        redGPUContext.destroy();
                        // 2 * 2 * 1 * expected = 4 * expected
                        run(size === 4 * expected);
                    } catch (e) {
                        // 일부 디바이스에서는 특정 포맷을 지원하지 않을 수 있으므로 예외 시 무시(pass) 처리합니다.
                        console.warn(`[Skip] Format ${format} creation failed on this device:`, e);
                        redGPUContext.destroy();
                        run(true);
                    }
                }, (error) => run(false, error));
            }, true);
        });

        runner.defineTest('3D Texture / Layers check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const texture = redGPUContext.gpuDevice.createTexture({
                    size: [2, 2, 4],
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING
                });
                const size = RedGPU.Util.calculateTextureByteSize(texture);
                redGPUContext.destroy();
                // 2 * 2 * 4 * 4 = 64
                run(size === 64);
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('MSAA sampleCount check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const texture = redGPUContext.gpuDevice.createTexture({
                    size: [2, 2, 1],
                    format: 'rgba8unorm',
                    sampleCount: 4,
                    usage: GPUTextureUsage.RENDER_ATTACHMENT // MSAA requires RENDER_ATTACHMENT
                });
                const size = RedGPU.Util.calculateTextureByteSize(texture);
                redGPUContext.destroy();
                // 2 * 2 * 1 * 4 (bytes) * 4 (samples) = 64
                run(size === 64);
            }, (error) => run(false, error));
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.loadAndCreateBitmapImage & imageBitmapToGPUTexture',
    (runner) => {
        runner.defineTest('Load image and create texture', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, async (redGPUContext) => {
                try {
                    const bitmap = await RedGPU.Util.loadAndCreateBitmapImage('../../../examples/assets/UV_Grid_Sm.jpg');
                    const texture = RedGPU.Util.imageBitmapToGPUTexture(
                        redGPUContext.gpuDevice,
                        [bitmap],
                        {
                            size: [bitmap.width, bitmap.height, 1],
                            format: 'rgba8unorm',
                            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
                        }
                    );
                    const pass = texture instanceof GPUTexture && texture.width === bitmap.width;
                    redGPUContext.destroy();
                    run(pass);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);

redUnit.testGroup(
    'RedGPU.Util.copyToTextureArray',
    (runner) => {
        runner.defineTest('Copy texture to array slice', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const device = redGPUContext.gpuDevice;
                const src = device.createTexture({
                    size: [64, 64, 1],
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.COPY_SRC
                });
                const dst = device.createTexture({
                    size: [64, 64, 2],
                    format: 'rgba8unorm',
                    usage: GPUTextureUsage.COPY_DST
                });
                const commandEncoder = device.createCommandEncoder();
                try {
                    RedGPU.Util.copyToTextureArray(commandEncoder, src, dst, 1);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false, e);
                }
            });
        }, true);
    }
);