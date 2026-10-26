import RedGPUContext from "../../../../context/RedGPUContext";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] 컴퓨트 셰이더를 통해 물리 기반 대기 산란 연산 결과를 텍스처에 베이킹하는 대기 산란용 LUT(Look-Up Table) 생성기의 추상 베이스 클래스입니다.
 * [EN] Abstract base class for atmospheric scattering LUT (Look-Up Table) generators that bake physically based atmospheric scattering calculations into textures using compute shaders.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
declare abstract class ASkyAtmosphereLUTGenerator extends RedGPUObject {
    #private;
    /**
     * [KO] ASkyAtmosphereLUTGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes an ASkyAtmosphereLUTGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] LUT 샘플링용 샘플러
     * [EN] Sampler for LUT sampling
     * @param label -
     * [KO] 생성기 구분 레이블
     * [EN] Generator identification label
     * @param width -
     * [KO] LUT 텍스처 너비
     * [EN] LUT texture width
     * @param height -
     * [KO] LUT 텍스처 높이
     * [EN] LUT texture height
     * @param depth -
     * [KO] LUT 텍스처 깊이 또는 레이어 수 (기본값: 1)
     * [EN] LUT texture depth or layer count (default: 1)
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler, label: string, width: number, height: number, depth?: number);
    /**
     * [KO] 대기 파라미터 공유 유니폼 버퍼를 반환합니다.
     * [EN] Returns the shared uniform buffer for atmospheric parameters.
     *
     * @returns
     * [KO] 공유 유니폼 버퍼
     * [EN] Shared uniform buffer
     */
    get sharedUniformBuffer(): UniformBuffer;
    /**
     * [KO] LUT 샘플링용 샘플러를 반환합니다.
     * [EN] Returns the sampler for LUT sampling.
     *
     * @returns
     * [KO] Sampler 인스턴스
     * [EN] Sampler instance
     */
    get sampler(): Sampler;
    /**
     * [KO] LUT 텍스처의 너비를 반환합니다.
     * [EN] Returns the width of the LUT texture.
     *
     * @returns
     * [KO] 텍스처 너비
     * [EN] Texture width
     */
    get width(): number;
    /**
     * [KO] LUT 텍스처의 높이를 반환합니다.
     * [EN] Returns the height of the LUT texture.
     *
     * @returns
     * [KO] 텍스처 높이
     * [EN] Texture height
     */
    get height(): number;
    /**
     * [KO] 생성된 LUT 텍스처 객체를 반환합니다.
     * [EN] Returns the generated LUT texture object.
     *
     * @returns
     * [KO] LUT 텍스처 객체
     * [EN] LUT texture object
     */
    abstract get lutTexture(): DirectTexture | DirectCubeTexture;
    /**
     * [KO] 컴퓨트 패스를 실행하여 LUT 데이터를 갱신합니다.
     * [EN] Executes a compute pass to update the LUT data.
     *
     * @param pipeline -
     * [KO] 실행할 컴퓨트 파이프라인
     * [EN] Compute pipeline to execute
     * @param bindGroup -
     * [KO] 바인딩할 리소스 바인드 그룹
     * [EN] Resource bind group to bind
     * @param workgroupSizeX -
     * [KO] X축 워크그룹 크기 (기본값: 8)
     * [EN] X-axis workgroup size (default: 8)
     * @param workgroupSizeY -
     * [KO] Y축 워크그룹 크기 (기본값: 8)
     * [EN] Y-axis workgroup size (default: 8)
     * @param workgroupSizeZ -
     * [KO] Z축 워크그룹 크기 (기본값: 1)
     * [EN] Z-axis workgroup size (default: 1)
     * @param notifyUpdate -
     * [KO] 패스 실행 후 `lutTexture.notifyUpdate()` 자동 호출 여부 (기본값: true)
     * [EN] Whether to automatically call `lutTexture.notifyUpdate()` after pass execution (default: true)
     */
    executeComputePass(pipeline: GPUComputePipeline, bindGroup: GPUBindGroup, workgroupSizeX?: number, workgroupSizeY?: number, workgroupSizeZ?: number, notifyUpdate?: boolean): void;
    /**
     * [KO] LUT 저장용 GPU 텍스처를 생성합니다.
     * [EN] Creates a GPU texture for storing the LUT.
     *
     * @param is3D -
     * [KO] 3D 텍스처 생성 여부 (기본값: false)
     * [EN] Whether to create a 3D texture (default: false)
     * @param format -
     * [KO] 텍스처 포맷 (기본값: `'rgba16float'`)
     * [EN] Texture format (default: `'rgba16float'`)
     * @returns
     * [KO] 생성된 GPUTexture
     * [EN] Created GPUTexture
     */
    createLUTTexture(is3D?: boolean, format?: GPUTextureFormat): GPUTexture;
    /**
     * [KO] 생성기 및 내부 LUT 리소스를 해제합니다.
     * [EN] Releases the generator and internal LUT resources.
     */
    destroy(): void;
    /**
     * [KO] WGSL 셰이더 코드로부터 컴퓨트 파이프라인을 생성합니다.
     * [EN] Creates a compute pipeline from WGSL shader code.
     *
     * @param label -
     * [KO] 파이프라인 레이블
     * [EN] Pipeline label
     * @param shaderCode -
     * [KO] WGSL 셰이더 소스 코드
     * [EN] WGSL shader source code
     * @returns
     * [KO] 생성된 GPUComputePipeline
     * [EN] Created GPUComputePipeline
     */
    createComputePipeline(label: string, shaderCode: string): GPUComputePipeline;
    /**
     * [KO] 컴퓨트 파이프라인의 첫 번째 레이아웃을 기반으로 바인드 그룹을 생성합니다.
     * [EN] Creates a bind group based on the first layout of the compute pipeline.
     *
     * @param label -
     * [KO] 바인드 그룹 레이블
     * [EN] Bind group label
     * @param pipeline -
     * [KO] 기준 컴퓨트 파이프라인
     * [EN] Reference compute pipeline
     * @param entries -
     * [KO] 바인드 그룹 엔트리 배열
     * [EN] Array of bind group entries
     * @returns
     * [KO] 생성된 GPUBindGroup
     * [EN] Created GPUBindGroup
     */
    createBindGroup(label: string, pipeline: GPUComputePipeline, entries: GPUBindGroupEntry[]): GPUBindGroup;
}
export default ASkyAtmosphereLUTGenerator;
