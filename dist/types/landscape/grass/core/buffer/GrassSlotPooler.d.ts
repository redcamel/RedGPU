import RedGPUContext from "../../../../context/RedGPUContext";
import type Grass from "../Grass";
import AScatterSlotPooler from "../../../core/scatter/AScatterSlotPooler";
/**
 * [KO] 잔디(Grass) 타입별 렌더링 유니폼 파라미터 슬롯을 메가 UBO로 풀링 및 관리하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that pools and manages per-type grass rendering uniform parameter slots in a mega UBO.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class GrassSlotPooler extends AScatterSlotPooler {
    /**
     * [KO] 슬롯당 유효 유니폼 파라미터 크기 (바이트 단위)
     * [EN] Effective uniform parameter size per slot (in bytes)
     */
    static PARAMS_SIZE_BYTES: number;
    /**
     * [KO] `GrassSlotPooler` 인스턴스를 생성합니다.
     * [EN] Creates a `GrassSlotPooler` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 지정된 슬롯에 잔디 타입의 렌더링 및 셰이딩 파라미터를 기록하고 GPU 버퍼에 업로드합니다.
     * [EN] Writes rendering and shading parameters of a grass type to the specified slot and uploads them to the GPU buffer.
     *
     * @param slot -
     * [KO] 기록할 대상 슬롯 인덱스
     * [EN] Target slot index to write to
     * @param grass -
     * [KO] 잔디(Grass) 타입 인스턴스
     * [EN] Grass type instance
     * @param hasValidVbt -
     * [KO] 지형 베이스 컬러 텍스처(VBT) 유효 여부
     * [EN] Whether the terrain base color texture (VBT) is valid
     */
    writeGrassSlot(slot: number, grass: Grass, hasValidVbt: boolean): void;
}
export default GrassSlotPooler;
