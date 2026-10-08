/**
 * [KO] 대규모 지형 3D 식생 생태계 및 인스턴스/컬링/렌더링 총괄 매니저 모듈입니다.
 * [EN] Overall manager module for large-scale terrain 3D foliage ecosystems, instances, culling, and rendering.
 * @packageDocumentation
 */
import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import type Landscape from "../Landscape";
import type {FoliageOptions} from "./core/Foliage";
import Foliage from "./core/Foliage";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCuller from "./core/culling/FoliageCuller";

import FoliageScatterMegaBuffer from "./core/buffer/FoliageScatterMegaBuffer";
import {FoliageSlotPooler} from "./core/renderUnit/FoliageSlotPooler";
import {AScatterManager} from "../core/scatter";

/**
 * [KO] 대규모 지형(Landscape)의 3D 식생(나무, 수풀, 바위 등) 및 옥타헤드럴 임포스터 생태계를 총괄 관리하는 매니저 클래스입니다.
 * [EN] Manager class that oversees the large-scale 3D foliage (trees, bushes, rocks, etc.) and octahedral impostor ecosystem of the landscape.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const foliageManager = landscape.foliageManager;
 *
 * // 식생 생태계 타입 등록 (다중 LOD 및 옥타헤드럴 임포스터 지원)
 * const pineTree = foliageManager.addType({
 *     name: 'PineTree',
 *     lods: [
 *         { mesh: treeMeshLOD0, lodDistance: 50 },
 *         { mesh: treeMeshLOD1, lodDistance: 120 }
 *     ],
 *     densityPerHectare: 80,
 *     streamingRadius: 800,
 *     useImpostor: true,
 *     minScale: [0.8, 0.8, 0.8],
 *     maxScale: [1.3, 1.3, 1.3]
 * });
 * ```
 *
 * @category Landscape
 */
class FoliageManager extends AScatterManager<Foliage, FoliageOptions> {
    #renderUnitVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #renderUnitDynamicBindGroup: GPUBindGroup | null = null;
    #slotPooler: FoliageSlotPooler;

    #megaBuffer: FoliageScatterMegaBuffer;

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #culler: FoliageCuller;
    #useDepthPrepass: boolean = true;

    #subCellSize: number = 100.0;
    #mountBudget: number = 16;
    #unmountBudget: number = 32;
    #roundRobinIndex: number = 0;
    #debugSubCellColoration: boolean = false;
    #onUniformUpdateNeeded: (() => void) | null = null;

    #dirtyUboMask: number = 0;
    #needsRepopulateMask: number = 0;

