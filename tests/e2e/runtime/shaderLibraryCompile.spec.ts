import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('ShaderLibrary & WGSLParser GPU Compilation', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(() => {
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // #redgpu_include 및 #redgpu_if 전처리 결과를 실제 WebGPU device.createShaderModule() + getCompilationInfo()로 컴파일 검증
    test('preprocesses #redgpu_include + #redgpu_if variants and compiles with zero WebGPU shader errors', async () => {
        const res = await harness.page.evaluate(async () => {
            const ctx = (window as any).__REDGPU_CTX__;
            const wgslParser = ctx.resourceManager.wgslParser;
            const device: GPUDevice = ctx.gpuDevice;

            const source = `
                #redgpu_include math.hash.getHash1D
                #redgpu_include color.linearToSrgbVec3
                #redgpu_include color.srgbToLinearVec3
                #redgpu_include color.getLuminance

                @group(0) @binding(0) var<storage, read_write> outBuf: array<f32, 4>;

                @compute @workgroup_size(1)
                fn main() {
                    let h = getHash1D(42.0);
                    #redgpu_if useSrgbRoundTrip
                        let lin = vec3<f32>(0.25, 0.5, 0.75);
                        let rt = srgbToLinearVec3(linearToSrgbVec3(lin));
                        let lum = getLuminance(rt);
                        outBuf[0] = h;
                        outBuf[1] = rt.x;
                        outBuf[2] = rt.y;
                        outBuf[3] = lum;
                    #redgpu_else
                        outBuf[0] = h;
                        outBuf[1] = 1.0;
                        outBuf[2] = 2.0;
                        outBuf[3] = 3.0;
                    #redgpu_endIf
                }
            `;

            const preprocessed = wgslParser.parse('E2E_SHADER_LIB_TEST', source);
            const defaultCode = preprocessed.defaultSource;
            const variantCode = preprocessed.shaderSourceVariant.getVariant('useSrgbRoundTrip');

            const compileAndCheck = async (code: string, label: string) => {
                const mod = device.createShaderModule({label, code});
                const info = await mod.getCompilationInfo();
                const errors = info.messages
                    .filter((m) => m.type === 'error')
                    .map((m) => m.message);
                return {mod, errors};
            };

            const defCheck = await compileAndCheck(defaultCode, 'E2E_DefaultVariant');
            const varCheck = await compileAndCheck(variantCode, 'E2E_SrgbVariant');

            // 실제 컴퓨트 패스 디스패치 후 GPU 출력 버퍼 Readback 검증
            const outGpuBuf = device.createBuffer({
                size: 16,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
            });
            const readBuf = device.createBuffer({
                size: 16,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            });

            const pipeline = device.createComputePipeline({
                layout: 'auto',
                compute: {module: varCheck.mod, entryPoint: 'main'}
            });
            const bindGroup = device.createBindGroup({
                layout: pipeline.getBindGroupLayout(0),
                entries: [{binding: 0, resource: {buffer: outGpuBuf}}]
            });

            await ctx.commandEncoderManager.immediateSubmit('E2E_ShaderLibDispatch', (enc: GPUCommandEncoder) => {
                const pass = enc.beginComputePass();
                pass.setPipeline(pipeline);
                pass.setBindGroup(0, bindGroup);
                pass.dispatchWorkgroups(1);
                pass.end();
                enc.copyBufferToBuffer(outGpuBuf, 0, readBuf, 0, 16);
            });

            await readBuf.mapAsync(GPUMapMode.READ);
            const gpuOut = Array.from(new Float32Array(readBuf.getMappedRange().slice(0)));
            readBuf.unmap();
            outGpuBuf.destroy();
            readBuf.destroy();

            return {
                defaultErrors: defCheck.errors,
                variantErrors: varCheck.errors,
                conditionalBlocks: preprocessed.conditionalBlocks,
                gpuOut
            };
        });

        expect(res.defaultErrors).toEqual([]);
        expect(res.variantErrors).toEqual([]);
        expect(res.conditionalBlocks).toEqual(['useSrgbRoundTrip']);
        // getHash1D(42.0) in [0, 1], linear->sRGB->linear round-trip preserves 0.25 and 0.5
        expect(res.gpuOut[0]).toBeGreaterThanOrEqual(0);
        expect(res.gpuOut[0]).toBeLessThanOrEqual(1);
        expect(res.gpuOut[1]).toBeCloseTo(0.25, 3);
        expect(res.gpuOut[2]).toBeCloseTo(0.5, 3);
        expect(res.gpuOut[3]).toBeGreaterThan(0.3);
        expect(res.gpuOut[3]).toBeLessThan(0.7);
    });
});
