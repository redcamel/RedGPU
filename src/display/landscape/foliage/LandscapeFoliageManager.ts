import RedGPUContext from "../../../context/RedGPUContext";
import type Landscape from "../core/Landscape";
import type {FoliageTypeOptions} from "./FoliageType";
import FoliageType from "./FoliageType";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./core/culling/FoliageCullingDispatcher";

import FoliageMegaBuffer from "./core/buffer/FoliageMegaBuffer";
import LandscapeFoliageSpatialGrid from "./core/spatial/LandscapeFoliageSpatialGrid";

class LandscapeFoliageManager {
    static #sharedEmptyBindGroupLayout: GPUBindGroupLayout | null = null;
    static #sharedEmptyBindGroup: GPUBindGroup | null = null;
    static #sharedSubMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #redGPUContext: RedGPUContext;
    #landscape: Landscape | null = null;

    #megaBuffer: FoliageMegaBuffer;
    #foliageTypes: Map<string, FoliageType> = new Map();
    #typeList: FoliageType[] = [];

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #cullingDispatcher: FoliageCullingDispatcher;
    #useDepthPrepass: boolean = true;

    #spatialGrid: LandscapeFoliageSpatialGrid;
    #subCellSize: number = 100.0;
    #streamingRadius: number = 600.0;
    #debugSubCellColoration: boolean = false;

    // 🍃 [Phase 5] 전역 바람 시뮬레이션 설정
    #windEnabled: boolean = true;
    #windDirection: [number, number] = [1.0, 0.5];
    #windSpeed: number = 1.2;
    #windStrength: number = 0.5;
    #windFrequency: number = 0.08;
    #windFlutterStrength: number = 0.5;

