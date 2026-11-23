import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.Core.PostEffectTexturePool', () => {
    // 텍스처 풀 할당·반환·재사용, hitRate/peakActiveCount 집계, releaseAll/clear 및 음수 크기 차단 검증
    test('verifies allocation, release, reuse, hitRate, peakActiveCount, releaseAll, clear, getDetails, and negative dimension guard', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');

            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const pool = new RedGPU.PostEffect.Core.PostEffectTexturePool(ctx);

                            // 1. 초기 상태 카운터가 모두 0인지 확인
                            const initialOk =
                                pool.videoMemorySize === 0 &&
                                pool.activeCount === 0 &&
                                pool.idleCount === 0 &&
                                pool.totalCount === 0 &&
                                pool.allocationCount === 0 &&
                                pool.peakActiveCount === 0 &&
                                pool.hitRate === 0;

                            // 2. 할당 -> 반환 -> 동일 크기 재할당 시 신규 할당 없이 재사용되는지 검증
                            const res1 = pool.allocResult(256, 256);
                            const allocOk = pool.activeCount === 1 && pool.allocationCount === 1;
                            pool.release(res1.texture);
                            const releaseOk = pool.activeCount === 0 && pool.idleCount === 1;
                            pool.allocResult(256, 256);
                            const reuseOk =
                                pool.activeCount === 1 && pool.idleCount === 0 && pool.allocationCount === 1;

                            // 3. clear() 호출 시 모든 GPU 텍스처 및 메모리 통계 초기화 검증
                            pool.clear();
                            const clearedOk =
                                pool.videoMemorySize === 0 &&
                                pool.activeCount === 0 &&
                                pool.idleCount === 0 &&
                                pool.allocationCount === 0;

                            // 4. hitRate(1/3) 및 peakActiveCount(2) 집계 정밀도 검증
                            pool.allocResult(64, 64);
                            const r64 = pool.allocResult(64, 64);
                            pool.release(r64.texture);
                            pool.allocResult(64, 64);
                            const metricsOk =
                                Math.abs(pool.hitRate - 1 / 3) < 1e-4 && pool.peakActiveCount === 2;

                            // 5. releaseAll()로 활성 텍스처 일괄 반환 검증
                            pool.releaseAll();
                            const releaseAllOk = pool.activeCount === 0 && pool.idleCount === 2;

                            // 6. getDetails() 키 포맷 및 음수 크기 입력 차단 검증
                            pool.clear();
                            pool.allocResult(100, 100, 'rgba8unorm');
                            const details = pool.getDetails();
                            const detailsOk =
                                Array.isArray(details) &&
                                details.length === 1 &&
                                details[0].key === '100x100_rgba8unorm_STORAGE';

                            let negativeThrew = false;
                            try {
                                pool.allocResult(-1, 100);
                            } catch {
                                negativeThrew = true;
                            }

                            pool.clear();
                            ctx.destroy();

                            resolve({
                                initialOk,
                                allocOk,
                                releaseOk,
                                reuseOk,
                                clearedOk,
                                metricsOk,
                                releaseAllOk,
                                detailsOk,
                                negativeThrew
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
            initialOk: true,
            allocOk: true,
            releaseOk: true,
            reuseOk: true,
            clearedOk: true,
            metricsOk: true,
            releaseAllOk: true,
            detailsOk: true,
            negativeThrew: true
        });
    });
});
