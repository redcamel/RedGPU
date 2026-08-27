import RedGPUContext from "../../../context/RedGPUContext";
import type Landscape from "../core/Landscape";
import type {FoliageTypeOptions} from "./FoliageType";
import FoliageType from "./FoliageType";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./core/culling/FoliageCullingDispatcher";

class LandscapeFoliageManager {
    static #sharedEmptyBindGroupLayout: GPUBindGroupLayout | null = null;
    static #sharedEmptyBindGroup: GPUBindGroup | null = null;
    static #sharedSubMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #redGPUContext: RedGPUContext;
    #landscape: Landscape | null = null;

    #foliageTypes: Map<string, FoliageType> = new Map();
    #typeList: FoliageType[] = [];

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #cullingDispatcher: FoliageCullingDispatcher;

    constructor(landscape: Landscape) {
        this.#landscape = landscape;
        this.#redGPUContext = landscape.redGPUContext;

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

        this.#pipelineRegistry = new FoliagePipelineRegistry(this.#redGPUContext, emptyBGL);
        this.#renderer = new FoliageRenderer(this.#redGPUContext, this.#pipelineRegistry, emptyBG, subMeshBGL);
        this.#cullingDispatcher = new FoliageCullingDispatcher(this.#redGPUContext);
    }

    get landscape(): Landscape | null {
        return this.#landscape;
    }

    handleTileLoaded(comp: any): void {
        const count = this.#typeList.length;
        for (let i = 0; i < count; i++) {
            this.#typeList[i].populateTile(comp);
        }
    }

    get types(): readonly FoliageType[] {
        return this.#typeList;
    }

    get hasFoliageTypes(): boolean {
        return this.#typeList.length > 0;
    }

    render(view: any, passEncoder: GPURenderPassEncoder): void {
        if (passEncoder) {
            this.#renderer.render(passEncoder, this.#typeList, view);
        }
    }

    update(viewOrCamera?: any, stateData?: any): void {
        this.#cullingDispatcher.updateAndDispatch(this.#typeList, viewOrCamera, this.#landscape, stateData);
    }

    addFoliageType(options: FoliageTypeOptions): FoliageType {
        if (this.#foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.#foliageTypes.get(options.name)!;
        }

        const foliageType = new FoliageType(this.#redGPUContext, options, LandscapeFoliageManager.#sharedSubMeshVertexBindGroupLayout, this);
        this.#foliageTypes.set(options.name, foliageType);
        this.#typeList.push(foliageType);

        const cells = this.#landscape?.landscapeComponents;
        if (cells && cells.length > 0) {
            const count = cells.length;
            for (let i = 0; i < count; i++) {
                foliageType.populateTile(cells[i]);
            }
        }

        return foliageType;
    }

    removeFoliageType(name: string): boolean {
        const foliageType = this.#foliageTypes.get(name);
        if (foliageType) {
            foliageType.destroy();
            const idx = this.#typeList.indexOf(foliageType);
            if (idx !== -1) {
                this.#typeList.splice(idx, 1);
            }
            return this.#foliageTypes.delete(name);
        }
        return false;
    }

    getFoliageType(name: string): FoliageType | undefined {
        return this.#foliageTypes.get(name);
    }

    destroy(): void {
        this.#foliageTypes.forEach((type) => type.destroy());
        this.#foliageTypes.clear();
        this.#typeList.length = 0;
        this.#pipelineRegistry.clearCache();
    }
}

Object.freeze(LandscapeFoliageManager);
export default LandscapeFoliageManager;
