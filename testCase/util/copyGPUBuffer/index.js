import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../../../dist/index.js";

const redUnit = new RedUnit('RedGPU - Util.copyGPUBuffer');

redUnit.testGroup(
    'copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer)',
    (runner) => {
        // We need a redGPUContext to test buffers. 
        runner.defineTest('Success Test Test: Copy same size buffers', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const device = redGPUContext.gpuDevice;
                    const srcBuffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST });
                    const dstBuffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.COPY_DST });
                    
                    const encoder = device.createCommandEncoder();
                    RedGPU.Util.copyGPUBuffer(encoder, srcBuffer, dstBuffer);
                    
                    // Actually checking the data could be done but copyGPUBuffer just pushes to encoder.
                    // If no error, we consider it a success.
                    run(true);
                } catch (e) {
                    run(false, e);
                } finally {
                    redGPUContext.destroy();
                }
            }, (err) => run(false, err));
        }, true);

        runner.defineTest('Failure Test Test: Pass fake objects instead of GPUBuffer', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const fakeSrc = { size: 3 };
                    const fakeDst = { size: 3 };

                    const encoder = redGPUContext.gpuDevice.createCommandEncoder();
                    RedGPU.Util.copyGPUBuffer(encoder, fakeSrc, fakeDst);
                    run(true);
                } catch (e) {
                    const isCorrectError = e.message.includes('must be instances of GPUBuffer');
                    run(!isCorrectError, e);
                } finally {
                    redGPUContext.destroy();
                }
            }, (err) => run(false, err));
        }, false);
        runner.defineTest('Failure Test Test: Same buffer instances', (run) => {
            const canvas = document.createElement('canvas');
            RedGPU.init(canvas, (redGPUContext) => {
                try {
                    const device = redGPUContext.gpuDevice;
                    const srcBuffer = device.createBuffer({
                        size: 16,
                        usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
                    });
                    
                    const encoder = device.createCommandEncoder();
                    RedGPU.Util.copyGPUBuffer(encoder, srcBuffer, srcBuffer);
                    run(true);
                } catch (e) {
                    const isCorrectError = e.message.includes('different instances');
                    run(!isCorrectError, e);
                } finally {
                    redGPUContext.destroy();
                }
            }, (err) => run(false, err));
        }, false);
        
        runner.defineTest('Failure Test Test: Invalid arguments', (run) => {
            try {
                RedGPU.Util.copyGPUBuffer(null, null, null);
                run(true);
            } catch (e) {
                const isCorrectError = e.message.includes('must be an instance of GPUCommandEncoder');
                run(!isCorrectError, e);
            }
        }, false);
    }
);
