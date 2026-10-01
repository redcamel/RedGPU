/**
 * [KO] 대규모 지형 3D 식생 생태계 및 인스턴스/컬링/렌더링 총괄 매니저 모듈입니다.
 * [EN] Overall manager module for large-scale terrain 3D foliage ecosystems, instances, culling, and rendering.
 * @packageDocumentation
 */
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import type Landscape from "../Landscape";
import LandscapeTileStreamer from "../core/spatial/LandscapeTileStreamer";
import LandscapeComponent from "../core/spatial/LandscapeComponent";
import type {FoliageOptions} from "./core/Foliage";
import Foliage from "./core/Foliage";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./core/culling/FoliageCullingDispatcher";

import FoliageScatterMegaBuffer from "./core/buffer/FoliageScatterMegaBuffer";
import FoliageSpatialGrid from "./core/spatial/FoliageSpatialGrid";

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
 * foliageManager.streamingRadius = 800;
 * foliageManager.windStrength = 1.2;
 *
 * // 식생 생태계 타입 등록 (다중 LOD 및 옥타헤드럴 임포스터 지원)
 * const pineTree = foliageManager.addFoliage({
 *     name: 'PineTree',
 *     lods: [
 *         { mesh: treeMeshLOD0, lodDistance: 50 },
 *         { mesh: treeMeshLOD1, lodDistance: 120 }
 *     ],
 *     densityPerHectare: 80,
 *     useImpostor: true,
 *     minScale: [0.8, 0.8, 0.8],
 *     maxScale: [1.3, 1.3, 1.3]
 * });
 * ```
 *
 * @category Landscape
 */
class FoliageManager {
    #emptyBindGroupLayout: GPUBindGroupLayout | null = null;
    #emptyBindGroup: GPUBindGroup | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #redGPUContext: RedGPUContext;
    #landscape: Landscape | null = null;
    #tileStreamer: LandscapeTileStreamer;

    #enabled: boolean = true;
    #megaBuffer: FoliageScatterMegaBuffer;
    #foliageTypes: Map<string, Foliage> = new Map();
    #typeList: Foliage[] = [];

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #cullingDispatcher: FoliageCullingDispatcher;
    #useDepthPrepass: boolean = true;

    #spatialGrid: FoliageSpatialGrid;
    #subCellSize: number = 100.0;
    #streamingRadius: number = 600.0;
    #debugSubCellColoration: boolean = false;
    #onUniformUpdateNeeded: (() => void) | null = null;

    #windEnabled: boolean = true;
    #windDirection: [number, number] = [1.0, 0.5];
    #windSpeed: number = 1.0;
    #windStrength: number = 1.0;
    #windFrequency: number = 0.08;
    #windFlutterStrength: number = 0.5;

    /**
     * [KO] FoliageManager의 새 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `landscape.foliageManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a new instance of FoliageManager. (Do not instantiate directly; access via the `landscape.foliageManager` property.)
     *
     * @param landscape -
     * [KO] 식생 생태계가 바인딩될 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance to which the foliage ecosystem is bound
     * @param tileStreamer -
     * [KO] 지형 타일 스트리머 인스턴스
     * [EN] Landscape tile streamer instance
     * @param onUniformUpdateNeeded -
     * [KO] 지형 유니폼 버퍼 갱신이 필요할 때 호출되는 내부 콜백 함수
     * [EN] Internal callback invoked when terrain uniform buffers require updating
     */
    constructor(landscape: Landscape, tileStreamer: LandscapeTileStreamer, onUniformUpdateNeeded?: () => void) {
        this.#landscape = landscape;
        this.#tileStreamer = tileStreamer;
        this.#onUniformUpdateNeeded = onUniformUpdateNeeded ?? null;
        this.#redGPUContext = landscape.redGPUContext;
        this.#spatialGrid = new FoliageSpatialGrid(landscape, this.#subCellSize, this.#streamingRadius);

        const {gpuDevice, resourceManager} = this.#redGPUContext;
        if (gpuDevice) {
            this.#emptyBindGroupLayout = resourceManager.createBindGroupLayout('Landscape_Empty_BindGroupLayout', {
                label: 'Landscape_Empty_BindGroupLayout',
                entries: []
            });
            this.#emptyBindGroup = gpuDevice.createBindGroup({
                label: 'Foliage_Empty_BindGroup',
                layout: this.#emptyBindGroupLayout,
                entries: []
            });
            this.#subMeshVertexBindGroupLayout = resourceManager.createBindGroupLayout('Foliage_SubMesh_BindGroupLayout', {
                label: 'Foliage_SubMesh_BindGroupLayout',
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {type: 'uniform'}
                    }
                ]
            });
        }

        const emptyBGL = this.#emptyBindGroupLayout;
        const emptyBG = this.#emptyBindGroup;
        const subMeshBGL = this.#subMeshVertexBindGroupLayout;

        this.#megaBuffer = new FoliageScatterMegaBuffer(this.#redGPUContext);
        this.#pipelineRegistry = new FoliagePipelineRegistry(this.#redGPUContext, emptyBGL);
        this.#renderer = new FoliageRenderer(this.#redGPUContext, this.#pipelineRegistry, emptyBG, subMeshBGL);
        this.#cullingDispatcher = new FoliageCullingDispatcher(this.#redGPUContext, this.#megaBuffer, this.#tileStreamer);

        this.#megaBuffer.onRecreated = () => {
            this.#renderer.markShadowBundleDirty();
        };
    }

    /**
     * [KO] 식생 시스템의 활성화 여부를 가져옵니다. `false`일 경우 식생 스트리밍, 컬링, 렌더링이 일시 중단됩니다.
     * [EN] Gets whether the foliage system is enabled. When `false`, foliage streaming, culling, and rendering are suspended.
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * [KO] 식생 시스템의 활성화 여부를 설정합니다.
     * [EN] Sets whether the foliage system is enabled.
     */
    set enabled(val: boolean) {
        this.#enabled = !!val;
    }

    /**
     * [KO] 지형의 새로운 타일 컴포넌트가 로드되었을 때 호출되는 라이프사이클 훅으로, 해당 타일에 등록된 식생 인스턴스를 배치합니다.
     * [EN] Lifecycle hook invoked when a new landscape tile component finishes loading, populating registered foliage instances on that tile.
     *
     * @param tileComponent -
     * [KO] 로드 완료된 지형 타일 컴포넌트 (`LandscapeComponent`)
     * [EN] Loaded landscape tile component (`LandscapeComponent`)
     */
    onTileLoaded(tileComponent: LandscapeComponent): void {
        if (!this.#enabled || this.#typeList.length === 0 || !tileComponent) return;
        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.#typeList[i].populateTile(tileComponent, this.#landscape);
        }
        this.#renderer.markShadowBundleDirty();
    }

    /**
     * [KO] 불투명(Opaque) 식생 서브메시에 대한 Depth Prepass(Z-Prepass) 활성화 여부를 반환합니다.
     * [EN] Gets whether Depth Prepass (Z-Prepass) is enabled for opaque foliage submeshes.
     */
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    /**
     * [KO] 불투명(Opaque) 식생 서브메시에 대한 Depth Prepass(Z-Prepass) 활성화 여부를 설정합니다.
     * [EN] Sets whether Depth Prepass (Z-Prepass) is enabled for opaque foliage submeshes.
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
        if (!this.#enabled || !passEncoder || this.#typeList.length === 0) return;
        this.#renderer.render(passEncoder, this.#typeList, view);
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
        if (!this.#enabled || !passEncoder || this.#typeList.length === 0) return;
        this.#renderer.renderShadow(passEncoder, this.#typeList, view);
    }

    /**
     * [KO] 현재 활성화된 식생 타입들이 메인 렌더 패스(뎁스 프리패스 포함)에서 발행하는 간접 드로우콜(Indirect Draw Call) 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by currently active foliage types in the main render pass (including depth prepass).
     */
    get totalDrawCalls(): number {
        if (!this.#enabled) return 0;
        let count = 0;
        const list = this.#typeList;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const foliage = list[i];
            if (foliage.activeInstanceCount > 0) {
                if (this.#useDepthPrepass && foliage.useDepthPrepass) {
                    count += foliage.depthPrepassSubMeshes.length;
                }
                count += foliage.mainSubMeshes.length;
            }
        }
        return count;
    }

    /**
     * [KO] 그림자 투사(castShadow: true)가 설정된 식생 타입들이 캐스케이드 그림자 맵(CSM) 패스에서 발행하는 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the total number of indirect draw calls dispatched by shadow-casting foliage types in the cascaded shadow map (CSM) pass.
     */
    get shadowDrawCalls(): number {
        if (!this.#enabled) return 0;
        let count = 0;
        const list = this.#typeList;
        const len = list.length;
        for (let i = 0; i < len; i++) {
            const foliage = list[i];
            if (!foliage.castShadow || foliage.maxShadowDistance <= 0 || foliage.activeInstanceCount <= 0) continue;
            const num3DLODs = foliage.hasImpostor ? Math.max(1, foliage.lodInfoList.length - 1) : foliage.lodInfoList.length;
            if (foliage.hasMaskedLOD0) {
                count += foliage.lod0SubMeshes.length;
                if (num3DLODs > 1) {
                    count += 1;
                }
            } else {
                count += 1;
            }
            count += 3;
        }
        return count;
    }

    /**
     * [KO] 식생 공간 분할 격자(Foliage Spatial Grid)의 단위 서브셀 크기(단위: 월드 유닛, 기본값: 100)를 반환합니다.
     * [EN] Gets the unit subcell size of the foliage spatial grid (unit: world units, default: 100).
     */
    get subCellSize(): number {
        return this.#subCellSize;
    }

    /**
     * [KO] 식생 공간 분할 격자의 단위 서브셀 크기를 설정합니다. 변경 시 지형 타일별 식생이 자동으로 재배치됩니다.
     * [EN] Sets the unit subcell size of the foliage spatial grid. Foliage is automatically repopulated across landscape tiles upon change.
     *
     * @param val -
     * [KO] 설정할 서브셀 크기 (최소값: 10.0)
     * [EN] Subcell size to set (minimum: 10.0)
     */
    set subCellSize(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#subCellSize !== clamped) {
            this.#subCellSize = clamped;
            this.#spatialGrid.subCellSize = clamped;
            this.#onUniformUpdateNeeded?.();

            const count = this.#typeList.length;
            for (let i = 0; i < count; i++) {
                this.#typeList[i].subCellSize = clamped;
            }
            this.#repopulateAll();
        }
    }

    /**
     * [KO] 카메라 주변 식생 서브셀의 동적 스트리밍 로드 반경(단위: 월드 유닛, 기본값: 600)을 반환합니다.
     * [EN] Gets the dynamic streaming load radius of foliage subcells around the camera (unit: world units, default: 600).
     */
    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    /**
     * [KO] 카메라 주변 식생 서브셀의 동적 스트리밍 로드 반경을 설정합니다.
     * [EN] Sets the dynamic streaming load radius of foliage subcells around the camera.
     *
     * @param val -
     * [KO] 설정할 스트리밍 반경 (최소값: 10.0)
     * [EN] Streaming radius to set (minimum: 10.0)
     */
    set streamingRadius(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#streamingRadius !== clamped) {
            this.#streamingRadius = clamped;
            this.#spatialGrid.streamingRadius = clamped;
            this.#onUniformUpdateNeeded?.();
        }
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
     * [KO] 모든 식생에 적용되는 바람(Wind) 시뮬레이션의 활성화 여부를 반환합니다.
     * [EN] Gets whether wind simulation applied to all foliage is enabled.
     */
    get windEnabled(): boolean {
        return this.#windEnabled;
    }

    /**
     * [KO] 모든 식생에 적용되는 바람 시뮬레이션의 활성화 여부를 설정합니다.
     * [EN] Sets whether wind simulation applied to all foliage is enabled.
     *
     * @param val -
     * [KO] 바람 시뮬레이션 활성화 여부
     * [EN] Whether wind simulation is enabled
     */
    set windEnabled(val: boolean) {
        const boolVal = !!val;
        if (this.#windEnabled !== boolVal) {
            this.#windEnabled = boolVal;
            this.#syncWindToAllTypes();
        }
    }

    /**
     * [KO] 바람의 이동 속도(기본값: 1.0)를 반환합니다.
     * [EN] Gets the wind movement speed (default: 1.0).
     */
    get windSpeed(): number {
        return this.#windSpeed;
    }

    /**
     * [KO] 바람의 이동 속도를 설정합니다.
     * [EN] Sets the wind movement speed.
     *
     * @param val -
     * [KO] 바람 이동 속도 (최소값: 0.0)
     * [EN] Wind movement speed (minimum: 0.0)
     */
    set windSpeed(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windSpeed !== numVal) {
            this.#windSpeed = numVal;
            this.#syncWindToAllTypes();
        }
    }

    /**
     * [KO] 바람에 의한 식생 줄기 및 가지의 굽힘 강도(기본값: 0.5)를 반환합니다.
     * [EN] Gets the bending strength of foliage stems and branches caused by wind (default: 0.5).
     */
    get windStrength(): number {
        return this.#windStrength;
    }

    /**
     * [KO] 바람에 의한 식생 줄기 및 가지의 굽힘 강도를 설정합니다.
     * [EN] Sets the bending strength of foliage stems and branches caused by wind.
     *
     * @param val -
     * [KO] 바람 굽힘 강도 (최소값: 0.0)
     * [EN] Wind bending strength (minimum: 0.0)
     */
    set windStrength(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windStrength !== numVal) {
            this.#windStrength = numVal;
            this.#syncWindToAllTypes();
        }
    }

    /**
     * [KO] 바람 파동의 공간적 진동수/주파수(기본값: 0.8)를 반환합니다.
     * [EN] Gets the spatial wave frequency of the wind (default: 0.8).
     */
    get windFrequency(): number {
        return this.#windFrequency;
    }

    /**
     * [KO] 바람 파동의 공간적 진동수/주파수를 설정합니다.
     * [EN] Sets the spatial wave frequency of the wind.
     *
     * @param val -
     * [KO] 바람 주파수 (최소값: 0.001)
     * [EN] Wind frequency (minimum: 0.001)
     */
    set windFrequency(val: number) {
        const numVal = Math.max(0.001, Number(val) || 0.001);
        if (this.#windFrequency !== numVal) {
            this.#windFrequency = numVal;
            this.#syncWindToAllTypes();
        }
    }

    /**
     * [KO] 나뭇잎이나 잔가지의 고주파 플러터(떨림) 강도(기본값: 0.3)를 반환합니다.
     * [EN] Gets the high-frequency flutter strength of leaves and twigs (default: 0.3).
     */
    get windFlutterStrength(): number {
        return this.#windFlutterStrength;
    }

    /**
     * [KO] 나뭇잎이나 잔가지의 고주파 플러터(떨림) 강도를 설정합니다.
     * [EN] Sets the high-frequency flutter strength of leaves and twigs.
     *
     * @param val -
     * [KO] 플러터 떨림 강도 (최소값: 0.0)
     * [EN] Flutter strength (minimum: 0.0)
     */
    set windFlutterStrength(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windFlutterStrength !== numVal) {
            this.#windFlutterStrength = numVal;
            this.#syncWindToAllTypes();
        }
    }

    /**
     * [KO] 바람이 불어가는 2D 평면 정규화 방향 벡터 `[x, z]`(기본값: `[1.0, 0.0]`)를 반환합니다.
     * [EN] Gets the normalized 2D direction vector `[x, z]` of the wind (default: `[1.0, 0.0]`).
     */
    get windDirection(): [number, number] {
        return this.#windDirection;
    }

    /**
     * [KO] 바람이 불어가는 2D 평면 방향 벡터를 설정합니다. 자동으로 정규화됩니다.
     * [EN] Sets the 2D direction vector of the wind. Automatically normalized.
     *
     * @param val -
     * [KO] 바람 2D 방향 벡터 `[x, z]`
     * [EN] 2D wind direction vector `[x, z]`
     */
    set windDirection(val: [number, number]) {
        if (Array.isArray(val) && val.length >= 2) {
            const [rawX, rawY] = val;
            const x = Number(rawX) || 0;
            const y = Number(rawY) || 0;
            const len = Math.sqrt(x * x + y * y);
            if (len > 0.0001) {
                this.#windDirection = [x / len, y / len];
            } else {
                this.#windDirection = [1.0, 0.0];
            }
            this.#syncWindToAllTypes();
        }
    }

    /**
     * [KO] 바람의 진행 방향 각도(단위: 도(degree), 0° ~ 360°, 기본값: 0°)를 반환합니다.
     * [EN] Gets the wind direction angle in degrees (0° to 360°, default: 0°).
     */
    get windDirectionAngle(): number {
        const rad = Math.atan2(this.#windDirection[1], this.#windDirection[0]);
        let deg = rad * (180.0 / Math.PI);
        if (deg < 0) deg += 360;
        return deg;
    }

    /**
     * [KO] 바람의 진행 방향 각도를 설정합니다 (단위: 도(degree)).
     * [EN] Sets the wind direction angle in degrees.
     *
     * @param deg -
     * [KO] 설정할 바람 각도 (단위: 도)
     * [EN] Wind angle to set (in degrees)
     */
    set windDirectionAngle(deg: number) {
        const rad = deg * (Math.PI / 180.0);
        this.#windDirection = [Math.cos(rad), Math.sin(rad)];
        this.#syncWindToAllTypes();
    }

    /**
     * [KO] 등록된 모든 {@link Foliage} 생태계 인스턴스의 읽기 전용 배열을 반환합니다.
     * [EN] Gets the read-only array of all registered {@link Foliage} ecosystem instances.
     */
    get foliageList(): Foliage[] {
        return this.#typeList;
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
        if (!this.#enabled || this.#typeList.length === 0) return;

        const view = renderViewStateData.view;
        const cam = view.rawCamera;
        if (cam && typeof cam.x === 'number' && typeof cam.z === 'number') {
            let maxRadius = this.#streamingRadius;
            const count = this.#typeList.length;
            for (let i = 0; i < count; i++) {
                const t = this.#typeList[i];
                if (t.enableStreaming && t.streamingRadius > maxRadius) {
                    maxRadius = t.streamingRadius;
                }
            }
            if (this.#spatialGrid.streamingRadius !== maxRadius) {
                this.#spatialGrid.streamingRadius = maxRadius;
            }

            this.#spatialGrid.update(cam.x, cam.z);

            const activeKeys = this.#spatialGrid.activeSubCellKeys;
            const activeCount = this.#spatialGrid.activeSubCellCount;

            for (let i = 0; i < count; i++) {
                this.#typeList[i].updateStreaming(activeKeys, activeCount, cam.x, cam.z);
            }
        }
        this.#cullingDispatcher.updateAndDispatch(this.#typeList, view, this.#landscape, renderViewStateData);
    }

    /**
     * [KO] 새로운 식생 생태계 타입({@link Foliage})을 생성하여 매니저에 등록하고, 지형의 기존 타일들에 인스턴스를 즉시 배치합니다.
     * [EN] Creates and registers a new foliage ecosystem type ({@link Foliage}) into the manager, immediately populating instances across existing landscape tiles.
     *
     * @param options -
     * [KO] 식생 생성 및 지형 배치 규칙 옵션 {@link FoliageOptions}
     * [EN] Foliage creation and landscape placement rule options {@link FoliageOptions}
     * @returns
     * [KO] 생성되어 등록된 {@link Foliage} 인스턴스
     * [EN] Newly created and registered {@link Foliage} instance
     */
    addFoliage(options: FoliageOptions): Foliage {
        const {name, subCellSize, streamingRadius} = options;
        if (this.#foliageTypes.has(name)) {
            console.warn(`[FoliageManager] Foliage with name '${name}' already exists.`);
            return this.#foliageTypes.get(name)!;
        }

        const mergedOptions: FoliageOptions = {
            ...options,
            subCellSize: subCellSize ?? this.#subCellSize,
            streamingRadius: streamingRadius ?? this.#streamingRadius
        };

        const foliage = new Foliage(
            this.#redGPUContext,
            mergedOptions,
            this.#subMeshVertexBindGroupLayout,
            this.#megaBuffer,
            () => this.#renderer.markShadowBundleDirty(),
            (t) => this.#repopulateFoliage(t),
            this.#cullingDispatcher.baker
        );
        this.#foliageTypes.set(options.name, foliage);
        this.#typeList.push(foliage);
        this.#renderer.markShadowBundleDirty();

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            foliage.syncWindToSubMeshes(
                gpuDevice,
                this.#windDirection[0],
                this.#windDirection[1],
                this.#windSpeed,
                this.#windStrength,
                this.#windFrequency,
                this.#windFlutterStrength,
                this.#windEnabled
            );
        }

        const cells = this.#landscape?.components;
        if (cells && cells.length > 0) {
            const count = cells.length;
            for (let i = 0; i < count; i++) {
                foliage.populateTile(cells[i], this.#landscape);
            }
        }

        return foliage;
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
    removeFoliage(target: Foliage | string): boolean {
        if (!target) return false;
        const foliage = typeof target === 'string'
            ? this.getFoliage(target)
            : target;
        if (!foliage) return false;

        const idx = this.#typeList.indexOf(foliage);
        if (idx === -1) return false;

        this.#typeList.splice(idx, 1);
        foliage.destroy();
        this.#renderer.markShadowBundleDirty();
        return this.#foliageTypes.delete(foliage.name);
    }

    /**
     * [KO] 등록된 식생 생태계 타입을 이름(`name`)으로 조회합니다.
     * [EN] Retrieves a registered foliage ecosystem type by name.
     *
     * @param name -
     * [KO] 조회할 식생 타입의 고유 이름
     * [EN] Unique name of the foliage type to retrieve
     * @returns
     * [KO] 일치하는 {@link Foliage} 인스턴스 (미등록 시 `undefined`)
     * [EN] Matching {@link Foliage} instance (`undefined` if not registered)
     */
    getFoliage(name: string): Foliage | undefined {
        if (!name) return undefined;
        return this.#foliageTypes.get(name);
    }

    /**
     * [KO] 등록된 모든 식생(Foliage) 생태계 타입을 일괄 제거합니다.
     * [EN] Clears all registered foliage ecosystem types.
     */
    clearFoliage(): void {
        while (this.#typeList.length > 0) {
            this.removeFoliage(this.#typeList[this.#typeList.length - 1]);
        }
    }

    /**
     * [KO] 등록된 모든 식생 타입의 메가버퍼 인스턴스 배치를 강제로 다시 베이크(Rebake)합니다.
     * [EN] Forces a rebake of mega-buffer instance placement for all registered foliage types.
     */
    rebakeAll(): void {
        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.#typeList[i].rebake();
        }
    }

    /**
     * [KO] 매니저에 등록된 모든 식생을 제거하고 메가버퍼, 렌더러, 컬링 디스패처 등 모든 WebGPU 자원을 안전하게 해제합니다.
     * [EN] Clears all foliage registered in the manager and safely releases all WebGPU resources including mega-buffers, renderers, and culling dispatchers.
     */
    destroy(): void {
        this.clearFoliage();
        this.#megaBuffer.destroy();
        this.#pipelineRegistry.clearCache();
        this.#renderer.destroy();
        this.#cullingDispatcher.destroy();
        this.#emptyBindGroupLayout = null;
        this.#emptyBindGroup = null;
        this.#subMeshVertexBindGroupLayout = null;
        this.#landscape = null;
        this.#tileStreamer = null as any;
        this.#onUniformUpdateNeeded = null;
    }

    #syncWindToAllTypes(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;
        const dirX = this.#windDirection[0];
        const dirY = this.#windDirection[1];
        const speed = this.#windSpeed;
        const strength = this.#windStrength;
        const freq = this.#windFrequency;
        const flutter = this.#windFlutterStrength;
        const enabled = this.#windEnabled;

        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.#typeList[i].syncWindToSubMeshes(
                gpuDevice,
                dirX,
                dirY,
                speed,
                strength,
                freq,
                flutter,
                enabled
            );
        }
    }

    #repopulateFoliage(type: Foliage): void {
        if (!type) return;

        type.clearTileCache();

        const cells = this.#landscape?.components;
        if (cells && cells.length > 0) {
            const count = cells.length;
            for (let i = 0; i < count; i++) {
                type.populateTile(cells[i], this.#landscape);
            }
        }
        this.#renderer.markShadowBundleDirty();
    }

    #repopulateAll(): void {
        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.#repopulateFoliage(this.#typeList[i]);
        }
    }
}

Object.freeze(FoliageManager);
export default FoliageManager;