    /**
     * [KO] FoliageManager의 새 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `landscape.foliageManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a new instance of FoliageManager. (Do not instantiate directly; access via the `landscape.foliageManager` property.)
     *
     * @param landscape -
     * [KO] 식생 생태계가 바인딩될 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance to which the foliage ecosystem is bound
     * @param onUniformUpdateNeeded -
     * [KO] 지형 유니폼 버퍼 갱신이 필요할 때 호출되는 내부 콜백 함수
     * [EN] Internal callback invoked when terrain uniform buffers require updating
     */
    constructor(landscape: Landscape, onUniformUpdateNeeded?: () => void) {
        super(landscape);
        this.#onUniformUpdateNeeded = onUniformUpdateNeeded ?? null;
        this.#slotPooler = new FoliageSlotPooler(this.redGPUContext);
        const renderUnitMegaUBO = this.#slotPooler.gpuBuffer;

        const {gpuDevice, resourceManager} = this.redGPUContext;
        if (gpuDevice && renderUnitMegaUBO) {
            this.#renderUnitVertexBindGroupLayout = resourceManager.createBindGroupLayout('Foliage_RenderUnit_BindGroupLayout', {
                label: 'Foliage_RenderUnit_BindGroupLayout',
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {
                            type: 'uniform',
                            hasDynamicOffset: true,
                            minBindingSize: 32
                        }
                    }
                ]
            });

            this.#renderUnitDynamicBindGroup = gpuDevice.createBindGroup({
                label: 'Foliage_RenderUnit_DynamicBindGroup',
                layout: this.#renderUnitVertexBindGroupLayout,
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
        }

        this.#megaBuffer = new FoliageScatterMegaBuffer(this.redGPUContext);
        this.#pipelineRegistry = new FoliagePipelineRegistry(this.redGPUContext);
        this.#renderer = new FoliageRenderer(
            this.redGPUContext,
            this.#pipelineRegistry,
            this.#renderUnitVertexBindGroupLayout,
            this.#renderUnitDynamicBindGroup
        );
        this.#culler = new FoliageCuller(this.redGPUContext, this.#megaBuffer);

        this.#megaBuffer.onRecreated = () => {
            this.#renderer.markAllBundlesDirty();
        };
    }

    /**
     * [KO] 렌더 유닛 UBO 슬롯 풀러를 반환합니다.
     * [EN] Returns the render unit UBO slot pooler.
     */
    get slotPooler(): FoliageSlotPooler {
        return this.#slotPooler;
    }

    /**
     * [KO] 활성화된 식생 타입들이 Depth Prepass에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by active foliage types in the depth prepass.
     */
    get depthPrepassDrawCalls(): number {
        if (!this.enabled || !this.#useDepthPrepass) return 0;
        let count = 0;
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const foliage = list[i];
            if (foliage.activeInstanceCount > 0 && foliage.useDepthPrepass) {
                count += foliage.depthPrepassOpaqueRenderUnits.length + foliage.depthPrepassMaskedRenderUnits.length;
            }
        }
        return count;
    }

    /**
     * [KO] 활성화된 식생 타입들이 순수 메인 렌더 패스(Forward Pass)에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by active foliage types in the forward main render pass.
     */
    get mainPassDrawCalls(): number {
        if (!this.enabled) return 0;
        let count = 0;
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const foliage = list[i];
            if (foliage.activeInstanceCount > 0) {
                count += foliage.mainRenderUnits.length;
            }
        }
        return count;
    }

    /**
     * [KO] 불투명(Opaque) 식생 렌더 유닛에 대한 Depth Prepass(Z-Prepass) 활성화 여부를 반환합니다.
     * [EN] Gets whether Depth Prepass (Z-Prepass) is enabled for opaque foliage render units.
     */
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    /**
     * [KO] 불투명(Opaque) 식생 렌더 유닛에 대한 Depth Prepass(Z-Prepass) 활성화 여부를 설정합니다.
     * [EN] Sets whether Depth Prepass (Z-Prepass) is enabled for opaque foliage render units.
     *
     * @param val -
     * [KO] 활성화 여부 (`true`일 경우 메인 렌더링 전 Depth Prepass를 선행하여 픽셀 오버드로우 최소화)
     * [EN] Whether to enable (when `true`, runs Depth Prepass before main rendering to minimize pixel overdraw)
     */
    set useDepthPrepass(val: boolean) {
        const boolVal = !!val;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#renderer.useDepthPrepass = boolVal;
        }
    }

    /**
     * [KO] 매 프레임 호출되어 카메라 위치에 기반한 식생 공간 격자 셀 스트리밍을 갱신하고, GPU 컬링 Compute Pass를 디스패치합니다.
     * [EN] Called every frame to update foliage spatial grid streaming based on camera position and dispatch GPU culling compute passes.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더 상태 데이터 (카메라, HZB 텍스처 뷰, 절두체 평면 등 포함)
     * [EN] View render state data (including camera, HZB texture views, frustum planes, etc.)
     */
    update(renderViewStateData: RenderViewStateData): void {
        const {enabled, types, landscape} = this;
        if (!enabled || types.length === 0) return;

        const count = types.length;

        // 1. [Bake 채널] 지형/인스턴스 파라미터 변경으로 재배치가 필요한 식생 타입 서브셀 캐시 리셋
        const repopMask = this.#needsRepopulateMask;
        if (repopMask !== 0) {
            for (let i = 0; i < count; i++) {
                const foliage = types[i];
                const typeId = foliage.allocation?.typeId ?? 0;
                if ((repopMask & (1 << typeId)) !== 0) {
                    this.#repopulateFoliage(foliage);
                }
            }
            this.#needsRepopulateMask = 0;
        }

        // 2. [UBO 채널] 바람/지면블렌드/LOD전환거리 등 UBO가 변경된 식생 렌더 유닛 UBO 슬롯 1회 일괄 플러시
        const uboMask = this.#dirtyUboMask;
        if (uboMask !== 0) {
            for (let i = 0; i < count; i++) {
                const foliage = types[i];
                const typeId = foliage.allocation?.typeId ?? 0;
                if ((uboMask & (1 << typeId)) !== 0) {
                    foliage.flushAllRenderUnitUBOs();
                }
            }
            this.#dirtyUboMask = 0;
        }

        const {view} = renderViewStateData;
        const {rawCamera: cam} = view;
        const {x: camX, z: camZ} = cam;

        let remainingMount = this.#mountBudget;
        let remainingUnmount = this.#unmountBudget;
        if (this.#roundRobinIndex >= count) {
            this.#roundRobinIndex = 0;
        }
        const startIdx = this.#roundRobinIndex;
        for (let i = 0; i < count; i++) {
            const idx = (startIdx + i) % count;
            const foliage = types[idx];
            foliage.updateStreaming(camX, camZ, remainingMount, remainingUnmount);
            remainingMount = Math.max(0, remainingMount - foliage.lastMountedCount);
            remainingUnmount = Math.max(0, remainingUnmount - foliage.lastUnmountedCount);
        }
        this.#roundRobinIndex = (this.#roundRobinIndex + 1) % count;

        this.#culler.updateAndDispatch(types, landscape, renderViewStateData);
    }

    /**
     * [KO] 매니저에 등록된 모든 식생을 제거하고 메가버퍼, 렌더러, 컬링 디스패처 등 모든 WebGPU 자원을 안전하게 해제합니다.
     * [EN] Clears all foliage registered in the manager and safely releases all WebGPU resources including mega-buffers, renderers, and culling dispatchers.
     */
    destroy(): void {
        this.clearTypes();
        this.#megaBuffer.destroy();
        this.#pipelineRegistry.clearCache();
        this.#renderer.destroy();
        this.#culler.destroy();
        this.#slotPooler.destroy();
        this.#renderUnitDynamicBindGroup = null;
        this.#renderUnitVertexBindGroupLayout = null;
        this.#onUniformUpdateNeeded = null;
    }

    /**
     * [KO] 특정 식생 타입이 메인 렌더 패스(Depth Prepass 활성화 시 포함)에서 발행하는 간접 드로우콜 수를 단일 패스로 계산합니다.
     * [EN] Computes the number of indirect draw calls dispatched by a specific foliage type in the main render pass (including Depth Prepass if active) in a single pass.
     */
    protected override computeTypeDrawCalls(foliage: Foliage): number {
        if (foliage.activeInstanceCount <= 0) return 0;
        let count = foliage.mainRenderUnits.length;
        if (this.#useDepthPrepass && foliage.useDepthPrepass) {
            count += foliage.depthPrepassOpaqueRenderUnits.length + foliage.depthPrepassMaskedRenderUnits.length;
        }
        return count;
    }

    /**
     * [KO] 식생 공간 분할 격자의 단위 서브셀 크기를 설정합니다. 변경 시 식생 서브셀 캐시가 초기화되고 온디맨드 재배치가 수행됩니다.
     * [EN] Sets the unit subcell size of the foliage spatial grid. Foliage subcell caches are cleared and repopulated on-demand across cells upon change.
     *
     * @param val -
     * [KO] 설정할 서브셀 크기 (최소값: 10.0)
     * [EN] Subcell size to set (minimum: 10.0)
     */
    set subCellSize(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#subCellSize !== clamped) {
            this.#subCellSize = clamped;
            this.#onUniformUpdateNeeded?.();
            this.repopulateAll();
        }
    }


    /**
     * [KO] 현재 스트리밍되어 메모리에 로드된 총 식생 인스턴스 수를 반환합니다. (GrassManager 대칭 프로퍼티)
     * [EN] Returns the total number of foliage instances currently populated and loaded in memory. (Symmetric to GrassManager)
     */
    get totalInstanceCount(): number {
        let count = 0;
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            count += list[i].activeInstanceCount;
        }
        return count;
    }

    /**
     * [KO] 현재 메가버퍼(MegaBuffer)에 할당된 최대 식생 인스턴스 수용 용량(VRAM Buffer Capacity)을 반환합니다. (GrassManager 대칭 프로퍼티)
     * [EN] Returns the maximum foliage instance capacity (VRAM Buffer Capacity) currently allocated in the mega-buffer. (Symmetric to GrassManager)
     */
    get instanceCapacity(): number {
        return this.#megaBuffer.instanceCapacity;
    }

    /**
     * [KO] 식생 공간 분할 격자(Foliage Spatial Grid)의 단위 서브셀 크기(단위: 월드 유닛, 기본값: 100)를 반환합니다.
     * [EN] Gets the unit subcell size of the foliage spatial grid (unit: world units, default: 100).
     */
    get subCellSize(): number {
        return this.#subCellSize;
    }

    /**
     * [KO] 메인 렌더 패스에서 GPU 컬링을 통과한 식생 인스턴스들을 일괄 렌더링합니다.
     * [EN] Renders culled foliage instances in the main render pass.
     *
     * @param view -
     * [KO] 현재 렌더링 중인 View3D 객체
     * [EN] Current View3D object being rendered
     * @param passEncoder -
     * [KO] 메인 씬 GPURenderPassEncoder
     * [EN] Main scene GPURenderPassEncoder
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || !passEncoder || types.length === 0) return;
        this.#renderer.render(view, passEncoder, types);
    }


    /**
     * [KO] 지형 셰이더에서 식생 공간 서브셀 경계를 온스크린 격자 색상으로 시각화할지 여부를 반환합니다.
     * [EN] Gets whether to visualize foliage spatial subcell boundaries with on-screen grid colors in the landscape shader.
     */
    get debugSubCellColoration(): boolean {
        return this.#debugSubCellColoration;
    }

    /**
     * [KO] 지형 셰이더에서 식생 공간 서브셀 경계의 시각화 여부를 설정합니다.
     * [EN] Sets whether to visualize foliage spatial subcell boundaries in the landscape shader.
     *
     * @param val -
     * [KO] 디버그 색상화 활성화 여부
     * [EN] Whether to enable debug coloration
     */
    set debugSubCellColoration(val: boolean) {
        const boolVal = !!val;
        if (this.#debugSubCellColoration !== boolVal) {
            this.#debugSubCellColoration = boolVal;
            this.#onUniformUpdateNeeded?.();
        }
    }

    /**
     * [KO] 매 프레임 모든 식생 타입을 통틀어 최대로 마운트할 수 있는 전역 서브셀 예산 총량을 반환합니다.
     * [EN] Returns the global maximum subcell mount budget per frame across all foliage types.
     */
    get mountBudget(): number {
        return this.#mountBudget;
    }

    /**
     * [KO] 매 프레임 모든 식생 타입을 통틀어 최대로 마운트할 수 있는 전역 서브셀 예산 총량을 설정합니다.
     * [EN] Sets the global maximum subcell mount budget per frame across all foliage types.
     *
     * @param val -
     * [KO] 설정할 마운트 예산 (최소값: 1, 기본값: 16)
     * [EN] Mount budget to set (minimum: 1, default: 16)
     */
    set mountBudget(val: number) {
        this.#mountBudget = Math.max(1, (val | 0) || 1);
    }

    /**
     * [KO] 매 프레임 모든 식생 타입을 통틀어 최대로 언마운트할 수 있는 전역 서브셀 예산 총량을 반환합니다.
     * [EN] Returns the global maximum subcell unmount budget per frame across all foliage types.
     */
    get unmountBudget(): number {
        return this.#unmountBudget;
    }

    /**
     * [KO] 매 프레임 모든 식생 타입을 통틀어 최대로 언마운트할 수 있는 전역 서브셀 예산 총량을 설정합니다.
     * [EN] Sets the global maximum subcell unmount budget per frame across all foliage types.
     *
     * @param val -
     * [KO] 설정할 언마운트 예산 (최소값: 1, 기본값: 32)
     * [EN] Unmount budget to set (minimum: 1, default: 32)
     */
    set unmountBudget(val: number) {
        this.#unmountBudget = Math.max(1, (val | 0) || 1);
    }



    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사가 설정된 식생 인스턴스들의 그림자를 렌더링합니다.
     * [EN] Renders shadows for foliage instances in the cascaded shadow map (CSM) pass.
     *
     * @param view -
     * [KO] 그림자 패스를 렌더링 중인 View3D 객체
     * [EN] Current View3D object rendering the shadow pass
     * @param passEncoder -
     * [KO] 섀도우 맵 생성을 위한 GPURenderPassEncoder
     * [EN] GPURenderPassEncoder for shadow map generation
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || !passEncoder || types.length === 0) return;
        this.#renderer.renderShadow(view, passEncoder, types);
    }

    /**
     * [KO] 등록된 식생 생태계 타입을 매니저에서 제거하고 관련 리소스를 해제합니다.
     * [EN] Removes a registered foliage ecosystem type from the manager and releases associated resources.
     *
     * @param target -
     * [KO] 제거할 식생의 고유 이름(`string`) 또는 {@link Foliage} 인스턴스
     * [EN] Unique name (`string`) or {@link Foliage} instance to remove
     * @returns
     * [KO] 대상이 정상적으로 제거되었으면 `true`, 미존재 시 `false`
     * [EN] `true` if target was found and removed, `false` otherwise
     */
    removeType(target: Foliage | string): boolean {
        if (!target) return false;
        const removed = this.unregisterTypeInternal(target);
        if (!removed) return false;

        if (removed.allocation) {
            const bit = 1 << removed.allocation.typeId;
            this.#dirtyUboMask &= ~bit;
            this.#needsRepopulateMask &= ~bit;
        }

        removed.destroy();
        this.#renderer.markAllBundlesDirty();
        return true;
    }

    /**
     * [KO] 등록된 모든 식생 타입을 일괄 제거하고 비트마스크를 초기화합니다.
     * [EN] Clears all registered foliage types and resets bitmasks.
     */
    override clearTypes(): void {
        this.#dirtyUboMask = 0;
        this.#needsRepopulateMask = 0;
        super.clearTypes();
    }

    /**
     * [KO] 새로운 식생 생태계 타입({@link Foliage})을 생성하여 매니저에 등록하고, 카메라 기반 온디맨드 스트리밍을 준비합니다.
     * [EN] Creates and registers a new foliage ecosystem type ({@link Foliage}) into the manager, preparing camera-based on-demand streaming.
     *
     * @param options -
     * [KO] 식생 생성 및 지형 배치 규칙 옵션 {@link FoliageOptions}
     * [EN] Foliage creation and landscape placement rule options {@link FoliageOptions}
     * @returns
     * [KO] 생성되어 등록된 {@link Foliage} 인스턴스
     * [EN] Newly created and registered {@link Foliage} instance
     */
    addType(options: FoliageOptions): Foliage {
        const {name} = options;
        const existing = this.getTypeByName(name);
        if (existing) {
            console.warn(`[FoliageManager] Foliage with name '${name}' already exists.`);
            return existing;
        }

        const foliage = new Foliage(
            this.redGPUContext,
            options,
            this.#megaBuffer,
            this.#culler.baker,
            this.#slotPooler,
            this.landscape
        );
        foliage.onUniformDirty = this.#onFoliageUniformDirty;
        foliage.onRepopulateRequired = this.#onFoliageRepopulateRequired;
        this.registerTypeInternal(foliage);
        this.#renderer.markAllBundlesDirty();

        return foliage;
    }

    /**
     * [KO] 등록된 모든 식생 인스턴스의 서브셀 캐시를 초기화하고 온디맨드 재배치를 트리거합니다.
     * [EN] Clears the sub-cell cache of all registered foliage instances and triggers on-demand repopulation.
     */
    repopulateAll(): void {
        const count = this.types.length;
        for (let i = 0; i < count; i++) {
            const foliage = this.types[i];
            const typeId = foliage.allocation?.typeId ?? 0;
            this.#needsRepopulateMask |= (1 << typeId);
            this.#dirtyUboMask |= (1 << typeId);
            this.#repopulateFoliage(foliage);
        }
    }

    /**
     * [KO] 등록된 모든 식생 타입의 메가버퍼 인스턴스 배치를 강제로 다시 베이크(Rebake)합니다.
     * [EN] Forces a rebake of mega-buffer instance placement for all registered foliage types.
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
     * [KO] 그림자를 투사하는 특정 식생 타입이 CSM 그림자 맵 패스에서 발행하는 간접 드로우콜 수를 계산합니다.
     * [EN] Computes the number of indirect draw calls dispatched by a shadow-casting foliage type in the CSM shadow pass.
     */
    protected override computeTypeShadowDrawCalls(foliage: Foliage): number {
        if (foliage.shadowCullDistance <= 0 || foliage.activeInstanceCount <= 0) return 0;
        const num3DLODs = foliage.hasImpostor ? Math.max(1, foliage.lodInfoList.length - 1) : foliage.lodInfoList.length;
        let count = foliage.hasMaskedLOD0
            ? foliage.lod0RenderUnits.length + (num3DLODs > 1 ? 1 : 0)
            : 1;
        count += 3;
        return count;
    }

    #repopulateFoliage(type: Foliage): void {
        if (!type) return;

        type.clearSubCellCache();
        this.#renderer.markShadowBundleDirty();
    }

    #onFoliageRepopulateRequired = (type: Foliage): void => {
        const typeId = type.allocation?.typeId ?? 0;
        this.#needsRepopulateMask |= (1 << typeId);
        this.#dirtyUboMask |= (1 << typeId);
    };

}

Object.freeze(FoliageManager);
export default FoliageManager;
