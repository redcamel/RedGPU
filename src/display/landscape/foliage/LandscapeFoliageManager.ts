import RedGPUContext from "../../../context/RedGPUContext";
import type {FoliageTypeOptions} from "./FoliageType";
import FoliageType from "./FoliageType";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";
import FoliageRenderer from "./core/renderer/FoliageRenderer";
import FoliageCullingDispatcher from "./core/culling/FoliageCullingDispatcher";

class LandscapeFoliageManager {
    #redGPUContext: RedGPUContext;
    landscape: any = null;

    #foliageTypes: Map<string, FoliageType> = new Map();
    #typeList: FoliageType[] = [];

    #emptyBindGroupLayout: GPUBindGroupLayout | null = null;
    #emptyBindGroup: GPUBindGroup | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #pipelineRegistry: FoliagePipelineRegistry;
    #renderer: FoliageRenderer;
    #cullingDispatcher: FoliageCullingDispatcher;

    constructor(redGPUContextOrLandscape: RedGPUContext | any, landscape?: any) {
        if (redGPUContextOrLandscape instanceof RedGPUContext) {
            this.#redGPUContext = redGPUContextOrLandscape;
            this.landscape = landscape || null;
        } else {
            this.landscape = redGPUContextOrLandscape;
            this.#redGPUContext = this.landscape.redGPUContext;
        }

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            this.#emptyBindGroupLayout = gpuDevice.createBindGroupLayout({
                label: 'EmptyFoliageBindGroupLayout',
                entries: []
            });
            this.#emptyBindGroup = gpuDevice.createBindGroup({
                label: 'EmptyFoliageBindGroup',
                layout: this.#emptyBindGroupLayout,
                entries: []
            });
            this.#subMeshVertexBindGroupLayout = gpuDevice.createBindGroupLayout({
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

        this.#pipelineRegistry = new FoliagePipelineRegistry(this.#redGPUContext, this.#emptyBindGroupLayout);
        this.#renderer = new FoliageRenderer(this.#redGPUContext, this.#pipelineRegistry, this.#emptyBindGroup, this.#subMeshVertexBindGroupLayout);
        this.#cullingDispatcher = new FoliageCullingDispatcher(this.#redGPUContext);

        if (this.landscape?.tileStreamer) {
            this.landscape.tileStreamer.onTileLoaded = (comp: any) => {
                const count = this.#typeList.length;
                for (let i = 0; i < count; i++) {
                    this.#typeList[i].populateTile(comp);
                }
            };
        }
    }

    get types(): FoliageType[] {
        return this.#typeList;
    }

    get hasFoliageTypes(): boolean {
        return this.#typeList.length > 0;
    }

    get subMeshVertexBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#subMeshVertexBindGroupLayout;
    }

    get cullingBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#cullingDispatcher.cullingBindGroupLayout;
    }

    render(arg1: any, arg2?: any): void {
        let passEncoder: GPURenderPassEncoder;
        let view: any;

        if (arg1 && typeof arg1.setPipeline === 'function') {
            passEncoder = arg1;
            view = arg2;
        } else {
            view = arg1;
            passEncoder = arg2;
        }

        if (passEncoder) {
            this.#renderer.render(passEncoder, this.#typeList, view);
        }
    }

    update(viewOrCamera?: any, stateData?: any): void {
        this.#cullingDispatcher.updateAndDispatch(this.#typeList, viewOrCamera, this.landscape, stateData);
    }

    addFoliageType(options: FoliageTypeOptions): FoliageType {
        if (this.#foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.#foliageTypes.get(options.name)!;
        }

        const foliageType = new FoliageType(this.#redGPUContext, options, this.#subMeshVertexBindGroupLayout);
        foliageType.foliageManager = this;
        this.#foliageTypes.set(options.name, foliageType);
        this.#typeList.push(foliageType);

        const spatialGrid = this.landscape?.spatialGrid;
        if (spatialGrid && spatialGrid.flatCells.length > 0) {
            const cells = spatialGrid.flatCells;
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
