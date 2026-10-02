/**
 * [KO] 대규모 지형 절차적 잔디(Grass) 렌더링 총괄 매니저 모듈입니다.
 * [EN] Overall manager module for large-scale procedural grass rendering on terrain.
 * @packageDocumentation
 */
import RedGPUObject from "../../base/RedGPUObject";
import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeComponent from "../core/spatial/LandscapeComponent";
import Grass, {GrassOptions} from "./core/Grass";
import {GrassScatterMegaBuffer} from "./core/buffer/GrassScatterMegaBuffer";
import {GrassRenderer, GrassTypeMaterialBufferResources} from "./core/renderer/GrassRenderer";
import computeViewFrustumPlanes from "../../math/computeViewFrustumPlanes";
import GrassBakePipeline from "./core/baking/GrassBakePipeline";
import GrassCullPipeline from "./core/culling/GrassCullPipeline";

/**
 * [KO] 카메라를 중심으로 잔디를 활성화하고 스트리밍하는 기본 반경(미터 단위)입니다. 기본값: `120.0`
 * [EN] Default radius in meters around the camera within which grass is activated and streamed. Default: `120.0`
 */
const DEFAULT_STREAMING_RADIUS: number = 120.0;
const CELL_SIZE: number = 16.0;

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
export class GrassManager extends RedGPUObject {

    #landscape: Landscape;
    #tileStreamer: LandscapeTileStreamer;
    #enabled: boolean = true;
    #streamingRadius: number = DEFAULT_STREAMING_RADIUS;

    #megaBuffer: GrassScatterMegaBuffer;
    #bakePipeline: GrassBakePipeline;
    #cullPipeline: GrassCullPipeline;

    #grassList: Grass[] = [];
    #nextTypeId: number = 0;
    #populated: boolean = false;

    #renderer: GrassRenderer;
    #typeMaterialBuffers: Map<number, GrassTypeMaterialBufferResources> = new Map();

    #lastCamPos: [number, number, number] = [0, 0, 0];
    #lastBakePos: [number, number] = [0, 0];
    #initialBaked: boolean = false;
    #lastLoadedTileCount: number = 0;
    #frustumPlanesF32: Float32Array = new Float32Array(24);

    /**
     * [KO] GrassManager의 새 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `landscape.grassManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a new instance of GrassManager. (Do not instantiate directly; access via the `landscape.grassManager` property.)
     *
     * @param landscape -
     * [KO] 잔디 생태계가 바인딩될 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance to which the grass ecosystem is bound
     * @param tileStreamer -
     * [KO] 지형의 가상 텍스처(VHT/VNT/VBT)를 제공하는 타일 스트리머
     * [EN] Tile streamer providing landscape virtual textures (VHT/VNT/VBT)
     */
    constructor(landscape: Landscape, tileStreamer: LandscapeTileStreamer) {
        super(landscape.redGPUContext);
        this.#landscape = landscape;
        this.#tileStreamer = tileStreamer;

        this.#megaBuffer = new GrassScatterMegaBuffer(this.redGPUContext, 131072);
        this.#bakePipeline = new GrassBakePipeline(this.redGPUContext);
        this.#cullPipeline = new GrassCullPipeline(this.redGPUContext);

        this.#megaBuffer.onRecreated = () => {
            this.#cullPipeline.invalidateBindGroups();
            for (const res of this.#typeMaterialBuffers.values()) {
                res.instanceBindGroup = null;
                for (let s = 0; s < res.subMeshResources.length; s++) {
                    res.subMeshResources[s].bindGroup = null;
                }
            }
        };

