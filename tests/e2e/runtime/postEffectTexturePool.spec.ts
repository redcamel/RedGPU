import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.Core.PostEffectTexturePool', () => {
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

	// 초기 상태 카운터 및 allocation -> release -> 동일 크기 재사용 동작 검증
	test('initializes empty counters and reuses released textures of matching size', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const pool = new RedGPU.PostEffect.Core.PostEffectTexturePool(ctx);

			const initialOk =
				pool.videoMemorySize === 0 &&
				pool.activeCount === 0 &&
				pool.idleCount === 0 &&
				pool.totalCount === 0 &&
				pool.allocationCount === 0 &&
				pool.peakActiveCount === 0 &&
				pool.hitRate === 0;

			const res1 = pool.allocResult(256, 256);
			const allocOk = pool.activeCount === 1 && pool.allocationCount === 1;
			pool.release(res1.texture);
			const releaseOk = pool.activeCount === 0 && pool.idleCount === 1;
			pool.allocResult(256, 256);
			const reuseOk = pool.activeCount === 1 && pool.idleCount === 0 && pool.allocationCount === 1;

			pool.clear();
			return initialOk && allocOk && releaseOk && reuseOk;
		});

		expect(ok).toBe(true);
	});

	// hitRate, peakActiveCount 집계, releaseAll 일괄 반환 및 clear() 메모리 초기화 검증
	test('tracks hitRate/peakActiveCount and supports releaseAll and clear', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const pool = new RedGPU.PostEffect.Core.PostEffectTexturePool(ctx);

			pool.allocResult(64, 64);
			const r64 = pool.allocResult(64, 64);
			pool.release(r64.texture);
			pool.allocResult(64, 64);
			const metricsOk = Math.abs(pool.hitRate - 1 / 3) < 1e-4 && pool.peakActiveCount === 2;

			pool.releaseAll();
			const releaseAllOk = pool.activeCount === 0 && pool.idleCount === 2;

			pool.clear();
			const clearedOk =
				pool.videoMemorySize === 0 &&
				pool.activeCount === 0 &&
				pool.idleCount === 0 &&
				pool.allocationCount === 0;

			return metricsOk && releaseAllOk && clearedOk;
		});

		expect(ok).toBe(true);
	});

	// getDetails() 키 포맷 출력 및 음수 텍스처 크기 입력 차단 검증
	test('reports getDetails key format and rejects negative dimensions', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const pool = new RedGPU.PostEffect.Core.PostEffectTexturePool(ctx);

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
			return detailsOk && negativeThrew;
		});

		expect(ok).toBe(true);
	});
});