    constructor(landscape: Landscape) {
        this.#landscape = landscape;
        this.#redGPUContext = landscape.redGPUContext;
        this.#spatialGrid = new LandscapeFoliageSpatialGrid(landscape, this.#subCellSize, this.#streamingRadius);

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            if (!LandscapeFoliageManager.#sharedEmptyBindGroupLayout) {
                LandscapeFoliageManager.#sharedEmptyBindGroupLayout = gpuDevice.createBindGroupLayout({
                    label: 'EmptyFoliageBindGroupLayout',
                    entries: []
                });
            }
            if (!LandscapeFoliageManager.#sharedEmptyBindGroup) {
                LandscapeFoliageManager.#sharedEmptyBindGroup = gpuDevice.createBindGroup({
                    label: 'EmptyFoliageBindGroup',
                    layout: LandscapeFoliageManager.#sharedEmptyBindGroupLayout,
                    entries: []
                });
            }
            if (!LandscapeFoliageManager.#sharedSubMeshVertexBindGroupLayout) {
                LandscapeFoliageManager.#sharedSubMeshVertexBindGroupLayout = gpuDevice.createBindGroupLayout({
                    label: 'FoliageSubMesh_VertexBindGroupLayout',
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.VERTEX,
                            buffer: {type: 'uniform'}
                        }
                    ]
                });
            }
        }

        const emptyBGL = LandscapeFoliageManager.#sharedEmptyBindGroupLayout;
        const emptyBG = LandscapeFoliageManager.#sharedEmptyBindGroup;
        const subMeshBGL = LandscapeFoliageManager.#sharedSubMeshVertexBindGroupLayout;

        this.#megaBuffer = new FoliageMegaBuffer(this.#redGPUContext);
        this.#pipelineRegistry = new FoliagePipelineRegistry(this.#redGPUContext, emptyBGL);
        this.#renderer = new FoliageRenderer(this.#redGPUContext, this.#pipelineRegistry, emptyBG, subMeshBGL);
        this.#cullingDispatcher = new FoliageCullingDispatcher(this.#redGPUContext, this.#megaBuffer);

        this.#megaBuffer.onRecreated = () => {
            this.#renderer.markShadowBundleDirty();
        };
    }

    handleTileLoaded(comp: any): void {
        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.#typeList[i].populateTile(comp, this.#landscape);
        }
    }

    get megaBuffer(): FoliageMegaBuffer {
        return this.#megaBuffer;
    }

    get hasFoliageTypes(): boolean {
        return this.#typeList.length > 0;
    }

    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    set useDepthPrepass(val: boolean) {
        const boolVal = !!val;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#renderer.useDepthPrepass = boolVal;
        }
    }

    render(view: any, passEncoder: GPURenderPassEncoder): void {
        if (passEncoder) {
            this.#renderer.render(passEncoder, this.#typeList, view);
        }
    }

    renderShadow(view: any, passEncoder: GPURenderPassEncoder): void {
        if (passEncoder && this.hasFoliageTypes) {
            this.#renderer.renderShadow(passEncoder, this.#typeList, view);
        }
    }

    get subCellSize(): number {
        return this.#subCellSize;
    }

    set subCellSize(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#subCellSize !== clamped) {
            this.#subCellSize = clamped;
            this.#spatialGrid.subCellSize = clamped;
            this.#landscape?.updateLandscapeUniforms?.();

            // [Phase 3.2] 등록된 모든 FoliageType의 subCellSize 동기화 및 자동 재생성
            const count = this.#typeList.length;
            for (let i = 0; i < count; i++) {
                this.#typeList[i].subCellSize = clamped;
            }
            this.repopulateAll();
        }
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#streamingRadius !== clamped) {
            this.#streamingRadius = clamped;
            this.#spatialGrid.streamingRadius = clamped;
            this.#landscape?.updateLandscapeUniforms?.();
        }
    }

    get debugSubCellColoration(): boolean {
        return this.#debugSubCellColoration;
    }

    set debugSubCellColoration(val: boolean) {
        const boolVal = !!val;
        if (this.#debugSubCellColoration !== boolVal) {
            this.#debugSubCellColoration = boolVal;
            this.#landscape?.updateLandscapeUniforms?.();
        }
    }

    get spatialGrid(): LandscapeFoliageSpatialGrid {
        return this.#spatialGrid;
    }

    // ============================================================================
    // 🍃 [Phase 5] 전역 바람(Wind) 시뮬레이션 제어 API
    // ============================================================================

    get windEnabled(): boolean {
        return this.#windEnabled;
    }

    set windEnabled(val: boolean) {
        const boolVal = !!val;
        if (this.#windEnabled !== boolVal) {
            this.#windEnabled = boolVal;
            this.#syncWindToAllTypes();
        }
    }

    get windSpeed(): number {
        return this.#windSpeed;
    }

    set windSpeed(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windSpeed !== numVal) {
            this.#windSpeed = numVal;
            this.#syncWindToAllTypes();
        }
    }

    get windStrength(): number {
        return this.#windStrength;
    }

    set windStrength(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windStrength !== numVal) {
            this.#windStrength = numVal;
            this.#syncWindToAllTypes();
        }
    }

    get windFrequency(): number {
        return this.#windFrequency;
    }

    set windFrequency(val: number) {
        const numVal = Math.max(0.001, Number(val) || 0.001);
        if (this.#windFrequency !== numVal) {
            this.#windFrequency = numVal;
            this.#syncWindToAllTypes();
        }
    }

    get windFlutterStrength(): number {
        return this.#windFlutterStrength;
    }

    set windFlutterStrength(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windFlutterStrength !== numVal) {
            this.#windFlutterStrength = numVal;
            this.#syncWindToAllTypes();
        }
    }

    get windDirection(): [number, number] {
        return this.#windDirection;
    }

    set windDirection(val: [number, number]) {
        if (Array.isArray(val) && val.length >= 2) {
            const x = Number(val[0]) || 0;
            const y = Number(val[1]) || 0;
            const len = Math.sqrt(x * x + y * y);
            if (len > 0.0001) {
                this.#windDirection = [x / len, y / len];
            } else {
                this.#windDirection = [1.0, 0.0];
            }
            this.#syncWindToAllTypes();
        }
    }

    get windDirectionAngle(): number {
        const rad = Math.atan2(this.#windDirection[1], this.#windDirection[0]);
        let deg = rad * (180.0 / Math.PI);
        if (deg < 0) deg += 360;
        return deg;
    }

    set windDirectionAngle(deg: number) {
        const rad = deg * (Math.PI / 180.0);
        this.#windDirection = [Math.cos(rad), Math.sin(rad)];
        this.#syncWindToAllTypes();
    }

    addFoliageType(options: FoliageTypeOptions): FoliageType {
        if (this.#foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.#foliageTypes.get(options.name)!;
        }

        const mergedOptions: FoliageTypeOptions = {
            ...options,
            subCellSize: options.subCellSize ?? this.#subCellSize,
            streamingRadius: options.streamingRadius ?? this.#streamingRadius
        };

        const foliageType = new FoliageType(
            this.#redGPUContext,
            mergedOptions,
            LandscapeFoliageManager.#sharedSubMeshVertexBindGroupLayout,
            this.#megaBuffer,
            () => this.#renderer.markShadowBundleDirty(),
            (t) => this.repopulateFoliageType(t),
            this.#cullingDispatcher.baker
        );
        this.#foliageTypes.set(options.name, foliageType);
        this.#typeList.push(foliageType);
        this.#renderer.markShadowBundleDirty();

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            foliageType.syncWindToSubMeshes(
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

        const cells = this.#landscape?.landscapeComponents;
        if (cells && cells.length > 0) {
            const count = cells.length;
            for (let i = 0; i < count; i++) {
                foliageType.populateTile(cells[i], this.#landscape);
            }
        }

        return foliageType;
    }

    update(viewOrCamera?: any, stateData?: any): void {
        const cam = viewOrCamera?.camera || viewOrCamera;
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

            const activeKeySet = this.#spatialGrid.activeSubCellKeySet;
            const activeKeys = this.#spatialGrid.activeSubCellKeys;
            const activeCount = this.#spatialGrid.activeSubCellCount;

            for (let i = 0; i < count; i++) {
                this.#typeList[i].updateStreaming(activeKeySet, activeKeys, activeCount, cam.x, cam.z);
            }
        }
        this.#cullingDispatcher.updateAndDispatch(this.#typeList, viewOrCamera, this.#landscape, stateData);
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


    /**
     * [KO] 특정 FoliageType의 서브셀 청크를 지우고 현재 지형 컴포넌트들을 기준으로 재스폰합니다.
     * [EN] Clears sub-cell chunks of a FoliageType and repopulates them based on current landscape components.
     */
    repopulateFoliageType(foliageTypeOrName: FoliageType | string): void {
        const type = typeof foliageTypeOrName === 'string'
            ? this.#foliageTypes.get(foliageTypeOrName)
            : foliageTypeOrName;
        if (!type) return;

        type.clearTileCache();

        const cells = this.#landscape?.landscapeComponents;
        if (cells && cells.length > 0) {
            const count = cells.length;
            for (let i = 0; i < count; i++) {
                type.populateTile(cells[i], this.#landscape);
            }
        }
        this.#renderer.markShadowBundleDirty();
    }

    /**
     * [KO] 모든 FoliageType의 인스턴스를 재스폰합니다.
     * [EN] Repopulates all foliage types.
     */
    repopulateAll(): void {
        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.repopulateFoliageType(this.#typeList[i]);
        }
    }

    removeFoliageType(name: string): boolean {
        const foliageType = this.#foliageTypes.get(name);
        if (foliageType) {
            foliageType.destroy();
            const idx = this.#typeList.indexOf(foliageType);
            if (idx !== -1) {
                this.#typeList.splice(idx, 1);
            }
            this.#renderer.markShadowBundleDirty();
            return this.#foliageTypes.delete(name);
        }
        return false;
    }

    get typeList(): readonly FoliageType[] {
        return this.#typeList;
    }

    get foliageTypes(): ReadonlyMap<string, FoliageType> {
        return this.#foliageTypes;
    }

    getFoliageType(name: string): FoliageType | undefined {
        return this.#foliageTypes.get(name);
    }

    destroy(): void {
        this.#foliageTypes.forEach((type) => type.destroy());
        this.#foliageTypes.clear();
        this.#typeList.length = 0;
        this.#megaBuffer.destroy();
        this.#pipelineRegistry.clearCache();
        this.#renderer.destroy();
        this.#cullingDispatcher.destroy();
    }
}

Object.freeze(LandscapeFoliageManager);
export default LandscapeFoliageManager;
