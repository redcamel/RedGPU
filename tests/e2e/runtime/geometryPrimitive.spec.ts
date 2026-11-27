import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Geometry & Primitive (Box, Sphere, Plane)', () => {
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

	// Box(2, 4, 6) GPU 정점/인덱스 버퍼 생성 및 AABB 크기 정합성 검증
	test('builds Box GPU buffers and accurate AABB volume', async () => {
		const res = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const box = new RedGPU.Primitive.Box(ctx, 2, 4, 6);
			return {
				hasVertexBuffer: box.vertexBuffer instanceof RedGPU.Resource.VertexBuffer,
				hasIndexBuffer: box.indexBuffer instanceof RedGPU.Resource.IndexBuffer,
				vertexCount: box.vertexBuffer.vertexCount,
				indexCount: box.indexBuffer.indexCount,
				xSize: box.volume.xSize,
				ySize: box.volume.ySize,
				zSize: box.volume.zSize
			};
		});

		expect(res.hasVertexBuffer).toBe(true);
		expect(res.hasIndexBuffer).toBe(true);
		expect(res.vertexCount).toBeGreaterThan(0);
		expect(res.indexCount).toBeGreaterThan(0);
		expect(res.xSize).toBeCloseTo(2, 4);
		expect(res.ySize).toBeCloseTo(4, 4);
		expect(res.zSize).toBeCloseTo(6, 4);
	});

	// 동일 파라미터 Box 재생성 시 ResourceManager 캐시를 통한 GPU 버퍼 재사용 검증
	test('reuses cached GPU buffers for identical Box parameters', async () => {
		const reused = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const a = new RedGPU.Primitive.Box(ctx, 2, 4, 6);
			const b = new RedGPU.Primitive.Box(ctx, 2, 4, 6);
			return a.vertexBuffer === b.vertexBuffer && a.indexBuffer === b.indexBuffer;
		});

		expect(reused).toBe(true);
	});

	// Sphere(radius = 3) GPU 버퍼 생성 및 AABB 지름(6) 정합성 검증
	test('builds Sphere with accurate AABB diameter', async () => {
		const res = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const sphere = new RedGPU.Primitive.Sphere(ctx, 3, 16, 16);
			return {
				vertexCount: sphere.vertexBuffer.vertexCount,
				indexCount: sphere.indexBuffer.indexCount,
				xSize: sphere.volume.xSize,
				ySize: sphere.volume.ySize,
				zSize: sphere.volume.zSize
			};
		});

		expect(res.vertexCount).toBeGreaterThan(0);
		expect(res.indexCount).toBeGreaterThan(0);
		expect(res.xSize).toBeCloseTo(6, 3);
		expect(res.ySize).toBeCloseTo(6, 3);
		expect(res.zSize).toBeCloseTo(6, 3);
	});

	// Plane(5, 7) XY 평면 AABB 크기(xSize=5, ySize=7, zSize=0) 정합성 검증
	test('builds Plane on XY plane with zero Z thickness', async () => {
		const res = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const plane = new RedGPU.Primitive.Plane(ctx, 5, 7);
			return {
				vertexCount: plane.vertexBuffer.vertexCount,
				indexCount: plane.indexBuffer.indexCount,
				xSize: plane.volume.xSize,
				ySize: plane.volume.ySize,
				zSize: plane.volume.zSize
			};
		});

		expect(res.vertexCount).toBeGreaterThan(0);
		expect(res.indexCount).toBeGreaterThan(0);
		expect(res.xSize).toBeCloseTo(5, 4);
		expect(res.ySize).toBeCloseTo(7, 4);
		expect(res.zSize).toBeCloseTo(0, 4);
	});
});
