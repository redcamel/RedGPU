import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 지형 가상 텍스처 아틀라스(VHT, VNT, VBT) 베이킹 생성기의 공통 컴퓨트 파이프라인 및 유니폼 버퍼 풀을 관리하는 추상 클래스입니다.
 * [EN] Abstract class that manages common compute pipelines and uniform buffer pools for terrain virtual texture atlas (VHT, VNT, VBT) baking generators.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare abstract class ALandscapeAtlasGenerator extends RedGPUObject {
    #private;
    /**
     * [KO] `ALandscapeAtlasGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes an `ALandscapeAtlasGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param generatorLabel -
     * [KO] GPU 리소스 디버그 라벨 식별자 (예: `'VHT'`, `'VNT'`, `'VBT'`)
     * [EN] GPU resource debug label identifier (e.g., `'VHT'`, `'VNT'`, `'VBT'`)
     * @param workgroupSize -
     * [KO] 컴퓨트 셰이더 2D 워크그룹 가로/세로 크기 (기본값: `16`)
     * [EN] Compute shader 2D workgroup width/height size (default: `16`)
     */
    constructor(redGPUContext: RedGPUContext, generatorLabel: string, workgroupSize?: number);
    /**
     * [KO] 아틀라스 베이킹에 사용되는 기본 컴퓨트 파이프라인을 반환합니다.
     * [EN] Returns the base compute pipeline used for atlas baking.
     *
     * @returns
     * [KO] 컴퓨트 파이프라인 또는 `null`
     * [EN] Compute pipeline or `null`
     */
    get computePipeline(): GPUComputePipeline | null;
    /**
     * [KO] 아틀라스 베이킹 컴퓨트 파이프라인의 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the bind group layout of the atlas baking compute pipeline.
     *
     * @returns
     * [KO] 바인드 그룹 레이아웃 또는 `null`
     * [EN] Bind group layout or `null`
     */
    get bindGroupLayout(): GPUBindGroupLayout | null;
    /**
     * [KO] 현재 프레임에서 사용 가능한 지정된 바이트 크기 이상의 유니폼 버퍼를 풀에서 할당받아 반환합니다.
     * [EN] Acquires and returns an available uniform buffer with at least the specified byte length from the pool for the current frame.
     *
     * @param byteLength -
     * [KO] 필요한 최소 유니폼 버퍼 바이트 크기
     * [EN] Minimum required uniform buffer size in bytes
     * @returns
     * [KO] 할당된 `GPUBuffer` 인스턴스
     * [EN] Allocated `GPUBuffer` instance
     */
    acquireUniformBuffer(byteLength: number): GPUBuffer;
    /**
     * [KO] 지정된 바인드 그룹과 픽셀 영역 크기로 아틀라스 베이킹 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches an atlas baking compute pass with the specified bind group and pixel region dimensions.
     *
     * @param bindGroup -
     * [KO] 바인딩할 `GPUBindGroup` 인스턴스
     * [EN] `GPUBindGroup` instance to bind
     * @param pixelW -
     * [KO] 베이킹 영역의 가로 픽셀 크기
     * [EN] Width of the baking region in pixels
     * @param pixelH -
     * [KO] 베이킹 영역의 세로 픽셀 크기
     * [EN] Height of the baking region in pixels
     * @param pixelX -
     * [KO] 베이킹 영역의 시작 X 픽셀 오프셋
     * [EN] Starting X pixel offset of the baking region
     * @param pixelZ -
     * [KO] 베이킹 영역의 시작 Z(Y) 픽셀 오프셋
     * [EN] Starting Z(Y) pixel offset of the baking region
     */
    dispatchBakePass(bindGroup: GPUBindGroup, pixelW: number, pixelH: number, pixelX: number, pixelZ: number): void;
    /**
     * [KO] 셰이더 모듈과 바인드 그룹 레이아웃 엔트리를 기반으로 기본 컴퓨트 파이프라인 및 유니폼 버퍼 풀을 초기화합니다.
     * [EN] Initializes the base compute pipeline and uniform buffer pool based on the shader module and bind group layout entries.
     *
     * @param shaderModuleKey -
     * [KO] 리소스 매니저에 등록할 셰이더 모듈 캐시 키
     * [EN] Shader module cache key to register in the resource manager
     * @param shaderCode -
     * [KO] WGSL 컴퓨트 셰이더 소스 코드
     * [EN] WGSL compute shader source code
     * @param layoutEntries -
     * [KO] 바인드 그룹 레이아웃 엔트리 배열 (`Array<GPUBindGroupLayoutEntry>`)
     * [EN] Array of bind group layout entries (`Array<GPUBindGroupLayoutEntry>`)
     * @param defaultUniformByteLength -
     * [KO] 초기 유니폼 버퍼 슬롯의 기본 바이트 크기 (기본값: `16`)
     * [EN] Default byte length for initial uniform buffer slots (default: `16`)
     */
    initBaseComputePipeline(shaderModuleKey: string, shaderCode: string, layoutEntries: GPUBindGroupLayoutEntry[], defaultUniformByteLength?: number): void;
    /**
     * [KO] 유니폼 버퍼 풀을 파기하고 컴퓨트 파이프라인 참조를 해제합니다.
     * [EN] Destroys the uniform buffer pool and releases compute pipeline references.
     */
    destroy(): void;
}
export default ALandscapeAtlasGenerator;
