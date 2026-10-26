import RedGPUContext from "../../../../context/RedGPUContext";
import type Landscape from "../../../Landscape";
import type Grass from "../Grass";
import type GrassMegaBuffer from "../buffer/GrassMegaBuffer";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";
/**
 * [KO] 잔디 인스턴스 베이킹에 사용되는 셀 크기(단위: 미터)입니다.
 * [EN] Cell size (in meters) used for grass instance baking.
 *
 * @category Landscape
 */
export declare const GRASS_CELL_SIZE: number;
/**
 * [KO] 컴퓨트 셰이더를 사용하여 지형(Landscape) 표면에 잔디(Grass) 인스턴스를 베이킹하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that bakes grass instances onto the landscape surface using a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class GrassInstanceBaker extends AScatterInstanceBaker {
    #private;
    /**
     * [KO] `GrassInstanceBaker` 인스턴스를 생성합니다.
     * [EN] Creates a `GrassInstanceBaker` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 중심 좌표를 기준으로 반경 내 셀에 대해 잔디 인스턴스 베이킹 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches the grass instance baking compute pass for cells within the radius around the center coordinates.
     *
     * @param megaBuffer -
     * [KO] 잔디 인스턴스 데이터를 저장할 GrassMegaBuffer 인스턴스
     * [EN] GrassMegaBuffer instance to store grass instance data
     * @param landscape -
     * [KO] 지형(Landscape) 인스턴스
     * [EN] Landscape instance
     * @param grass -
     * [KO] 베이킹할 잔디(Grass) 타입 인스턴스
     * [EN] Grass type instance to bake
     * @param centerX -
     * [KO] 베이킹 중심 X 월드 좌표 (기본값: 0)
     * [EN] Baking center X world coordinate (default: 0)
     * @param centerZ -
     * [KO] 베이킹 중심 Z 월드 좌표 (기본값: 0)
     * [EN] Baking center Z world coordinate (default: 0)
     */
    dispatchBake(megaBuffer: GrassMegaBuffer, landscape: Landscape, grass: Grass, centerX?: number, centerZ?: number): void;
    /**
     * [KO] 베이커가 점유한 GPU 버퍼 및 캐시 리소스를 해제합니다.
     * [EN] Releases GPU buffers and cache resources occupied by the baker.
     */
    destroy(): void;
}
export default GrassInstanceBaker;
