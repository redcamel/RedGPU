import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Util.copyGPUBuffer', () => {
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

    // 동일 크기 GPUBuffer 복사 명령 인코딩 및 큐 제출 정상 동작 검증
    test('copies same-size GPUBuffers without errors', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const device = (window as any).__REDGPU_CTX__.gpuDevice;
            const srcBuffer = device.createBuffer({
                size: 16,
                usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            });
            const dstBuffer = device.createBuffer({
                size: 16,
                usage: GPUBufferUsage.COPY_DST
            });

            const encoder = device.createCommandEncoder();
            RedGPU.Util.copyGPUBuffer(encoder, srcBuffer, dstBuffer);
            device.queue.submit([encoder.finish()]);

            srcBuffer.destroy();
            dstBuffer.destroy();
            return true;
        });

        expect(ok).toBe(true);
    });

    // null 인코더, 가짜 버퍼 객체, 동일 버퍼 인스턴스(src === dst) 전달 시 예외 메시지 검증
    test('rejects null encoder, fake buffer objects, and identical buffer instances', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const device = (window as any).__REDGPU_CTX__.gpuDevice;

            let nullArgsMsg = '';
            try {
                RedGPU.Util.copyGPUBuffer(null, null, null);
            } catch (e: any) {
                nullArgsMsg = e?.message || '';
            }

            let fakeMsg = '';
            try {
                const enc = device.createCommandEncoder();
                RedGPU.Util.copyGPUBuffer(enc, {size: 3}, {size: 3});
            } catch (e: any) {
                fakeMsg = e?.message || '';
            }

            const buf = device.createBuffer({
                size: 16,
                usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
            });
            let sameMsg = '';
            try {
                const enc = device.createCommandEncoder();
                RedGPU.Util.copyGPUBuffer(enc, buf, buf);
            } catch (e: any) {
                sameMsg = e?.message || '';
            }
            buf.destroy();

            return {
                nullArgsOk: nullArgsMsg.includes('must be an instance of GPUCommandEncoder'),
                fakeOk: fakeMsg.includes('must be instances of GPUBuffer'),
                sameOk: sameMsg.includes('different instances')
            };
        });

        expect(res).toEqual({nullArgsOk: true, fakeOk: true, sameOk: true});
    });
});
