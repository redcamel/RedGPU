import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RenderState');

redUnit.testGroup(
    'RedGPU.RenderState.BlendState',
    (runner) => {
        runner.defineTest('Success: Initial srcFactor check', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                run(blendState.srcFactor);
            } catch (e) { run(null, e); }
        }, RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA);

        runner.defineTest('Success: Initial dstFactor check', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                run(blendState.dstFactor);
            } catch (e) { run(null, e); }
        }, RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA);

        runner.defineTest('Success: Property Update trigger dirtyPipeline', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                blendState.operation = RedGPU.GPU_BLEND_OPERATION.SUBTRACT;
                run(mockMaterial.dirtyPipeline);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure: invalid operation', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                blendState.operation = 'invalid-op';
                run(true);
            } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RenderState.PrimitiveState',
    (runner) => {
        runner.defineTest('Success: Initial topology check', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                run(primitiveState.topology);
            } catch (e) { run(null, e); }
        }, RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);

        runner.defineTest('Success: Set topology and check dirty', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
                run(mockMesh.dirtyPipeline);
            } catch (e) { run(false, e); }
        }, true);

        runner.defineTest('Failure: invalid topology', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                primitiveState.topology = 'invalid-topology';
                run(true);
            } catch (e) { run(false, e); }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RenderState.DepthStencilState',
    (runner) => {
        runner.defineTest('Success: Initial format check', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                run(dsState.format);
            } catch (e) { run(null, e); }
        }, 'depth32float');

        runner.defineTest('Success: Initial depthCompare check', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                run(dsState.depthCompare);
            } catch (e) { run(null, e); }
        }, RedGPU.GPU_COMPARE_FUNCTION.LESS_EQUAL);

        runner.defineTest('Success: depthBias conditions - Line (should be null)', (run) => {
            try {
                const mockMeshLine = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST } };
                const dsStateLine = new RedGPU.RenderState.DepthStencilState(mockMeshLine);
                dsStateLine.depthBias = 2;
                run(dsStateLine.state.depthBias);
            } catch (e) { run(undefined, e); }
        }, null);

        runner.defineTest('Success: depthBias conditions - Triangle (should be 2)', (run) => {
            try {
                const mockMeshTriangle = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP } };
                const dsStateTriangle = new RedGPU.RenderState.DepthStencilState(mockMeshTriangle);
                dsStateTriangle.depthBias = 2;
                run(dsStateTriangle.state.depthBias);
            } catch (e) { run(null, e); }
        }, 2);

        runner.defineTest('Failure: invalid format', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                dsState.format = 'invalid-format';
                run(true);
            } catch (e) { run(false, e); }
        }, false);
    }
);