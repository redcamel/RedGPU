import RedGPUContext from "../../../../context/RedGPUContext";
import type Foliage from "../Foliage";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";
import AScatterCuller from "../../../core/scatter/AScatterCuller";
import FoliageMegaBuffer from "../buffer/FoliageMegaBuffer";
import FoliageInstanceBaker from "../baking/FoliageInstanceBaker";
/**
 * [KO] 식생(Foliage) 인스턴스에 대한 절두체(Frustum), HZB 오클루전, 거리 기반 LOD 선택 및 그림자 캐스케이드 컬링을 GPU 컴퓨트 셰이더로 수행하는 클래스입니다.
 * [EN] Class that performs frustum culling, HZB occlusion culling, distance-based LOD selection, and shadow cascade culling for foliage instances via GPU compute shaders.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class FoliageCuller extends AScatterCuller {
    #private;
    /**
     * [KO] `FoliageCuller` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageCuller` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param megaBuffer -
     * [KO] 식생 통합 GPU 버퍼를 관리하는 `FoliageMegaBuffer` 인스턴스 (선택)
     * [EN] `FoliageMegaBuffer` instance managing unified foliage GPU buffers (optional)
     */
    constructor(redGPUContext: RedGPUContext, megaBuffer?: FoliageMegaBuffer | null);
    /**
     * [KO] 식생 인스턴스 베이커(`FoliageInstanceBaker`) 인스턴스를 반환합니다.
     * [EN] Returns the foliage instance baker (`FoliageInstanceBaker`) instance.
     *
     * @returns
     * [KO] `FoliageInstanceBaker` 인스턴스
     * [EN] `FoliageInstanceBaker` instance
     */
    get baker(): FoliageInstanceBaker;
    /**
     * [KO] 현재 프레임의 카메라 뷰 행렬, FOV, HZB 텍스처 및 캐스케이드 절두체 정보를 통합 글로벌 컬링 유니폼 버퍼에 갱신합니다.
     * [EN] Updates the unified global culling uniform buffer with the current frame's camera view matrix, FOV, HZB texture, and cascade frustum data.
     *
     * @param foliageList -
     * [KO] 활성 식생(`Foliage`) 타입 배열
     * [EN] Array of active `Foliage` types
     * @param renderViewStateData -
     * [KO] 현재 프레임의 렌더 뷰 상태 데이터
     * [EN] Render view state data for the current frame
     */
    update(foliageList: Foliage[], renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 메인 및 그림자 간접 드로우 버퍼(Indirect Buffer) 카운터를 초기화하는 커맨드를 인코더에 기록합니다.
     * [EN] Records commands to reset main and shadow indirect draw buffer counters into the encoder.
     *
     * @param encoder -
     * [KO] 대상 `GPUCommandEncoder` 인스턴스
     * [EN] Target `GPUCommandEncoder` instance
     */
    recordResetCommands(encoder: GPUCommandEncoder): void;
    /**
     * [KO] 컴퓨트 패스 인코더에 통합 식생 컬링 컴퓨트 셰이더 디스패치 명령을 기록합니다.
     * [EN] Records unified foliage culling compute shader dispatch commands into the compute pass encoder.
     *
     * @param computePass -
     * [KO] 대상 `GPUComputePassEncoder` 인스턴스
     * [EN] Target `GPUComputePassEncoder` instance
     */
    dispatchPass(computePass: GPUComputePassEncoder): void;
    /**
     * [KO] 글로벌 컬링 유니폼을 갱신하고 `CommandEncoderManager`의 프리프로세스 패스에 간접 버퍼 초기화 및 컬링 디스패치를 등록합니다.
     * [EN] Updates global culling uniforms and registers indirect buffer reset and culling dispatch in the `CommandEncoderManager` pre-process pass.
     *
     * @param foliageList -
     * [KO] 활성 식생(`Foliage`) 타입 배열
     * [EN] Array of active `Foliage` types
     * @param renderViewStateData -
     * [KO] 현재 프레임의 렌더 뷰 상태 데이터
     * [EN] Render view state data for the current frame
     */
    updateAndDispatch(foliageList: Foliage[], renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 컬링 파이프라인, 베이커 및 내부 참조 리소스를 해제합니다.
     * [EN] Releases the culling pipeline, baker, and internal reference resources.
     */
    destroy(): void;
}
export default FoliageCuller;
