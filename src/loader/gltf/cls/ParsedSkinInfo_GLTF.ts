import RedGPUContext from "../../../context/RedGPUContext";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import Mesh from "../../../display/mesh/Mesh";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";

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
    lastMeshModelMatrix: any = null;
    computeShader: GPUShaderModule;
    computePipeline: GPUComputePipeline;
    bindGroup: GPUBindGroup;
    skinnerBindGroupLayout: GPUBindGroupLayout;
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
			#redgpu_include SYSTEM_UNIFORM;

			struct Uniforms {
			  meshSlotIndex:        u32,
			  searchJointIndexTable:    array<vec4<u32>, ${this.joints.length}>,
			  inverseBindMatrices:    array<mat4x4<f32>, ${this.joints.length}>,
			  
			  // 정점 레이아웃 메타데이터
			  vertexStride:   u32,
			  positionOffset: u32,
			  normalOffset:   u32,
			  tangentOffset:  u32,

			  jointSlotIndices:       array<vec4<u32>, ${Math.ceil(this.usedJoints.length / 4)}>,
			};
			
			struct SkinnedVertex {
			  position: vec3<f32>,
			  normal:   vec3<f32>,
			  tangent:  vec4<f32>,
			  currentClipPos: vec4<f32>,
			};
			
			@group(1) @binding(0) var<storage, read>       vertexWeight:  array<vec4<f32>>;
			@group(1) @binding(1) var<storage, read>       vertexJoint:  array<vec4<u32>>;
			@group(1) @binding(2) var<storage, read_write> skinnedVertexBuffer:  array<SkinnedVertex>;
			@group(1) @binding(3) var<storage, read_write> prevSkinnedVertexBuffer:  array<vec4<f32>>;
			@group(1) @binding(4) var<uniform>             uniforms:          Uniforms;
			@group(1) @binding(5) var<storage, read>       originalVertices:  array<f32>;
			
			@compute @workgroup_size(${this.WORK_SIZE},1,1)
			fn main(@builtin(global_invocation_id) global_id: vec3<u32>) { 
			  let idx = global_id.x;
			  if (idx >= arrayLength(&vertexWeight)) {
			    return;
			  }
			
			  let weights = vertexWeight[idx];
			  let joints = vertexJoint[idx];
			  
			  // 조인트 modelMatrix 조회 및 인버스 바인드 행렬 로드 (하단 어디서든 접근 가능하도록 선두에 배치)
			  let searchJointIndexTable = uniforms.searchJointIndexTable;
			  let localJointIdxX = searchJointIndexTable[joints.x].x;
			  let localJointIdxY = searchJointIndexTable[joints.y].x;
			  let localJointIdxZ = searchJointIndexTable[joints.z].x;
			  let localJointIdxW = searchJointIndexTable[joints.w].x;

			  let jointSlotIndices = uniforms.jointSlotIndices;
			  let jointModelMatrixX = globalVertexSSBO[jointSlotIndices[localJointIdxX >> 2u][localJointIdxX & 3u]].matrixList.modelMatrix;
			  let jointModelMatrixY = globalVertexSSBO[jointSlotIndices[localJointIdxY >> 2u][localJointIdxY & 3u]].matrixList.modelMatrix;
			  let jointModelMatrixZ = globalVertexSSBO[jointSlotIndices[localJointIdxZ >> 2u][localJointIdxZ & 3u]].matrixList.modelMatrix;
			  let jointModelMatrixW = globalVertexSSBO[jointSlotIndices[localJointIdxW >> 2u][localJointIdxW & 3u]].matrixList.modelMatrix;

			  let inverseBindMatrices = uniforms.inverseBindMatrices;
			  let invBindX = inverseBindMatrices[joints.x];
			  let invBindY = inverseBindMatrices[joints.y];
			  let invBindZ = inverseBindMatrices[joints.z];
			  let invBindW = inverseBindMatrices[joints.w];
			  
			  // 1. 원본 버텍스 데이터 읽기
			  let baseIdx = idx * uniforms.vertexStride;
			  
			  let posIdx = baseIdx + uniforms.positionOffset;
			  let rawPos = vec3<f32>(
			    originalVertices[posIdx],
			    originalVertices[posIdx + 1u],
			    originalVertices[posIdx + 2u]
			  );
			  
			  let normalIdx = baseIdx + uniforms.normalOffset;
			  let rawNormal = vec3<f32>(
			    originalVertices[normalIdx],
			    originalVertices[normalIdx + 1u],
			    originalVertices[normalIdx + 2u]
			  );
			  
			  var skinnedTangent = vec4<f32>(0.0, 0.0, 0.0, 1.0);
			  if (uniforms.tangentOffset != 0u) {
			    let tangentIdx = baseIdx + uniforms.tangentOffset;
			    let rawTangent = vec4<f32>(
			      originalVertices[tangentIdx],
			      originalVertices[tangentIdx + 1u],
			      originalVertices[tangentIdx + 2u],
			      originalVertices[tangentIdx + 3u]
			    );
			    
			    let t = vec4<f32>(rawTangent.xyz, 0.0);
			    let skinnedTangentVec4 = weights.x * (jointModelMatrixX * (invBindX * t)) +
			                            weights.y * (jointModelMatrixY * (invBindY * t)) +
			                            weights.z * (jointModelMatrixZ * (invBindZ * t)) +
			                            weights.w * (jointModelMatrixW * (invBindW * t));
			    skinnedTangent = vec4<f32>(normalize(skinnedTangentVec4.xyz), rawTangent.w);
			  }

			  // --- 1. 포지션 스키닝 계산 (Matrix-Vector multiplication 8회) ---
			  let v = vec4<f32>(rawPos, 1.0);
			  let skinnedPos = weights.x * (jointModelMatrixX * (invBindX * v)) +
			                   weights.y * (jointModelMatrixY * (invBindY * v)) +
			                   weights.z * (jointModelMatrixZ * (invBindZ * v)) +
			                   weights.w * (jointModelMatrixW * (invBindW * v));

			  // 3. 이전 프레임 결과 보존 (이전 프레임 클립 위치 계산 및 기록)
			  // skinnedVertexBuffer[idx]의 position은 이전 프레임 시점의 최종 월드 포지션이다!
			  let prevWorldPos = vec4<f32>(skinnedVertexBuffer[idx].position, 1.0);
			  prevSkinnedVertexBuffer[idx] = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * prevWorldPos;
			  
			  // 4. 스키닝 적용된 데이터 기록 (조인트 스킨 합성 행렬에 의해 최종 월드 공간으로 바로 변환됨!)
			  var skinnedOut: SkinnedVertex;
			  skinnedOut.position = skinnedPos.xyz;
			  
			  // --- 2. 노말 스키닝 계산 (방향 벡터이므로 w = 0.0) ---
			  let n = vec4<f32>(rawNormal, 0.0);
			  let skinnedNormalVec4 = weights.x * (jointModelMatrixX * (invBindX * n)) +
			                         weights.y * (jointModelMatrixY * (invBindY * n)) +
			                         weights.z * (jointModelMatrixZ * (invBindZ * n)) +
			                         weights.w * (jointModelMatrixW * (invBindW * n));
			  skinnedOut.normal = normalize(skinnedNormalVec4.xyz);
			  
			  skinnedOut.tangent = skinnedTangent;
			  
			  // 현재 프레임의 클립 공간(Jitter 배제) 위치 사전 계산 및 기록!
			  skinnedOut.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * vec4<f32>(skinnedOut.position, 1.0);
			  
			  skinnedVertexBuffer[idx] = skinnedOut;
			}
    `;
        this.computeShader = redGPUContext.resourceManager.createGPUShaderModule(`calcSkinMatrix_${this.usedJoints.length}`, {code: source})
        
        // systemLayout 가져오기 (group 0)
        const systemLayout = redGPUContext.resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);

        // skinnerLayout 명시적 생성 (group 1)
        this.skinnerBindGroupLayout = device.createBindGroupLayout({
            label: 'calcSkinMatrix_skinnerLayout',
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
                { binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } }
            ]
        });

        // 명시적 pipelineLayout 생성
        const pipelineLayout = device.createPipelineLayout({
            label: 'calcSkinMatrix_pipelineLayout',
            bindGroupLayouts: [systemLayout, this.skinnerBindGroupLayout]
        });

        this.computePipeline = device.createComputePipeline({
            label: 'calcSkinMatrix',
            layout: pipelineLayout,
            compute: {
                module: this.computeShader,
                entryPoint: 'main',
            },
        });

        // uniforms 사이즈 = meshSlotIndex (16바이트 정렬) + searchJointIndexTable + inverseBindMatrices + layout 메타데이터 (16바이트) + jointSlotIndices (Math.ceil(this.usedJoints.length / 4) * 16바이트)
        const jointSlotIndicesNum = Math.ceil(this.usedJoints.length / 4) * 4;
        this.uniformBuffer = device.createBuffer({
            size: 16 + (this.joints.length * 4 * 4) + (this.joints.length * 16 * 4) + 16 + (jointSlotIndicesNum * 4),
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        // 메인 메쉬의 globalVertexSlotIndex 최초 1회 주입
        device.queue.writeBuffer(
            this.uniformBuffer,
            0,
            new Uint32Array([mesh.globalVertexSlotIndex])
        )

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

        // 조인트 슬롯 인덱스 데이터를 보관할 임시 배열 (4의 배수로 올림 패킹)
        const jointSlotIndices = new Uint32Array(jointSlotIndicesNum);
        jointSlotIndices.fill(0);
        this.usedJoints.forEach((jointIdx, i) => {
            jointSlotIndices[i] = this.joints[jointIdx].globalVertexSlotIndex;
        });
        device.queue.writeBuffer(
            this.uniformBuffer,
            16 + (this.joints.length * 16) + (this.joints.length * 64) + 16,
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
            layout: this.skinnerBindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: weightBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: jointBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.vertexStorageBuffer}},
                {binding: 3, resource: {buffer: this.prevVertexStorageBuffer}},
                {binding: 4, resource: {buffer: this.uniformBuffer}},
                {binding: 5, resource: {buffer: vertexBuffer.gpuBuffer}},
            ],
        });
        this.prevGlobalVertexSSBOBuffer = redGPUContext.globalVertexSSBO.gpuBuffer
    }
}

export default ParsedSkinInfo_GLTF;
