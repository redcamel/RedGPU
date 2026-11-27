import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('RenderState (BlendState, DepthStencilState, PrimitiveState)', () => {
	let harness: SharedWebGPUHarness;

	test.beforeAll(async ({browser}) => {
		harness = await createSharedWebGPUHarness(browser, {initContext: false});
	});

	test.afterEach(() => {
		harness.assertNoErrors();
	});

	test.afterAll(async () => {
		await harness.dispose();
	});

	// BlendState 기본값, 상태 갱신, dirtyPipeline 플래그 및 잘못된 상수 차단 검증
	test('validates BlendState defaults, state updates, dirtyPipeline, and invalid enum rejection', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const expectThrows = (fn: () => void) => {
				try {
					fn();
					return false;
				} catch {
					return true;
				}
			};
			const mat = {dirtyPipeline: false};
			const blend = new RedGPU.RenderState.BlendState(mat);
			const defaultsOk =
				blend.operation === RedGPU.GPU_BLEND_OPERATION.ADD &&
				blend.srcFactor === RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA &&
				blend.dstFactor === RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

			blend.operation = RedGPU.GPU_BLEND_OPERATION.MAX;
			blend.srcFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
			blend.dstFactor = RedGPU.GPU_BLEND_FACTOR.ZERO;

			return (
				defaultsOk &&
				blend.state.operation === 'max' &&
				blend.state.srcFactor === 'one' &&
				blend.state.dstFactor === 'zero' &&
				mat.dirtyPipeline === true &&
				expectThrows(() => (blend.operation = 'invalid')) &&
				expectThrows(() => (blend.srcFactor = null))
			);
		});

		expect(ok).toBe(true);
	});

	// DepthStencilState 포맷·깊이 비교 설정, 토폴로지별 depthBias 규칙 및 잘못된 포맷 차단 검증
	test('validates DepthStencilState format, topology-dependent depthBias, and invalid format rejection', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const expectThrows = (fn: () => void) => {
				try {
					fn();
					return false;
				} catch {
					return true;
				}
			};
			const triObj = {
				dirtyPipeline: false,
				primitiveState: {topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST}
			};
			const ds = new RedGPU.RenderState.DepthStencilState(triObj);
			ds.format = 'depth24plus';
			ds.depthWriteEnabled = false;
			ds.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS;
			ds.depthBias = 5;

			// 선분 토폴로지에서는 depthBias가 null로 무시되는지 검증
			const lineObj = {
				dirtyPipeline: false,
				primitiveState: {topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST}
			};
			const dsLine = new RedGPU.RenderState.DepthStencilState(lineObj);
			dsLine.depthBias = 5;

			return (
				ds.format === 'depth24plus' &&
				ds.depthWriteEnabled === false &&
				ds.depthCompare === 'always' &&
				ds.state.depthBias === 5 &&
				dsLine.state.depthBias === null &&
				expectThrows(() => (ds.format = 'invalid-format'))
			);
		});

		expect(ok).toBe(true);
	});

	// PrimitiveState 토폴로지·컬링·전면 방향 갱신 및 비정상 입력 차단 검증
	test('validates PrimitiveState updates, dirtyPipeline, and invalid input rejection', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const expectThrows = (fn: () => void) => {
				try {
					fn();
					return false;
				} catch {
					return true;
				}
			};
			const primObj = {dirtyPipeline: false};
			const ps = new RedGPU.RenderState.PrimitiveState(primObj);
			ps.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
			ps.cullMode = RedGPU.GPU_CULL_MODE.FRONT;
			ps.frontFace = RedGPU.GPU_FRONT_FACE.CW;
			ps.unclippedDepth = true;

			return (
				ps.state.topology === 'line-strip' &&
				ps.state.cullMode === 'front' &&
				ps.state.frontFace === 'cw' &&
				ps.state.unclippedDepth === true &&
				primObj.dirtyPipeline === true &&
				expectThrows(() => (ps.topology = 'invalid')) &&
				expectThrows(() => (ps.unclippedDepth = 'true'))
			);
		});

		expect(ok).toBe(true);
	});
});
