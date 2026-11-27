import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Resource.GlobalStorageBufferManager', () => {
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

    // 초기화 속성(totalSlotCount, elementSize, label) 및 GPUBuffer 생성 검증
    test('initializes buffer properties and creates underlying GPUBuffer', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const m = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 256, 128, 'TEST_BUFFER');
            return (
                m.totalSlotCount === 128 &&
                m.elementSize === 256 &&
                m.label === 'TEST_BUFFER' &&
                m.gpuBuffer instanceof GPUBuffer
            );
        });

        expect(ok).toBe(true);
    });

    // LIFO 방식 슬롯 해제 및 우선 재할당 순서 검증
    test('reuses freed slots in LIFO order before allocating new indices', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const m = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 256, 10, 'TEST_ALLOC');
            const s0 = m.allocateSlot();
            const s1 = m.allocateSlot();
            m.allocateSlot();
            m.freeSlot(s1.index);
            m.freeSlot(s0.index);
            const r0 = m.allocateSlot();
            const r1 = m.allocateSlot();
            const r2 = m.allocateSlot();
            return r0.index === 0 && r1.index === 1 && r2.index === 3;
        });

        expect(ok).toBe(true);
    });

    // 다단계 연속 리사이즈(1 -> 2 -> 4) 후 기존 CPU 백킹 데이터 보존 및 onResize 콜백 검증
    test('retains existing data across cascading resizes and invokes onResize callback', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const m = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 1, 'TEST_CASCADE');
            let cbArg: any = null;
            m.setOnResize((mgr: any) => {
                cbArg = mgr;
            });

            const c0 = m.allocateSlot();
            m.updateFloatData(c0.index, new Float32Array([1.1, 2.2, 3.3, 4.4]));
            const c1 = m.allocateSlot();
            m.updateFloatData(c1.index, new Float32Array([5.5, 6.6, 7.7, 8.8]));
            m.allocateSlot();

            const v = new Float32Array(m.cpuData);
            return (
                m.totalSlotCount === 4 &&
                cbArg === m &&
                Math.abs(v[0] - 1.1) < 1e-4 &&
                Math.abs(v[3] - 4.4) < 1e-4 &&
                Math.abs(v[4] - 5.5) < 1e-4 &&
                Math.abs(v[7] - 8.8) < 1e-4
            );
        });

        expect(ok).toBe(true);
    });

    // 슬롯 내부 오프셋 지정 쓰기 및 동일 슬롯 내 Float32/Uint32 혼합 쓰기 무결성 검증
    test('maps internal offsets and coexisting float/uint partitions accurately', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            const mOffset = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 32, 2, 'TEST_OFFSET');
            mOffset.allocateSlot();
            const o1 = mOffset.allocateSlot();
            mOffset.updateFloatData(o1.index, new Float32Array([9.9, 8.8, 7.7]), 2);
            const v4 = new Float32Array(mOffset.cpuData);
            const offsetOk =
                Math.abs(v4[10] - 9.9) < 1e-4 &&
                Math.abs(v4[11] - 8.8) < 1e-4 &&
                Math.abs(v4[12] - 7.7) < 1e-4 &&
                v4[9] === 0;

            const mMixed = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 2, 'TEST_MIXED');
            const x0 = mMixed.allocateSlot();
            mMixed.updateFloatData(x0.index, new Float32Array([1.5, 2.5]), 0);
            mMixed.updateUintData(x0.index, new Uint32Array([42, 100]), 2);
            const vf = new Float32Array(mMixed.cpuData);
            const vu = new Uint32Array(mMixed.cpuData);
            const mixedOk =
                Math.abs(vf[0] - 1.5) < 1e-4 &&
                Math.abs(vf[1] - 2.5) < 1e-4 &&
                vu[2] === 42 &&
                vu[3] === 100;

            return offsetOk && mixedOk;
        });

        expect(ok).toBe(true);
    });

    // 1,000개 슬롯 대량 할당·부분 해제·재회수 스트레스 및 dirtyMin/dirtyMax 추적·flush 검증
    test('handles 1,000-slot stress recycling and dirty range tracking/flush', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            const mStress = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 16, 'TEST_STRESS');
            const slots: any[] = [];
            for (let i = 0; i < 1000; i++) slots.push(mStress.allocateSlot());
            const capBefore = mStress.totalSlotCount;
            for (let i = 0; i < 1000; i += 2) mStress.freeSlot(slots[i].index);
            const activeAfterFree = mStress.activeSlotCount;
            const newSlots: any[] = [];
            for (let i = 0; i < 500; i++) newSlots.push(mStress.allocateSlot());
            const stressOk =
                activeAfterFree === 500 &&
                mStress.totalSlotCount === capBefore &&
                newSlots.every((s) => s.index < 1000);

            const mDirty = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 10, 'TEST_DIRTY');
            const dirtyInitial = mDirty.dirtyMin === Infinity && mDirty.dirtyMax === -Infinity;
            mDirty.updateFloatData(4, new Float32Array([1.0]));
            const dirty1 = mDirty.dirtyMin === 4 && mDirty.dirtyMax === 4;
            mDirty.updateFloatData(2, new Float32Array([2.0]));
            mDirty.updateFloatData(7, new Float32Array([3.0]));
            const dirty2 = mDirty.dirtyMin === 2 && mDirty.dirtyMax === 7;
            mDirty.flush();
            const dirtyAfter = mDirty.dirtyMin === Infinity && mDirty.dirtyMax === -Infinity;

            return stressOk && dirtyInitial && dirty1 && dirty2 && dirtyAfter;
        });

        expect(ok).toBe(true);
    });

    // safeMaxBufferSize(128MB) 초과 및 슬롯 elementSize 초과 쓰기 차단 검증
    test('enforces hardware safeMaxBufferSize and per-slot boundary limits', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            const elementSize64MB = 67108864;
            const mLimit = new RedGPU.Resource.GlobalStorageBufferManager(ctx, elementSize64MB, 2, 'TEST_LIMIT');
            mLimit.allocateSlot();
            mLimit.allocateSlot();
            const resizeLimitThrows = expectThrows(() => mLimit.allocateSlot());
            const initLimitThrows = expectThrows(
                () => new RedGPU.Resource.GlobalStorageBufferManager(ctx, elementSize64MB, 3, 'TEST_INIT_LIMIT')
            );

            const mOverflow = new RedGPU.Resource.GlobalStorageBufferManager(ctx, 16, 2, 'TEST_OVERFLOW');
            const slot = mOverflow.allocateSlot();
            const overflowOk =
                expectThrows(() => mOverflow.updateFloatData(slot.index, new Float32Array([1, 2, 3, 4, 5]))) &&
                expectThrows(() => mOverflow.updateFloatData(slot.index, new Float32Array([1, 2, 3]), 2)) &&
                expectThrows(() => mOverflow.updateUintData(slot.index, new Uint32Array([1, 2, 3, 4, 5])));

            return resizeLimitThrows && initLimitThrows && overflowOk;
        });

        expect(ok).toBe(true);
    });
});
