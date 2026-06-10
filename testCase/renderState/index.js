import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RenderState');

redUnit.testGroup(
    'RedGPU.RenderState.BlendState',
    (runner) => {
        const createMockMaterial = () => ({ dirtyPipeline: false });

        runner.defineTest('Success Test: Constructor and Getters', (run) => {
            try {
                const mat = createMockMaterial();
                const blend = new RedGPU.RenderState.BlendState(mat);
                const check = blend.operation === RedGPU.GPU_BLEND_OPERATION.ADD &&
                              blend.srcFactor === RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA &&
                              blend.dstFactor === RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
                run(check);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Setters and state update', (run) => {
            try {
                const mat = createMockMaterial();
                const blend = new RedGPU.RenderState.BlendState(mat);
                blend.operation = RedGPU.GPU_BLEND_OPERATION.MAX;
                blend.srcFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
                blend.dstFactor = RedGPU.GPU_BLEND_FACTOR.ZERO;
                
                const checkState = blend.state.operation === 'max' &&
                                   blend.state.srcFactor === 'one' &&
                                   blend.state.dstFactor === 'zero';
                const checkDirty = mat.dirtyPipeline === true;
                run(checkState && checkDirty);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: operation - invalid constant', (run) => {
            try { new RedGPU.RenderState.BlendState(createMockMaterial()).operation = 'invalid'; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: srcFactor - null', (run) => {
            try { new RedGPU.RenderState.BlendState(createMockMaterial()).srcFactor = null; run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RenderState.DepthStencilState',
    (runner) => {
        const createMockObject = (topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST) => ({
            dirtyPipeline: false,
            primitiveState: { topology }
        });

        runner.defineTest('Success Test: Format and Basic Properties', (run) => {
            try {
                const obj = createMockObject();
                const ds = new RedGPU.RenderState.DepthStencilState(obj);
                ds.format = 'depth24plus';
                ds.depthWriteEnabled = false;
                ds.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.ALWAYS;
                run(ds.format === 'depth24plus' && ds.depthWriteEnabled === false && ds.depthCompare === 'always');
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Success Test: Depth Bias and topology relationship', (run) => {
            try {
                const triObj = createMockObject(RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
                const dsTri = new RedGPU.RenderState.DepthStencilState(triObj);
                dsTri.depthBias = 5;
                const checkTri = dsTri.state.depthBias === 5;

                const lineObj = createMockObject(RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
                const dsLine = new RedGPU.RenderState.DepthStencilState(lineObj);
                dsLine.depthBias = 5;
                const checkLine = dsLine.state.depthBias === null;

                run(checkTri && checkLine);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: format - invalid', (run) => {
            try { new RedGPU.RenderState.DepthStencilState(createMockObject()).format = 'invalid-format'; run(true); } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RenderState.PrimitiveState',
    (runner) => {
        const createMockObject = () => ({ dirtyPipeline: false });

        runner.defineTest('Success Test: Properties and state', (run) => {
            try {
                const obj = createMockObject();
                const psActual = new RedGPU.RenderState.PrimitiveState(obj);
                psActual.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
                psActual.cullMode = RedGPU.GPU_CULL_MODE.FRONT;
                psActual.frontFace = RedGPU.GPU_FRONT_FACE.CW;
                psActual.unclippedDepth = true;
                
                const checkState = psActual.state.topology === 'line-strip' &&
                                   psActual.state.cullMode === 'front' &&
                                   psActual.state.frontFace === 'cw' &&
                                   psActual.state.unclippedDepth === true;
                run(checkState && obj.dirtyPipeline === true);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure Test: topology - invalid', (run) => {
            try { new RedGPU.RenderState.PrimitiveState(createMockObject()).topology = 'invalid'; run(true); } catch (e) { run(false, e); }
        }, false);

        runner.defineTest('Failure Test: unclippedDepth - wrong type', (run) => {
            try { new RedGPU.RenderState.PrimitiveState(createMockObject()).unclippedDepth = 'true'; run(true); } catch (e) { run(false, e); }
        }, false);
    }
);
