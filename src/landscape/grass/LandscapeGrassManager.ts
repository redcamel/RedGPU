import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeComponent from "../core/spatial/LandscapeComponent";
import Grass, {GrassOptions} from "./core/Grass";
import {GrassMegaBuffer} from "./core/buffer/GrassMegaBuffer";
import {GrassBaker} from "./core/baking/GrassBaker";
import {GrassCuller} from "./core/culling/GrassCuller";
import grassVertexSource from "./shader/grassVertex.wgsl";
import grassFragmentSource from "./shader/grassFragment.wgsl";
import grassFragmentFarSource from "./shader/grassFragmentFar.wgsl";
import grassShadowSource from "./shader/grassShadow.wgsl";
import grassShadowVertexSource from "./shader/grassShadowVertex.wgsl";
import {mat4} from "gl-matrix";
import computeViewFrustumPlanes from "../../math/computeViewFrustumPlanes";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import LandscapeWeightMapCache from "../core/material/LandscapeWeightMapCache";

const DEG2RAD: number = 0.017453292519943295;

/**
 * [KO] 잔디 배치 및 스트리밍을 수행하는 기본 격자 셀의 한 변 크기(미터 단위)입니다. 기본값: `16.0`
 * [EN] Dimension in meters of a single grid cell used for grass population and streaming. Default: `16.0`
 */
const CELL_SIZE: number = 16.0;

/**
 * [KO] 카메라를 중심으로 잔디를 활성화하고 스트리밍하는 기본 반경(미터 단위)입니다. 기본값: `120.0`
 * [EN] Default radius in meters around the camera within which grass is activated and streamed. Default: `120.0`
 */
const DEFAULT_STREAMING_RADIUS: number = 120.0;

/**
 * [KO] 한 프레임에 거리순으로 정렬 및 평가 가능한 스트리밍 후보 셀의 최대 개수입니다. 기본값: `2048`
 * [EN] Maximum number of candidate cells evaluated for streaming in a single frame. Default: `2048`
 */
const MAX_CANDIDATE_CELLS: number = 2048;

/**
 * [KO] 프레임 드랍(스파이크)을 방지하기 위해 한 프레임에 신규 인스턴스를 생성/배치하는 최대 셀 예산입니다. 기본값: `8`
 * [EN] Maximum cell budget populated with new instances per frame to prevent frame drops. Default: `8`
 */
const MAX_POPULATE_CELLS_PER_FRAME: number = 8;

/**
 * [KO] 특정 격자 셀에 할당된 MegaBuffer 인스턴스 슬롯 범위 정보 인터페이스입니다.
 * [EN] Interface defining the MegaBuffer instance slot range allocated to a specific grid cell.
 */
interface CellSlotRange {
    /**
     * [KO] MegaBuffer 내에서 해당 셀의 인스턴스 데이터가 시작되는 슬롯 인덱스입니다.
     * [EN] Starting slot index of the cell's instance data within the MegaBuffer.
     */
    start: number;

    /**
     * [KO] 해당 셀에 할당 예약된 총 슬롯 개수(최대 밀도 기준)입니다.
     * [EN] Total number of slots reserved for this cell based on target density.
     */
    count: number;

    /**
     * [KO] 지형 가중치 맵 및 절차적 배치 필터링을 거쳐 실제로 유효하게 채워진 인스턴스 개수입니다.
     * [EN] Actual number of valid instances populated after terrain weight map and procedural filtering.
     */
    filledCount: number;
}

/**
 * [KO] 스트리밍 후보 셀들의 인덱스를 카메라와의 거리 제곱값 오름차순으로 정렬하는 퀵 정렬(Quick Sort) 함수입니다.
 * [EN] Quick-sort function that sorts streaming candidate cell indices in ascending order of squared distance to the camera.
 *
 * @remarks
 * [KO] 매 프레임 고빈도 호출 구간에서 가비지 컬렉션(GC) 부하를 방지하기 위해 추가 힙 메모리 할당 없이 사전 할당된 `Int32Array` 배열 내에서 제자리 스왑(in-place swap)으로 정렬합니다.
 * [EN] Operates in-place on pre-allocated `Int32Array` index arrays without additional heap allocations to eliminate Garbage Collection (GC) overhead during high-frequency per-frame execution.
 *
 * @param indices -
 * [KO] 정렬할 후보 셀의 인덱스 배열 (`#candidateIndices`)
 * [EN] Array of candidate cell indices to be sorted (`#candidateIndices`)
 * @param dists -
 * [KO] 각 후보 셀의 카메라 상대 거리 제곱값이 저장된 배열 (`#candidateDistancesSq`)
 * [EN] Array containing squared distances from each candidate cell to the camera (`#candidateDistancesSq`)
 * @param left -
 * [KO] 정렬 구간 시작 인덱스
 * [EN] Starting index of the range to sort
 * @param right -
 * [KO] 정렬 구간 끝 인덱스
 * [EN] Ending index of the range to sort
 */
function sortCandidateIndicesByDistance(
    indices: Int32Array,
    dists: Float32Array,
    left: number,
    right: number
): void {
    if (left >= right) return;
    const pivotVal = dists[indices[(left + right) >> 1]];
    let i = left;
    let j = right;
    while (i <= j) {
        while (dists[indices[i]] < pivotVal) i++;
        while (dists[indices[j]] > pivotVal) j--;
        if (i <= j) {
            const temp = indices[i];
            indices[i] = indices[j];
            indices[j] = temp;
            i++;
            j--;
        }
    }
    if (left < j) sortCandidateIndicesByDistance(indices, dists, left, j);
    if (i < right) sortCandidateIndicesByDistance(indices, dists, i, right);
}

//TODO - 잔디도 머지해서 그리면 좋아질것 같은데...
/**
 * [KO] 대규모 지형(Landscape)의 절차적 잔디(Procedural Grass) 생태계를 총괄 관리하는 매니저 클래스입니다.
 * [EN] Manager class that oversees the large-scale procedural grass ecosystem of the landscape.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const grassManager = landscape.grassManager;
 * grassManager.streamingRadius = 150;
 *
 * // 잔디 생태계 타입 등록
 * const fieldGrass = grassManager.addGrass({
 *     name: 'FieldGrass',
 *     lods: [
 *         { mesh: grassMeshLOD0, lodDistance: 35 },
 *         { mesh: grassMeshLOD1, lodDistance: 90 }
 *     ],
 *     baseColorTexture: grassTexture,
 *     densityPerHectare: 7500,
 *     targetLayer: 'GrassLayer'
 * });
 * ```
 */
