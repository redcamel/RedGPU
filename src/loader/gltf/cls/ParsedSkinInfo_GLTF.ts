import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";


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
    prevVertexStorageBuffer: GPUBuffer
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
        vertexBuffer: VertexBuffer,
        weightBuffer: VertexBuffer,
        jointBuffer: IndexBuffer,
    ) {
        const interleavedStruct = vertexBuffer.interleavedStruct;
        const stride = vertexBuffer.stride;
        const positionOffset = interleavedStruct.getAttributeOffset('aVertexPosition');
        const normalOffset = interleavedStruct.getAttributeOffset('aVertexNormal');
        const tangentOffset = interleavedStruct.define['aVertexTangent'] ? interleavedStruct.getAttributeOffset('aVertexTangent') : 0;

        const source = `
			struct Uniforms {
			  invertNodeGlobalTransform:    mat4x4<f32>,
			  jointModelMatrices:     array<mat4x4<f32>, ${this.usedJoints.length}>,
			  inverseBindMatrices:    array<mat4x4<f32>, ${this.joints.length}>,
			  searchJointIndexTable:    array<vec4<u32>, ${this.joints.length}>,
			  
			  // 정점 레이아웃 메타데이터
			  vertexStride:   u32,
			  positionOffset: u32,
			  normalOffset:   u32,
			  tangentOffset:  u32,
			};
			
			struct SkinnedVertex {
			  position: vec3<f32>,
			  normal:   vec3<f32>,
			  tangent:  vec4<f32>,
			};
			
			@group(0) @binding(0) var<storage, read>       vertexWeight:  array<vec4<f32>>;
			@group(0) @binding(1) var<storage, read>       vertexJoint:  array<vec4<u32>>;
			@group(0) @binding(2) var<storage, read_write> skinnedVertexBuffer:  array<SkinnedVertex>;
			@group(0) @binding(3) var<storage, read_write> prevSkinnedVertexBuffer:  array<SkinnedVertex>;
			@group(0) @binding(4) var<uniform>             uniforms:          Uniforms;
			@group(0) @binding(5) var<storage, read>       originalVertices:  array<f32>;
			
			@compute @workgroup_size(${this.WORK_SIZE},1,1)
			fn main(@builtin(global_invocation_id) global_id: vec3<u32>) { 
			  let idx = global_id.x;
			  if (idx >= arrayLength(&vertexWeight)) {
			    return;
			  }
			
			  let weights = vertexWeight[idx];
			  let joints = vertexJoint[idx];
			  
			  // 1. 원본 버텍스 데이터 읽기
			  let baseIdx = idx * uniforms.vertexStride;
			  let rawPos = vec3<f32>(
			    originalVertices[baseIdx + uniforms.positionOffset],
			    originalVertices[baseIdx + uniforms.positionOffset + 1u],
			    originalVertices[baseIdx + uniforms.positionOffset + 2u]
			  );
			  let rawNormal = vec3<f32>(
			    originalVertices[baseIdx + uniforms.normalOffset],
			    originalVertices[baseIdx + uniforms.normalOffset + 1u],
			    originalVertices[baseIdx + uniforms.normalOffset + 2u]
			  );
			  
			  var rawTangent = vec4<f32>(0.0, 0.0, 0.0, 1.0);
			  if (uniforms.tangentOffset != 0u) {
			    rawTangent = vec4<f32>(
			      originalVertices[baseIdx + uniforms.tangentOffset],
			      originalVertices[baseIdx + uniforms.tangentOffset + 1u],
			      originalVertices[baseIdx + uniforms.tangentOffset + 2u],
			      originalVertices[baseIdx + uniforms.tangentOffset + 3u]
			    );
			  }
			
			  // 2. 스키닝 합성 행렬 계산
			  let skinMat = uniforms.invertNodeGlobalTransform * (
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
				
			  // 3. 이전 프레임 결과 보존
			  prevSkinnedVertexBuffer[idx] = skinnedVertexBuffer[idx];
			  
			  // 4. 스키닝 적용된 데이터 기록
			  var skinnedOut: SkinnedVertex;
			  skinnedOut.position = (skinMat * vec4<f32>(rawPos, 1.0)).xyz;
			  skinnedOut.normal = normalize((skinMat * vec4<f32>(rawNormal, 0.0)).xyz);
			  skinnedOut.tangent = vec4<f32>(normalize((skinMat * vec4<f32>(rawTangent.xyz, 0.0)).xyz), rawTangent.w);
			  
			  skinnedVertexBuffer[idx] = skinnedOut;
			}
    `;
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
        // uniforms 사이즈 = jointData 크기 + inverseBindMatrices 크기 + searchJointIndexTable 크기 + layout 메타데이터 (16바이트)
        this.uniformBuffer = device.createBuffer({
            size: this.jointData.byteLength + (this.joints.length * 16 * 4) + (this.joints.length * 4 * 4) + 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })
        device.queue.writeBuffer(
            this.uniformBuffer,
            this.jointData.byteLength,
            new Float32Array(this.inverseBindMatrices.map(v => Array.from(v)).flat())
        )
        const searchJointIndexTableData = new Uint32Array(this.joints.length * 4);
        searchJointIndexTableData.fill(0);
        this.usedJoints.forEach((jointIdx, i) => {
            searchJointIndexTableData[jointIdx * 4] = i;
        });
        device.queue.writeBuffer(
            this.uniformBuffer,
            this.jointData.byteLength + (this.joints.length * 16 * 4),
            searchJointIndexTableData
        )

        // 정점 레이아웃 메타데이터 기록 (u32 4개 = 16바이트)
        const layoutMetadata = new Uint32Array([stride, positionOffset, normalOffset, tangentOffset]);
        device.queue.writeBuffer(
            this.uniformBuffer,
            this.jointData.byteLength + (this.joints.length * 16 * 4) + (this.joints.length * 4 * 4),
            layoutMetadata
        )

        this.bindGroup = device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: {buffer: weightBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: jointBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.vertexStorageBuffer}},
                {binding: 3, resource: {buffer: this.prevVertexStorageBuffer}},
                {binding: 4, resource: {buffer: this.uniformBuffer}},
                {binding: 5, resource: {buffer: vertexBuffer.gpuBuffer}},
            ],
        });
    }
}

// ParsedSkinInfo_GLTF 클래스를 export 합니다.
export default ParsedSkinInfo_GLTF;
