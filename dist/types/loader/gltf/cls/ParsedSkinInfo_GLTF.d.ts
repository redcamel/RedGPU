import RedGPUContext from "../../../context/RedGPUContext";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import Mesh from "../../../display/mesh/Mesh";
import Sphere from "../../../primitive/Sphere";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
/**
 * [KO] glTF 스키닝 애니메이션을 위한 조인트, 역바인드 행렬 및 컴퓨트 파이프라인 리소스를 관리하는 클래스입니다.
 * [EN] Class that manages joints, inverse bind matrices, and compute pipeline resources for glTF skinning animation.
 *
 * ::: warning
 * [KO] 이 클래스는 GLTFLoader에 의해 내부적으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is internally created by GLTFLoader.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category GLTF
 */
declare class ParsedSkinInfo_GLTF {
    #private;
    /**
     * [KO] 스키닝에 참여하는 조인트 메쉬 배열
     * [EN] Array of joint meshes participating in skinning
     */
    joints: Mesh[];
    /**
     * [KO] 각 조인트의 역바인드 행렬(`Float32Array`) 배열
     * [EN] Array of inverse bind matrices (`Float32Array`) for each joint
     */
    inverseBindMatrices: Float32Array[];
    /**
     * [KO] 스켈레톤 루트 메쉬
     * [EN] Skeleton root mesh
     */
    skeletonMesh: Mesh;
    /**
     * [KO] 정점 스토리지 메타 정보
     * [EN] Vertex storage meta information
     */
    vertexStorageInfo: any;
    /**
     * [KO] 현재 프레임의 스키닝된 정점 데이터를 저장하는 GPU 버퍼
     * [EN] GPU buffer storing skinned vertex data for the current frame
     */
    vertexStorageBuffer: GPUBuffer;
    /**
     * [KO] 이전 프레임의 스키닝된 정점 데이터를 저장하는 GPU 버퍼
     * [EN] GPU buffer storing skinned vertex data for the previous frame
     */
    prevVertexStorageBuffer: GPUBuffer;
    /**
     * [KO] 대상 메쉬 노드의 글로벌 변환 역행렬
     * [EN] Inverse global transform matrix of the target mesh node
     */
    invertNodeGlobalTransform: Float32Array;
    /**
     * [KO] 메쉬 정점에서 실제로 참조하는 조인트 인덱스 배열
     * [EN] Array of joint indices actually referenced by the mesh vertices
     */
    usedJoints: number[];
    /**
     * [KO] 컴퓨트 셰이더 워크그룹 크기
     * [EN] Compute shader workgroup size
     */
    WORK_SIZE: number;
    /**
     * [KO] 조인트 행렬 연산용 데이터 버퍼
     * [EN] Data buffer for joint matrix computation
     */
    jointData: Float32Array;
    /**
     * [KO] 스키닝 유니폼 데이터를 저장하는 GPU 버퍼
     * [EN] GPU buffer storing skinning uniform data
     */
    uniformBuffer: GPUBuffer;
    /**
     * [KO] 조인트 슬롯 인덱스 GPU 버퍼
     * [EN] Joint slot indices GPU buffer
     */
    jointSlotIndicesBuffer: GPUBuffer;
    /**
     * [KO] 마지막으로 적용된 메쉬 모델 행렬
     * [EN] Last applied mesh model matrix
     */
    lastMeshModelMatrix: any;
    /**
     * [KO] 스키닝 연산용 컴퓨트 셰이더 모듈
     * [EN] Compute shader module for skinning calculation
     */
    computeShader: GPUShaderModule;
    /**
     * [KO] 스키닝 연산용 컴퓨트 파이프라인
     * [EN] Compute pipeline for skinning calculation
     */
    computePipeline: GPUComputePipeline;
    /**
     * [KO] 스키닝 리소스 바인드 그룹
     * [EN] Skinning resource bind group
     */
    bindGroup: GPUBindGroup;
    /**
     * [KO] 스키닝 바인드 그룹 레이아웃
     * [EN] Skinning bind group layout
     */
    skinnerBindGroupLayout: GPUBindGroupLayout;
    /**
     * [KO] 이전 프레임의 글로벌 정점 SSBO GPU 버퍼 참조
     * [EN] Reference to the previous frame's global vertex SSBO GPU buffer
     */
    prevGlobalVertexSSBOBuffer: GPUBuffer;
    /**
     * [KO] ParsedSkinInfo_GLTF 인스턴스를 생성합니다.
     * [EN] Creates a ParsedSkinInfo_GLTF instance.
     */
    constructor();
    /**
     * [KO] 디버그용 구체 지오메트리를 반환합니다.
     * [EN] Returns the sphere geometry for debugging.
     *
     * @returns
     * [KO] 구체 지오메트리 인스턴스
     * [EN] Sphere geometry instance
     */
    get geometry(): Sphere;
    /**
     * [KO] 디버그용 컬러 머티리얼을 반환합니다.
     * [EN] Returns the color material for debugging.
     *
     * @returns
     * [KO] 컬러 머티리얼 인스턴스
     * [EN] Color material instance
     */
    get material(): ColorMaterial;
    /**
     * [KO] 대상 메쉬의 조인트 버퍼에서 실제로 사용되는 조인트 인덱스 목록을 추출합니다.
     * [EN] Extracts the list of joint indices actually used from the target mesh's joint buffer.
     *
     * @param mesh -
     * [KO] 조인트 정보를 추출할 대상 메쉬
     * [EN] Target mesh to extract joint information from
     * @returns
     * [KO] 사용된 조인트 인덱스 배열
     * [EN] Array of used joint indices
     */
    getUsedJointIndices(mesh: Mesh): number[];
    /**
     * [KO] 스키닝 연산을 위한 GPU 컴퓨트 파이프라인과 유니폼 버퍼를 생성하고 초기화합니다.
     * [EN] Creates and initializes the GPU compute pipeline and uniform buffer for skinning calculations.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param device -
     * [KO] WebGPU 디바이스
     * [EN] WebGPU device
     * @param vertexBuffer -
     * [KO] 원본 정점 버퍼
     * [EN] Source vertex buffer
     * @param weightBuffer -
     * [KO] 조인트 가중치 버퍼
     * [EN] Joint weight buffer
     * @param jointBuffer -
     * [KO] 조인트 인덱스 버퍼
     * [EN] Joint index buffer
     * @param mesh -
     * [KO] 스키닝 대상 메쉬
     * [EN] Target mesh for skinning
     */
    createCompute(redGPUContext: RedGPUContext, device: GPUDevice, vertexBuffer: VertexBuffer, weightBuffer: VertexBuffer, jointBuffer: IndexBuffer, mesh: Mesh): void;
    /**
     * [KO] 스키닝 컴퓨트 파이프라인의 바인드 그룹을 갱신합니다.
     * [EN] Updates the bind group for the skinning compute pipeline.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param device -
     * [KO] WebGPU 디바이스
     * [EN] WebGPU device
     * @param vertexBuffer -
     * [KO] 원본 정점 버퍼
     * [EN] Source vertex buffer
     * @param weightBuffer -
     * [KO] 조인트 가중치 버퍼
     * [EN] Joint weight buffer
     * @param jointBuffer -
     * [KO] 조인트 인덱스 버퍼
     * [EN] Joint index buffer
     */
    updateBindGroup(redGPUContext: RedGPUContext, device: GPUDevice, vertexBuffer: VertexBuffer, weightBuffer: VertexBuffer, jointBuffer: IndexBuffer): void;
    /**
     * [KO] 스키닝 정보와 관련된 모든 GPU 버퍼 및 리소스를 해제합니다.
     * [EN] Destroys all GPU buffers and resources associated with the skinning information.
     */
    destroy(): void;
}
export default ParsedSkinInfo_GLTF;
