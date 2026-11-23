import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Resource.GlobalStorageBufferManager', () => {
    // 초기화, LIFO 슬롯 재사용, 연속 리사이즈 데이터 보존, 오프셋/혼합 쓰기, 스트레스, 더티 트래킹 및 경계 차단 검증
    test('verifies init, LIFO slot reuse, cascading resize retention, internal offsets, mixed float/uint, stress, dirty tracking, resize callback, and boundary/limit guards', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            const canvas = document.createElement('canvas');
            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            // 1. 초기화 및 GPUBuffer 생성 검증
                            const m1 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 256, 128, 'TEST_BUFFER');
                            const initOk =
                                m1.totalSlotCount === 128 &&
                                m1.elementSize === 256 &&
                                m1.label === 'TEST_BUFFER' &&
                                m1.gpuBuffer instanceof GPUBuffer;

                            // 2. LIFO 방식 슬롯 해제 및 우선 재할당 검증
                            const m2 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 256, 10, 'TEST_ALLOC');
                            const s0 = m2.allocateSlot();
                            const s1 = m2.allocateSlot();
                            m2.allocateSlot();
                            m2.freeSlot(s1.index);
                            m2.freeSlot(s0.index);
                            const r0 = m2.allocateSlot();
                            const r1 = m2.allocateSlot();
                            const r2 = m2.allocateSlot();
                            const lifoOk = r0.index === 0 && r1.index === 1 && r2.index === 3;

                            // 3. 다단계 연속 리사이즈(1 -> 2 -> 4) 후 기존 CPU 백킹 데이터 보존 검증
                            const m3 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 1, 'TEST_CASCADE');
                            const c0 = m3.allocateSlot();
                            m3.updateFloatData(c0.index, new Float32Array([1.1, 2.2, 3.3, 4.4]));
                            const c1 = m3.allocateSlot();
                            m3.updateFloatData(c1.index, new Float32Array([5.5, 6.6, 7.7, 8.8]));
                            m3.allocateSlot();
                            const v3 = new Float32Array(m3.cpuData);
                            const cascadeOk =
                                m3.totalSlotCount === 4 &&
                                Math.abs(v3[0] - 1.1) < 1e-4 &&
                                Math.abs(v3[3] - 4.4) < 1e-4 &&
                                Math.abs(v3[4] - 5.5) < 1e-4 &&
                                Math.abs(v3[7] - 8.8) < 1e-4;

                            // 4. 슬롯 내부 오프셋 지정 쓰기 정밀 매핑 검증
                            const m4 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 32, 2, 'TEST_OFFSET');
                            m4.allocateSlot();
                            const o1 = m4.allocateSlot();
                            m4.updateFloatData(o1.index, new Float32Array([9.9, 8.8, 7.7]), 2);
                            const v4 = new Float32Array(m4.cpuData);
                            const offsetOk =
                                Math.abs(v4[10] - 9.9) < 1e-4 &&
                                Math.abs(v4[11] - 8.8) < 1e-4 &&
                                Math.abs(v4[12] - 7.7) < 1e-4 &&
                                v4[9] === 0;

                            // 5. 동일 슬롯 내 Float32/Uint32 파티션 혼합 쓰기 무결성 검증
                            const m5 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 2, 'TEST_MIXED');
                            const x0 = m5.allocateSlot();
                            m5.updateFloatData(x0.index, new Float32Array([1.5, 2.5]), 0);
                            m5.updateUintData(x0.index, new Uint32Array([42, 100]), 2);
                            const vf5 = new Float32Array(m5.cpuData);
                            const vu5 = new Uint32Array(m5.cpuData);
                            const mixedOk =
                                Math.abs(vf5[0] - 1.5) < 1e-4 &&
                                Math.abs(vf5[1] - 2.5) < 1e-4 &&
                                vu5[2] === 42 &&
                                vu5[3] === 100;

                            // 6. 1,000개 슬롯 대량 할당·부분 해제·재회수 스트레스 검증
                            const m6 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 16, 'TEST_STRESS');
                            const slots: any[] = [];
                            for (let i = 0; i < 1000; i++) slots.push(m6.allocateSlot());
                            const capBefore = m6.totalSlotCount;
                            for (let i = 0; i < 1000; i += 2) m6.freeSlot(slots[i].index);
                            const activeAfterFree = m6.activeSlotCount;
                            const newSlots: any[] = [];
                            for (let i = 0; i < 500; i++) newSlots.push(m6.allocateSlot());
                            const stressOk =
                                activeAfterFree === 500 &&
                                m6.totalSlotCount === capBefore &&
                                newSlots.every((s) => s.index < 1000);

                            // 7. dirtyMin / dirtyMax 범위 추적 및 flush 후 초기화 검증
                            const m7 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 10, 'TEST_DIRTY');
                            const dirtyInitial = m7.dirtyMin === Infinity && m7.dirtyMax === -Infinity;
                            m7.updateFloatData(4, new Float32Array([1.0]));
                            const dirty1 = m7.dirtyMin === 4 && m7.dirtyMax === 4;
                            m7.updateFloatData(2, new Float32Array([2.0]));
                            m7.updateFloatData(7, new Float32Array([3.0]));
                            const dirty2 = m7.dirtyMin === 2 && m7.dirtyMax === 7;
                            m7.flush();
                            const dirtyAfter = m7.dirtyMin === Infinity && m7.dirtyMax === -Infinity;
                            const dirtyOk = dirtyInitial && dirty1 && dirty2 && dirtyAfter;

                            // 8. safeMaxBufferSize(128MB) 초과 시 리사이즈/초기화 차단 검증
                            const elementSize64MB = 67108864;
                            const m8 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, elementSize64MB, 2, 'TEST_LIMIT');
                            m8.allocateSlot();
                            m8.allocateSlot();
                            const resizeLimitThrows = expectThrows(() => m8.allocateSlot());
                            const initLimitThrows = expectThrows(
                                () => new RedGPU.Resource.GlobalStorageBufferManager(ctx, elementSize64MB, 3, 'TEST_INIT_LIMIT')
                            );

                            // 9. 리사이즈 발생 시 setOnResize 콜백 호출 검증
                            const m9 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 1, 'TEST_RESIZE');
                            let cbArg: any = null;
                            m9.setOnResize((mgr: any) => {
                                cbArg = mgr;
                            });
                            m9.allocateSlot();
                            m9.allocateSlot();
                            const callbackOk = cbArg === m9;

                            // 10. 슬롯 크기(elementSize) 초과 쓰기 차단 검증
                            const m10 = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 2, 'TEST_OVERFLOW');
                            const slot10 = m10.allocateSlot();
                            const overflowOk =
                                expectThrows(() => m10.updateFloatData(slot10.index, new Float32Array([1, 2, 3, 4, 5]))) &&
                                expectThrows(() => m10.updateFloatData(slot10.index, new Float32Array([1, 2, 3]), 2)) &&
                                expectThrows(() => m10.updateUintData(slot10.index, new Uint32Array([1, 2, 3, 4, 5])));

                            ctx.destroy();
                            resolve({
                                initOk,
                                lifoOk,
                                cascadeOk,
                                offsetOk,
                                mixedOk,
                                stressOk,
                                dirtyOk,
                                resizeLimitThrows,
                                initLimitThrows,
                                callbackOk,
                                overflowOk
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
            initOk: true,
            lifoOk: true,
            cascadeOk: true,
            offsetOk: true,
            mixedOk: true,
            stressOk: true,
            dirtyOk: true,
            resizeLimitThrows: true,
            initLimitThrows: true,
            callbackOk: true,
            overflowOk: true
        });
    });
});
