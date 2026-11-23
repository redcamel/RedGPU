import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Util.copyGPUBuffer', () => {
    // 동일 크기 GPUBuffer 복사 정상 동작 및 가짜 객체·동일 인스턴스·null 인자 차단 검증
    test('copies same-size GPUBuffers and rejects fake, identical, or null arguments', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            // null GPUCommandEncoder 전달 시 예외 메시지 검증
            let nullArgsMsg = '';
            try {
                RedGPU.Util.copyGPUBuffer(null, null, null);
            } catch (e: any) {
                nullArgsMsg = e?.message || '';
            }

            const canvas = document.createElement('canvas');
            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const device = ctx.gpuDevice;
                            const srcBuffer = device.createBuffer({
                                size: 16,
                                usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
                            });
                            const dstBuffer = device.createBuffer({
                                size: 16,
                                usage: GPUBufferUsage.COPY_DST
                            });

                            // 동일 크기 GPUBuffer 간 복사 명령 인코딩 및 제출 검증
                            const encoder = device.createCommandEncoder();
                            RedGPU.Util.copyGPUBuffer(encoder, srcBuffer, dstBuffer);
                            device.queue.submit([encoder.finish()]);

                            // GPUBuffer 인스턴스가 아닌 가짜 객체 전달 차단 검증
                            let fakeMsg = '';
                            try {
                                const enc2 = device.createCommandEncoder();
                                RedGPU.Util.copyGPUBuffer(enc2, {size: 3}, {size: 3});
                            } catch (e: any) {
                                fakeMsg = e?.message || '';
                            }

                            // 동일 버퍼 인스턴스(src === dst) 복사 차단 검증
                            let sameMsg = '';
                            try {
                                const enc3 = device.createCommandEncoder();
                                RedGPU.Util.copyGPUBuffer(enc3, srcBuffer, srcBuffer);
                            } catch (e: any) {
                                sameMsg = e?.message || '';
                            }

                            srcBuffer.destroy();
                            dstBuffer.destroy();
                            ctx.destroy();

                            resolve({
                                nullArgsOk: nullArgsMsg.includes('must be an instance of GPUCommandEncoder'),
                                fakeOk: fakeMsg.includes('must be instances of GPUBuffer'),
                                sameOk: sameMsg.includes('different instances')
                            });
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });
        });

        expect(result).toEqual({
            nullArgsOk: true,
            fakeOk: true,
            sameOk: true
        });
    });
});
