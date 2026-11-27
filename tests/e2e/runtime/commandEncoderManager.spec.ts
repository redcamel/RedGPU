import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('CommandEncoderManager', () => {
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

    // 동일 페이즈 내 인코더 재사용, 다중 페이즈 통계 수집 및 submitAll() 일괄 제출 검증
    test('reuses encoder within same phase, tracks pass stats, and batches submitAll()', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const cem = ctx.commandEncoderManager;
            const {COMMAND_ENCODER_TYPE} = RedGPU.CommandEncoderManager;

            cem.resetAll();

            let enc1: GPUCommandEncoder | null = null;
            let enc2: GPUCommandEncoder | null = null;
            cem.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (enc: GPUCommandEncoder) => {
                enc1 = enc;
            });
            cem.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (enc: GPUCommandEncoder) => {
                enc2 = enc;
            });

            cem.addPreProcessComputePass('TestPreCompute', () => {
            });
            cem.addPostProcessComputePass('TestPostCompute', () => {
            });

            const batchStats = cem.submitAll();
            const secondSubmit = cem.submitAll();

            return {
                sameEncoderReused: enc1 !== null && enc1 === enc2,
                resourceRawUsages: batchStats?.phases?.RESOURCE?.['Raw Usages'],
                resourceCmdBuffers: batchStats?.phases?.RESOURCE?.['Command Buffers'],
                preComputeCount: batchStats?.phases?.PRE_PROCESS?.['Compute Passes']?.count,
                preComputeLabels: batchStats?.phases?.PRE_PROCESS?.['Compute Passes']?.list,
                postComputeCount: batchStats?.phases?.POST_PROCESS?.['Compute Passes']?.count,
                secondSubmitIsNull: secondSubmit === null
            };
        });

        expect(res).toEqual({
            sameEncoderReused: true,
            resourceRawUsages: 2,
            resourceCmdBuffers: 1,
            preComputeCount: 1,
            preComputeLabels: ['TestPreCompute'],
            postComputeCount: 1,
            secondSubmitIsNull: true
        });
    });

    // 중첩 패스 호출 시 새 인코더 자동 분리 및 활성 패스 중 submit() 호출 차단 검증
    test('spawns separate encoder for nested pass and throws if submit() called during active pass', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const cem = ctx.commandEncoderManager;
            const {COMMAND_ENCODER_TYPE} = RedGPU.CommandEncoderManager;

            cem.resetAll();

            let activeSubmitError = '';
            cem.addPreProcessComputePass('OuterCompute', () => {
                try {
                    cem.submit(COMMAND_ENCODER_TYPE.PRE_PROCESS);
                } catch (e: any) {
                    activeSubmitError = e?.message || '';
                }
                cem.addPreProcessComputePass('NestedCompute', () => {
                });
            });

            const stats = cem.submit(COMMAND_ENCODER_TYPE.PRE_PROCESS);
            return {
                hasActiveSubmitError: activeSubmitError.includes('while a pass is still active'),
                commandBuffers: stats?.['Command Buffers'],
                computeCount: stats?.['Compute Passes']?.count
            };
        });

        expect(res).toEqual({
            hasActiveSubmitError: true,
            commandBuffers: 2,
            computeCount: 2
        });
    });

    // addDeferredDestroy() 등록 리소스가 submitAll() 완료 시 일괄 destroy() 되는지 검증
    test('executes deferred destroy callbacks on submitAll() and reports deferredDestroyCount', async () => {
        const res = await harness.page.evaluate(() => {
            const ctx = (window as any).__REDGPU_CTX__;
            const cem = ctx.commandEncoderManager;
            cem.resetAll();

            let destroyedCount = 0;
            cem.addDeferredDestroy({
                destroy: () => {
                    destroyedCount++;
                }
            });
            cem.addDeferredDestroy({
                destroy: () => {
                    destroyedCount++;
                }
            });

            const beforeSubmit = destroyedCount;
            const stats = cem.submitAll();
            const afterSubmit = destroyedCount;
            const secondSubmit = cem.submitAll();

            return {
                beforeSubmit,
                afterSubmit,
                reportedCount: stats?.deferredDestroyCount,
                secondSubmitIsNull: secondSubmit === null
            };
        });

        expect(res).toEqual({
            beforeSubmit: 0,
            afterSubmit: 2,
            reportedCount: 2,
            secondSubmitIsNull: true
        });
    });

    // immediateSubmit()으로 GPU 버퍼 복사 실행 후 MAP_READ로 실제 GPU 데이터 Readback 검증
    test('immediateSubmit() executes GPU copy commands and resolves after GPU work completes', async () => {
        const values = await harness.page.evaluate(async () => {
            const ctx = (window as any).__REDGPU_CTX__;
            const device: GPUDevice = ctx.gpuDevice;
            const cem = ctx.commandEncoderManager;

            const payload = new Float32Array([11.5, -22.25, 33.75, 44.0]);
            const srcBuf = device.createBuffer({
                size: payload.byteLength,
                usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            });
            const readBuf = device.createBuffer({
                size: payload.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            });

            device.queue.writeBuffer(srcBuf, 0, payload);
            await cem.immediateSubmit('E2E_ImmediateCopy', (enc: GPUCommandEncoder) => {
                enc.copyBufferToBuffer(srcBuf, 0, readBuf, 0, payload.byteLength);
            });

            await readBuf.mapAsync(GPUMapMode.READ);
            const result = Array.from(new Float32Array(readBuf.getMappedRange().slice(0)));
            readBuf.unmap();
            srcBuf.destroy();
            readBuf.destroy();
            return result;
        });

        expect(values).toEqual([11.5, -22.25, 33.75, 44.0]);
    });
});
