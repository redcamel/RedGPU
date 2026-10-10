/**
 * [KO] 대규모 지형 절차적 잔디(Grass) 렌더링 총괄 매니저 모듈입니다.
 * [EN] Overall manager module for large-scale procedural grass rendering on terrain.
 * @packageDocumentation
 */
import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import Landscape from "../Landscape";
import Grass, {GrassOptions} from "./core/Grass";
import {GrassScatterMegaBuffer} from "./core/buffer/GrassScatterMegaBuffer";
import {GrassRenderer} from "./core/renderer/GrassRenderer";
import {GrassSlotPooler} from "./core/buffer/GrassSlotPooler";
import GrassInstanceBaker, {GRASS_CELL_SIZE} from "./core/baking/GrassInstanceBaker";
import GrassCuller from "./core/culling/GrassCuller";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {AScatterManager} from "../core/scatter";

/**
 * [KO] 대규모 지형(Landscape)의 GPU 베이킹 & GPU 초고속 컬링 기반 잔디(Grass) 생태계를 총괄 관리하는 매니저 클래스입니다.
 * [EN] Manager class that oversees the large-scale GPU baked & GPU culled grass ecosystem of the landscape.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
export class GrassManager extends AScatterManager<Grass, GrassOptions> {

    #megaBuffer: GrassScatterMegaBuffer;
    #baker: GrassInstanceBaker;
    #culler: GrassCuller;
    #slotPooler: GrassSlotPooler;

    #nextTypeId: number = 0;
    #populated: boolean = false;

    #renderer: GrassRenderer;

    #lastBakePos: [number, number] = [0, 0];
    #initialBaked: boolean = false;
    #lastLoadedTileCount: number = 0;
    #currentRenderViewStateData: RenderViewStateData | null = null;
    #dirtyUboMask: number = 0;
    #needsRebakeMask: number = 0;
    #lastUpdateFrameIndex: number = -1;

    /**
     * [KO] GrassManager의 새 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `landscape.grassManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a new instance of GrassManager. (Do not instantiate directly; access via the `landscape.grassManager` property.)
     *
     * @param landscape -
     * [KO] 잔디 생태계가 바인딩될 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance to which the grass ecosystem is bound
     */
    constructor(landscape: Landscape) {
        super(landscape);

        this.#megaBuffer = new GrassScatterMegaBuffer(this.redGPUContext, 131072);
        this.#baker = new GrassInstanceBaker(this.redGPUContext);
        this.#culler = new GrassCuller(this.redGPUContext);
        this.#slotPooler = new GrassSlotPooler(this.redGPUContext);
        this.#renderer = new GrassRenderer(this.redGPUContext);

        this.#megaBuffer.onRecreated = () => {
            this.#megaBuffer.invalidateUnifiedCullingBindGroup();
            this.#renderer.markAllBundlesDirty();
            this.rebakeAll();
        };
    }

    /**
     * [KO] 현재 스트리밍 반경 내에 생성되어 메모리에 로드된 총 잔디 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of grass instances currently populated and loaded in memory within the streaming radius.
     */
    get totalInstanceCount(): number {
        let count = 0;
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const alloc = this.#megaBuffer.getAllocation(types[i].typeId);
            if (alloc) count += alloc.instanceCount;
        }
        return count;
    }

    /**
     * [KO] 초기 잔디 인스턴스 배치가 1회 이상 완료되었는지 여부를 반환합니다.
     * [EN] Returns whether initial grass instance population has been performed at least once.
     */
    get populated(): boolean {
        return this.#populated;
    }

    /**
     * [KO] 현재 메가버퍼(MegaBuffer)에 할당된 최대 잔디 인스턴스 수용 용량(VRAM Buffer Capacity)을 반환합니다.
     * [EN] Returns the maximum grass instance capacity (VRAM Buffer Capacity) currently allocated in the mega-buffer.
     */
    get instanceCapacity(): number {
        return this.#megaBuffer.instanceCapacity;
    }

    /**
     * [KO] 특정 잔디 타입이 메인 렌더 패스(Near + Far)에서 발행하는 간접 드로우콜 수를 계산합니다.
     * [EN] Computes the number of indirect draw calls dispatched by a specific grass type in the main pass (Near + Far).
     */
    protected override computeTypeDrawCalls(grass: Grass): number {
        if (!this.#populated) return 0;
        const alloc = this.#megaBuffer.getAllocation(grass.typeId);
        if (alloc) {
            const {instanceCount, nearSlots, farSlots} = alloc;
            if (instanceCount > 0) {
                return nearSlots.length + farSlots.length;
            }
        }
        return 0;
    }

    /**
     * [KO] 그림자를 투사하는 특정 잔디 타입이 CSM 그림자 맵 패스에서 발행하는 간접 드로우콜 수를 계산합니다.
     * [EN] Computes the number of indirect draw calls dispatched by a shadow-casting grass type in the CSM shadow pass.
     */
    protected override computeTypeShadowDrawCalls(grass: Grass): number {
        if (!this.#populated) return 0;
        const alloc = this.#megaBuffer.getAllocation(grass.typeId);
        if (alloc && alloc.instanceCount > 0) {
            return alloc.nearSlots.length;
        }
        return 0;
    }

    /**
     * [KO] 새로운 잔디 생태계 타입을 등록하고 GPU MegaBuffer 공간 및 머티리얼 바인딩 리소스를 할당합니다.
     * [EN] Registers a new grass ecosystem type and allocates GPU MegaBuffer capacity and material binding resources.
     *
     * @param options - 잔디 설정 옵션 객체
     * @returns 생성되어 등록된 {@link Grass} 인스턴스
     */
    addType(options: GrassOptions): Grass {
        const grassType = new Grass(this.redGPUContext, options);

        const typeId = this.#nextTypeId++;
        grassType.typeId = typeId;
        this.registerTypeInternal(grassType);

        const {
            cullingDistance,
            instancesPerCell,
            renderUnits,
            streamingRadius,
            maxInstances: userMaxInstances
        } = grassType;
        const targetRadius = Math.max(cullingDistance, streamingRadius);
        const cellCountApprox = Math.ceil((Math.PI * targetRadius * targetRadius) / (GRASS_CELL_SIZE * GRASS_CELL_SIZE));
        const computedMax = Math.max(4096, Math.min(262144, cellCountApprox * Math.ceil(instancesPerCell * 1.3)));
        const maxInstances = userMaxInstances !== undefined ? Math.max(4096, userMaxInstances) : computedMax;

        const alloc = this.#megaBuffer.allocateType(
            typeId,
            maxInstances,
            renderUnits
        );
        grassType.bindAllocation(alloc);

        this.#megaBuffer.updateTypeParams(typeId, grassType, alloc);

        grassType.onUniformDirty = this.#onGrassUniformDirty;
        grassType.onRepopulateRequired = this.#onGrassRepopulateRequired;

        const {targetLayer} = grassType;
        if (targetLayer != null && targetLayer !== '') {
            const matchedLayer = typeof targetLayer === 'number'
                ? this.landscape.layers[targetLayer]
                : this.landscape.layers.find(
                    l => l.name === targetLayer
                );
            const wt = matchedLayer?.weightTexture;
            if (wt && typeof (wt as any).addLoadListeners === 'function') {
                (wt as any).addLoadListeners(this.#onGrassRepopulateRequired);
            }
        }

        const slotIndex = this.#slotPooler.allocateSlot();
        grassType.slotIndex = slotIndex;

        const hasValidVbt = this.landscape.hasValidVbtAtlas;
        this.#slotPooler.writeGrassSlot(slotIndex, grassType, hasValidVbt);

        this.#megaBuffer.invalidateUnifiedCullingBindGroup();
        this.#renderer.markAllBundlesDirty();
        this.#populated = true;
        return grassType;
    }

    /**
     * [KO] 매 프레임 호출되어 베이킹된 잔디 인스턴스들을 대상으로 초고속 GPU 거리/프러스텀 컬링 Compute Pass를 디스패치합니다.
     * [EN] Called every frame to dispatch ultra-fast GPU distance/frustum culling compute pass for baked grass instances.
     *
     * @param renderViewStateData - 뷰 렌더 상태 데이터
     * @param standalone - 단독 실행 모드 여부 (기본값: false, Landscape 통합 패스 모드)
     */
    update(renderViewStateData: RenderViewStateData, standalone: boolean = false): void {
        const {enabled, types, landscape} = this;
        const grassLen = types.length;
        if (!enabled || grassLen === 0) return;
        if (this.#lastUpdateFrameIndex === renderViewStateData.frameIndex) return;
        this.#lastUpdateFrameIndex = renderViewStateData.frameIndex;
        this.#currentRenderViewStateData = renderViewStateData;

        const {view} = renderViewStateData;
        const {rawCamera} = view;
        const {x, z} = rawCamera;

        const {tileLoadedCount, hasValidScatterAtlas} = landscape;

        const tileCountChanged = hasValidScatterAtlas && this.#lastLoadedTileCount !== tileLoadedCount;
        if (tileCountChanged) {
            this.#lastLoadedTileCount = tileLoadedCount;
        }

        const [lastBakeX, lastBakeZ] = this.#lastBakePos;
        const dx = x - lastBakeX;
        const dz = z - lastBakeZ;
        const distSq = dx * dx + dz * dz;

        let minRadius = types[0].streamingRadius;
        for (let i = 1; i < grassLen; i++) {
            const r = types[i].streamingRadius;
            if (r < minRadius) minRadius = r;
        }
        const bakeThreshold = Math.max(16.0, minRadius * 0.35);

        let rebakedThisFrame = false;
        const needsRebake = this.#needsRebakeMask !== 0;
        if (hasValidScatterAtlas && (needsRebake || !this.#initialBaked || tileCountChanged || distSq > bakeThreshold * bakeThreshold)) {
            this.#initialBaked = true;
            this.#lastBakePos[0] = x;
            this.#lastBakePos[1] = z;
            this.#bakeAll(x, z);
            this.#needsRebakeMask = 0;
            rebakedThisFrame = true;
        }

        const hasValidVbt = landscape.hasValidVbtAtlas;
        const uboDirtyMask = this.#dirtyUboMask;

        for (let i = 0; i < grassLen; i++) {
            const type = types[i];
            const {typeId, slotIndex} = type;

            let activeSlot = slotIndex;
            if (activeSlot < 0) {
                activeSlot = this.#slotPooler.allocateSlot();
                if (activeSlot >= 0) {
                    type.slotIndex = activeSlot;
                    this.#slotPooler.writeGrassSlot(activeSlot, type, hasValidVbt);
                } else {
                    continue;
                }
            }

            const isDirty = tileCountChanged || ((uboDirtyMask & (1 << typeId)) !== 0);
            if (isDirty) {
                this.#slotPooler.writeGrassSlot(activeSlot, type, hasValidVbt);

                if (!rebakedThisFrame) {
                    const alloc = this.#megaBuffer.getAllocation(typeId);
                    if (alloc) {
                        this.#megaBuffer.updateTypeParams(typeId, type, alloc);
                    }
                }
            }
        }
        this.#dirtyUboMask = 0;

        if (standalone) {
            this.commandEncoderManager.useEncoder(
                COMMAND_ENCODER_TYPE.PRE_PROCESS,
                this.#onResetMultiIndirectCommands
            );

            this.commandEncoderManager.addPreProcessComputePass(
                'Grass_GPU_Culling_ComputePass',
                this.#onPreProcessComputePass
            );
        }
    }

    /**
     * [KO] 인다이렉트 드로우 커맨드 카운터 리셋 커맨드를 기록합니다 (PRE_PROCESS 커맨드 인코더).
     * [EN] Records indirect draw command counter reset commands (PRE_PROCESS command encoder).
     *
     * @param encoder - 대상 GPU 커맨드 인코더
     */
    recordResetCommands(encoder: GPUCommandEncoder): void {
        this.#megaBuffer.resetMultiIndirectCommands(encoder);
    }

    /**
     * [KO] 단일 통합 컴퓨트 패스에 잔디 인스턴스 GPU 컬링 디스패치 커맨드를 기록합니다.
     * [EN] Records grass instance GPU culling dispatch commands into the unified compute pass.
     *
     * @param computePass - 실행 중인 GPU 컴퓨트 패스 인코더
     * @param renderViewStateData - 선택적 렌더 뷰 상태 데이터
     */
    dispatchCullingPass(computePass: GPUComputePassEncoder, renderViewStateData?: RenderViewStateData): void {
        const stateData = renderViewStateData || this.#currentRenderViewStateData;
        if (!stateData || !this.enabled || this.types.length === 0) return;
        this.#culler.dispatchPass(
            computePass,
            this.#megaBuffer,
            stateData
        );
    }

    /**
     * [KO] 등록된 특정 잔디 생태계 타입을 매니저에서 제거하고 관련 GPU 리소스를 안전하게 해제합니다.
     * [EN] Removes a specific registered grass ecosystem type from the manager and safely releases associated GPU resources.
     *
     * @param target - 제거할 {@link Grass} 인스턴스 또는 잔디의 고유 이름(`string`)
     * @returns 제거 성공 여부
     */
    removeType(target: Grass | string): boolean {
        const removedGrass = this.unregisterTypeInternal(target);
        if (!removedGrass) return false;

        const {typeId, slotIndex} = removedGrass;

        this.#megaBuffer.freeType(typeId);
        if (slotIndex >= 0) {
            this.#slotPooler.freeSlot(slotIndex);
            removedGrass.slotIndex = -1;
        }

        this.#dirtyUboMask &= ~(1 << typeId);
        this.#needsRebakeMask &= ~(1 << typeId);

        removedGrass.bindAllocation(null);
        removedGrass.onUniformDirty = null;
        removedGrass.onRepopulateRequired = null;
        if (this.types.length === 0) {
            this.#populated = false;
        }
        this.#megaBuffer.invalidateUnifiedCullingBindGroup();
        this.#renderer.markAllBundlesDirty();
        return true;
    }

    /**
     * [KO] 등록된 모든 스캐터 잔디 타입을 일괄 제거하고 초기 상태로 리셋합니다.
     * [EN] Clears all registered scatter grass types and resets to the initial state.
     */
    clearTypes(): void {
        const {types} = this;
        while (types.length > 0) {
            this.removeType(types[types.length - 1]);
        }

        this.#dirtyUboMask = 0;
        this.#needsRebakeMask = 0;
        this.#slotPooler.clear();
        this.#megaBuffer.destroy();
        this.#megaBuffer = new GrassScatterMegaBuffer(this.redGPUContext, 131072);
        this.#megaBuffer.onRecreated = () => {
            this.#megaBuffer.invalidateUnifiedCullingBindGroup();
            this.#renderer.markAllBundlesDirty();
            this.rebakeAll();
        };

        this.#nextTypeId = 0;
        this.#lastLoadedTileCount = 0;
        this.#initialBaked = false;
        this.#populated = false;
        this.#lastBakePos[0] = 0;
        this.#lastBakePos[1] = 0;
    }

    /**
     * [KO] 잔디 매니저가 소유한 모든 GPU 버퍼, 파이프라인 및 자원을 안전하게 해제합니다.
     * [EN] Safely releases all GPU buffers, pipelines, and resources held by the grass manager.
     */
    destroy(): void {
        this.#megaBuffer.destroy();
        this.#baker.destroy();
        this.#culler.destroy();
        this.#renderer.destroy();
        this.#slotPooler.destroy();

        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            list[i].destroy();
        }
        this.clearTypes();

        this.#currentRenderViewStateData = null;
    }

    /**
     * [KO] VRAM 간접 드로우 커맨드 템플릿 복사를 위한 바인딩 콜백 (Zero-GC)
     * [EN] Binding callback for resetting multi-indirect draw commands in VRAM (Zero-GC)
     */
    #onResetMultiIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.#megaBuffer.resetMultiIndirectCommands(encoder);
    };

    /**
     * [KO] GPU 초고속 컬링 컴퓨트 패스 실행 콜백 (Zero-GC)
     * [EN] Callback for executing GPU compute culling pass (Zero-GC)
     */
    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        if (!this.#currentRenderViewStateData) return;
        this.#culler.dispatchPass(
            computePass,
            this.#megaBuffer,
            this.#currentRenderViewStateData
        );
    };


    /**
     * [KO] 메인 렌더 패스에서 GPU 컬링을 통과한 잔디 인스턴스들을 간접 드로우(`drawIndexedIndirect`) 방식으로 고속 일괄 렌더링합니다.
     * [EN] Renders culled grass instances in the main render pass using fast indirect draw calls (`drawIndexedIndirect`).
     *
     * @param view - 현재 렌더링 중인 View3D 객체
     * @param passEncoder - 메인 씬 GPURenderPassEncoder
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0 || !this.#populated) return;
        this.#renderer.render(view, passEncoder, types, this.#megaBuffer, this.#slotPooler);
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사(`castShadow: true`)가 설정된 잔디 인스턴스들의 그림자를 렌더링합니다.
     * [EN] Renders shadows for grass instances configured with `castShadow: true` in the cascaded shadow map (CSM) pass.
     *
     * @param view - 그림자 패스를 렌더링 중인 View3D 객체
     * @param passEncoder - 섀도우 맵 생성을 위한 GPURenderPassEncoder
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        const {enabled, types} = this;
        if (!enabled || types.length === 0 || !this.#populated) return;
        this.#renderer.renderShadow(view, passEncoder, types, this.#megaBuffer, this.#slotPooler);
    }

    /**
     * [KO] 등록된 모든 잔디 타입의 인스턴스 배치를 다음 프레임에 강제로 다시 베이크하도록 예약합니다.
     * [EN] Schedules a forced rebake of instance placement for all registered grass types on the next frame.
     */
    rebakeAll(): void {
        this.#needsRebakeMask = -1;
    }

    /**
     * [KO] 모든 잔디 타입에 대해 지정된 중심 좌표를 기준으로 GPU 베이킹을 실행합니다.
     * [EN] Executes GPU baking for all registered grass types centered at the specified coordinates.
     */
    #bakeAll(centerX: number, centerZ: number): void {
        const {types} = this;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            this.#bakeGrassType(types[i], centerX, centerZ);
        }
    }

    /**
     * [KO] 잔디 UBO 갱신 요청 비트마스크 등록 콜백 (Zero-GC: 1사이클 비트 연산)
     * [EN] Bitmask registration callback for grass UBO dirty requests (Zero-GC: 1-cycle bitwise operation)
     */
    #onGrassUniformDirty = (typeId?: number): void => {
        if (typeId !== undefined && typeId >= 0 && typeId < 32) {
            this.#dirtyUboMask |= (1 << typeId);
        } else {
            this.#dirtyUboMask = -1;
        }
    };

    /**
     * [KO] 잔디 리베이크 요청 비트마스크 등록 콜백 (Zero-GC: 베이킹 및 UBO 동시 갱신)
     * [EN] Bitmask registration callback for grass rebake requests (Zero-GC: simultaneous bake & UBO update)
     */
    #onGrassRepopulateRequired = (typeId?: number): void => {
        if (typeId !== undefined && typeId >= 0 && typeId < 32) {
            this.#needsRebakeMask |= (1 << typeId);
            this.#dirtyUboMask |= (1 << typeId);
        } else {
            this.#needsRebakeMask = -1;
            this.#dirtyUboMask = -1;
        }
    };


    /**
     * [KO] 특정 잔디 타입에 대해 GPU 베이킹을 실행하여 VRAM 버퍼에 위치/노멀/색상을 1회 기록합니다.
     * [EN] Executes GPU baking for a specific grass type to record position/normal/color into the VRAM buffer once.
     */
    #bakeGrassType(grass: Grass, centerX: number, centerZ: number): void {
        if (!this.landscape.hasValidScatterAtlas) return;

        this.#baker.dispatchBake(
            this.#megaBuffer,
            this.landscape,
            grass,
            centerX,
            centerZ
        );

        const alloc = this.#megaBuffer.getAllocation(grass.typeId);
        if (alloc) {
            this.#megaBuffer.updateTypeParams(grass.typeId, grass, alloc);
        }
    }
}

Object.freeze(GrassManager);
export default GrassManager;