        this.#renderer = new GrassRenderer(this.redGPUContext);
    }

    /**
     * [KO] 잔디 시스템의 활성화 여부를 반환합니다. `false`일 경우 잔디 스트리밍, 컬링, 렌더링이 일시 중단됩니다.
     * [EN] Gets whether the grass system is enabled. When `false`, grass streaming, culling, and rendering are suspended.
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * [KO] 잔디 시스템의 활성화 여부를 설정합니다.
     * [EN] Sets whether the grass system is enabled.
     *
     * @param val -
     * [KO] 활성화 여부
     * [EN] Whether to enable
     */
    set enabled(val: boolean) {
        this.#enabled = val;
    }

    /**
     * [KO] 카메라 중심의 잔디 스트리밍 유효 반경(단위: 월드 유닛/미터, 기본값: 120.0)을 반환합니다.
     * [EN] Gets the active grass streaming radius (in world units/meters, default: 120.0) around the camera.
     */
    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    /**
     * [KO] 카메라 중심의 잔디 스트리밍 유효 반경을 설정합니다.
     * [EN] Sets the active grass streaming radius around the camera.
     *
     * @param val -
     * [KO] 설정할 스트리밍 반경 (최소값: 16.0)
     * [EN] Streaming radius to set (minimum: 16.0)
     */
    set streamingRadius(val: number) {
        const next = Math.max(16.0, val);
        if (this.#streamingRadius !== next) {
            this.#streamingRadius = next;
            this.rebakeAll();
        }
    }

    /**
     * [KO] 등록된 잔디 타입의 총 개수를 반환합니다.
     * [EN] Returns the total number of registered grass types.
     */
    get count(): number {
        return this.#grassList.length;
    }

    /**
     * [KO] 초기 잔디 인스턴스 배치가 1회 이상 완료되었는지 여부를 반환합니다.
     * [EN] Returns whether initial grass instance population has been performed at least once.
     */
    get populated(): boolean {
        return this.#populated;
    }

    /**
     * [KO] 현재 매니저에 등록된 모든 잔디({@link Grass}) 생태계 인스턴스 배열을 반환합니다.
     * [EN] Gets the list of all {@link Grass} ecosystem instances currently registered to this manager.
     */
    get grassList(): Grass[] {
        return this.#grassList;
    }

    /**
     * [KO] 현재 스트리밍 반경 내에 생성되어 메모리에 로드된 총 잔디 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of grass instances currently populated and loaded in memory within the streaming radius.
     */
    get totalInstanceCount(): number {
        let count = 0;
        const list = this.#grassList;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const alloc = this.#megaBuffer.getAllocation(list[i].typeId);
            if (alloc) count += alloc.instanceCount;
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
     * [KO] 현재 활성화된 잔디 타입들이 메인 렌더 패스(Near + Far)에서 발행하는 간접 드로우콜(Indirect Draw Call) 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by currently active grass types in the main render pass (Near + Far).
     */
    get totalDrawCalls(): number {
        if (!this.#enabled || !this.#populated) return 0;
        let count = 0;
        const list = this.#grassList;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const grass = list[i];
            const alloc = this.#megaBuffer.getAllocation(grass.typeId);
            if (alloc && alloc.instanceCount > 0) {
                count += alloc.slots.length;
            }
        }
        return count;
    }

    /**
     * [KO] 그림자 투사(castShadow: true)가 설정된 잔디 타입들이 캐스케이드 그림자 맵(CSM) 패스에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by shadow-casting grass types in the cascaded shadow map (CSM) pass.
     */
    get shadowDrawCalls(): number {
        if (!this.#enabled || !this.#populated) return 0;
        let count = 0;
        const list = this.#grassList;
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
        this.#grassList.push(grassType);

        const {cullingDistance, instancesPerCell, name, subMeshes} = grassType;
        const targetRadius = Math.max(cullingDistance, this.#streamingRadius);
        const cellCountApprox = Math.ceil((Math.PI * targetRadius * targetRadius) / (CELL_SIZE * CELL_SIZE));
        const maxInstances = Math.max(4096, Math.min(262144, cellCountApprox * Math.ceil((instancesPerCell || 64) * 1.3)));

        const alloc = this.#megaBuffer.allocateType(
            typeId,
            maxInstances,
            subMeshes
        );
        grassType.bindAllocation(alloc);

        grassType.onRepopulateRequired = () => {
            this.rebakeAll();
        };

        if (grassType.targetLayer !== undefined && grassType.targetLayer !== null && grassType.targetLayer !== '' && this.#landscape.layers) {
            const matchedLayer = typeof grassType.targetLayer === 'number'
                ? this.#landscape.layers[grassType.targetLayer]
                : this.#landscape.layers.find(
                    l => l.name === grassType.targetLayer || (l as any).key === grassType.targetLayer
                );
            const wt = matchedLayer?.weightTexture;
            if (wt && typeof (wt as any).onLoad === 'function') {
                (wt as any).onLoad(() => {
                    this.rebakeAll();
                });
            }
        }

        const gpuDevice = this.gpuDevice;
        if (gpuDevice) {
            const cpuBuffer = new Float32Array(12);
            const uintBuffer = new Uint32Array(cpuBuffer.buffer);

            const uniformBuffer = gpuDevice.createBuffer({
                label: `Grass_MaterialUniformBuffer_${name}_${this.instanceId}`,
                size: cpuBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const grassUniformCPUBuffer = new Float32Array(8);
            const grassUniformGPUBuffer = gpuDevice.createBuffer({
                label: `Grass_WindUniformBuffer_${name}_${this.instanceId}`,
                size: grassUniformCPUBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            this.#typeMaterialBuffers.set(typeId, {
                uniformBuffer,
                cpuBuffer,
                uintBuffer,
                grassUniformGPUBuffer,
                grassUniformCPUBuffer,
                bindGroup: null,
                instanceBindGroup: null,
                cachedColorTexView: null,
                initialized: false,
                cachedHasVbt: false,
                subMeshResources: []
            });

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

        this.#cullPipeline.invalidateBindGroups();
        this.#populated = true;
        return grassType;
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

        const index = typeof target === 'string'
            ? this.#grassList.findIndex(g => g.name === target)
            : this.#grassList.indexOf(target);

        if (index === -1) return false;

        const [removedGrass] = this.#grassList.splice(index, 1);
        const {typeId} = removedGrass;

        this.#megaBuffer.freeType(typeId);

        const res = this.#typeMaterialBuffers.get(typeId);
        if (res) {
            res.uniformBuffer.destroy();
            res.grassUniformGPUBuffer.destroy();
            res.subMeshResources.length = 0;
            this.#typeMaterialBuffers.delete(typeId);
        }

        removedGrass.bindAllocation(null);
        this.#cullPipeline.invalidateBindGroups();
        return true;
    }

    /**
     * [KO] 등록된 모든 잔디 생태계 타입을 일괄 제거하고 초기 상태로 리셋합니다.
     * [EN] Clears all registered grass ecosystem types and resets to the initial state.
     */
    clearGrass(): void {
        while (this.#grassList.length > 0) {
            this.removeGrass(this.#grassList[this.#grassList.length - 1]);
        }

        this.#megaBuffer.destroy();
        this.#megaBuffer = new GrassScatterMegaBuffer(this.redGPUContext, 131072);
        this.#megaBuffer.onRecreated = () => {
            this.#cullPipeline.invalidateBindGroups();
            for (const res of this.#typeMaterialBuffers.values()) {
                res.instanceBindGroup = null;
            }
        };

        this.#nextTypeId = 0;
        this.#lastLoadedTileCount = 0;
        this.#initialBaked = false;
        this.#lastBakePos[0] = 0;
        this.#lastBakePos[1] = 0;
        this.#cullPipeline.invalidateBindGroups();
    }

    /**
     * [KO] 매 프레임 호출되어 베이킹된 잔디 인스턴스들을 대상으로 초고속 GPU 거리/프러스텀 컬링 Compute Pass를 디스패치합니다.
     * [EN] Called every frame to dispatch ultra-fast GPU distance/frustum culling compute pass for baked grass instances.
     *
     * @param renderViewStateData - 뷰 렌더 상태 데이터
     */
    update(renderViewStateData: RenderViewStateData): void {
        if (!this.#enabled || this.#grassList.length === 0) return;

        const {view, frustumPlanes} = renderViewStateData;
        const {rawCamera: rawCam, projectionMatrix} = view;
        const {x: camX, y: camY, z: camZ} = rawCam;

        this.#lastCamPos[0] = camX;
        this.#lastCamPos[1] = camY;
        this.#lastCamPos[2] = camZ;

        let frustumPlanesF32: Float32Array | null = null;
        if (frustumPlanes && frustumPlanes.length === 6) {
            for (let p = 0; p < 6; p++) {
                this.#frustumPlanesF32.set(frustumPlanes[p], p * 4);
            }
            frustumPlanesF32 = this.#frustumPlanesF32;
        } else if (projectionMatrix && rawCam?.viewMatrix) {
            const computed = computeViewFrustumPlanes(projectionMatrix, rawCam.viewMatrix);
            if (computed) {
                for (let p = 0; p < 6; p++) {
                    this.#frustumPlanesF32.set(computed[p], p * 4);
                }
                frustumPlanesF32 = this.#frustumPlanesF32;
            }
        }

        const {tileLoadedCount: currentLoadedTileCount} = this.#landscape;
        const vhtAtlas = this.#tileStreamer.getAtlasTexture('vht');
        const vbtAtlas = this.#tileStreamer.getAtlasTexture('vbtBaseColor');
        const hasValidTextures = !!(vhtAtlas?.gpuTextureView && vbtAtlas?.gpuTextureView && currentLoadedTileCount > 0);

        const tileCountChanged = hasValidTextures && this.#lastLoadedTileCount !== currentLoadedTileCount;
        if (tileCountChanged) {
            this.#lastLoadedTileCount = currentLoadedTileCount;
        }

        const dx = camX - this.#lastBakePos[0];
        const dz = camZ - this.#lastBakePos[1];
        const distSq = dx * dx + dz * dz;
        const bakeThreshold = this.#streamingRadius * 0.35;

        if (hasValidTextures && (!this.#initialBaked || tileCountChanged || distSq > bakeThreshold * bakeThreshold)) {
            this.#initialBaked = true;
            this.#lastBakePos[0] = camX;
            this.#lastBakePos[1] = camZ;
            this.rebakeAll(camX, camZ);
        }

        this.#megaBuffer.resetMultiIndirectCommands();

        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const hasValidVbt = !!(vbtAtlas?.gpuTexture && currentLoadedTileCount > 0);

        for (const type of this.#grassList) {
            const {typeId, dirty} = type;
            const res = this.#typeMaterialBuffers.get(typeId);
            if (!res) continue;

            const isDirty = !res.initialized || dirty || res.cachedHasVbt !== hasValidVbt;
            if (isDirty) {
                res.initialized = true;
                res.cachedHasVbt = hasValidVbt;
                type.markClean();

                const {
                    cullingDistance,
                    fadeStartDistance,
                    height,
                    minY,
                    shadowCullDistance,
                    shadowFadeStartDistance,
                    groundBlendStrength,
                    alphaCutoff,
                    exposureBoost,
                    subsurfaceColor,
                    subsurfaceStrength,
                    roughness,
                    shadowStrength,
                    receiveShadow
                } = type;

                const {
                    grassUniformCPUBuffer: gf,
                    grassUniformGPUBuffer,
                    cpuBuffer: mf,
                    uintBuffer: mu,
                    uniformBuffer
                } = res;

                gf[0] = cullingDistance;
                gf[1] = fadeStartDistance;
                gf[2] = height;
                gf[3] = minY;
                gf[4] = shadowCullDistance;
                gf[5] = shadowFadeStartDistance;
                gf[6] = 0.0;
                gf[7] = 0.0;

                gpuDevice.queue.writeBuffer(
                    grassUniformGPUBuffer,
                    0,
                    gf.buffer,
                    0,
                    gf.byteLength
                );

                mf[0] = groundBlendStrength;
                mf[1] = alphaCutoff;
                mu[2] = hasValidVbt ? 1 : 0;
                mf[3] = exposureBoost;

                mf[4] = subsurfaceColor[0];
                mf[5] = subsurfaceColor[1];
                mf[6] = subsurfaceColor[2];
                mf[7] = subsurfaceStrength;

                mf[8] = roughness;
                mf[9] = shadowStrength;
                mu[10] = receiveShadow ? 1 : 0;

                gpuDevice.queue.writeBuffer(
                    uniformBuffer,
                    0,
                    mf.buffer,
                    0,
                    mf.byteLength
                );
            }
        }

        // GPU 초고속 컬링 단일 패스 디스패치 (위치/노멀 계산 0%, 거리 및 프러스텀 판정만 초고속 수행)
        this.commandEncoderManager.addPreProcessComputePass(
            'Grass_GPU_Culling_ComputePass',
            (computePass: GPUComputePassEncoder) => {
                this.#cullPipeline.dispatchPass(
                    computePass,
                    this.#megaBuffer,
                    this.#grassList,
                    camX,
                    camY,
                    camZ,
                    frustumPlanesF32
                );
            }
        );
    }

    /**
     * [KO] 등록된 잔디의 고유 이름을 통해 해당 {@link Grass} 생태계 인스턴스를 검색합니다.
     * [EN] Finds and retrieves the corresponding {@link Grass} ecosystem instance by its registered unique name.
     *
     * @param name - 검색할 잔디의 고유 이름
     * @returns 일치하는 {@link Grass} 인스턴스 (미발견 시 `undefined`)
     */
    getGrassByName(name: string): Grass | undefined {
        const count = this.#grassList.length;
        for (let i = 0; i < count; i++) {
            const g = this.#grassList[i];
            if (g.name === name) return g;
        }
        return undefined;
    }

    /**
     * [KO] 지형의 새로운 타일 컴포넌트가 로드되었을 때 호출되는 라이프사이클 훅입니다.
     * [EN] Lifecycle hook invoked when a new landscape tile component finishes loading.
     *
     * @param tileComponent - 로드 완료된 지형 타일 컴포넌트 (`LandscapeComponent`)
     */
    onTileLoaded(tileComponent: LandscapeComponent): void {
        if (!this.#enabled || this.#grassList.length === 0 || !tileComponent) return;

        if (this.#lastCamPos[0] === 0 && this.#lastCamPos[1] === 0 && this.#lastCamPos[2] === 0) {
            const fallbackCamPos = this.#getFallbackCameraPosition();
            if (fallbackCamPos) {
                this.#lastCamPos[0] = fallbackCamPos[0];
                this.#lastCamPos[1] = fallbackCamPos[1];
                this.#lastCamPos[2] = fallbackCamPos[2];
            }
        }
        this.rebakeAll();
    }

    /**
     * [KO] 메인 렌더 패스에서 GPU 컬링을 통과한 잔디 인스턴스들을 간접 드로우(`drawIndexedIndirect`) 방식으로 고속 일괄 렌더링합니다.
     * [EN] Renders culled grass instances in the main render pass using fast indirect draw calls (`drawIndexedIndirect`).
     *
     * @param view - 현재 렌더링 중인 View3D 객체
     * @param passEncoder - 메인 씬 GPURenderPassEncoder
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        if (!this.#enabled || this.#grassList.length === 0 || !this.#populated) return;
        this.#renderer.render(view, passEncoder, this.#grassList, this.#megaBuffer, this.#typeMaterialBuffers);
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사(`castShadow: true`)가 설정된 잔디 인스턴스들의 그림자를 렌더링합니다.
     * [EN] Renders shadows for grass instances configured with `castShadow: true` in the cascaded shadow map (CSM) pass.
     *
     * @param view - 그림자 패스를 렌더링 중인 View3D 객체
     * @param passEncoder - 섀도우 맵 생성을 위한 GPURenderPassEncoder
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        if (!this.#enabled || this.#grassList.length === 0) return;
        this.#renderer.renderShadow(view, passEncoder, this.#grassList, this.#megaBuffer, this.#typeMaterialBuffers);
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
        const list = this.#grassList;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            this.#bakeGrassType(list[i], posX, posZ);
        }
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

        for (const res of this.#typeMaterialBuffers.values()) {
            res.uniformBuffer.destroy();
            res.grassUniformGPUBuffer.destroy();
            res.subMeshResources.length = 0;
        }
        this.#typeMaterialBuffers.clear();
        for (const grass of this.#grassList) {
            grass.onRepopulateRequired = null;
        }
        this.#grassList.length = 0;
    }

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
        const vhtAtlas = this.#tileStreamer.getAtlasTexture('vht');
        const vbtAtlas = this.#tileStreamer.getAtlasTexture('vbtBaseColor');
        if (!vhtAtlas?.gpuTextureView || !vbtAtlas?.gpuTextureView) return;

        const posX = centerX !== undefined ? centerX : this.#lastCamPos[0];
        const posZ = centerZ !== undefined ? centerZ : this.#lastCamPos[2];

        this.#bakePipeline.dispatchBake(
            this.#megaBuffer,
            this.#tileStreamer,
            this.#landscape,
            grass,
            posX,
            posZ
        );
    }
}

Object.freeze(GrassManager);
export default GrassManager;
