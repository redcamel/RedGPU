import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_COMPARE_FUNCTION from "../../gpuConst/GPU_COMPARE_FUNCTION";
import PassPointLightClusters from "../../light/pointLightCluster/PassPointLightClusters";
import PassPointLightClustersBound from "../../light/pointLightCluster/PassPointLightClustersBound";
import PassPointLightClustersHelper from "../../light/pointLightCluster/PassPointLightClustersHelper";
import PickingManager from "../../picking/PickingManager";
import PostEffectManager from "../../postEffect/PostEffectManager";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../resources/resourceManager/ResourceManager";
import Sampler from "../../resources/sampler/Sampler";
import SystemCode from "../../resources/systemCode/SystemCode";
import CubeTexture from "../../resources/texture/CubeTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import Axis from "../helper/asix/Axis";
import Grid from "../helper/grid/Grid";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import SkyBoxMaterial from "../skyboxs/skyBox/SkyBoxMaterial";
import ViewRenderTextureManager from "./ViewRenderTextureManager";
import ViewTransform from "./ViewTransform";

const STRUCT_INFO = parseWGSL(SystemCode.SYSTEM_UNIFORM)
const UNIFORM_STRUCT = STRUCT_INFO.uniforms.systemUniforms;

class View3D extends ViewTransform {
//
    #systemUniform_Vertex_StructInfo: any = UNIFORM_STRUCT;
    #systemUniform_Vertex_UniformBindGroup: GPUBindGroup;
    #systemUniform_Vertex_UniformBuffer: UniformBuffer;
    #instanceId: number
    #grid: Grid
    #axis: Axis
    #skybox: SkyBox
    #name: string
    #scene: Scene
    //
    #useFrustumCulling: boolean = true
    #useDistanceCulling: boolean = false
    #distanceCulling: number = 50
    #iblTexture: CubeTexture
    //
    readonly #debugViewRenderState: RenderViewStateData
    readonly #postEffectManager: PostEffectManager
    readonly #viewRenderTextureManager: ViewRenderTextureManager
    #pickingManager: PickingManager = new PickingManager()
//
    #prevInfoList = []
    #shadowDepthSampler: GPUSampler
    #basicSampler: GPUSampler
    //
    #clusterPointLightsBuffer: GPUBuffer
    #clusterPointLightsBufferData: Float32Array
    #passLightClusters: PassPointLightClusters
    #passLightClustersBound: PassPointLightClustersBound
    #prevWidth: number = undefined
    #prevHeight: number = undefined