export class LandscapeGrassManager {
    static readonly #COMPUTE_PASS_DESCRIPTOR: GPUComputePassDescriptor = {
        label: 'LandscapeGrass_ComputePass'
    };

    #redGPUContext: RedGPUContext;
    #landscape: Landscape;
    #tileStreamer: LandscapeTileStreamer;
    #enabled: boolean = true;
    #streamingRadius: number = DEFAULT_STREAMING_RADIUS;

    #megaBuffer: GrassMegaBuffer;
    #baker: GrassBaker;
    #culler: GrassCuller;

    #grassList: Grass[] = [];
    #nextTypeId: number = 0;
    #totalInstanceCount: number = 0;
    #populated: boolean = false;

    #vertexModule: GPUShaderModule | null = null;
    #vertexShadowModule: GPUShaderModule | null = null;
    #fragmentModule: GPUShaderModule | null = null;
    #fragmentFarModule: GPUShaderModule | null = null;
    #fragmentShadowModule: GPUShaderModule | null = null;
    #pipelineLayout: GPUPipelineLayout | null = null;
    #pipelineBindGroupLayout1: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout2: GPUBindGroupLayout | null = null;
    #renderPipelinesNear: Map<number, GPURenderPipeline> = new Map();
    #renderPipelinesFar: Map<number, GPURenderPipeline> = new Map();
    #shadowPipeline: GPURenderPipeline | null = null;

    #typeMaterialBuffers: Map<number, {
        uniformBuffer: GPUBuffer;
        cpuBuffer: Float32Array;
        uintBuffer: Uint32Array;
        grassUniformGPUBuffer: GPUBuffer;
        grassUniformCPUBuffer: Float32Array;
        bindGroup: GPUBindGroup | null;
        instanceBindGroup: GPUBindGroup | null;
        cachedColorTexView: GPUTextureView | null;
        initialized: boolean;
        cachedHasVbt: boolean;
    }> = new Map();

    #candidateKeys: Int32Array = new Int32Array(MAX_CANDIDATE_CELLS);
    #candidateDistancesSq: Float32Array = new Float32Array(MAX_CANDIDATE_CELLS);
    #candidateIndices: Int32Array = new Int32Array(MAX_CANDIDATE_CELLS);

    #slotRangePool: CellSlotRange[] = [];

    #typeCellStates: Map<number, {
        activeCellRanges: Map<number, CellSlotRange>;
        freeSlotRanges: CellSlotRange[];
        slotHead: number;
        instanceCount: number;
    }> = new Map();

    #neededCellKeysSet: Set<number> = new Set();
    #keysToEvict: number[] = [];
    #lastPopulatePos: [number, number, number] = [0, 0, 0];
    #lastUpdateGridPos: [number, number] = [-999999, -999999];
    #lastLoadedTileCount: number = 0;
    #frustumPlanesF32: Float32Array = new Float32Array(24);
    #viewProjectionMatrixF32: Float32Array = new Float32Array(16);
    #tempWeights4: Float32Array = new Float32Array(4);

    #prngState: number = 12345;

    /**
     * [KO] LandscapeGrassManager의 새 인스턴스를 생성합니다.
     * @remarks 사용자가 직접 생성하지 마시고 `landscape.grassManager` 프로퍼티를 통해 접근하십시오.
     * [EN] Creates a new instance of LandscapeGrassManager.
     * @remarks Do not instantiate directly; access via the `landscape.grassManager` property.
     *
     * @param landscape -
     * [KO] 잔디 생태계가 바인딩될 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance to which the grass ecosystem is bound
     * @param tileStreamer -
     * [KO] 지형의 가상 텍스처(VHT/VNT/VBT)를 제공하는 타일 스트리머
     * [EN] Tile streamer providing landscape virtual textures (VHT/VNT/VBT)
     */
    constructor(landscape: Landscape, tileStreamer: LandscapeTileStreamer) {
        this.#landscape = landscape;
        this.#tileStreamer = tileStreamer;
        this.#redGPUContext = landscape.redGPUContext;

        this.#megaBuffer = new GrassMegaBuffer(this.#redGPUContext, 131072);
        this.#baker = new GrassBaker(this.#redGPUContext);
        this.#culler = new GrassCuller(this.#redGPUContext);

        this.#megaBuffer.onRecreated = () => {
            this.#baker.invalidateBindGroup();
            this.#culler.invalidateBindGroup();
            for (const res of this.#typeMaterialBuffers.values()) {
                res.instanceBindGroup = null;
            }
        };

        this.#initShadersAndLayouts();
    }

    /**
     * [KO] 잔디 시스템의 활성화 여부를 가져옵니다. `false`일 경우 잔디 스트리밍, 컬링, 렌더링이 일시 중단됩니다.
     * [EN] Gets whether the grass system is enabled. When `false`, grass streaming, culling, and rendering are suspended.
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * [KO] 잔디 시스템의 활성화 여부를 설정합니다.
     * [EN] Sets whether the grass system is enabled.
     */
    set enabled(val: boolean) {
        this.#enabled = val;
    }

    /**
     * [KO] 카메라 중심의 잔디 스트리밍 유효 반경(미터 단위)을 가져옵니다.
     * [EN] Gets the active grass streaming radius (in meters) around the camera.
     */
    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    /**
     * [KO] 카메라 중심의 잔디 스트리밍 유효 반경(미터 단위)을 설정합니다. 값이 변경되면 인스턴스 배치가 즉시 재평가됩니다.
     * [EN] Sets the active grass streaming radius (in meters) around the camera. Re-evaluates instance placement immediately when changed.
     */
    set streamingRadius(val: number) {
        const clamped = Math.max(16.0, val);
        if (this.#streamingRadius !== clamped) {
            this.#streamingRadius = clamped;
            this.#populateInstances(this.#lastPopulatePos);
        }
    }


    /**
     * [KO] 현재 매니저에 등록된 잔디 목록을 가져옵니다.
     * [EN] Gets the list of grass items currently registered to this manager.
     */
    get grassList(): Grass[] {
        return this.#grassList;
    }

    /**
     * [KO] 등록된 잔디가 하나 이상 존재하는지 여부를 확인합니다.
     * [EN] Checks whether one or more grass items are registered.
     */
    get hasGrass(): boolean {
        return this.#grassList.length > 0;
    }

    /**
     * [KO] 현재 스트리밍 반경 내 활성 셀들에 생성되어 메모리에 로드된 총 잔디 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of grass instances currently populated and loaded in memory within the streaming radius.
     */
    get totalInstanceCount(): number {
        return this.#totalInstanceCount;
    }

    /**
     * [KO] 새로운 잔디 생태계 타입을 등록하고 GPU MegaBuffer 공간 및 머티리얼 바인딩 리소스를 할당합니다.
     * [EN] Registers a new grass ecosystem type and allocates GPU MegaBuffer capacity and material binding resources.
     *
     * @remarks
     * [KO] 등록된 잔디는 카메라 스트리밍 반경 및 지형 가중치 맵(WeightMap)에 따라 자동으로 셀 단위 배치 및 인스턴싱이 수행됩니다.
     * [EN] Registered grass is automatically populated and instanced per cell according to the camera streaming radius and terrain weight map.
     *
     * ### Example
     * ```typescript
     * const grassType = landscape.grassManager.addGrass({
     *     name: 'WildGrass',
     *     lods: [
     *         { mesh: grassLOD0Mesh, lodDistance: 30 },
     *         { mesh: grassLOD1Mesh, lodDistance: 70 }
     *     ],
     *     baseColorTexture: grassTexture,
     *     densityPerHectare: 6000,
     *     minSlope: 0,
     *     maxSlope: 40,
     *     minScale: [0.8, 0.8],
     *     maxScale: [1.2, 1.4],
     *     groundBlendStrength: 0.85,
     *     subsurfaceStrength: 0.5,
     *     targetLayer: 'GrassLayer'
     * });
     * ```
     *
     * @param options -
     * [KO] 잔디 타입의 메시, LOD 단계, 밀도, 경사 필터링, 스케일 범위, 셰이딩 파라미터가 포함된 옵션 객체
     * [EN] Options object containing meshes, LOD stages, density, slope filtering, scale ranges, and shading parameters
     * @returns
     * [KO] 생성되어 등록된 {@link Grass} 인스턴스
     * [EN] Created and registered {@link Grass} instance
     */
    addGrass(options: GrassOptions): Grass {
        const grassType = new Grass(this.#redGPUContext, options);

        const typeId = this.#nextTypeId++;
        grassType.typeId = typeId;
        this.#grassList.push(grassType);

        const targetRadius = Math.max(grassType.cullingDistance, this.#streamingRadius);
        const cellCountApprox = Math.ceil((Math.PI * targetRadius * targetRadius) / (CELL_SIZE * CELL_SIZE));
        const maxInstances = Math.max(2048, Math.min(262144, cellCountApprox * Math.ceil(grassType.instancesPerCell * 1.3)));

        const lodAllocConfigs = grassType.lods.map(l => ({
            lodIndex: l.lodIndex,
            lodDistance: l.lodDistance,
            indexCount: (l.geometry as any)?.indexBuffer?.indexCount ?? 0,
            firstIndex: 0,
            baseVertex: 0
        }));

        const alloc = this.#megaBuffer.allocateType(
            typeId,
            grassType.name,
            maxInstances,
            lodAllocConfigs
        );

        const baseOffset = alloc.rawBaseOffset;
        for (let i = 0; i < maxInstances; i++) {
            this.#megaBuffer.writeInstanceData(baseOffset + i, 0.0, -999999.0, 0.0, 0.0, 0.0, 0.0);
        }
        this.#megaBuffer.uploadInstances(baseOffset, maxInstances);

        this.#culler.invalidateBindGroup();
        this.#baker.invalidateBindGroup();

        this.#typeCellStates.set(typeId, {
            activeCellRanges: new Map(),
            freeSlotRanges: [],
            slotHead: 0,
            instanceCount: 0
        });

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            const cpuBuffer = new Float32Array(12);
            const uintBuffer = new Uint32Array(cpuBuffer.buffer);

            const uniformBuffer = gpuDevice.createBuffer({
                label: `Grass_MaterialUniform_${grassType.name}`,
                size: cpuBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const grassUniformCPUBuffer = new Float32Array(8);
            const grassUniformGPUBuffer = gpuDevice.createBuffer({
                label: `Grass_UniformBuffer_${grassType.name}`,
                size: grassUniformCPUBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            this.#typeMaterialBuffers.set(grassType.typeId, {
                uniformBuffer,
                cpuBuffer,
                uintBuffer,
                grassUniformGPUBuffer,
                grassUniformCPUBuffer,
                bindGroup: null,
                instanceBindGroup: null,
                cachedColorTexView: null,
                initialized: false,
                cachedHasVbt: false
            });
        }

        grassType.onChanged = () => {
            this.#populateInstances(this.#lastPopulatePos);
        };

        if (grassType.targetLayer) {
            const matchedLayer = this.#landscape.layers.find(l => l.name === grassType.targetLayer || (l as any).key === grassType.targetLayer);
            const targetSrc = matchedLayer?.weightTexture?.src || (matchedLayer as any)?.pendingWeightSrc;
            if (targetSrc) {
                LandscapeWeightMapCache.load(targetSrc).then(() => {
                    if (this.#lastPopulatePos[0] === 0 && this.#lastPopulatePos[1] === 0 && this.#lastPopulatePos[2] === 0) {
                        const view = this.#landscape.redGPUContext.viewList?.[0];
                        const cam = (view as any)?.camera;
                        if (cam) {
                            this.#lastPopulatePos[0] = cam.x ?? cam.position?.[0] ?? cam.camera?.x ?? 0;
                            this.#lastPopulatePos[1] = cam.y ?? cam.position?.[1] ?? cam.camera?.y ?? 0;
                            this.#lastPopulatePos[2] = cam.z ?? cam.position?.[2] ?? cam.camera?.z ?? 0;
                        }
                    }
                    this.#populateInstances(this.#lastPopulatePos);
                });
            }
        }

        this.#lastUpdateGridPos[0] = -999999;
        this.#lastUpdateGridPos[1] = -999999;
        return grassType;
    }

    /**
     * [KO] 등록된 특정 잔디 생태계 타입을 매니저에서 제거하고 관련 GPU 리소스를 안전하게 해제합니다.
     * [EN] Removes a specific registered grass ecosystem type from the manager and safely releases associated GPU resources.
     *
     * @param target -
     * [KO] 제거할 {@link Grass} 인스턴스 또는 잔디의 고유 이름(`string`)
     * [EN] {@link Grass} instance or unique grass name (`string`) to remove
     * @returns
     * [KO] 제거 성공 여부 (대상을 찾아 정상 제거 시 `true`, 미존재 시 `false`)
     * [EN] Whether removal succeeded (`true` if found and removed, `false` otherwise)
     */
    removeGrass(target: Grass | string): boolean {
        if (!target) return false;
        const grass = (target instanceof Grass) ? target : this.getGrass(target);
        if (!grass) return false;

        const idx = this.#grassList.indexOf(grass);
        if (idx === -1) return false;

        const typeId = grass.typeId;
        grass.onChanged = null;
        this.#grassList.splice(idx, 1);

        const res = this.#typeMaterialBuffers.get(typeId);
        if (res) {
            res.uniformBuffer.destroy();
            res.grassUniformGPUBuffer.destroy();
            this.#typeMaterialBuffers.delete(typeId);
        }

        const state = this.#typeCellStates.get(typeId);
        if (state) {
            for (const r of state.activeCellRanges.values()) this.#releaseSlotRange(r);
            for (const r of state.freeSlotRanges) this.#releaseSlotRange(r);
            state.activeCellRanges.clear();
            state.freeSlotRanges.length = 0;
            this.#typeCellStates.delete(typeId);
        }

        const alloc = this.#megaBuffer.getAllocation(typeId);
        if (alloc) {
            alloc.instanceCount = 0;
            const baseOffset = alloc.rawBaseOffset;
            for (let i = 0; i < alloc.maxInstances; i++) {
                this.#megaBuffer.writeInstanceData(baseOffset + i, 0.0, -999999.0, 0.0, 0.0, 0.0, 0.0);
            }
            this.#megaBuffer.uploadInstances(baseOffset, alloc.maxInstances);
            this.#megaBuffer.updateTypeParams(
                typeId,
                0.0, 0.0, 0.0, 0.0, 0.0, false,
                baseOffset, 0, alloc.culledBaseOffset, alloc.indirectBaseOffset,
                0, 0, [0, 0, 0, 0]
            );
        }

        let totalPop = 0;
        for (const type of this.#grassList) {
            const a = this.#megaBuffer.getAllocation(type.typeId);
            if (a) totalPop += a.instanceCount;
        }
        this.#totalInstanceCount = totalPop;
        this.#populated = totalPop > 0;

        return true;
    }

    /**
     * [KO] 등록된 잔디 생태계 타입을 이름(`name`)으로 조회합니다.
     * [EN] Retrieves a registered grass ecosystem type by name.
     *
     * @param name -
     * [KO] 조회할 잔디의 고유 이름(`string`)
     * [EN] Unique name (`string`) of the grass to retrieve
     * @returns
     * [KO] 일치하는 {@link Grass} 인스턴스 (미등록 시 `undefined`)
     * [EN] Matching {@link Grass} instance (`undefined` if not registered)
     */
    getGrass(name: string): Grass | undefined {
        if (!name) return undefined;
        const count = this.#grassList.length;
        for (let i = 0; i < count; i++) {
            const g = this.#grassList[i];
            if (g.name === name) return g;
        }
        return undefined;
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
        this.#megaBuffer = new GrassMegaBuffer(this.#redGPUContext, 131072);
        this.#megaBuffer.onRecreated = () => {
            this.#baker.invalidateBindGroup();
            this.#culler.invalidateBindGroup();
            for (const res of this.#typeMaterialBuffers.values()) {
                res.instanceBindGroup = null;
            }
        };

        this.#nextTypeId = 0;
        this.#lastLoadedTileCount = 0;
        this.#lastUpdateGridPos[0] = -999999;
        this.#lastUpdateGridPos[1] = -999999;
        this.#culler.invalidateBindGroup();
        this.#baker.invalidateBindGroup();
    }

    /**
     * [KO] 메인 렌더 패스에서 GPU 컬링을 통과한 잔디 인스턴스들을 간접 드로우(`drawIndexedIndirect`) 방식으로 고속 일괄 렌더링합니다.
     * [EN] Renders culled grass instances in the main render pass using fast indirect draw calls (`drawIndexedIndirect`).
     *
     * @param view -
     * [KO] 현재 렌더링 중인 View3D 객체 (시스템 유니폼 바인드그룹 및 MSAA 샘플 수 추출용)
     * [EN] Current View3D object being rendered (used to extract system uniform bind group and MSAA sample count)
     * @param passEncoder -
     * [KO] 메인 씬 GPURenderPassEncoder
     * [EN] Main scene GPURenderPassEncoder
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder): void {
        if (!this.#enabled || this.#grassList.length === 0 || !this.#populated) return;

        const systemBG = view.systemUniform_Vertex_UniformBindGroup;
        if (!systemBG) return;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#pipelineBindGroupLayout1 || !this.#pipelineBindGroupLayout2) return;

        const sampleCount = this.#redGPUContext.antialiasingManager.useMSAA ? 4 : 1;
        const nearPipeline = this.#getRenderPipeline(sampleCount, false);
        const farPipeline = this.#getRenderPipeline(sampleCount, true);
        if (!nearPipeline || !farPipeline) return;

        const fallbackTex = this.#redGPUContext.resourceManager.emptyBitmapTextureView;
        const basicSampler = this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        let currentPipeline: GPURenderPipeline | null = nearPipeline;
        passEncoder.setPipeline(nearPipeline);
        passEncoder.setBindGroup(0, systemBG);

        const indirectGPUBuffer = this.#megaBuffer.indirectGPUBuffer;
        if (!indirectGPUBuffer) return;

        for (const type of this.#grassList) {
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!alloc || alloc.instanceCount === 0) continue;

            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res) continue;

            if (!res.instanceBindGroup && this.#megaBuffer.culledGPUBuffer && res.grassUniformGPUBuffer) {
                res.instanceBindGroup = gpuDevice.createBindGroup({
                    label: `Grass_InstanceBindGroup_${type.name}`,
                    layout: this.#pipelineBindGroupLayout1,
                    entries: [
                        {binding: 0, resource: {buffer: this.#megaBuffer.culledGPUBuffer}},
                        {binding: 1, resource: {buffer: res.grassUniformGPUBuffer}},
                    ]
                });
            }

            const rawTex = type.baseColorTexture?.gpuTexture;
            const colorTexView = (rawTex
                ? (this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(type.baseColorTexture) || rawTex.createView())
                : null) || fallbackTex;

            if (!res.bindGroup || res.cachedColorTexView !== colorTexView) {
                res.bindGroup = gpuDevice.createBindGroup({
                    label: `Grass_MaterialBindGroup_${type.name}`,
                    layout: this.#pipelineBindGroupLayout2,
                    entries: [
                        {binding: 0, resource: colorTexView},
                        {binding: 1, resource: basicSampler},
                        {binding: 2, resource: {buffer: res.uniformBuffer}},
                    ]
                });
                res.cachedColorTexView = colorTexView;
            }

            if (!res.instanceBindGroup || !res.bindGroup) continue;

            passEncoder.setBindGroup(1, res.instanceBindGroup);
            passEncoder.setBindGroup(2, res.bindGroup);

            for (const lodAlloc of alloc.lods) {
                const targetPipeline = lodAlloc.lodIndex === 0 ? nearPipeline : farPipeline;
                if (currentPipeline !== targetPipeline) {
                    passEncoder.setPipeline(targetPipeline);
                    currentPipeline = targetPipeline;
                }

                const lodGeom = type.getGeometryForLOD(lodAlloc.lodIndex);
                const lvb = lodGeom?.vertexBuffer;
                const lib = lodGeom?.indexBuffer;
                if (!lvb || !lib) continue;

                passEncoder.setVertexBuffer(0, lvb.gpuBuffer);
                passEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

                const indirectOffsetBytes = lodAlloc.indirectOffset * 5 * 4;
                passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
            }
        }
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사(`castShadow: true`)가 설정된 잔디 인스턴스들의 그림자를 렌더링합니다.
     * [EN] Renders shadows for grass instances configured with `castShadow: true` in the cascaded shadow map (CSM) pass.
     *
     * @param view -
     * [KO] 그림자 패스를 렌더링 중인 View3D 객체
     * [EN] Current View3D object rendering the shadow pass
     * @param passEncoder -
     * [KO] 섀도우 맵 생성을 위한 GPURenderPassEncoder
     * [EN] GPURenderPassEncoder for shadow map generation
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void {
        if (!this.#enabled || this.#grassList.length === 0) return;

        const currentCascade = view.currentCascadeIndex;
        if (currentCascade !== undefined && currentCascade > 1) return;

        const indirectGPUBuffer = this.#megaBuffer.indirectGPUBuffer;
        if (!indirectGPUBuffer) return;

        const pipeline = this.#getShadowRenderPipeline();
        if (!pipeline) return;

        const systemBG = view.systemUniform_Vertex_UniformBindGroup;
        if (!systemBG) return;

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, systemBG);

        for (const type of this.#grassList) {
            if (!type.castShadow) continue;
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!alloc || alloc.instanceCount === 0) continue;

            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res || !res.instanceBindGroup || !res.bindGroup) continue;

            const lod0Alloc = alloc.lods[0];
            if (!lod0Alloc) continue;

            const lodGeom = type.getGeometryForLOD(0);
            const lvb = lodGeom?.vertexBuffer;
            const lib = lodGeom?.indexBuffer;
            if (!lvb || !lib) continue;

            passEncoder.setBindGroup(1, res.instanceBindGroup);
            passEncoder.setBindGroup(2, res.bindGroup);

            passEncoder.setVertexBuffer(0, lvb.gpuBuffer);
            passEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

            const indirectOffsetBytes = lod0Alloc.indirectOffset * 5 * 4;
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
        }
    }

    /**
     * [KO] 매 프레임 호출되어 카메라 위치에 기반한 잔디 격자 셀 스트리밍을 갱신하고, GPU 컬링 및 베이킹 Compute Pass를 큐에 등록합니다.
     * [EN] Called every frame to update grass grid cell streaming based on camera position and enqueue GPU culling and baking compute passes.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더 상태 데이터 (카메라, HZB 텍스처 뷰, 사전 계산된 절두체 평면 등 포함)
     * [EN] View render state data (including camera, HZB texture views, precomputed frustum planes, etc.)
     */
    update(renderViewStateData: RenderViewStateData): void {
        if (!this.#enabled || this.#grassList.length === 0) return;

        const view = renderViewStateData.view;
        const rawCam = view.rawCamera;
        const camX = rawCam.x;
        const camY = rawCam.y;
        const camZ = rawCam.z;

        this.#lastPopulatePos[0] = camX;
        this.#lastPopulatePos[1] = camY;
        this.#lastPopulatePos[2] = camZ;

        let frustumPlanesF32: Float32Array | null = null;
        const frustumPlanes = renderViewStateData.frustumPlanes;
        if (frustumPlanes && frustumPlanes.length === 6) {
            for (let p = 0; p < 6; p++) {
                this.#frustumPlanesF32.set(frustumPlanes[p], p * 4);
            }
            frustumPlanesF32 = this.#frustumPlanesF32;
        } else if (view.projectionMatrix && rawCam?.viewMatrix) {
            const computed = computeViewFrustumPlanes(view.projectionMatrix, rawCam.viewMatrix);
            if (computed) {
                for (let p = 0; p < 6; p++) {
                    this.#frustumPlanesF32.set(computed[p], p * 4);
                }
                frustumPlanesF32 = this.#frustumPlanesF32;
            }
        }

        const currentLoadedTileCount = this.#landscape.tileLoadedCount;
        const tileCountChanged = currentLoadedTileCount !== this.#lastLoadedTileCount;
        this.#lastLoadedTileCount = currentLoadedTileCount;

        if (currentLoadedTileCount > 0) {
            const isInitialStreaming = !this.#populated;
            this.#updateCellStreaming(camX, camZ, isInitialStreaming, tileCountChanged);
        }
        this.#megaBuffer.resetIndirectDrawCountsCPU();

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const vbtAtlas = this.#tileStreamer.getAtlasTexture('vbtBaseColor');
        const hasValidVbt = !!(vbtAtlas?.gpuTexture && currentLoadedTileCount > 0);

        for (const type of this.#grassList) {
            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res) continue;

            const isDirty = !res.initialized || type.dirty || res.cachedHasVbt !== hasValidVbt;
            if (isDirty) {
                res.initialized = true;
                res.cachedHasVbt = hasValidVbt;
                type.markClean();

                const gf = res.grassUniformCPUBuffer;
                gf[0] = type.cullingDistance;
                gf[1] = type.shrinkStartDistance;
                gf[2] = type.meshHeight;
                gf[3] = type.minY;
                gf[4] = type.shadowCullDistance;
                gf[5] = type.shadowShrinkStartDistance;
                gf[6] = 0.0;
                gf[7] = 0.0;

                gpuDevice.queue.writeBuffer(
                    res.grassUniformGPUBuffer,
                    0,
                    res.grassUniformCPUBuffer.buffer,
                    0,
                    res.grassUniformCPUBuffer.byteLength
                );

                const mf = res.cpuBuffer;
                const mu = res.uintBuffer;

                mf[0] = type.groundBlendStrength;
                mf[1] = type.alphaCutoff;
                mu[2] = hasValidVbt ? 1 : 0;
                mf[3] = type.exposureBoost;

                const ssc = type.subsurfaceColor;
                mf[4] = ssc[0];
                mf[5] = ssc[1];
                mf[6] = ssc[2];
                mf[7] = type.subsurfaceStrength;

                mf[8] = type.roughness;
                mf[9] = type.shadowStrength;
                mu[10] = type.receiveShadow ? 1 : 0;

                gpuDevice.queue.writeBuffer(
                    res.uniformBuffer,
                    0,
                    res.cpuBuffer.buffer,
                    0,
                    res.cpuBuffer.byteLength
                );

                const lodCount = Math.min(4, type.lodCount);
                const lodDistances: [number, number, number, number] = [9999, 9999, 9999, 9999];
                for (let i = 0; i < lodCount; i++) {
                    lodDistances[i] = type.lods[i].lodDistance;
                }

                const alloc = this.#megaBuffer.getAllocation(type.typeId);
                if (alloc) {
                    const minSlope = type.minSlope ?? 0.0;
                    const maxSlope = type.maxSlope ?? 89.0;
                    const hasSlopeFilter = minSlope > 0.0 || maxSlope < 89.0;
                    const minSlopeTan2 = minSlope > 0.0 ? Math.tan(minSlope * DEG2RAD) ** 2 : 0.0;
                    const maxSlopeTan2 = maxSlope < 89.0 ? Math.tan(maxSlope * DEG2RAD) ** 2 : 999999.0;

                    this.#megaBuffer.updateTypeParams(
                        type.typeId,
                        type.cullingDistance,
                        type.bottomOffset,
                        type.meshHeight,
                        minSlopeTan2,
                        maxSlopeTan2,
                        hasSlopeFilter,
                        alloc.rawBaseOffset,
                        alloc.maxInstances,
                        alloc.culledBaseOffset,
                        alloc.indirectBaseOffset,
                        lodCount,
                        alloc.maxInstances,
                        lodDistances
                    );
                }
            }
        }

        const hzbTextureView = view.hierarchicalZBuffer?.textureView || null;
        const hasHZB = !!hzbTextureView;

        let viewProjectionMatrixF32: Float32Array | null = null;
        if (view.projectionMatrix && rawCam?.viewMatrix) {
            mat4.multiply(this.#viewProjectionMatrixF32 as any, view.projectionMatrix, rawCam.viewMatrix);
            viewProjectionMatrixF32 = this.#viewProjectionMatrixF32;
        }

        const totalAllocated = this.#megaBuffer.totalAllocatedInstances;
        this.#culler.updateUniforms(
            camX,
            camY,
            camZ,
            frustumPlanesF32,
            totalAllocated,
            this.#grassList.length,
            viewProjectionMatrixF32,
            hasHZB
        );

        this.#culler.updateBindGroup(this.#megaBuffer, hzbTextureView);

        this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
            LandscapeGrassManager.#COMPUTE_PASS_DESCRIPTOR,
            this.#onPreProcessComputePass
        );
    }

    /**
     * [KO] 지정된 안티앨리어싱 샘플 수(MSAA)와 LOD 거리 모드(근거리/원거리)에 대응하는 GPURenderPipeline을 반환합니다.
     * [EN] Retrieves the GPURenderPipeline matching the specified MSAA sample count and LOD distance mode (near/far).
     *
     * @param sampleCount -
     * [KO] 렌더 패스의 멀티샘플링 안티앨리어싱(MSAA) 샘플 수 (기본값: 1)
     * [EN] Multisampling antialiasing (MSAA) sample count of the render pass (default: 1)
     * @param isFar -
     * [KO] 원거리 LOD 전용 간소화 셰이더를 적용할지 여부 (기본값: false)
     * [EN] Whether to apply the simplified shader dedicated to far LOD (default: false)
     * @returns
     * [KO] 캐시되거나 생성된 GPURenderPipeline 인스턴스, 또는 생성 실패 시 `null`
     * [EN] Cached or created GPURenderPipeline instance, or `null` if creation fails
     */
    #getRenderPipeline(sampleCount: number = 1, isFar: boolean = false): GPURenderPipeline | null {
        const cache = isFar ? this.#renderPipelinesFar : this.#renderPipelinesNear;
        let pipeline = cache.get(sampleCount);
        if (pipeline) return pipeline;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        const fragModule = isFar ? this.#fragmentFarModule : this.#fragmentModule;
        if (!gpuDevice || !this.#pipelineLayout || !this.#vertexModule || !fragModule) return null;

        const preferredNormalFormat = navigator.gpu.getPreferredCanvasFormat();

        pipeline = gpuDevice.createRenderPipeline({
            label: `Grass_RenderPipeline_${isFar ? 'Far' : 'Near'}_msaa${sampleCount}`,
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 18 * 4,
                        stepMode: 'vertex',
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 1, offset: 12, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                        ]
                    }
                ]
            },
            fragment: {
                module: fragModule,
                entryPoint: 'main',
                targets: [
                    {format: 'rgba16float'},
                    {format: preferredNormalFormat},
                    {format: 'rgba16float'}
                ]
            },
            primitive: {
                topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST,
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: sampleCount
            }
        });

        cache.set(sampleCount, pipeline);
        return pipeline;
    }

    /**
     * [KO] 현재 활성화된 모든 잔디 인스턴스에 대해 지형 표면 높이/법선/가중치 스냅 GPU 베이킹 태스크를 재등록합니다.
     * [EN] Re-enqueues GPU baking tasks for all currently active grass instances to re-snap height, normals, and weights to the terrain surface.
     */
    rebakeAll(): void {
        if (!this.#enabled || this.#grassList.length === 0) return;
        for (const type of this.#grassList) {
            const state = this.#typeCellStates.get(type.typeId);
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!state || !alloc) continue;
            for (const range of state.activeCellRanges.values()) {
                if (range.filledCount > 0) {
                    this.#baker.addBakeTasks(alloc.rawBaseOffset + range.start, range.filledCount, type.typeId);
                }
            }
        }
    }

    /**
     * [KO] 지형의 새로운 타일 컴포넌트가 로드되었을 때 호출되는 라이프사이클 훅으로, 해당 타일 영역과 교차하는 잔디 인스턴스들의 지형 스냅 베이킹을 실행합니다.
     * [EN] Lifecycle hook invoked when a new landscape tile component finishes loading, triggering terrain snap baking for grass instances intersecting that tile boundary.
     *
     * @param tileComponent -
     * [KO] 로드 완료된 지형 타일 컴포넌트 (`LandscapeComponent`)
     * [EN] Loaded landscape tile component (`LandscapeComponent`)
     */
    onTileLoaded(tileComponent: LandscapeComponent): void {
        if (!this.#enabled || this.#grassList.length === 0 || !tileComponent) return;

        if (this.#lastPopulatePos[0] === 0 && this.#lastPopulatePos[1] === 0 && this.#lastPopulatePos[2] === 0) {
            // TODO - 이건 나중에 처리해야겠다
            const view = this.#landscape.redGPUContext.viewList?.[0] as View3D | undefined;
            const rawCam = view?.rawCamera;
            if (rawCam) {
                this.#lastPopulatePos[0] = rawCam.x;
                this.#lastPopulatePos[1] = rawCam.y;
                this.#lastPopulatePos[2] = rawCam.z;
            }
        }

        this.#updateCellStreaming(this.#lastPopulatePos[0], this.#lastPopulatePos[2], false, true);

        const [tileSizeX, tileSizeZ] = this.#landscape.tileSize;
        const halfTileX = tileSizeX * 0.5;
        const halfTileZ = tileSizeZ * 0.5;
        const minX = tileComponent.worldX - halfTileX;
        const maxX = tileComponent.worldX + halfTileX;
        const minZ = tileComponent.worldZ - halfTileZ;
        const maxZ = tileComponent.worldZ + halfTileZ;

        const cellSize = CELL_SIZE;

        for (const type of this.#grassList) {
            const state = this.#typeCellStates.get(type.typeId);
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!state || !alloc) continue;

            for (const [key, range] of state.activeCellRanges.entries()) {
                if (range.filledCount <= 0) continue;
                const cellX = (key >> 16);
                const cellZ = (key << 16) >> 16;
                const cellCenterX = (cellX + 0.5) * cellSize;
                const cellCenterZ = (cellZ + 0.5) * cellSize;

                if (cellCenterX >= minX && cellCenterX <= maxX && cellCenterZ >= minZ && cellCenterZ <= maxZ) {
                    this.#baker.addBakeTasks(alloc.rawBaseOffset + range.start, range.filledCount, type.typeId);
                }
            }
        }
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 렌더링에 사용되는 전용 GPURenderPipeline을 반환합니다.
     * [EN] Retrieves the cached GPURenderPipeline used for cascaded shadow map (CSM) rendering.
     *
     * @returns
     * [KO] 캐시되거나 생성된 섀도우 GPURenderPipeline 인스턴스, 또는 생성 실패 시 `null`
     * [EN] Cached or created shadow GPURenderPipeline instance, or `null` if creation fails
     */
    #getShadowRenderPipeline(): GPURenderPipeline | null {
        if (this.#shadowPipeline) return this.#shadowPipeline;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#pipelineLayout || !this.#vertexShadowModule || !this.#fragmentShadowModule) return null;

        this.#shadowPipeline = gpuDevice.createRenderPipeline({
            label: 'Grass_ShadowRenderPipeline',
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexShadowModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 18 * 4,
                        stepMode: 'vertex',
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 1, offset: 12, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                        ]
                    }
                ]
            },
            fragment: {
                module: this.#fragmentShadowModule,
                entryPoint: 'main',
                targets: []
            },
            primitive: {
                topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST,
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: 1
            }
        });

        return this.#shadowPipeline;
    }

    /**
     * [KO] 지정된 3D 월드 좌표를 중심으로 스트리밍 반경 내의 잔디 셀과 인스턴스를 강제로 재생성 및 배치합니다.
     * [EN] Forces repopulation and placement of grass cells and instances within the streaming radius around the specified 3D world position.
     *
     * @param centerPos -
     * [KO] 스트리밍 중심이 될 월드 좌표 `[x, y, z]`
     * [EN] World coordinates `[x, y, z]` to act as the streaming center
     */
    #populateInstances(centerPos: [number, number, number]): void {
        this.#lastPopulatePos[0] = centerPos[0];
        this.#lastPopulatePos[1] = centerPos[1];
        this.#lastPopulatePos[2] = centerPos[2];
        this.#updateCellStreaming(centerPos[0], centerPos[2], true);
    }

    /**
     * [KO] 잔디 매니저가 소유한 모든 GPU 버퍼(MegaBuffer, Uniform, Indirect Buffer), 텍스처 뷰, 파이프라인 및 내부 슬롯 풀을 안전하게 해제합니다.
     * [EN] Safely releases all GPU buffers, texture views, pipelines, slot pools, and internal resources held by the grass manager.
     */
    destroy(): void {
        this.#megaBuffer.destroy();
        this.#baker.destroy();
        this.#culler.destroy();
        this.#shadowPipeline = null;
        this.#vertexShadowModule = null;
        this.#fragmentShadowModule = null;
        this.#vertexModule = null;
        this.#fragmentModule = null;
        this.#fragmentFarModule = null;
        this.#pipelineLayout = null;
        this.#pipelineBindGroupLayout1 = null;
        this.#pipelineBindGroupLayout2 = null;

        for (const res of this.#typeMaterialBuffers.values()) {
            res.uniformBuffer.destroy();
            res.grassUniformGPUBuffer.destroy();
        }
        this.#typeMaterialBuffers.clear();
        this.#typeCellStates.clear();
        this.#slotRangePool.length = 0;
        this.#neededCellKeysSet.clear();
        this.#keysToEvict.length = 0;
        this.#renderPipelinesNear.clear();
        this.#renderPipelinesFar.clear();
        for (const grass of this.#grassList) {
            grass.onChanged = null;
        }
        this.#grassList.length = 0;
    }

    /**
     * [KO] 잔디 렌더링 및 그림자 렌더링에 필요한 WebGPU 셰이더 모듈과 파이프라인 레이아웃을 생성 및 초기화합니다.
     * [EN] Creates and initializes WebGPU shader modules and pipeline layouts required for grass and shadow rendering.
     */
    #initShadersAndLayouts(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const resourceManager = this.#redGPUContext.resourceManager;
        if (!gpuDevice) return;

        this.#vertexModule = resourceManager.createGPUShaderModule('Grass_VertexModule', {
            code: grassVertexSource
        });

        this.#fragmentModule = resourceManager.createGPUShaderModule('Grass_FragmentModule', {
            code: grassFragmentSource
        });

        this.#fragmentFarModule = resourceManager.createGPUShaderModule('Grass_FragmentFarModule', {
            code: grassFragmentFarSource
        });

        this.#vertexShadowModule = resourceManager.createGPUShaderModule('Grass_VertexShadowModule', {
            code: grassShadowVertexSource
        });

        this.#fragmentShadowModule = resourceManager.createGPUShaderModule('Grass_FragmentShadowModule', {
            code: grassShadowSource
        });

        const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');

        this.#pipelineBindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'Grass_Pipeline_Group1_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
            ]
        });

        this.#pipelineBindGroupLayout2 = gpuDevice.createBindGroupLayout({
            label: 'Grass_Pipeline_Group2_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
            ]
        });

        this.#pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'Grass_PipelineLayout',
            bindGroupLayouts: [
                systemBGLayout,
                this.#pipelineBindGroupLayout1,
                this.#pipelineBindGroupLayout2,
            ]
        });
    }

    /**
     * [KO] 커맨드 인코더의 사전 컴퓨트 패스(PreProcess Compute Pass) 단계에서 호출되어 지형 스냅 베이킹 및 GPU 컬링을 실행합니다.
     * [EN] Invoked during the pre-process compute pass of the command encoder to execute terrain snap baking and GPU culling.
     */
    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        if (this.#baker.hasPendingTasks) {
            const vhtAtlas = this.#tileStreamer.getAtlasTexture('vht');
            const vbtAtlas = this.#tileStreamer.getAtlasTexture('vbtBaseColor');
            const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;

            this.#baker.dispatchPass(
                computePass,
                this.#megaBuffer,
                vhtAtlas?.gpuTextureView,
                vbtAtlas?.gpuTextureView,
                worldSizeX,
                worldSizeZ,
                this.#landscape.heightScale
            );
        }

        this.#culler.dispatchPass(computePass, this.#megaBuffer.totalAllocatedInstances);
    };

    /**
     * [KO] 카메라 위치를 기준으로 격자 셀의 유효성을 평가하여 범위를 벗어난 셀을 언마운트(Evict)하고 신규 셀을 배치(Populate)합니다.
     * [EN] Evaluates grid cell validity based on camera position, evicting out-of-range cells and populating new candidate cells.
     *
     * @param camX -
     * [KO] 카메라의 월드 X 좌표
     * [EN] World X coordinate of the camera
     * @param camZ -
     * [KO] 카메라의 월드 Z 좌표
     * [EN] World Z coordinate of the camera
     * @param forceRebuild -
     * [KO] 기존 활성 셀들을 모두 강제 초기화하고 처음부터 다시 구축할지 여부
     * [EN] Whether to force reset all active cells and rebuild from scratch
     * @param populateAllCandidates -
     * [KO] 프레임당 배치 셀 수 제한을 무시하고 유효 후보 셀을 모두 한 번에 배치할지 여부
     * [EN] Whether to bypass the per-frame populate budget and populate all candidate cells at once
     */
    #updateCellStreaming(
        camX: number,
        camZ: number,
        forceRebuild: boolean = false,
        populateAllCandidates: boolean = false
    ): void {
        const cellSize = CELL_SIZE;
        const curGridX = Math.floor(camX / cellSize);
        const curGridZ = Math.floor(camZ / cellSize);

        if (!forceRebuild && !populateAllCandidates && curGridX === this.#lastUpdateGridPos[0] && curGridZ === this.#lastUpdateGridPos[1]) {
            return;
        }

        this.#lastUpdateGridPos[0] = curGridX;
        this.#lastUpdateGridPos[1] = curGridZ;

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        for (const type of this.#grassList) {
            const state = this.#typeCellStates.get(type.typeId);
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!state || !alloc) continue;

            if (forceRebuild) {
                for (const r of state.activeCellRanges.values()) this.#releaseSlotRange(r);
                for (const r of state.freeSlotRanges) this.#releaseSlotRange(r);
                state.activeCellRanges.clear();
                state.freeSlotRanges.length = 0;
                state.slotHead = 0;
                state.instanceCount = 0;
                alloc.instanceCount = 0;

                const baseOffset = alloc.rawBaseOffset;
                for (let i = 0; i < alloc.maxInstances; i++) {
                    this.#megaBuffer.writeInstanceData(baseOffset + i, 0.0, -999999.0, 0.0, 0.0, 0.0, 0.0);
                }
                this.#megaBuffer.uploadInstances(baseOffset, alloc.maxInstances);
            }

            const safeCullRadius = type.cullingDistance + cellSize * 1.5;
            const radius = Math.max(safeCullRadius, this.#streamingRadius);
            const radiusSq = radius * radius;
            const cellRadius = Math.ceil(radius / cellSize);

            this.#neededCellKeysSet.clear();
            let candidateCount = 0;
            const maxCandidates = MAX_CANDIDATE_CELLS;

            for (let dz = -cellRadius; dz <= cellRadius; dz++) {
                const cz = curGridZ + dz;
                const cellCenterZ = (cz + 0.5) * cellSize;
                if (cellCenterZ < -halfWorldZ || cellCenterZ > halfWorldZ) continue;

                const distZ = cellCenterZ - camZ;
                const distZSq = distZ * distZ;

                for (let dx = -cellRadius; dx <= cellRadius; dx++) {
                    const cx = curGridX + dx;
                    const cellCenterX = (cx + 0.5) * cellSize;
                    if (cellCenterX < -halfWorldX || cellCenterX > halfWorldX) continue;

                    const distX = cellCenterX - camX;
                    const dSq = distX * distX + distZSq;
                    if (dSq > radiusSq) continue;

                    const key = ((cx & 0xFFFF) << 16) | (cz & 0xFFFF);
                    this.#neededCellKeysSet.add(key);

                    if (!state.activeCellRanges.has(key) && candidateCount < maxCandidates) {
                        this.#candidateKeys[candidateCount] = key;
                        this.#candidateDistancesSq[candidateCount] = dSq;
                        this.#candidateIndices[candidateCount] = candidateCount;
                        candidateCount++;
                    }
                }
            }

            if (candidateCount > 1) {
                sortCandidateIndicesByDistance(this.#candidateIndices, this.#candidateDistancesSq, 0, candidateCount - 1);
            }

            this.#keysToEvict.length = 0;
            state.activeCellRanges.forEach((_range, activeKey) => {
                if (!this.#neededCellKeysSet.has(activeKey)) {
                    this.#keysToEvict.push(activeKey);
                }
            });

            for (let i = 0; i < this.#keysToEvict.length; i++) {
                const evictKey = this.#keysToEvict[i];
                const range = state.activeCellRanges.get(evictKey)!;
                state.activeCellRanges.delete(evictKey);

                for (let s = 0; s < range.count; s++) {
                    this.#megaBuffer.writeInstanceData(
                        alloc.rawBaseOffset + range.start + s,
                        0.0, -999999.0, 0.0, 0.0, 0.0, 0.0
                    );
                }

                this.#megaBuffer.uploadInstances(alloc.rawBaseOffset + range.start, range.count);
                state.freeSlotRanges.push(range);
                state.instanceCount -= range.filledCount;
            }

            const maxCellsToPopulate = (forceRebuild || populateAllCandidates) ? candidateCount : MAX_POPULATE_CELLS_PER_FRAME;
            const cellsToProcess = Math.min(candidateCount, maxCellsToPopulate);
            const targetDensity = type.instancesPerCell;
            const matchedLayer = type.targetLayer ? this.#landscape.layers.find(l => l.name === type.targetLayer || (l as any).key === type.targetLayer) : undefined;
            const targetSrc = matchedLayer?.weightTexture?.src || (matchedLayer as any)?.pendingWeightSrc || null;
            const hasWeightMap = !!(targetSrc && LandscapeWeightMapCache.has(targetSrc));
            const channelIdx = matchedLayer?.weightChannelIndex ?? 0;

            if (type.targetLayer && !hasWeightMap) {
                continue;
            }

            const [tileSizeX, tileSizeZ] = this.#landscape.tileSize;
            const hasTileStreaming = this.#landscape.tileUrlResolver !== null;

            for (let i = 0; i < cellsToProcess; i++) {
                const sortedIdx = this.#candidateIndices[i];
                const key = this.#candidateKeys[sortedIdx];
                if (state.activeCellRanges.has(key)) continue;

                const cellX = (key >> 16);
                const cellZ = (key << 16) >> 16;
                const cellCenterX = (cellX + 0.5) * cellSize;
                const cellCenterZ = (cellZ + 0.5) * cellSize;

                if (hasTileStreaming) {
                    const tileCol = Math.floor((cellCenterX + halfWorldX) / tileSizeX);
                    const tileRow = Math.floor((cellCenterZ + halfWorldZ) / tileSizeZ);
                    if (!this.#landscape.isTileLoaded(tileRow, tileCol)) {
                        continue;
                    }
                }

                let slotBase = -1;
                let reusedRange: CellSlotRange | null = null;
                if (state.freeSlotRanges.length > 0) {
                    reusedRange = state.freeSlotRanges.pop()!;
                    slotBase = reusedRange.start;
                } else if (state.slotHead + targetDensity <= alloc.maxInstances) {
                    slotBase = state.slotHead;
                    state.slotHead += targetDensity;
                } else {
                    break;
                }

                const cellMinX = cellX * cellSize;
                const cellMinZ = cellZ * cellSize;

                this.#setPrngSeed((cellX * 73856093) ^ (cellZ * 19349663) ^ (type.typeId * 83492791));

                let filledCount = 0;
                for (let inst = 0; inst < targetDensity; inst++) {
                    const gx = cellMinX + this.#nextPrng() * cellSize;
                    const gz = cellMinZ + this.#nextPrng() * cellSize;

                    if (hasWeightMap && targetSrc) {
                        const u = (gx + halfWorldX) / worldSizeX;
                        const v = (gz + halfWorldZ) / worldSizeZ;
                        LandscapeWeightMapCache.getAllWeights(targetSrc, u, v, this.#tempWeights4);
                        const totalW = this.#tempWeights4[0] + this.#tempWeights4[1] + this.#tempWeights4[2] + this.#tempWeights4[3];
                        const normW = totalW > 0.001
                            ? (this.#tempWeights4[channelIdx] / totalW)
                            : (this.#tempWeights4[channelIdx] || 0.0);

                        if (normW < 0.20) continue;
                        if (type.densityScaleByWeight && this.#nextPrng() > normW) continue;
                    }

                    const rot = this.#nextPrng() * 6.2831853;
                    const sScale = type.minScale[0] + this.#nextPrng() * (type.maxScale[0] - type.minScale[0]);
                    const hScale = type.minScale[1] + this.#nextPrng() * (type.maxScale[1] - type.minScale[1]);

                    const globalInstIdx = alloc.rawBaseOffset + slotBase + filledCount;
                    this.#megaBuffer.writeInstanceData(
                        globalInstIdx,
                        gx, 0.0, gz,
                        rot, sScale, hScale
                    );
                    filledCount++;
                }

                for (let rem = filledCount; rem < targetDensity; rem++) {
                    this.#megaBuffer.writeInstanceData(
                        alloc.rawBaseOffset + slotBase + rem,
                        0.0, -999999.0, 0.0, 0.0, 0.0, 0.0
                    );
                }

                if (filledCount > 0) {
                    this.#megaBuffer.uploadInstances(alloc.rawBaseOffset + slotBase, targetDensity);
                    this.#baker.addBakeTasks(alloc.rawBaseOffset + slotBase, filledCount, type.typeId);
                    if (reusedRange) {
                        reusedRange.count = targetDensity;
                        reusedRange.filledCount = filledCount;
                        state.activeCellRanges.set(key, reusedRange);
                    } else {
                        state.activeCellRanges.set(key, this.#acquireSlotRange(slotBase, targetDensity, filledCount));
                    }
                    state.instanceCount += filledCount;
                } else {
                    this.#megaBuffer.uploadInstances(alloc.rawBaseOffset + slotBase, targetDensity);
                    if (reusedRange) {
                        reusedRange.count = targetDensity;
                        reusedRange.filledCount = 0;
                        state.freeSlotRanges.push(reusedRange);
                    } else {
                        state.freeSlotRanges.push(this.#acquireSlotRange(slotBase, targetDensity, 0));
                    }
                }
            }

            alloc.instanceCount = state.instanceCount;
        }

        let totalPop = 0;
        for (const type of this.#grassList) {
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (alloc) totalPop += alloc.instanceCount;
        }
        this.#totalInstanceCount = totalPop;
        this.#populated = totalPop > 0;
    }

    /**
     * [KO] 절차적 잔디 배치를 위한 고속 의사난수 생성기(PRNG)의 시드를 설정합니다.
     * [EN] Sets the seed for the fast pseudo-random number generator (PRNG) used in procedural grass placement.
     *
     * @param seed -
     * [KO] PRNG 초기화 정수 시드
     * [EN] Integer seed for PRNG initialization
     */
    #setPrngSeed(seed: number): void {
        this.#prngState = seed >>> 0;
    }

    /**
     * [KO] 0.0 이상 1.0 미만 범위의 균일 의사난수를 생성합니다. (SplitMix32 기반 고속 연산)
     * [EN] Generates a uniform pseudo-random number in the range [0.0, 1.0). (Fast computation based on SplitMix32)
     *
     * @returns
     * [KO] 생성된 의사난수 부동소수점 값
     * [EN] Generated pseudo-random floating-point value
     */
    #nextPrng(): number {
        this.#prngState = (this.#prngState + 0x6D2B79F5) | 0;
        let t = Math.imul(this.#prngState ^ (this.#prngState >>> 15), 1 | this.#prngState);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /**
     * [KO] 셀 슬롯 범위 객체 풀에서 인스턴스를 가져오거나 새로 생성합니다. (GC 방지)
     * [EN] Acquires a cell slot range instance from the pool or creates a new one. (Prevents GC)
     *
     * @param start -
     * [KO] 슬롯 시작 인덱스
     * [EN] Slot starting index
     * @param count -
     * [KO] 할당 슬롯 총 개수
     * [EN] Total number of allocated slots
     * @param filledCount -
     * [KO] 실제 유효하게 채워진 인스턴스 개수 (기본값: 0)
     * [EN] Actual filled instance count (default: 0)
     * @returns
     * [KO] 풀에서 재사용되거나 새로 생성된 {@link CellSlotRange} 객체
     * [EN] Reused from pool or newly created {@link CellSlotRange} object
     */
    #acquireSlotRange(start: number, count: number, filledCount: number = 0): CellSlotRange {
        const item = this.#slotRangePool.pop();
        if (item) {
            item.start = start;
            item.count = count;
            item.filledCount = filledCount;
            return item;
        }
        return {start, count, filledCount};
    }

    /**
     * [KO] 사용이 끝난 셀 슬롯 범위 객체를 재사용 풀로 반환합니다. (GC 방지)
     * [EN] Returns an unused cell slot range object to the reuse pool. (Prevents GC)
     *
     * @param item -
     * [KO] 반환할 {@link CellSlotRange} 객체
     * [EN] {@link CellSlotRange} object to release back to the pool
     */
    #releaseSlotRange(item: CellSlotRange): void {
        this.#slotRangePool.push(item);
    }
}

Object.freeze(LandscapeGrassManager);
export default LandscapeGrassManager;
