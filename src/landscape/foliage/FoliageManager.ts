import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import type Landscape from "../Landscape";
import type {FoliageOptions} from "./core/Foliage";
import Foliage from "./core/Foliage";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCuller from "./core/culling/FoliageCuller";

import FoliageMegaBuffer from "./core/buffer/FoliageMegaBuffer";
import FoliageSlotPooler from "./core/buffer/FoliageSlotPooler";
import {AScatterManager} from "../core/scatter";
import {FOLIAGE_SUB_CELL_SIZE} from "./FOLIAGE_CONSTANTS";

const DEFAULT_MOUNT_BUDGET: number = 16;
const DEFAULT_UNMOUNT_BUDGET: number = 32;

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
class FoliageManager extends AScatterManager<Foliage, FoliageOptions> {
    #slotPooler: FoliageSlotPooler;

    #megaBuffer: FoliageMegaBuffer;

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #culler: FoliageCuller;

    #roundRobinIndex: number = 0;

    #dirtyUboMask: number = 0;
    #needsRepopulateMask: number = 0;
    #lastUpdateFrameIndex: number = -1;

    /**
     * [KO] `FoliageManager` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageManager` instance.
     *
     * @param landscape -
     * [KO] 식생이 배치될 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance where foliage is placed
     */
    constructor(landscape: Landscape) {
        super(landscape);
        const {redGPUContext} = this;
        this.#slotPooler = new FoliageSlotPooler(redGPUContext);
        const renderUnitMegaUBO = this.#slotPooler.gpuBuffer;

        const {gpuDevice, resourceManager} = redGPUContext;
        const {VERTEX} = GPUShaderStage;
        const renderUnitVertexBindGroupLayout = resourceManager.createBindGroupLayout('Foliage_RenderUnit_BindGroupLayout', {
            label: 'Foliage_RenderUnit_BindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: VERTEX,
                    buffer: {
                        type: 'uniform',
                        hasDynamicOffset: true,
                        minBindingSize: 32
                    }
                }
            ]
        });

        const renderUnitDynamicBindGroup = gpuDevice.createBindGroup({
            label: 'Foliage_RenderUnit_DynamicBindGroup',
            layout: renderUnitVertexBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: renderUnitMegaUBO,
                        offset: 0,
                        size: 32
                    }
                }
            ]
        });

        this.#megaBuffer = new FoliageMegaBuffer(redGPUContext);
        this.#pipelineRegistry = new FoliagePipelineRegistry(redGPUContext);
        this.#renderer = new FoliageRenderer(
            redGPUContext,
            this.#pipelineRegistry,
            renderUnitVertexBindGroupLayout,
            renderUnitDynamicBindGroup
        );
        this.#culler = new FoliageCuller(redGPUContext, this.#megaBuffer);

        this.#megaBuffer.onRecreated = () => {
            this.#renderer.markAllBundlesDirty();
        };
    }

    /**
     * [KO] 렌더 유닛 동적 유니폼 슬롯 풀러(`FoliageSlotPooler`)를 반환합니다.
     * [EN] Returns the render unit dynamic uniform slot pooler (`FoliageSlotPooler`).
     *
     * @returns
     * [KO] `FoliageSlotPooler` 인스턴스
     * [EN] `FoliageSlotPooler` instance
     */
    get slotPooler(): FoliageSlotPooler {
        return this.#slotPooler;
    }

    /**
     * [KO] 깊이 프리패스(Depth Prepass)에서 발생하는 총 드로우 콜 수를 반환합니다.
     * [EN] Returns the total number of draw calls issued in the depth prepass.
     *
     * @returns
     * [KO] 깊이 프리패스 드로우 콜 수
     * [EN] Number of depth prepass draw calls
     */
    get depthPrepassDrawCalls(): number {
        if (!this.enabled) return 0;
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const foliage = types[i];
            const {
                activeInstanceCount,
                depthPrepassOpaqueRenderUnits,
                depthPrepassMaskedRenderUnits
            } = foliage;
            if (activeInstanceCount > 0) {
                count += depthPrepassOpaqueRenderUnits.length + depthPrepassMaskedRenderUnits.length;
            }
        }
        return count;
    }

    /**
     * [KO] 메인 렌더 패스에서 발생하는 총 드로우 콜 수를 반환합니다.
     * [EN] Returns the total number of draw calls issued in the main render pass.
     *
     * @returns
     * [KO] 메인 패스 드로우 콜 수
     * [EN] Number of main pass draw calls
     */
    get mainPassDrawCalls(): number {
        if (!this.enabled) return 0;
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const {activeInstanceCount, mainRenderUnits} = types[i];
            if (activeInstanceCount > 0) {
                count += mainRenderUnits.length;
            }
        }
        return count;
    }

    /**
     * [KO] 현재 활성화된 모든 식생 타입의 총 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of active instances across all foliage types.
     *
     * @returns
     * [KO] 활성 인스턴스 총합
     * [EN] Total active instance count
     */
    get totalInstanceCount(): number {
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const {activeInstanceCount} = types[i];
            count += activeInstanceCount;
        }
        return count;
    }

    /**
     * [KO] 메가 버퍼(`FoliageMegaBuffer`)의 최대 인스턴스 수용량을 반환합니다.
     * [EN] Returns the maximum instance capacity of the mega buffer (`FoliageMegaBuffer`).
     *
     * @returns
     * [KO] 최대 인스턴스 수용량
     * [EN] Maximum instance capacity
     */
    get instanceCapacity(): number {
        return this.#megaBuffer.instanceCapacity;
    }

    /**
     * [KO] 식생 스트리밍 서브 셀의 한 변 크기(미터 단위)를 반환합니다.
     * [EN] Returns the side length of a foliage streaming sub-cell in meters.
     *
     * @returns
     * [KO] 서브 셀 크기 (미터)
     * [EN] Sub-cell size in meters
     */
    get subCellSize(): number {
        return FOLIAGE_SUB_CELL_SIZE;
    }

    /**
     * [KO] 간접 드로우 버퍼 카운터 초기화 명령을 커맨드 인코더에 기록합니다.
     * [EN] Records commands to reset indirect draw buffer counters into the command encoder.
     *
     * @param encoder -
     * [KO] 대상 `GPUCommandEncoder` 인스턴스
     * [EN] Target `GPUCommandEncoder` instance
     */
    recordResetCommands(encoder: GPUCommandEncoder): void {
        this.#culler.recordResetCommands(encoder);
    }

    /**
     * [KO] 공유 컴퓨트 패스 인코더에 식생 GPU 컬링 디스패치 명령을 기록합니다.
     * [EN] Records foliage GPU culling dispatch commands into the shared compute pass encoder.
     *
     * @param computePass -
     * [KO] 대상 `GPUComputePassEncoder` 인스턴스
     * [EN] Target `GPUComputePassEncoder` instance
     */
    dispatchCullingPass(computePass: GPUComputePassEncoder): void {
        this.#culler.dispatchPass(computePass);
    }

    /**
     * [KO] 매니저가 보유한 모든 식생 타입과 GPU 리소스를 해제합니다.
     * [EN] Releases all foliage types and GPU resources held by the manager.
     */
    destroy(): void {
        this.clearTypes();
        this.#megaBuffer.destroy();
        this.#pipelineRegistry.clearCache();
        this.#renderer.destroy();
        this.#culler.destroy();
        this.#slotPooler.destroy();
    }

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
    update(renderViewStateData: RenderViewStateData, standalone: boolean = false): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0) return;
        const {frameIndex} = renderViewStateData;
        if (this.#lastUpdateFrameIndex === frameIndex) return;
        this.#lastUpdateFrameIndex = frameIndex;

        const count = types.length;

        const repopMask = this.#needsRepopulateMask;
        if (repopMask !== 0) {
            for (let i = 0; i < count; i++) {
                const foliage = types[i];
                const typeId = foliage.typeId;
                if ((repopMask & (1 << typeId)) !== 0) {
                    this.#repopulateFoliage(foliage);
                }
            }
            this.#needsRepopulateMask = 0;
        }

        const uboMask = this.#dirtyUboMask;
        if (uboMask !== 0) {
            for (let i = 0; i < count; i++) {
                const foliage = types[i];
                const typeId = foliage.typeId;
                if ((uboMask & (1 << typeId)) !== 0) {
                    foliage.flushAllRenderUnitUBOs();
                }
            }
            this.#dirtyUboMask = 0;
        }

        const {view} = renderViewStateData;
        const {rawCamera} = view;
        const {x, z} = rawCamera;

        let remainingMount = DEFAULT_MOUNT_BUDGET;
        let remainingUnmount = DEFAULT_UNMOUNT_BUDGET;
        if (this.#roundRobinIndex >= count) {
            this.#roundRobinIndex = 0;
        }
        const startIdx = this.#roundRobinIndex;
        for (let i = 0; i < count; i++) {
            const idx = (startIdx + i) % count;
            const foliage = types[idx];
            foliage.updateStreaming(x, z, remainingMount, remainingUnmount);
            const {lastMountedCount, lastUnmountedCount} = foliage;
            remainingMount = Math.max(0, remainingMount - lastMountedCount);
            remainingUnmount = Math.max(0, remainingUnmount - lastUnmountedCount);
        }
        this.#roundRobinIndex = (this.#roundRobinIndex + 1) % count;

        if (standalone) {
            this.#culler.updateAndDispatch(types, renderViewStateData);
        } else {
            this.#culler.update(types, renderViewStateData);
        }
    }

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
    override computeTypeDrawCalls(foliage: Foliage): number {
        const {
            activeInstanceCount,
            mainRenderUnits,
            depthPrepassOpaqueRenderUnits,
            depthPrepassMaskedRenderUnits
        } = foliage;
        if (activeInstanceCount <= 0) return 0;
        return mainRenderUnits.length + depthPrepassOpaqueRenderUnits.length + depthPrepassMaskedRenderUnits.length;
    }

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
    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0) return;
        this.#renderer.render(view, passEncoder, types);
    }

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
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0) return;
        this.#renderer.renderShadow(view, passEncoder, types);
    }

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
    removeType(target: Foliage | string): boolean {
        const removed = this.unregisterTypeInternal(target);
        if (!removed) return false;

        const {typeId} = removed;
        const bit = 1 << typeId;
        this.#dirtyUboMask &= ~bit;
        this.#needsRepopulateMask &= ~bit;

        removed.destroy();
        this.#renderer.markAllBundlesDirty();
        return true;
    }

    /**
     * [KO] 등록된 모든 식생 타입을 제거하고 내부 더티 마스크를 초기화합니다.
     * [EN] Removes all registered foliage types and resets internal dirty masks.
     */
    override clearTypes(): void {
        this.#dirtyUboMask = 0;
        this.#needsRepopulateMask = 0;
        super.clearTypes();
    }

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
    addType(options: FoliageOptions): Foliage {
        const {name} = options;
        const existing = this.getTypeByName(name);
        if (existing) {
            console.warn(`[FoliageManager] Foliage with name '${name}' already exists.`);
            return existing;
        }

        const {redGPUContext, landscape} = this;
        const foliage = new Foliage(
            redGPUContext,
            options,
            this.#megaBuffer,
            this.#culler.baker,
            this.#slotPooler,
            landscape
        );
        foliage.onUniformDirty = this.#onFoliageUniformDirty;
        foliage.onRepopulateRequired = this.#onFoliageRepopulateRequired;
        this.registerTypeInternal(foliage);
        this.#renderer.markAllBundlesDirty();

        return foliage;
    }

    /**
     * [KO] 등록된 모든 식생 타입의 서브 셀 캐시를 초기화하고 인스턴스 재배치를 예약합니다.
     * [EN] Clears sub-cell caches for all registered foliage types and schedules instance repopulation.
     */
    repopulateAll(): void {
        const {types} = this;
        const count = types.length;
        for (let i = 0; i < count; i++) {
            const foliage = types[i];
            const typeId = foliage.typeId;
            this.#needsRepopulateMask |= (1 << typeId);
            this.#dirtyUboMask |= (1 << typeId);
            this.#repopulateFoliage(foliage);
        }
    }

    /**
     * [KO] 등록된 모든 식생 타입의 마운트된 서브 셀을 즉시 재베이킹합니다.
     * [EN] Immediately rebakes mounted sub-cells for all registered foliage types.
     */
    rebakeAll(): void {
        const {types} = this;
        const count = types.length;
        for (let i = 0; i < count; i++) {
            types[i].rebake();
        }
        this.#renderer.markAllBundlesDirty();
    }

    #onFoliageUniformDirty = (typeId: number): void => {
        this.#dirtyUboMask |= (1 << typeId);
    };

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
    override computeTypeShadowDrawCalls(foliage: Foliage): number {
        const {
            shadowCullDistance,
            activeInstanceCount,
            hasImpostor,
            lodInfoList,
            hasMaskedLOD0,
            lod0RenderUnits
        } = foliage;
        if (shadowCullDistance <= 0 || activeInstanceCount <= 0) return 0;
        const num3DLODs = hasImpostor ? Math.max(1, lodInfoList.length - 1) : lodInfoList.length;
        const cascadeDraws = hasMaskedLOD0
            ? lod0RenderUnits.length + (num3DLODs > 1 ? 1 : 0)
            : 1;
        return cascadeDraws * 2 + 2;
    }

    #repopulateFoliage(type: Foliage): void {
        type.clearSubCellCache();
        this.#renderer.markShadowBundleDirty();
    }

    #onFoliageRepopulateRequired = ({typeId}: Foliage): void => {
        this.#needsRepopulateMask |= (1 << typeId);
        this.#dirtyUboMask |= (1 << typeId);
    };

}

Object.freeze(FoliageManager);
export default FoliageManager;