    //
    /**
     * Creates a new instance of the Constructor class.
     *
     * @param {RedGPUContext} redGPUContext - The RedGPUContext.
     * @param {Scene} scene - The scene to render the constructor in.
     * @param {AController | Camera2D} camera - The camera used for rendering.
     * @param {string} [name] - The name of the constructor.
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string) {
        super(redGPUContext)
        this.scene = scene
        this.camera = camera
        if (name) this.name = name
        this.#init()
        this.#viewRenderTextureManager = new ViewRenderTextureManager(this)
        this.#debugViewRenderState = new RenderViewStateData(this)
        this.#postEffectManager = new PostEffectManager(this)
        this.setSize('100%', '100%')
    }

    get viewRenderTextureManager(): ViewRenderTextureManager {
        return this.#viewRenderTextureManager;
    }

    get systemUniform_Vertex_StructInfo(): any {
        return this.#systemUniform_Vertex_StructInfo;
    }

    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup {
        return this.#systemUniform_Vertex_UniformBindGroup;
    }

    get systemUniform_Vertex_UniformBuffer(): UniformBuffer {
        return this.#systemUniform_Vertex_UniformBuffer;
    }

    get passLightClustersBound(): PassPointLightClustersBound {
        return this.#passLightClustersBound;
    }

    get iblTexture(): CubeTexture {
        return this.#iblTexture;
    }

    set iblTexture(value: CubeTexture) {
        this.#iblTexture = value;
    }

    get pickingManager(): PickingManager {
        return this.#pickingManager;
    }

    get postEffectManager(): PostEffectManager {
        return this.#postEffectManager;
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

    get debugViewRenderState(): RenderViewStateData {
        return this.#debugViewRenderState;
    }

    //
    get grid(): Grid {
        return this.#grid;
    }

    set grid(value: Grid | boolean) {
        if (typeof value === 'boolean') {
            if (value === true) {
                value = new Grid(this.redGPUContext); // true면 Grid 생성
            } else {
                value = null; // false면 null 설정
            }
        } else if (!(value instanceof Grid) && value !== null) {
            // Grid가 아닌 값이 들어오는 경우 예외 처리
            throw new TypeError("grid must be of type 'Grid', 'boolean', or 'null'.");
        }
        this.#grid = value as Grid;
    }

    get axis(): Axis {
        return this.#axis;
    }

    set axis(value: Axis | boolean) {
        if (typeof value === 'boolean') {
            if (value === true) {
                value = new Axis(this.redGPUContext); // true면 Axis 생성
            } else {
                value = null; // false면 null 설정
            }
        } else if (!(value instanceof Axis) && value !== null) {
            // Axis가 아닌 값이 들어오는 경우 예외 처리
            throw new TypeError("axis must be of type 'Axis', 'boolean', or 'null'.");
        }
        this.#axis = value as Axis;
    }

    get skybox(): SkyBox  {
        return this.#skybox;
    }

    set skybox(value: SkyBox ) {
        this.#skybox = value;
    }

    get useFrustumCulling(): boolean {
        return this.#useFrustumCulling;
    }

    set useFrustumCulling(value: boolean) {
        this.#useFrustumCulling = value;
    }

    get useDistanceCulling(): boolean {
        return this.#useDistanceCulling;
    }

    set useDistanceCulling(value: boolean) {
        this.#useDistanceCulling = value;
    }

    get distanceCulling(): number {
        return this.#distanceCulling;
    }

    set distanceCulling(value: number) {
        this.#distanceCulling = value;
    }

    get scene(): Scene {
        return this.#scene;
    }

    set scene(value: Scene) {
        if (!(value instanceof Scene)) consoleAndThrowError('allow only Scene instance')
        this.#scene = value;
    }

    update(view: View3D, shadowRender: boolean = false, calcPointLightCluster: boolean = false,renderPath1ResultTexture?:GPUTexture) {
        //TODO 바인드그룹이 계속 생겨나는걸.... 막아야겠군
        const {scene} = view
        const iblTexture = view.iblTexture?.gpuTexture || (view.skybox?._material instanceof SkyBoxMaterial ? view.skybox._material.skyboxTexture?.gpuTexture : undefined)
        let shadowDepthGPUTextureView = shadowRender ? scene.shadowManager.shadowDepthGPUTextureViewEmpty : scene.shadowManager.shadowDepthGPUTextureView
        const index = view.redGPUContext.viewList.indexOf(view)
        const key = `${index}_${shadowRender ? 'shadowRender' : 'basic'}_2path${!!renderPath1ResultTexture}`
        if (index > -1) {
            let needResetBindGroup = true
            let prevInfo = this.#prevInfoList[key]
            if (prevInfo) {
                needResetBindGroup = (
                    prevInfo.iblTexture !== iblTexture ||
                    prevInfo.renderPath1ResultTexture !== renderPath1ResultTexture ||
                    prevInfo.shadowDepthGPUTextureView !== shadowDepthGPUTextureView
                    || !this.#passLightClusters
                )
            }
            if (needResetBindGroup) this.#createVertexUniformBindGroup(key, shadowDepthGPUTextureView, iblTexture,renderPath1ResultTexture)
            else this.#systemUniform_Vertex_UniformBindGroup = this.#prevInfoList[key].vertexUniformBindGroup;
            [
                {key: 'useIblTexture', value: [iblTexture ? 1 : 0]},
                {key: 'time', value: [view.debugViewRenderState.timestamp || 0]},
                {key: 'isView3D', value: [this.constructor === View3D ? 1 : 0]},
            ].forEach(({key, value}) => {
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.#systemUniform_Vertex_UniformBuffer.gpuBuffer,
                    this.#systemUniform_Vertex_StructInfo.members[key].uniformOffset,
                    new this.#systemUniform_Vertex_StructInfo.members[key].View(value)
                );
            });
            this.#prevInfoList[key] = {
                iblTexture,
                renderPath1ResultTexture,
                shadowDepthGPUTextureView,
                vertexUniformBindGroup: this.#systemUniform_Vertex_UniformBindGroup
            }
        }
        this.#updateClusters(calcPointLightCluster)
    }

    checkMouseInViewBounds(): boolean {
        const {pixelRectObject, pickingManager} = this;
        const {mouseX, mouseY} = pickingManager;
        return (0 < mouseX && mouseX < pixelRectObject.width) &&
            (0 < mouseY && mouseY < pixelRectObject.height);
    }

    #createVertexUniformBindGroup(key: string, shadowDepthGPUTextureView: GPUTextureView, iblTexture: GPUTexture,renderPath1ResultTexture:GPUTexture) {
        this.#updateClusters(true)
        const systemUniform_Vertex_BindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: this.redGPUContext.resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
            label: `SYSTEM_UNIFORM_bindGroup_${key}`,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#systemUniform_Vertex_UniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.#systemUniform_Vertex_UniformBuffer.size
                    },
                },
                {
                    binding: 1,
                    resource: this.#shadowDepthSampler
                },
                {
                    binding: 2,
                    resource: shadowDepthGPUTextureView
                },
                {
                    binding: 3,
                    resource: this.#basicSampler
                },
                {
                    binding: 4,
                    resource:
                      this.iblTexture?.gpuTexture?.createView( this.iblTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)
                      || this.#skybox?._material?.skyboxTexture?.gpuTexture?.createView(
                        this.#skybox._material.skyboxTexture.viewDescriptor || CubeTexture.defaultViewDescriptor
                      )
                        ||
                      this.redGPUContext.resourceManager.emptyCubeTextureView
                },
                {
                    binding: 5,
                    resource: {
                        buffer: this.#clusterPointLightsBuffer,
                        offset: 0,
                        size: this.#clusterPointLightsBuffer.size
                    }
                },
                {
                    binding: 6,
                    resource: {
                        buffer: this.#passLightClusters.clusterLightsBuffer,
                        offset: 0,
                        size: this.#passLightClusters.clusterLightsBuffer.size
                    }
                },
                {
                    binding: 7,
                    resource: this.#basicSampler
                },
                {
                    binding: 8,
                    // resource: renderPath1ResultTexture?.createView()
                    resource: this.viewRenderTextureManager.renderPath1ResultTextureView
                      || this.redGPUContext.resourceManager.emptyBitmapTextureView
                },
                {
                    binding: 9,
                    resource: this.#basicSampler
                },
            ]
        }
        this.#systemUniform_Vertex_UniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(systemUniform_Vertex_BindGroupDescriptor);
    }

    #init() {
        const systemUniform_Vertex_UniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        this.#systemUniform_Vertex_UniformBuffer = new UniformBuffer(this.redGPUContext, systemUniform_Vertex_UniformData, '#systemUniform_Vertex_UniformBuffer');
        //
        this.#clusterPointLightsBufferData = new Float32Array((8 * PassPointLightClustersHelper.MAX_POINT_LIGHTS) + 4)
        this.#clusterPointLightsBuffer = this.redGPUContext.gpuDevice.createBuffer(
            {
                label: 'clusterPointLightsBuffer',
                size: this.#clusterPointLightsBufferData.byteLength,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
            }
        )
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterPointLightsBuffer, 0, this.#clusterPointLightsBufferData)
        //
        this.#shadowDepthSampler = new Sampler(this.redGPUContext, {
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            compare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
        }).gpuSampler
        this.#basicSampler = new Sampler(this.redGPUContext).gpuSampler
    }

    #updateClusters(calcPointLightCluster: boolean = false) {
        if (!calcPointLightCluster) return
        const {redGPUContext, scene} = this
        // const dirtyPixelSize = this.#prevWidth == undefined || this.#prevHeight == undefined || this.#prevWidth !== this.pixelRectArray[2] || this.#prevHeight !== this.pixelRectArray[3]
        const dirtyPixelSize = true;
        if (!this.#passLightClustersBound) {
            this.#passLightClustersBound = new PassPointLightClustersBound(redGPUContext, this)
        }
        if (this.#passLightClusters && dirtyPixelSize) {
            // console.log('passLightClustersBound 재계산')
            this.#passLightClustersBound.render()
            this.#prevWidth = this.pixelRectArray[2]
            this.#prevHeight = this.pixelRectArray[3]
        }
        if (!this.#passLightClusters) {
            this.#passLightClusters = new PassPointLightClusters(redGPUContext, this)
        }
        if (scene) {
            const {pointLights} = scene.lightManager
            const pointLightNum = pointLights.length
            if (pointLightNum) {
                let i = pointLightNum
                // console.log('실행이되긴하하나2')
                while (i--) {
                    const tLight = pointLights[i]
                    //TODO - 프러스텀 컬링할꺼냐 말꺼냐
                    const stride = 8
                    const offset = 4 + stride * i
                    this.#clusterPointLightsBufferData.set(
                        [
                            ...tLight.position, tLight.radius,
                            ...tLight.color.rgbNormal, tLight.intensity,
                        ],
                        offset,
                    )
                }
                this.#clusterPointLightsBufferData.set(
                    [pointLightNum, 0, 0, 0],
                    0,
                )
                this.redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterPointLightsBuffer, 0, this.#clusterPointLightsBufferData);
            }
            this.#passLightClusters.render()
        }
    }
}

Object.freeze(View3D)
export default View3D
