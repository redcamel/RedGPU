import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - copyGPUBuffer');

redUnit.testGroup(
    'RedGPU.Util.copyGPUBuffer - Validation',
    (runner) => {
        runner.defineTest('Failure: alignment check (size 5)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const device = redGPUContext.gpuDevice;
                const src = device.createBuffer({size: 5, usage: GPUBufferUsage.COPY_SRC});
                const dst = device.createBuffer({size: 5, usage: GPUBufferUsage.COPY_DST});
                const encoder = device.createCommandEncoder();
                try {
                    RedGPU.Util.copyGPUBuffer(encoder, src, dst);
                    redGPUContext.destroy();
                    run(true);
                } catch (e) {
                    redGPUContext.destroy();
                    run(false);
                }
            });
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.Util.copyGPUBuffer - Integrity',
    (runner) => {
        runner.defineTest('Data integrity check', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, async (redGPUContext) => {
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
                const pass = Array.from(result).every((v, i) => v === testData[i]);
                read.unmap();
                redGPUContext.destroy();
                run(pass);
            });
        }, true);

        runner.defineTest('Copy with different sizes (uses min size and verify)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, async (redGPUContext) => {
                const device = redGPUContext.gpuDevice;
                
                const srcData = new Float32Array([10, 20, 30, 40]); // 16 bytes
                const srcBuffer = device.createBuffer({
                    size: srcData.byteLength,
                    usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true
                });
                new Float32Array(srcBuffer.getMappedRange()).set(srcData);
                srcBuffer.unmap();

                const dstBuffer = device.createBuffer({
                    size: 8, // Only first 2 elements (8 bytes) should be copied
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
                });

                const commandEncoder = device.createCommandEncoder();
                RedGPU.Util.copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer);
                device.queue.submit([commandEncoder.finish()]);

                const readBuffer = device.createBuffer({
                    size: 8,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                });
                const readEncoder = device.createCommandEncoder();
                readEncoder.copyBufferToBuffer(dstBuffer, 0, readBuffer, 0, 8);
                device.queue.submit([readEncoder.finish()]);

                await readBuffer.mapAsync(GPUMapMode.READ);
                const result = new Float32Array(readBuffer.getMappedRange());
                
                const pass = result[0] === 10 && result[1] === 20 && result.length === 2;

                readBuffer.unmap();
                redGPUContext.destroy();
                run(pass);
            });
        }, true);
    }
);