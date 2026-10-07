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
import {GrassSubMeshSlotPooler} from "./core/submesh/GrassSubMeshSlotPooler";
import GrassBakePipeline, {GRASS_CELL_SIZE} from "./core/baking/GrassBakePipeline";
import GrassCullPipeline from "./core/culling/GrassCullPipeline";
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
    #bakePipeline: GrassBakePipeline;
    #cullPipeline: GrassCullPipeline;
    #slotPooler: GrassSubMeshSlotPooler;

    #nextTypeId: number = 0;
    #populated: boolean = false;

    #renderer: GrassRenderer;

    #lastCamPos: [number, number, number] = [0, 0, 0];
    #lastBakePos: [number, number] = [0, 0];
    #initialBaked: boolean = false;
    #lastLoadedTileCount: number = 0;
    #frustumPlanesF32: Float32Array | null = new Float32Array(24);

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
        this.#bakePipeline = new GrassBakePipeline(this.redGPUContext);
        this.#cullPipeline = new GrassCullPipeline(this.redGPUContext);
        this.#slotPooler = new GrassSubMeshSlotPooler(this.redGPUContext);
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
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const alloc = this.#megaBuffer.getAllocation(list[i].typeId);
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
     * [KO] 현재 활성화된 잔디 타입들이 메인 렌더 패스(Near + Far)에서 발행하는 간접 드로우콜(Indirect Draw Call) 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by currently active grass types in the main render pass (Near + Far).
     */
    get totalDrawCalls(): number {
        if (!this.enabled || !this.#populated) return 0;
        let count = 0;
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const grass = list[i];
            const alloc = this.#megaBuffer.getAllocation(grass.typeId);
            if (alloc && alloc.instanceCount > 0) {
                count += alloc.nearSlots.length + alloc.farSlots.length;
            }
        }
        return count;
    }

    /**
     * [KO] 현재 메가버퍼(MegaBuffer)에 할당된 최대 잔디 인스턴스 수용 용량(VRAM Buffer Capacity)을 반환합니다.
     * [EN] Returns the maximum grass instance capacity (VRAM Buffer Capacity) currently allocated in the mega-buffer.
     */
    get instanceCapacity(): number {
        return this.#megaBuffer.instanceCapacity;
    }

    /**
     * [KO] 그림자 투사(castShadow: true)가 설정된 잔디 타입들이 캐스케이드 그림자 맵(CSM) 패스에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by shadow-casting grass types in the cascaded shadow map (CSM) pass.
     */
    get shadowDrawCalls(): number {
        if (!this.enabled || !this.#populated) return 0;
        let count = 0;
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const grass = list[i];
            if (!grass.castShadow) continue;
            const alloc = this.#megaBuffer.getAllocation(grass.typeId);
            if (alloc && alloc.instanceCount > 0) {
                count += alloc.nearSlots.length;
            }
        }
        return count;
    }

    /**
     * [KO] 새로운 잔디 생태계 타입을 등록하고 GPU MegaBuffer 공간 및 머티리얼 바인딩 리소스를 할당합니다.
     * [EN] Registers a new grass ecosystem type and allocates GPU MegaBuffer capacity and material binding resources.
     *
     * @param options - 잔디 설정 옵션 객체
     * @returns 생성되어 등록된 {@link Grass} 인스턴스
     */
    addGrass(options: GrassOptions): Grass {
        const grassType = new Grass(this.redGPUContext, options);

        const typeId = this.#nextTypeId++;
        grassType.typeId = typeId;
        this.registerTypeInternal(grassType);

        const {
            cullingDistance,
            instancesPerCell,
            subMeshes,
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
            subMeshes
        );
        grassType.bindAllocation(alloc);

        const vhtAtlas = this.landscape.vhtAtlasTexture;
        const vbtAtlas = this.landscape.vbtBaseColorAtlas;
        const canBakeImmediately = !!(this.gpuDevice && vhtAtlas?.gpuTextureView && vbtAtlas?.gpuTextureView);

        // 즉시 베이킹이 가능한 경우, #bakeGrassType 완료 시 최신 instanceCount로 단 1회 기록되므로 중복 VRAM 전송 방지
        if (!canBakeImmediately) {
            this.#megaBuffer.updateTypeParams(typeId, grassType, alloc);
        }

        grassType.onRepopulateRequired = this.#onGrassRepopulateRequired;

        if (grassType.targetLayer !== undefined && grassType.targetLayer !== null && grassType.targetLayer !== '' && this.landscape.layers) {
            const matchedLayer = typeof grassType.targetLayer === 'number'
                ? this.landscape.layers[grassType.targetLayer]
                : this.landscape.layers.find(
                    l => l.name === grassType.targetLayer
                );
            const wt = matchedLayer?.weightTexture;
            if (wt && typeof (wt as any).addLoadListeners === 'function') {
                (wt as any).addLoadListeners(this.#onGrassRepopulateRequired);
            }
        }

        const gpuDevice = this.gpuDevice;
        if (gpuDevice) {
            const slotIndex = this.#slotPooler.allocateSlot();
            grassType.slotIndex = slotIndex;

            const hasValidVbt = !!(vbtAtlas?.gpuTexture && this.landscape.tileLoadedCount > 0);
            this.#slotPooler.writeGrassSlot(slotIndex, grassType, hasValidVbt);

            const fallbackCam = this.#getFallbackCameraPosition();
            if (fallbackCam) {
                this.#lastCamPos[0] = fallbackCam[0];
                this.#lastCamPos[1] = fallbackCam[1];
                this.#lastCamPos[2] = fallbackCam[2];
                this.#lastBakePos[0] = fallbackCam[0];
                this.#lastBakePos[1] = fallbackCam[2];
            }

            this.#bakeGrassType(grassType, this.#lastCamPos[0], this.#lastCamPos[2]);
        }

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
     */
    update(renderViewStateData: RenderViewStateData): void {
        if (!this.enabled || this.types.length === 0) return;

        const {view} = renderViewStateData;
        const {rawCamera: rawCam} = view;
        const {x: camX, y: camY, z: camZ} = rawCam;

        this.#lastCamPos[0] = camX;
        this.#lastCamPos[1] = camY;
        this.#lastCamPos[2] = camZ;

        if (this.#frustumPlanesF32) {
            this.#frustumPlanesF32.set(renderViewStateData.frustumPlanesFlat);
        }

        const {tileLoadedCount: currentLoadedTileCount} = this.landscape;
        const vhtAtlas = this.landscape.vhtAtlasTexture;
        const vbtAtlas = this.landscape.vbtBaseColorAtlas;
        const hasValidTextures = !!(vhtAtlas?.gpuTextureView && vbtAtlas?.gpuTextureView && currentLoadedTileCount > 0);

        const tileCountChanged = hasValidTextures && this.#lastLoadedTileCount !== currentLoadedTileCount;
        if (tileCountChanged) {
            this.#lastLoadedTileCount = currentLoadedTileCount;
        }

        const dx = camX - this.#lastBakePos[0];
        const dz = camZ - this.#lastBakePos[1];
        const distSq = dx * dx + dz * dz;

        let minRadius = 120.0;
        const grassList = this.types;
        const grassLen = grassList.length;
        if (grassLen > 0) {
            minRadius = grassList[0].streamingRadius;
            for (let i = 1; i < grassLen; i++) {
                const r = grassList[i].streamingRadius;
                if (r < minRadius) minRadius = r;
            }
        }
        const bakeThreshold = Math.max(16.0, minRadius * 0.35);

        let rebakedThisFrame = false;
        if (hasValidTextures && (!this.#initialBaked || tileCountChanged || distSq > bakeThreshold * bakeThreshold)) {
            this.#initialBaked = true;
            this.#lastBakePos[0] = camX;
            this.#lastBakePos[1] = camZ;
            this.rebakeAll(camX, camZ);
            rebakedThisFrame = true;
        }

        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const hasValidVbt = !!(vbtAtlas?.gpuTexture && currentLoadedTileCount > 0);

        for (let i = 0; i < grassLen; i++) {
            const type = grassList[i];
            const {typeId, dirty, slotIndex} = type;

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

            const isDirty = dirty || tileCountChanged;
            if (isDirty) {
                type.markClean();
                this.#slotPooler.writeGrassSlot(activeSlot, type, hasValidVbt);

                // rebakeAll 실행 시 이미 각 잔디 타입별 updateTypeParams가 전송되었으므로 중복 전송 방지
                if (!rebakedThisFrame) {
                    const alloc = this.#megaBuffer.getAllocation(typeId);
                    if (alloc) {
                        this.#megaBuffer.updateTypeParams(typeId, type, alloc);
                    }
                }
            }
        }

        // VRAM 초고속 템플릿 복사 리셋 (Zero-GC: PRE_PROCESS 인코더 활용)
        this.commandEncoderManager.useEncoder(
            COMMAND_ENCODER_TYPE.PRE_PROCESS,
            this.#onResetMultiIndirectCommands
        );

        // GPU 초고속 컬링 단일 패스 디스패치 (Zero-GC: 재사용 인스턴스 콜백 바인딩)
        this.commandEncoderManager.addPreProcessComputePass(
            'Grass_GPU_Culling_ComputePass',
            this.#onPreProcessComputePass
        );
    }

    /**
     * [KO] 등록된 특정 잔디 생태계 타입을 매니저에서 제거하고 관련 GPU 리소스를 안전하게 해제합니다.
     * [EN] Removes a specific registered grass ecosystem type from the manager and safely releases associated GPU resources.
     *
     * @param target - 제거할 {@link Grass} 인스턴스 또는 잔디의 고유 이름(`string`)
     * @returns 제거 성공 여부
     */
    removeGrass(target: Grass | string): boolean {
        if (!target) return false;

        const removedGrass = this.unregisterTypeInternal(target);
        if (!removedGrass) return false;

        const {typeId, slotIndex} = removedGrass;

        this.#megaBuffer.freeType(typeId);
        if (slotIndex >= 0) {
            this.#slotPooler.freeSlot(slotIndex);
            removedGrass.slotIndex = -1;
        }

        removedGrass.bindAllocation(null);
        removedGrass.onRepopulateRequired = null;
        if (this.types.length === 0) {
            this.#populated = false;
        }
        this.#megaBuffer.invalidateUnifiedCullingBindGroup();
        this.#renderer.markAllBundlesDirty();
        return true;
    }

    /**
     * [KO] 새로운 스캐터 잔디 타입을 생성하여 매니저에 등록합니다. (IScatterManager 표준 메서드)
     * [EN] Creates and registers a new scatter grass type into the manager. (IScatterManager standard method)
     *
     * @param options - 잔디 생성 옵션
     * @returns 생성된 {@link Grass} 인스턴스
     */
    addType(options: GrassOptions): Grass {
        return this.addGrass(options);
    }

    /**
     * [KO] 등록된 특정 스캐터 잔디 타입을 매니저에서 제거합니다. (IScatterManager 표준 메서드)
     * [EN] Removes a specific registered scatter grass type from the manager. (IScatterManager standard method)
     *
     * @param target - 제거할 {@link Grass} 인스턴스 또는 고유 이름
     * @returns 제거 성공 여부
     */
    removeType(target: Grass | string): boolean {
        return this.removeGrass(target);
    }

    /**
     * [KO] 등록된 모든 스캐터 잔디 타입을 일괄 제거하고 초기 상태로 리셋합니다.
     * [EN] Clears all registered scatter grass types and resets to the initial state.
     */
    clearTypes(): void {
        while (this.types.length > 0) {
            this.removeType(this.types[this.types.length - 1]);
        }

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
        this.#bakePipeline.destroy();
        this.#cullPipeline.destroy();
        this.#renderer.destroy();
        this.#slotPooler.destroy();

        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            list[i].destroy();
        }
        this.clearTypes();

        this.#frustumPlanesF32 = null;
    }

    // Zero-GC: VRAM 간접 드로우 템플릿 복사를 위한 바인딩 콜백
    #onResetMultiIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.#megaBuffer.resetMultiIndirectCommands(encoder);
    };

    // Zero-GC: 매 프레임 임시 클로저 생성 방지를 위한 바인딩 콜백
    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        this.#cullPipeline.dispatchPass(
            computePass,
            this.#megaBuffer,
            this.#lastCamPos[0],
            this.#lastCamPos[1],
            this.#lastCamPos[2],
            this.#frustumPlanesF32
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
        if (!this.enabled || this.types.length === 0 || !this.#populated) return;
        this.#renderer.render(view, passEncoder, this.types, this.#megaBuffer, this.#slotPooler);
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사(`castShadow: true`)가 설정된 잔디 인스턴스들의 그림자를 렌더링합니다.
     * [EN] Renders shadows for grass instances configured with `castShadow: true` in the cascaded shadow map (CSM) pass.
     *
     * @param view - 그림자 패스를 렌더링 중인 View3D 객체
     * @param passEncoder - 섀도우 맵 생성을 위한 GPURenderPassEncoder
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        if (!this.enabled || this.types.length === 0 || !this.#populated) return;
        this.#renderer.renderShadow(view, passEncoder, this.types, this.#megaBuffer, this.#slotPooler);
    }

    /**
     * [KO] 등록된 모든 잔디 타입에 대해 지형 가상 텍스처(VHT/VBT)를 기반으로 GPU 베이킹을 수행합니다.
     * [EN] Re-executes GPU baking for all registered grass types based on landscape virtual textures (VHT/VBT).
     *
     * @param centerX - 베이킹 중심 월드 X 좌표 (생략 시 마지막 카메라 위치)
     * @param centerZ - 베이킹 중심 월드 Z 좌표 (생략 시 마지막 카메라 위치)
     */
    rebakeAll(centerX?: number, centerZ?: number): void {
        const posX = centerX !== undefined ? centerX : this.#lastCamPos[0];
        const posZ = centerZ !== undefined ? centerZ : this.#lastCamPos[2];
        const list = this.types;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            this.#bakeGrassType(list[i], posX, posZ);
        }
    }

    // Zero-GC: 잔디 리베이크 요청 공용 재사용 콜백
    #onGrassRepopulateRequired = (): void => {
        this.rebakeAll();
    };

    #getFallbackCameraPosition(): [number, number, number] | null {
        const viewList = this.redGPUContext?.viewList;
        if (!viewList || viewList.length === 0) return null;

        for (let i = 0; i < viewList.length; i++) {
            const v = viewList[i] as any;
            if (!v) continue;
            const rawCam = v.rawCamera || v.camera?.rawCamera || v.camera;
            if (rawCam && typeof rawCam.x === 'number') {
                return [rawCam.x, rawCam.y, rawCam.z];
            }
            const pos = v.camera?.position;
            if (pos && typeof pos[0] === 'number') {
                return [pos[0], pos[1], pos[2]];
            }
        }
        return null;
    }

    /**
     * [KO] 특정 잔디 타입에 대해 GPU 베이킹을 실행하여 VRAM 버퍼에 위치/노멀/색상을 1회 기록합니다.
     * [EN] Executes GPU baking for a specific grass type to record position/normal/color into the VRAM buffer once.
     */
    #bakeGrassType(grass: Grass, centerX?: number, centerZ?: number): void {
        const vhtAtlas = this.landscape.vhtAtlasTexture;
        const vbtAtlas = this.landscape.vbtBaseColorAtlas;
        if (!vhtAtlas?.gpuTextureView || !vbtAtlas?.gpuTextureView) return;

        const posX = centerX !== undefined ? centerX : this.#lastCamPos[0];
        const posZ = centerZ !== undefined ? centerZ : this.#lastCamPos[2];

        this.#bakePipeline.dispatchBake(
            this.#megaBuffer,
            this.landscape,
            grass,
            posX,
            posZ
        );

        const alloc = this.#megaBuffer.getAllocation(grass.typeId);
        if (alloc) {
            this.#megaBuffer.updateTypeParams(grass.typeId, grass, alloc);
        }
    }
}

Object.freeze(GrassManager);
export default GrassManager;
