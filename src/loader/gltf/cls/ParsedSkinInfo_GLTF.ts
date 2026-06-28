import RedGPUContext from "../../../context/RedGPUContext";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import Mesh from "../../../display/mesh/Mesh";

class ParsedSkinInfo_GLTF {
    joints: Mesh[] = []
    inverseBindMatrices: Float32Array[]
    skeletonMesh: Mesh
    vertexStorageInfo
    vertexStorageBuffer: GPUBuffer
    prevVertexStorageBuffer: GPUBuffer
    invertNodeGlobalTransform: Float32Array
    usedJoints: number[] = null
    WORK_SIZE: number = 64
    jointData: Float32Array
    uniformBuffer: GPUBuffer
    jointSlotIndicesBuffer: GPUBuffer
    computeShader: GPUShaderModule;
    computePipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;
    prevGlobalVertexSSBOBuffer: GPUBuffer;

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
        mesh: Mesh,
    ) {
        const interleavedStruct = vertexBuffer.interleavedStruct;
        const stride = vertexBuffer.stride;
        const positionOffset = interleavedStruct.getAttributeOffset('aVertexPosition');
        const normalOffset = interleavedStruct.getAttributeOffset('aVertexNormal');
        const tangentOffset = interleavedStruct.define['aVertexTangent'] ? interleavedStruct.getAttributeOffset('aVertexTangent') : 0;

        const source = `
			struct Uniforms {
			  meshSlotIndex:        u32,
			  searchJointIndexTable:    array<vec4<u32>, ${this.joints.length}>,
			  inverseBindMatrices:    array<mat4x4<f32>, ${this.joints.length}>,
			  
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

			struct MatrixList {
			  localMatrix: mat4x4<f32>,
			  modelMatrix: mat4x4<f32>,
			  prevModelMatrix: mat4x4<f32>,
			  normalModelMatrix: mat4x4<f32>,
			};
			struct GlobalVertexStruct {
			  matrixList: MatrixList,
			  pickingId: u32,
			  receiveShadow: f32,
			  combinedOpacity: f32,
			  useDisplacementTexture: u32,
			  displacementScale: f32,
			  disableJitter: u32,
			  globalFragmentSlotIndex: u32,
			  uvTransform: vec4<f32>,
			};
			
			@group(0) @binding(0) var<storage, read>       vertexWeight:  array<vec4<f32>>;
			@group(0) @binding(1) var<storage, read>       vertexJoint:  array<vec4<u32>>;
			@group(0) @binding(2) var<storage, read_write> skinnedVertexBuffer:  array<SkinnedVertex>;
			@group(0) @binding(3) var<storage, read_write> prevSkinnedVertexBuffer:  array<SkinnedVertex>;
			@group(0) @binding(4) var<uniform>             uniforms:          Uniforms;
			@group(0) @binding(5) var<storage, read>       originalVertices:  array<f32>;
			@group(0) @binding(6) var<storage, read>       globalVertexSSBO:  array<GlobalVertexStruct>;
			@group(0) @binding(7) var<storage, read>       jointSlotIndices:  array<u32>;
			
			// 4x4 행렬 역행렬 정밀 수학 함수 (Column-Major 연산식 보정 완료)
			fn getInverse4x4(m: mat4x4<f32>) -> mat4x4<f32> {
			  let a00 = m[0][0]; let a01 = m[0][1]; let a02 = m[0][2]; let a03 = m[0][3];
			  let a10 = m[1][0]; let a11 = m[1][1]; let a12 = m[1][2]; let a13 = m[1][3];
			  let a20 = m[2][0]; let a21 = m[2][1]; let a22 = m[2][2]; let a23 = m[2][3];
			  let a30 = m[3][0]; let a31 = m[3][1]; let a32 = m[3][2]; let a33 = m[3][3];

			  let b00 = a00 * a11 - a01 * a10;
			  let b01 = a00 * a12 - a02 * a10;
			  let b02 = a00 * a13 - a03 * a10;
			  let b03 = a01 * a12 - a02 * a11;
			  let b04 = a01 * a13 - a03 * a11;
			  let b05 = a02 * a13 - a03 * a12;
			  let b06 = a20 * a31 - a21 * a30;
			  let b07 = a20 * a32 - a22 * a30;
			  let b08 = a20 * a33 - a23 * a30;
			  let b09 = a21 * a32 - a22 * a31;
			  let b10 = a21 * a33 - a23 * a31;
			  let b11 = a22 * a33 - a23 * a32;

			  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
			  if (det == 0.0) {
			    return mat4x4<f32>(
			      vec4<f32>(1.0, 0.0, 0.0, 0.0),
			      vec4<f32>(0.0, 1.0, 0.0, 0.0),
			      vec4<f32>(0.0, 0.0, 1.0, 0.0),
			      vec4<f32>(0.0, 0.0, 0.0, 1.0)
			    );
			  }
			  let invDet = 1.0 / det;

			  return mat4x4<f32>(
			    vec4<f32>(
			      (a11 * b11 - a12 * b10 + a13 * b09) * invDet,
			      (a02 * b10 - a01 * b11 - a03 * b09) * invDet,
			      (a31 * b05 - a32 * b04 + a33 * b03) * invDet,
			      (a22 * b04 - a21 * b05 - a23 * b03) * invDet
			    ),
			    vec4<f32>(
			      (a12 * b08 - a10 * b11 - a13 * b07) * invDet,
			      (a00 * b11 - a02 * b08 + a03 * b07) * invDet,
			      (a32 * b02 - a30 * b05 - a33 * b01) * invDet,
			      (a20 * b05 - a22 * b02 + a23 * b01) * invDet
			    ),
			    vec4<f32>(
			      (a10 * b10 - a11 * b08 + a13 * b06) * invDet,
			      (a01 * b08 - a00 * b10 - a03 * b06) * invDet,
			      (a30 * b04 - a31 * b02 + a33 * b00) * invDet,
			      (a21 * b02 - a20 * b04 - a23 * b00) * invDet
			    ),
			    vec4<f32>(
			      (a11 * b07 - a10 * b09 - a12 * b06) * invDet,
			      (a00 * b09 - a01 * b07 + a02 * b06) * invDet,
			      (a31 * b01 - a30 * b03 - a32 * b00) * invDet,
			      (a20 * b03 - a21 * b01 + a22 * b00) * invDet
			    )
			  );
			}
			
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
			
			  // 2. 조인트 modelMatrix 조회 및 스키닝 합성 행렬 계산
			  let localJointIdxX = uniforms.searchJointIndexTable[joints.x].x;
			  let localJointIdxY = uniforms.searchJointIndexTable[joints.y].x;
			  let localJointIdxZ = uniforms.searchJointIndexTable[joints.z].x;
			  let localJointIdxW = uniforms.searchJointIndexTable[joints.w].x;

			  let jointModelMatrixX = globalVertexSSBO[jointSlotIndices[localJointIdxX]].matrixList.modelMatrix;
			  let jointModelMatrixY = globalVertexSSBO[jointSlotIndices[localJointIdxY]].matrixList.modelMatrix;
			  let jointModelMatrixZ = globalVertexSSBO[jointSlotIndices[localJointIdxZ]].matrixList.modelMatrix;
			  let jointModelMatrixW = globalVertexSSBO[jointSlotIndices[localJointIdxW]].matrixList.modelMatrix;

			  // 메인 모델 역행렬 실시간 계산
			  let invertNodeGlobalTransform = getInverse4x4(globalVertexSSBO[uniforms.meshSlotIndex].matrixList.modelMatrix);

			  let skinMat = invertNodeGlobalTransform * (
				    weights.x * (
				    	jointModelMatrixX * uniforms.inverseBindMatrices[joints.x]
				    ) +
				    weights.y * (
				    	jointModelMatrixY * uniforms.inverseBindMatrices[joints.y]
				    ) +
				    weights.z * (
				    	jointModelMatrixZ * uniforms.inverseBindMatrices[joints.z]
				    ) +
				    weights.w * (
				    	jointModelMatrixW * uniforms.inverseBindMatrices[joints.w]
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
        this.computeShader = redGPUContext.resourceManager.createGPUShaderModule(`calcSkinMatrix_${this.usedJoints.length}`, {code: source})
        this.computePipeline = device.createComputePipeline({
            label: 'calcSkinMatrix',
            layout: 'auto',
            compute: {
                module: this.computeShader,
                entryPoint: 'main',
            },
        });

        // uniforms 사이즈 = meshSlotIndex (16바이트 정렬) + searchJointIndexTable + inverseBindMatrices + layout 메타데이터 (16바이트)
        this.uniformBuffer = device.createBuffer({
            size: 16 + (this.joints.length * 4 * 4) + (this.joints.length * 16 * 4) + 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        // 메인 메쉬의 globalVertexSlotIndex 최초 1회 주입
        device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            new Uint32Array([mesh.globalVertexSlotIndex])
        )

        // 조인트 슬롯 인덱스 데이터를 보관할 스토리지 버퍼 개설
        this.jointSlotIndicesBuffer = device.createBuffer({
            size: this.usedJoints.length * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        // searchJointIndexTableData 주입
        const searchJointIndexTableData = new Uint32Array(this.joints.length * 4);
        searchJointIndexTableData.fill(0);
        this.usedJoints.forEach((jointIdx, i) => {
            searchJointIndexTableData[jointIdx * 4] = i;
        });
        device.queue.writeBuffer(
            this.uniformBuffer,
            16,
            searchJointIndexTableData
        )

        // inverseBindMatrices 주입
        device.queue.writeBuffer(
            this.uniformBuffer,
            16 + (this.joints.length * 16),
            new Float32Array(this.inverseBindMatrices.map(v => Array.from(v)).flat())
        )
        
        // 정점 레이아웃 메타데이터 기록 (u32 4개 = 16바이트)
        const layoutMetadata = new Uint32Array([stride, positionOffset, normalOffset, tangentOffset]);
        device.queue.writeBuffer(
            this.uniformBuffer,
            16 + (this.joints.length * 16) + (this.joints.length * 64),
            layoutMetadata
        )

        // 조인트 슬롯 인덱스 1회 계산 후 버퍼에 선제 주입
        const jointSlotIndices = new Uint32Array(this.usedJoints.length);
        this.usedJoints.forEach((jointIdx, i) => {
            jointSlotIndices[i] = this.joints[jointIdx].globalVertexSlotIndex;
        });
        device.queue.writeBuffer(
            this.jointSlotIndicesBuffer,
            0,
            jointSlotIndices
        )

        this.updateBindGroup(
            redGPUContext,
            device,
            vertexBuffer,
            weightBuffer,
            jointBuffer,
        )
    }

    updateBindGroup(
        redGPUContext: RedGPUContext,
        device: GPUDevice,
        vertexBuffer: VertexBuffer,
        weightBuffer: VertexBuffer,
        jointBuffer: IndexBuffer,
    ) {
        this.bindGroup = device.createBindGroup({
            layout: this.computePipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: {buffer: weightBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: jointBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.vertexStorageBuffer}},
                {binding: 3, resource: {buffer: this.prevVertexStorageBuffer}},
                {binding: 4, resource: {buffer: this.uniformBuffer}},
                {binding: 5, resource: {buffer: vertexBuffer.gpuBuffer}},
                {binding: 6, resource: {buffer: redGPUContext.globalVertexSSBO.gpuBuffer}},
                {binding: 7, resource: {buffer: this.jointSlotIndicesBuffer}},
            ],
        });
        this.prevGlobalVertexSSBOBuffer = redGPUContext.globalVertexSSBO.gpuBuffer
    }
}

export default ParsedSkinInfo_GLTF;
