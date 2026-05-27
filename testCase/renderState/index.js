import RedUnit from 'https://redcamel.github.io/RedUnit/dist/index.js';
import * as RedGPU from "../../dist/index.js";

const redUnit = new RedUnit('RedGPU - RenderState');

redUnit.testGroup(
    'RedGPU.RenderState.BlendState',
    (runner) => {
        runner.defineTest('Constructor & Initial State', (run) => {
            const mockMaterial = { dirtyPipeline: false };
            const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
            
            const checkSrc = blendState.srcFactor === RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
            const checkDst = blendState.dstFactor === RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
            const checkOp = blendState.operation === RedGPU.GPU_BLEND_OPERATION.ADD;
            const checkState = blendState.state.operation === RedGPU.GPU_BLEND_OPERATION.ADD;
            
            run(checkSrc && checkDst && checkOp && checkState);
        }, true);

        runner.defineTest('Property Update & dirtyPipeline trigger', (run) => {
            const mockMaterial = { dirtyPipeline: false };
            const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
            
            blendState.operation = RedGPU.GPU_BLEND_OPERATION.SUBTRACT;
            blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.ONE;
            
            const checkUpdate = blendState.state.operation === RedGPU.GPU_BLEND_OPERATION.SUBTRACT && 
                                blendState.state.srcFactor === RedGPU.GPU_BLEND_FACTOR.ONE;
            const checkDirty = mockMaterial.dirtyPipeline === true;
            
            run(checkUpdate && checkDirty);
        }, true);

        runner.defineTest('Validation Failure: invalid operation', (run) => {
            const mockMaterial = { dirtyPipeline: false };
            const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
            try {
                blendState.operation = 'invalid-op';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Validation Failure: invalid srcFactor', (run) => {
            const mockMaterial = { dirtyPipeline: false };
            const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
            try {
                blendState.srcFactor = 'invalid-factor';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Validation Failure: invalid dstFactor', (run) => {
            const mockMaterial = { dirtyPipeline: false };
            const blendState = new RedGPU.RenderState.BlendState(mockMaterial);
            try {
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
        runner.defineTest('Constructor & Initial State', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
            
            const checkTopology = primitiveState.topology === RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
            const checkCullMode = primitiveState.cullMode === RedGPU.GPU_CULL_MODE.BACK;
            const checkFrontFace = primitiveState.frontFace === RedGPU.GPU_FRONT_FACE.CCW;
            const checkState = primitiveState.state.topology === RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
            
            run(checkTopology && checkCullMode && checkFrontFace && checkState);
        }, true);

        runner.defineTest('Property Update & dirtyPipeline trigger', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
            
            primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
            primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
            
            const checkUpdate = primitiveState.state.topology === RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP && 
                                primitiveState.state.cullMode === RedGPU.GPU_CULL_MODE.NONE;
            const checkDirty = mockMesh.dirtyPipeline === true;
            
            run(checkUpdate && checkDirty);
        }, true);

        runner.defineTest('Validation Failure: invalid topology', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
            try {
                primitiveState.topology = 'invalid-topology';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Validation Failure: invalid cullMode', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
            try {
                primitiveState.cullMode = 'invalid-cull';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Validation Failure: invalid unclippedDepth type', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const primitiveState = new RedGPU.RenderState.PrimitiveState(mockMesh);
            try {
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
        runner.defineTest('Constructor & Initial State', (run) => {
            const mockMesh = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST } };
            const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
            
            const checkFormat = dsState.format === 'depth32float';
            const checkWrite = dsState.depthWriteEnabled === true;
            const checkCompare = dsState.depthCompare === RedGPU.GPU_COMPARE_FUNCTION.LESS_EQUAL;
            
            run(checkFormat && checkWrite && checkCompare);
        }, true);

        runner.defineTest('Property Update & dirtyPipeline trigger', (run) => {
            const mockMesh = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST } };
            const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
            
            dsState.depthWriteEnabled = false;
            dsState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.GREATER;
            dsState.format = 'depth24plus';
            
            const checkUpdate = dsState.state.depthWriteEnabled === false && 
                                dsState.state.depthCompare === RedGPU.GPU_COMPARE_FUNCTION.GREATER &&
                                dsState.state.format === 'depth24plus';
            const checkDirty = mockMesh.dirtyPipeline === true;
            
            run(checkUpdate && checkDirty);
        }, true);

        runner.defineTest('Validation Failure: invalid format', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
            try {
                dsState.format = 'invalid-format';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);

        runner.defineTest('Validation Failure: invalid depthCompare', (run) => {
            const mockMesh = { dirtyPipeline: false };
            const dsState = new RedGPU.RenderState.DepthStencilState(mockMesh);
            try {
                dsState.depthCompare = 'invalid-compare';
                run(true);
            } catch (e) {
                run(false);
            }
        }, false);
        
        runner.defineTest('State Generation Logic (depthBias conditions)', (run) => {
            const mockMeshLine = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.LINE_LIST } };
            const dsStateLine = new RedGPU.RenderState.DepthStencilState(mockMeshLine);
            dsStateLine.depthBias = 2;
            const checkLine = dsStateLine.state.depthBias === null;

            const mockMeshTriangle = { dirtyPipeline: false, primitiveState: { topology: RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP } };
            const dsStateTriangle = new RedGPU.RenderState.DepthStencilState(mockMeshTriangle);
            dsStateTriangle.depthBias = 2;
            const checkTriangle = dsStateTriangle.state.depthBias === 2;

            run(checkLine && checkTriangle);
        }, true);
    }
);