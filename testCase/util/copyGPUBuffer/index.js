import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - copyGPUBuffer');

redUnit.testGroup(
    'RedGPU.Util.copyGPUBuffer - Validation',
    (runner) => {
        runner.defineTest('Failure: alignment check (size 5)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const device = redGPUContext.gpuDevice;
                    const src = device.createBuffer({size: 5, usage: GPUBufferUsage.COPY_SRC});
                    const dst = device.createBuffer({size: 5, usage: GPUBufferUsage.COPY_DST});
                    const encoder = device.createCommandEncoder();
                    RedGPU.Util.copyGPUBuffer(encoder, src, dst);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            }, (error) => run(error));
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.copyGPUBuffer - Integrity',
    (runner) => {
        runner.defineTest('Success: Data integrity check value[0]', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, async (redGPUContext) => {
                try {
                    const device = redGPUContext.gpuDevice;
                    const testData = new Float32Array([1, 2, 3, 4]);
                    const src = device.createBuffer({
                        size: testData.byteLength,
                        usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
                        mappedAtCreation: true
                    });
                    new Float32Array(src.getMappedRange()).set(testData);
                    src.unmap();

                    const dst = device.createBuffer({
                        size: testData.byteLength,
                        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
                    });

                    const encoder = device.createCommandEncoder();
                    RedGPU.Util.copyGPUBuffer(encoder, src, dst);
                    device.queue.submit([encoder.finish()]);

                    const read = device.createBuffer({
                        size: testData.byteLength,
                        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                    });
                    const readEncoder = device.createCommandEncoder();
                    readEncoder.copyBufferToBuffer(dst, 0, read, 0, testData.byteLength);
                    device.queue.submit([readEncoder.finish()]);

                    await read.mapAsync(GPUMapMode.READ);
                    const result = new Float32Array(read.getMappedRange());
                    const actual = result[0];
                    read.unmap();
                    redGPUContext.destroy();
                    run(actual);
                } catch (e) {
                    redGPUContext.destroy();
                    run(e);
                }
            }, (error) => run(error));
        }, 1);
    }
);