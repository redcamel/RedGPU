import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";

let temp0 = new Float32Array(16)
let temp1 = new Float32Array(16)

/**
 * GLTF 형식에서 파싱된 스킨 정보를 나타내는 클래스입니다.
 * @class ParsedSkinInfo_GLTF
 */
class ParsedSkinInfo_GLTF {
    joints: any[];
    inverseBindMatrices: Float32Array[];
    skeletonMesh: any;
    vertexStorageInfo
    vertexStorageBuffer: GPUBuffer
    invertNodeGlobalTransform: Float32Array
    usedJoints: number[] = null
    WORK_SIZE: number = 64
    jointData: Float32Array
    uniformBuffer: GPUBuffer
    computeShader: GPUShaderModule;
    computePipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;

    /**
     * Constructor 클래스의 새 인스턴스를 생성합니다.
     * 클래스를 설명하는 @classdesc 도 추가했습니다.
     * @constructor
     */
    constructor() {
        this.joints = [];
        this.inverseBindMatrices = null;
        this.skeletonMesh = null;
    }

    getUsedJointIndices(mesh: Mesh): number[] {
        const usedJoints = new Set<number>();
        const {jointBuffer} = mesh.animationInfo;
        // 인터리브된 데이터에서 joint 정보 추출
        if (!jointBuffer.data.length) return [];
        const data = jointBuffer.data;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            const baseIndex = i;
            // 각 정점마다 4개의 조인트 인덱스
            for (let j = 0; j < 4; j++) {
                const jointIndex = Math.floor(data[baseIndex + j]);
                if (jointIndex >= 0 && jointIndex < this.joints.length) {
                    usedJoints.add(jointIndex);
                }
            }
        }
        return Array.from(usedJoints);
    }

    createCompute(
        redGPUContext: RedGPUContext,
        device: GPUDevice,
        vertexStorageBuffer: GPUBuffer,
        weightBuffer: VertexBuffer,
        jointBuffer: IndexBuffer,
    ) {
        const source = `
			struct Uniforms {
			  invertNodeGlobalTransform:    mat4x4<f32>,
			  jointModelMatrices:     array<mat4x4<f32>, ${this.usedJoints.length}>,
			  inverseBindMatrices:    array<mat4x4<f32>, ${this.joints.length}>,
			  searchJointIndexTable:    array<vec4<u32>, ${this.joints.length}>,
			};
			
			@group(0) @binding(0) var<storage, read>       vertexWeight:  array<vec4<f32>>;
			@group(0) @binding(1) var<storage, read>       vertexJoint:  array<vec4<u32>>;
			@group(0) @binding(2) var<storage, read_write> skinMatrixBuffer:  array<mat4x4<f32>>;
			@group(0) @binding(3) var<uniform>             uniforms:          Uniforms;
			
			@compute @workgroup_size(${this.WORK_SIZE},1,1)
			fn main(@builtin(global_invocation_id) global_id: vec3<u32>) { 
			  let idx = global_id.x;
			  if (idx >= arrayLength(&vertexWeight)) {
			    return;
			  }
			
			  let weights = vertexWeight[idx];
			  let joints = vertexJoint[idx];
			
			  skinMatrixBuffer[idx] = uniforms.invertNodeGlobalTransform * (
				    weights.x * (
				    	uniforms.jointModelMatrices[uniforms.searchJointIndexTable[joints.x].x] * uniforms.inverseBindMatrices[joints.x]
				    ) +
				    weights.y * (
				    	uniforms.jointModelMatrices[uniforms.searchJointIndexTable[joints.y].x] * uniforms.inverseBindMatrices[joints.y]
				    ) +
				    weights.z * (
				    	uniforms.jointModelMatrices[uniforms.searchJointIndexTable[joints.z].x] * uniforms.inverseBindMatrices[joints.z]
				    ) +
				    weights.w * (
				    	uniforms.jointModelMatrices[uniforms.searchJointIndexTable[joints.w].x] * uniforms.inverseBindMatrices[joints.w]
				    )
				);
			}
    `;
        // keepLog(this.joints, this.usedJoints)
        this.jointData = new Float32Array((1 + this.usedJoints.length) * 16)
        this.computeShader = redGPUContext.resourceManager.createGPUShaderModule(`calcSkinMatrix_${this.usedJoints.length}`, {code: source})
        this.computePipeline = device.createComputePipeline({
            label: 'calcSkinMatrix',
            layout: 'auto',
            compute: {
                module: this.computeShader,
                entryPoint: 'main',
            },
        });
        this.uniformBuffer = device.createBuffer({
            size: this.jointData.byteLength + (this.joints.length * 16 * 4) + (this.joints.length * 4 * 4),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
        device.queue.writeBuffer(
            this.uniformBuffer,
            this.jointData.byteLength,
            new Float32Array(this.inverseBindMatrices.map(v => Array.from(v)).flat())
        )
        const searchJointIndexTableData = new Uint32Array(this.joints.length * 4);
        searchJointIndexTableData.fill(0); // 또는 적절한 기본값
        this.usedJoints.forEach((jointIdx, i) => {
            searchJointIndexTableData[jointIdx * 4] = i;
        });
        // keepLog(this.joints,this.usedJoints,searchJointIndexTableData)
        device.queue.writeBuffer(
            this.uniformBuffer,
            this.jointData.byteLength + (this.joints.length * 16 * 4),
            searchJointIndexTableData
        )
        // keepLog(
        // 	this.usedJoints,
        // 	searchJointIndexTableData
        // )
        this.bindGroup = device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: {buffer: weightBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: jointBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: vertexStorageBuffer}},
                {binding: 3, resource: {buffer: this.uniformBuffer}},
            ],
        });
    }
}

// ParsedSkinInfo_GLTF 클래스를 export 합니다.
export default ParsedSkinInfo_GLTF;
