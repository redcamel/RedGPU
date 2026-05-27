import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util - copyGPUBuffer');

redUnit.testGroup(
    'RedGPU.Util.copyGPUBuffer',
    (runner) => {
        runner.defineTest('Alignment check (must be multiple of 4)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                const device = redGPUContext.gpuDevice;
                const srcBuffer = device.createBuffer({size: 5, usage: GPUBufferUsage.COPY_SRC});
                const dstBuffer = device.createBuffer({size: 5, usage: GPUBufferUsage.COPY_DST});
                const commandEncoder = device.createCommandEncoder();

                try {
                    RedGPU.Util.copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer);
                    redGPUContext.destroy();
                    run(false, 'Should throw error for size 5');
                } catch (e) {
                    redGPUContext.destroy();
                    run(true);
                }
            }, (error) => run(false, error));
        }, true);

        runner.defineTest('Data integrity check (Verify actual copy)', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, async (redGPUContext) => {
                const device = redGPUContext.gpuDevice;
                
                // 1. 소스 데이터 준비 (Float32Array [1, 2, 3, 4])
                const testData = new Float32Array([1, 2, 3, 4]);
                const srcBuffer = device.createBuffer({
                    size: testData.byteLength,
                    usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true
                });
                new Float32Array(srcBuffer.getMappedRange()).set(testData);
                srcBuffer.unmap();

                // 2. 목적지 버퍼 준비
                const dstBuffer = device.createBuffer({
                    size: testData.byteLength,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
                });

                // 3. copyGPUBuffer 실행
                const commandEncoder = device.createCommandEncoder();
                RedGPU.Util.copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer);
                device.queue.submit([commandEncoder.finish()]);

                // 4. 결과 검증 (목적지 버퍼 읽기)
                const readBuffer = device.createBuffer({
                    size: testData.byteLength,
                    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                });
                const readEncoder = device.createCommandEncoder();
                readEncoder.copyBufferToBuffer(dstBuffer, 0, readBuffer, 0, testData.byteLength);
                device.queue.submit([readEncoder.finish()]);

                await readBuffer.mapAsync(GPUMapMode.READ);
                const result = new Float32Array(readBuffer.getMappedRange());
                
                let pass = true;
                for(let i=0; i<testData.length; i++) {
                    if(result[i] !== testData[i]) {
                        pass = false;
                        break;
                    }
                }

                readBuffer.unmap();
                redGPUContext.destroy();
                run(pass);
            }, (error) => run(false, error));
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
            }, (error) => run(false, error));
        }, true);
    }
);