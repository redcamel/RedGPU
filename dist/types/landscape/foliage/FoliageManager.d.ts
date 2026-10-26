import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import type Landscape from "../Landscape";
import type { FoliageOptions } from "./core/Foliage";
import Foliage from "./core/Foliage";
import { AScatterManager } from "../core/scatter";
/**
 * [KO] 지형(`Landscape`) 상의 식생 타입 등록, 서브 셀 스트리밍, GPU 컬링 및 렌더링을 관리하는 클래스입니다.
 * [EN] Class that manages foliage type registration, sub-cell streaming, GPU culling, and rendering on a `Landscape`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 지형 식생 매니저를 통해 새로운 식생 타입 등록
 * // [EN] Register a new foliage type via the landscape foliage manager
 * const foliage = landscape.foliageManager.addType({
 *     name: 'PineTree',
 *     lods: [{ mesh: pineMesh, lodDistance: 80 }],
 *     densityPerHectare: 120
 * });
 * ```
 *
 * @see [Foliage and Impostors example](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 * @category Landscape
 */
declare class FoliageManager extends AScatterManager<Foliage, FoliageOptions> {
    #private;
    /**
     * [KO] `FoliageManager` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageManager` instance.
     *
     * @param landscape -
     * [KO] 식생이 배치될 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance where foliage is placed
     */
    constructor(landscape: Landscape);
    /**
     * [KO] 깊이 프리패스(Depth Prepass)에서 발생하는 총 드로우 콜 수를 반환합니다.
     * [EN] Returns the total number of draw calls issued in the depth prepass.
     *
     * @returns
     * [KO] 깊이 프리패스 드로우 콜 수
     * [EN] Number of depth prepass draw calls
     */
    get depthPrepassDrawCalls(): number;
    /**
     * [KO] 메인 렌더 패스에서 발생하는 총 드로우 콜 수를 반환합니다.
     * [EN] Returns the total number of draw calls issued in the main render pass.
     *
     * @returns
     * [KO] 메인 패스 드로우 콜 수
     * [EN] Number of main pass draw calls
     */
    get mainPassDrawCalls(): number;
    /**
     * [KO] 현재 활성화된 모든 식생 타입의 총 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of active instances across all foliage types.
     *
     * @returns
     * [KO] 활성 인스턴스 총합
     * [EN] Total active instance count
     */
    get totalInstanceCount(): number;
    /**
     * [KO] 메가 버퍼(`FoliageMegaBuffer`)의 최대 인스턴스 수용량을 반환합니다.
     * [EN] Returns the maximum instance capacity of the mega buffer (`FoliageMegaBuffer`).
     *
     * @returns
     * [KO] 최대 인스턴스 수용량
     * [EN] Maximum instance capacity
     */
    get instanceCapacity(): number;
    /**
     * [KO] 식생 스트리밍 서브 셀의 한 변 크기(미터 단위)를 반환합니다.
     * [EN] Returns the side length of a foliage streaming sub-cell in meters.
     *
     * @returns
     * [KO] 서브 셀 크기 (미터)
     * [EN] Sub-cell size in meters
     */
    get subCellSize(): number;
    /**
     * [KO] 간접 드로우 버퍼 카운터 초기화 명령을 커맨드 인코더에 기록합니다.
     * [EN] Records commands to reset indirect draw buffer counters into the command encoder.
     *
     * @param encoder -
     * [KO] 대상 `GPUCommandEncoder` 인스턴스
     * [EN] Target `GPUCommandEncoder` instance
     */
    recordResetCommands(encoder: GPUCommandEncoder): void;
    /**
     * [KO] 공유 컴퓨트 패스 인코더에 식생 GPU 컬링 디스패치 명령을 기록합니다.
     * [EN] Records foliage GPU culling dispatch commands into the shared compute pass encoder.
     *
     * @param computePass -
     * [KO] 대상 `GPUComputePassEncoder` 인스턴스
     * [EN] Target `GPUComputePassEncoder` instance
     */
    dispatchCullingPass(computePass: GPUComputePassEncoder): void;
    /**
     * [KO] 매니저가 보유한 모든 식생 타입과 GPU 리소스를 해제합니다.
     * [EN] Releases all foliage types and GPU resources held by the manager.
     */
    destroy(): void;
    /**
     * [KO] 매 프레임 식생 서브 셀 스트리밍, 유니폼 갱신 및 컬링 상태를 업데이트합니다.
     * [EN] Updates foliage sub-cell streaming, uniform buffers, and culling state every frame.
     *
     * @param renderViewStateData -
     * [KO] 현재 프레임의 렌더 뷰 상태 데이터
     * [EN] Render view state data for the current frame
     * @param standalone -
     * [KO] 단독 컴퓨트 패스로 즉시 컬링을 디스패치할지 여부 (기본값: `false`)
     * [EN] Whether to immediately dispatch culling in a standalone compute pass (default: `false`)
     */
    update(renderViewStateData: RenderViewStateData, standalone?: boolean): void;
    /**
     * [KO] 단일 식생 타입의 메인 및 깊이 프리패스 드로우 콜 수를 계산합니다.
     * [EN] Computes the number of main and depth prepass draw calls for a single foliage type.
     *
     * @param foliage -
     * [KO] 계산할 대상 `Foliage` 인스턴스
     * [EN] Target `Foliage` instance to compute
     * @returns
     * [KO] 드로우 콜 수
     * [EN] Number of draw calls
     */
    computeTypeDrawCalls(foliage: Foliage): number;
    /**
     * [KO] 메인 렌더 패스에 등록된 모든 식생 타입을 렌더링합니다.
     * [EN] Renders all registered foliage types in the main render pass.
     *
     * @param view -
     * [KO] 현재 렌더링 중인 `View3D` 인스턴스
     * [EN] Currently rendering `View3D` instance
     * @param passEncoder -
     * [KO] 대상 `GPURenderPassEncoder` 인스턴스
     * [EN] Target `GPURenderPassEncoder` instance
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder): void;
    /**
     * [KO] 디렉셔널 그림자 패스에 등록된 모든 식생 타입의 그림자를 렌더링합니다.
     * [EN] Renders shadows for all registered foliage types in the directional shadow pass.
     *
     * @param view -
     * [KO] 현재 렌더링 중인 `View3D` 인스턴스
     * [EN] Currently rendering `View3D` instance
     * @param passEncoder -
     * [KO] 그림자 패스의 `GPURenderPassEncoder` 인스턴스
     * [EN] `GPURenderPassEncoder` instance of the shadow pass
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void;
    /**
     * [KO] 지정한 식생 인스턴스 또는 이름과 일치하는 식생 타입을 매니저에서 제거하고 파기합니다.
     * [EN] Removes and destroys the foliage type matching the specified instance or name from the manager.
     *
     * @param target -
     * [KO] 제거할 `Foliage` 인스턴스 또는 식생 타입 이름
     * [EN] `Foliage` instance or foliage type name to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether the removal succeeded
     */
    removeType(target: Foliage | string): boolean;
    /**
     * [KO] 등록된 모든 식생 타입을 제거하고 내부 더티 마스크를 초기화합니다.
     * [EN] Removes all registered foliage types and resets internal dirty masks.
     */
    clearTypes(): void;
    /**
     * [KO] 새로운 식생(`Foliage`) 타입을 생성하여 매니저에 등록합니다.
     * [EN] Creates a new `Foliage` type and registers it with the manager.
     *
     * @param options -
     * [KO] 식생 생성 옵션(`FoliageOptions`)
     * [EN] Foliage creation options (`FoliageOptions`)
     * @returns
     * [KO] 생성 및 등록된 `Foliage` 인스턴스
     * [EN] Created and registered `Foliage` instance
     */
    addType(options: FoliageOptions): Foliage;
    /**
     * [KO] 등록된 모든 식생 타입의 서브 셀 캐시를 초기화하고 인스턴스 재배치를 예약합니다.
     * [EN] Clears sub-cell caches for all registered foliage types and schedules instance repopulation.
     */
    repopulateAll(): void;
    /**
     * [KO] 등록된 모든 식생 타입의 마운트된 서브 셀을 즉시 재베이킹합니다.
     * [EN] Immediately rebakes mounted sub-cells for all registered foliage types.
     */
    rebakeAll(): void;
    /**
     * [KO] 단일 식생 타입의 그림자 패스 드로우 콜 수를 계산합니다.
     * [EN] Computes the number of shadow pass draw calls for a single foliage type.
     *
     * @param foliage -
     * [KO] 계산할 대상 `Foliage` 인스턴스
     * [EN] Target `Foliage` instance to compute
     * @returns
     * [KO] 그림자 패스 드로우 콜 수
     * [EN] Number of shadow pass draw calls
     */
    computeTypeShadowDrawCalls(foliage: Foliage): number;
}
export default FoliageManager;
