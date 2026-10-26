import type RedGPUContext from "../../../../context/RedGPUContext";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";
import type FoliageMegaBuffer from "../buffer/FoliageMegaBuffer";
import type Landscape from "../../../Landscape";
import type Foliage from "../Foliage";
import { FoliageSubCell } from "../Foliage";
/**
 * [KO] `FoliageInstanceBaker` 생성을 위한 옵션 인터페이스입니다.
 * [EN] Options interface for creating a `FoliageInstanceBaker`.
 * @category Landscape
 */
export interface FoliageInstanceBakerOptions {
    /**
     * [KO] 사용자 정의 베이킹 컴퓨트 셰이더 WGSL 코드 (선택)
     * [EN] Custom baking compute shader WGSL code (optional)
     */
    computeShaderCode?: string;
    /**
     * [KO] GPU 파이프라인 및 버퍼 디버그 레이블 (선택)
     * [EN] Debug label for GPU pipelines and buffers (optional)
     */
    label?: string;
}
/**
 * [KO] 컴퓨트 셰이더를 사용하여 지형 서브 셀 영역의 식생 인스턴스 트랜스폼 및 속성을 메가 버퍼에 베이킹하는 클래스입니다.
 * [EN] Class that bakes foliage instance transforms and attributes for terrain sub-cells into the mega buffer using a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class FoliageInstanceBaker extends AScatterInstanceBaker {
    #private;
    /**
     * [KO] `FoliageInstanceBaker` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageInstanceBaker` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param options -
     * [KO] 베이커 초기화 옵션 (선택)
     * [EN] Baker initialization options (optional)
     */
    constructor(redGPUContext: RedGPUContext, options?: FoliageInstanceBakerOptions);
    /**
     * [KO] 단일 식생 서브 셀에 대한 절차적 인스턴스 배치 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches a procedural instance placement compute pass for a single foliage sub-cell.
     *
     * @param megaBuffer -
     * [KO] 인스턴스 데이터가 기록될 `FoliageMegaBuffer` 인스턴스
     * [EN] `FoliageMegaBuffer` instance where instance data will be written
     * @param landscape -
     * [KO] 지형 높이맵 및 가중치 맵을 제공하는 `Landscape` 인스턴스
     * [EN] `Landscape` instance providing terrain heightmap and weight maps
     * @param foliage -
     * [KO] 베이킹할 대상 `Foliage` 타입 인스턴스
     * [EN] Target `Foliage` type instance to bake
     * @param subCell -
     * [KO] 베이킹할 대상 서브 셀 정보(`FoliageSubCell`)
     * [EN] Target sub-cell information (`FoliageSubCell`) to bake
     * @param targetSlot -
     * [KO] 메가 버퍼 내 기록 시작 슬롯 오프셋
     * [EN] Starting slot offset in the mega buffer for writing
     * @param targetCount -
     * [KO] 서브 셀에 할당된 최대 인스턴스 수
     * [EN] Maximum number of instances allocated for the sub-cell
     * @param subCellSize -
     * [KO] 서브 셀의 한 변 크기(월드 단위)
     * [EN] Side length of the sub-cell in world units
     */
    dispatchBakeSubCell(megaBuffer: FoliageMegaBuffer, landscape: Landscape, foliage: Foliage, subCell: FoliageSubCell, targetSlot: number, targetCount: number, subCellSize: number): void;
    /**
     * [KO] 베이커가 보유한 태스크 버퍼 및 GPU 리소스를 해제합니다.
     * [EN] Releases the task buffer and GPU resources held by the baker.
     */
    destroy(): void;
}
export default FoliageInstanceBaker;
