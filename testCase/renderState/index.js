import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RenderState');

redUnit.testGroup(
    'RedGPU.RenderState.BlendState',
    (runner) => {
        runner.defineTest('Success: Constructor & Initial State', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                const checkSrc = blendState.srcFactor === RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
                const checkDst = blendState.dstFactor === RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
                const checkOp = blendState.operation === RedGPU.GPU_BLEND_OPERATION.ADD;
                const checkState = blendState.state.operation === RedGPU.GPU_BLEND_OPERATION.ADD;
                if (checkSrc && checkDst && checkOp && checkState) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);

        runner.defineTest('Success: Property Update & dirtyPipeline trigger', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                blendState.operation = RedGPU.GPU_BLEND_OPERATION.SUBTRACT;
                blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
                const checkUpdate = blendState.state.operation === RedGPU.GPU_BLEND_OPERATION.SUBTRACT &&
                                    blendState.state.srcFactor === RedGPU.GPU_BLEND_FACTOR.ONE;
                const checkDirty = mockMaterial.dirtyPipeline === true;
                if (checkUpdate && checkDirty) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);

        runner.defineTest('Failure: invalid operation', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                blendState.operation = 'invalid-op';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Failure: invalid srcFactor', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                blendState.srcFactor = 'invalid-factor';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Failure: invalid dstFactor', (run) => {
            try {
                const mockMaterial = { dirtyPipeline: false };
                const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
                blendState.dstFactor = 'invalid-factor';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RenderState.PrimitiveState',
    (runner) => {
        runner.defineTest('Success: Constructor & Initial State', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                const checkTopology = primitiveState.topology === RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
                const checkCullMode = primitiveState.cullMode === RedGPU.GPU_CULL_MODE.BACK;
                const checkFrontFace = primitiveState.frontFace === RedGPU.GPU_FRONT_FACE.CCW;
                const checkState = primitiveState.state.topology === RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
                if (checkTopology && checkCullMode && checkFrontFace && checkState) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);

        runner.defineTest('Success: Property Update & dirtyPipeline trigger', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
                primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
                const checkUpdate = primitiveState.state.topology === RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP &&
                                    primitiveState.state.cullMode === RedGPU.GPU_CULL_MODE.NONE;
                const checkDirty = mockMesh.dirtyPipeline === true;
                if (checkUpdate && checkDirty) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);

        runner.defineTest('Failure: invalid topology', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                primitiveState.topology = 'invalid-topology';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Failure: invalid cullMode', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                primitiveState.cullMode = 'invalid-cull';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Failure: invalid unclippedDepth type', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
                primitiveState.unclippedDepth = 'true';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
    }
);

redUnit.testGroup(
    'RedGPU.RenderState.DepthStencilState',
    (runner) => {
        runner.defineTest('Success: Constructor & Initial State', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST } };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                const checkFormat = dsState.format === 'depth32float';
                const checkWrite = dsState.depthWriteEnabled === true;
                const checkCompare = dsState.depthCompare === RedGPU.GPU_COMPARE_FUNCTION.LESS_EQUAL;
                if (checkFormat && checkWrite && checkCompare) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);

        runner.defineTest('Success: Property Update & dirtyPipeline trigger', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST } };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                dsState.depthWriteEnabled = false;
                dsState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.GREATER;
                dsState.format = 'depth24plus';
                const checkUpdate = dsState.state.depthWriteEnabled === false &&
                                    dsState.state.depthCompare === RedGPU.GPU_COMPARE_FUNCTION.GREATER &&
                                    dsState.state.format === 'depth24plus';
                const checkDirty = mockMesh.dirtyPipeline === true;
                if (checkUpdate && checkDirty) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);

        runner.defineTest('Failure: invalid format', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                dsState.format = 'invalid-format';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Failure: invalid depthCompare', (run) => {
            try {
                const mockMesh = { dirtyPipeline: false };
                const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
                dsState.depthCompare = 'invalid-compare';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Success: State Generation Logic (depthBias conditions)', (run) => {
            try {
                const mockMeshLine = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST } };
                const dsStateLine = new RedGPU.RenderState.DepthStencilState(mockMeshLine);
                dsStateLine.depthBias = 2;
                const checkLine = dsStateLine.state.depthBias === null;

                const mockMeshTriangle = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP } };
                const dsStateTriangle = new RedGPU.RenderState.DepthStencilState(mockMeshTriangle);
                dsStateTriangle.depthBias = 2;
                const checkTriangle = dsStateTriangle.state.depthBias === 2;

                if (checkLine && checkTriangle) run(true);
                else run(false);
            } catch (e) {
                run(e);
            }
        }, true);
    }
);