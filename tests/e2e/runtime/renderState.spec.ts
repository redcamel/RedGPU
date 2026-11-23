import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('RenderState (BlendState, DepthStencilState, PrimitiveState)', () => {
    // Getter/Setter, dirtyPipeline 플래그 갱신 및 잘못된 WebGPU 상수 차단 검증
    test('validates getters, setters, dirtyPipeline updates, and invalid enum rejection', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            // 1. BlendState 기본값, 상태 갱신 및 예외 검증
            const mat = {dirtyPipeline: false};
            const blend = new RedGPU.RenderState.BlendState(mat);
            const blendDefaultsOk =
                blend.operation === RedGPU.GPU_BLEND_OPERATION.ADD &&
                blend.srcFactor === RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA &&
                blend.dstFactor === RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;

            blend.operation = RedGPU.GPU_BLEND_OPERATION.MAX;
            blend.srcFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
            blend.dstFactor = RedGPU.GPU_BLEND_FACTOR.ZERO;
            const blendUpdateOk =
                blend.state.operation === 'max' &&
                blend.state.srcFactor === 'one' &&
                blend.state.dstFactor === 'zero' &&
                mat.dirtyPipeline === true;

            const blendInvalidOk =
                expectThrows(() => {
                    blend.operation = 'invalid';
                }) &&
                expectThrows(() => {
                    blend.srcFactor = null;
                });

            // 2. DepthStencilState 토폴로지별 depthBias 적용 규칙 검증 (삼각형만 적용, 선분은 null)
            const triObj = {
                dirtyPipeline: false,
                primitiveState: {topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST}
            };
            const ds = new RedGPU.RenderState.DepthStencilState(triObj);
            ds.format = 'depth24plus';
            ds.depthWriteEnabled = false;
            ds.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS;
            ds.depthBias = 5;

            const lineObj = {
                dirtyPipeline: false,
                primitiveState: {topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST}
            };
            const dsLine = new RedGPU.RenderState.DepthStencilState(lineObj);
            dsLine.depthBias = 5;

            const depthStencilOk =
                ds.format === 'depth24plus' &&
                ds.depthWriteEnabled === false &&
                ds.depthCompare === 'always' &&
                ds.state.depthBias === 5 &&
                dsLine.state.depthBias === null &&
                expectThrows(() => {
                    ds.format = 'invalid-format';
                });

            // 3. PrimitiveState 속성 갱신 및 타입 검증
            const primObj = {dirtyPipeline: false};
            const ps = new RedGPU.RenderState.PrimitiveState(primObj);
            ps.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
            ps.cullMode = RedGPU.GPU_CULL_MODE.FRONT;
            ps.frontFace = RedGPU.GPU_FRONT_FACE.CW;
            ps.unclippedDepth = true;

            const primitiveOk =
                ps.state.topology === 'line-strip' &&
                ps.state.cullMode === 'front' &&
                ps.state.frontFace === 'cw' &&
                ps.state.unclippedDepth === true &&
                primObj.dirtyPipeline === true &&
                expectThrows(() => {
                    ps.topology = 'invalid';
                }) &&
                expectThrows(() => {
                    ps.unclippedDepth = 'true';
                });

            return {blendDefaultsOk, blendUpdateOk, blendInvalidOk, depthStencilOk, primitiveOk};
        });

        expect(result).toEqual({
            blendDefaultsOk: true,
            blendUpdateOk: true,
            blendInvalidOk: true,
            depthStencilOk: true,
            primitiveOk: true
        });
    });
});
