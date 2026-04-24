import {mat4} from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_COMPARE_FUNCTION from "../../gpuConst/GPU_COMPARE_FUNCTION";
import DirectionalLight from "../../light/lights/DirectionalLight";
import PostEffectManager from "../../postEffect/PostEffectManager";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import Sampler from "../../resources/sampler/Sampler";
import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";
import CubeTexture from "../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import IBL from "../../resources/texture/ibl/IBL";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import DrawDebuggerDirectionalLight from "../drawDebugger/light/DrawDebuggerDirectionalLight";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import SkyAtmosphere from "../skyAtmosphere/SkyAtmosphere";
import AView from "./core/AView";
import RenderViewStateData from "./core/RenderViewStateData";
import ViewRenderTextureManager from "./core/ViewRenderTextureManager";
import ToneMappingManager from "../../toneMapping/ToneMappingManager";
import SystemUniformUpdater from "../../renderer/SystemUniformUpdater";
import updateSystemUniformData from "../../renderer/updateSystemUniformData";
import ClusterLightManager from "../../light/clusterLight/ClusterLightManager";
import ACamera from "../../camera/core/ACamera";
import AutoExposure from "../../camera/core/autoExposure/AutoExposure";

const SHADER_INFO = parseWGSL('VIEW3D_SYSTEM_UNIFORM', ShaderLibrary.SYSTEM_UNIFORM)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.systemUniforms;
let temp = mat4.create()
let temp2 = mat4.create()
let temp3 = mat4.create()

/**
 * [KO] 3D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 3D rendering.
 */
class View3D extends AView {
    #systemUniform_Vertex_StructInfo: any = UNIFORM_STRUCT;
    #systemUniform_Vertex_UniformBindGroup: GPUBindGroup;
    #systemUniform_Vertex_UniformBuffer: UniformBuffer;
    #skybox: SkyBox
    #skyAtmosphere: SkyAtmosphere
    #ibl: IBL
    readonly #renderViewStateData: RenderViewStateData
    readonly #postEffectManager: PostEffectManager
    readonly #toneMappingManager: ToneMappingManager
    readonly #viewRenderTextureManager: ViewRenderTextureManager
    #prevInfoList = {}
    #shadowDepthSampler: GPUSampler
    #basicSampler: GPUSampler
    #basicPackedSampler: GPUSampler

    #prevIBL_prefilterTexture: DirectCubeTexture
    #prevIBL_irradianceTexture: DirectCubeTexture
    #uniformData: ArrayBuffer
    #uniformDataF32: Float32Array
    #uniformDataU32: Uint32Array
    #noneJitterProjectionViewMatrix: mat4 = mat4.create()
    #clusterLightManager: ClusterLightManager

    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string) {
        super(redGPUContext, scene, camera, name)
        this.#init()
        this.#viewRenderTextureManager = new ViewRenderTextureManager(this)
        this.#renderViewStateData = new RenderViewStateData(this)
        this.#postEffectManager = new PostEffectManager(this)
        this.#toneMappingManager = new ToneMappingManager(this)
        this.#clusterLightManager = new ClusterLightManager(this)
        this.#uniformData = new ArrayBuffer(this.systemUniform_Vertex_StructInfo.endOffset)
        this.#uniformDataF32 = new Float32Array(this.#uniformData)
        this.#uniformDataU32 = new Uint32Array(this.#uniformData)
    }

    get clusterLightManager(): ClusterLightManager { return this.#clusterLightManager; }
    get viewRenderTextureManager(): ViewRenderTextureManager { return this.#viewRenderTextureManager; }
    get systemUniform_Vertex_StructInfo(): any { return this.#systemUniform_Vertex_StructInfo; }
    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup { return this.#systemUniform_Vertex_UniformBindGroup; }
    get systemUniform_Vertex_UniformBuffer(): UniformBuffer { return this.#systemUniform_Vertex_UniformBuffer; }
    get ibl(): IBL { return this.#ibl; }
    set ibl(value: IBL) { this.#ibl = value; }
    get postEffectManager(): PostEffectManager { return this.#postEffectManager; }
    get toneMappingManager(): ToneMappingManager { return this.#toneMappingManager; }
    get renderViewStateData(): RenderViewStateData { return this.#renderViewStateData; }
    get skybox(): SkyBox { return this.#skybox; }
    set skybox(value: SkyBox) {
        const {resourceManager} = this.redGPUContext
        const prevTexture = this.#skybox?.skyboxTexture
        const newTexture = value?.skyboxTexture
        if (prevTexture && prevTexture !== newTexture) this.#manageIBLResourceState(resourceManager, prevTexture.cacheKey, false);
        this.#skybox = value;
    }
    get skyAtmosphere(): SkyAtmosphere { return this.#skyAtmosphere; }
    set skyAtmosphere(value: SkyAtmosphere) { this.#skyAtmosphere = value; }

    get basicRenderBundleEncoderDescriptor(): GPURenderBundleEncoderDescriptor {
        const {antialiasingManager} = this.redGPUContext
        const {useMSAA} = antialiasingManager
        return {
            colorFormats: ['rgba16float', navigator.gpu.getPreferredCanvasFormat(), 'rgba16float'],
            depthStencilFormat: 'depth32float',
            sampleCount: useMSAA ? 4 : 1
        }
    }

    get noneJitterProjectionViewMatrix(): mat4 { return this.#noneJitterProjectionViewMatrix; }

    update(shadowRender: boolean = false, calcPointLightCluster: boolean = false, renderPath1ResultTextureView?: GPUTextureView) {
        const {scene, redGPUContext, ibl, skyAtmosphere} = this
        const {shadowManager} = scene
        shadowManager.update(redGPUContext)
        const {directionalShadowManager} = shadowManager

        const ibl_prefilterTexture = ibl?.prefilterTexture?.gpuTexture
        const ibl_irradianceTexture = ibl?.irradianceTexture?.gpuTexture
        let shadowDepthTextureView = shadowRender ? directionalShadowManager.shadowDepthTextureViewEmpty : directionalShadowManager.shadowDepthTextureView
        const index = this.redGPUContext.viewList.indexOf(this)
        const key = `${index}_${shadowRender ? 'shadowRender' : 'basic'}_2path${!!renderPath1ResultTextureView}`
        
        if (index > -1) {
            let needResetBindGroup = true
            let prevInfo = this.#prevInfoList[key]
            
            const skyAtmosphereReflectionLUT = skyAtmosphere?.skyAtmosphereReflectionLUT;
            const skyAtmosphereIrradianceLUT = skyAtmosphere?.skyAtmosphereIrradianceLUT;

            if (prevInfo) {
                needResetBindGroup = (
                    prevInfo.ibl !== ibl ||
                    prevInfo.skyAtmosphere !== skyAtmosphere ||
                    prevInfo.skyAtmosphereReflectionLUT !== skyAtmosphereReflectionLUT ||
                    prevInfo.skyAtmosphereReflectionLUTRevision !== skyAtmosphereReflectionLUT?.revision ||
                    prevInfo.skyAtmosphereIrradianceLUT !== skyAtmosphereIrradianceLUT ||
                    prevInfo.skyAtmosphereIrradianceLUTRevision !== skyAtmosphereIrradianceLUT?.revision ||
                    prevInfo.ibl_prefilterTexture !== ibl_prefilterTexture ||
                    prevInfo.ibl_irradianceTexture !== ibl_irradianceTexture ||
                    prevInfo.renderPath1ResultTextureView !== renderPath1ResultTextureView ||
                    prevInfo.shadowDepthTextureView !== shadowDepthTextureView ||
                    !this.#clusterLightManager.passClustersLight
                )
            }
            if (needResetBindGroup) this.#createVertexUniformBindGroup(key, shadowDepthTextureView, this.ibl, renderPath1ResultTextureView)
            else this.#systemUniform_Vertex_UniformBindGroup = this.#prevInfoList[key].vertexUniformBindGroup;
            
            this.#prevInfoList[key] = {
                ibl,
                skyAtmosphere,
                skyAtmosphereReflectionLUT,
                skyAtmosphereReflectionLUTRevision: skyAtmosphereReflectionLUT?.revision,
                skyAtmosphereIrradianceLUT,
                skyAtmosphereIrradianceLUTRevision: skyAtmosphereIrradianceLUT?.revision,
                ibl_prefilterTexture,
                ibl_irradianceTexture,
                renderPath1ResultTextureView,
                shadowDepthTextureView,
                vertexUniformBindGroup: this.#systemUniform_Vertex_UniformBindGroup
            }
        }
        this.#clusterLightManager.updateClusterLights(calcPointLightCluster);
        this.#updateSystemUniform();
    }

    #updateSystemUniform() {
        const { inverseProjectionMatrix, noneJitterProjectionMatrix, projectionMatrix, rawCamera, toneMappingManager } = this;
        rawCamera.updateExposure(this);

        const {redGPUContext, systemUniform_Vertex_UniformBuffer} = this
        const {gpuDevice} = redGPUContext
        const {lightManager, shadowManager} = this.scene
        const {viewMatrix} = rawCamera
        const structInfo = this.systemUniform_Vertex_StructInfo;
        const {members} = structInfo
        {
            this.#noneJitterProjectionViewMatrix = mat4.multiply(temp2, noneJitterProjectionMatrix, viewMatrix)
            const projectionViewMatrix = mat4.multiply(temp, projectionMatrix, viewMatrix);
            SystemUniformUpdater.updateCamera(rawCamera, members.camera.members, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateShadow(shadowManager, members.shadow.members, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateSkyAtmosphere(this.skyAtmosphere, members, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateDirectionalLights(lightManager.directionalLights, members.directionalLights.memberList, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateAmbientLight(lightManager.ambientLight, members.ambientLight.members, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateTime(this.renderViewStateData, members.time.members, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateProjection(
                {
                    projectionMatrix,
                    projectionViewMatrix,
                    noneJitterProjectionMatrix,
                    noneJitterProjectionViewMatrix: this.#noneJitterProjectionViewMatrix,
                    inverseProjectionMatrix,
                    inverseProjectionViewMatrix: mat4.invert(temp3, projectionViewMatrix),
                    prevNoneJitterProjectionViewMatrix: redGPUContext.antialiasingManager.useTAA ? this.taa.prevNoneJitterProjectionViewMatrix : this.#noneJitterProjectionViewMatrix,
                },
                members.projection.members,
                this.#uniformDataF32,
                this.#uniformDataU32
            )

            updateSystemUniformData(members, this.#uniformDataF32, this.#uniformDataU32, [
                {key: 'resolution', value: [this.pixelRectObject.width, this.pixelRectObject.height]},
                {key: 'usePrefilterTexture', value: this.ibl?.prefilterTexture?.gpuTexture ? 1 : 0},
                {key: 'isView3D', value: this.constructor === View3D ? 1 : 0},
                {key: 'directionalLightCount', value: lightManager.directionalLightCount},
                {
                    key: 'iblIntensity',
                    value: this.ibl ? (this.ibl.nit / (this.ibl.inherentLuminance || 1.0)) * this.ibl.intensity : 1.0
                },
                {
                    key: 'emissiveIntensity',
                    value: 1.0
                },
                {key: 'directionalLightProjectionViewMatrix', value: lightManager.getDirectionalLightProjectionViewMatrix(this)},
                {key: 'directionalLightProjectionMatrix', value: lightManager.getDirectionalLightProjectionMatrix(this)},
                {key: 'directionalLightViewMatrix', value: lightManager.getDirectionalLightViewMatrix(this)},
                {
                    key: 'preExposure',
                    value: this.postEffectManager.autoExposure.preExposure
                },
                ]);
        }
        lightManager.directionalLights.forEach((light: DirectionalLight) => {
            if (light.enableDebugger) {
                if (!light.drawDebugger) light.drawDebugger = new DrawDebuggerDirectionalLight(redGPUContext, light)
                light.drawDebugger.render(this.renderViewStateData)
            }
        })
        gpuDevice.queue.writeBuffer(systemUniform_Vertex_UniformBuffer.gpuBuffer, 0, this.#uniformData);
    }

    #createVertexUniformBindGroup(key: string, shadowDepthTextureView: GPUTextureView, ibl: IBL, renderPath1ResultTextureView: GPUTextureView) {
        this.#clusterLightManager.updateClusterLights(true)
        const ibl_prefilterTexture = ibl?.prefilterTexture
        const ibl_irradianceTexture = ibl?.irradianceTexture
        const {redGPUContext} = this
        const {gpuDevice, resourceManager} = redGPUContext;
        const systemUniform_Vertex_BindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
            label: `SYSTEM_UNIFORM_bindGroup_${key}`,
            entries: [
                {binding: 0, resource: {buffer: this.#systemUniform_Vertex_UniformBuffer.gpuBuffer, offset: 0, size: this.#systemUniform_Vertex_UniformBuffer.size}},
                {binding: 1, resource: this.#shadowDepthSampler},
                {binding: 2, resource: shadowDepthTextureView},
                {binding: 3, resource: this.#basicSampler},
                {binding: 5, resource: {buffer: this.#clusterLightManager.clusterLightsBuffer, offset: 0, size: this.#clusterLightManager.clusterLightsBuffer.size}},
                {binding: 6, resource: {buffer: this.#clusterLightManager.passClustersLight.clusterLightsBuffer, offset: 0, size: this.#clusterLightManager.passClustersLight.clusterLightsBuffer.size}},
                {binding: 7, resource: this.#basicSampler},
                {binding: 8, resource: renderPath1ResultTextureView || resourceManager.emptyBitmapTextureView},
                {binding: 9, resource: this.#basicPackedSampler},
                {binding: 10, resource: resourceManager.getGPUResourceCubeTextureView(ibl_prefilterTexture, ibl_prefilterTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)},
                {binding: 11, resource: resourceManager.getGPUResourceCubeTextureView(ibl_irradianceTexture, ibl_irradianceTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)},
                {binding: 12, resource: resourceManager.brdfGenerator.brdfLUTTexture?.createView() || resourceManager.emptyBitmapTextureView},
                {binding: 13, resource: this.skyAtmosphere ? this.skyAtmosphere.atmosphereSampler.gpuSampler : this.#basicSampler},
                {binding: 14, resource: this.skyAtmosphere ? this.skyAtmosphere.transmittanceLUT.gpuTextureView : resourceManager.emptyBitmapTextureView},
                {binding: 15, resource: resourceManager.getGPUResourceCubeTextureView(this.skyAtmosphere?.skyAtmosphereIrradianceLUT, this.skyAtmosphere?.skyAtmosphereIrradianceLUT?.viewDescriptor || CubeTexture.defaultViewDescriptor)},
                {binding: 16, resource: resourceManager.getGPUResourceCubeTextureView(this.skyAtmosphere?.skyAtmosphereReflectionLUT, this.skyAtmosphere?.skyAtmosphereReflectionLUT?.viewDescriptor || CubeTexture.defaultViewDescriptor)},
            ]
        }
        this.#systemUniform_Vertex_UniformBindGroup = gpuDevice.createBindGroup(systemUniform_Vertex_BindGroupDescriptor);
        this.#updateIBLResourceStates(resourceManager, ibl_prefilterTexture, ibl_irradianceTexture);
    }

    #updateIBLResourceStates(resourceManager: ResourceManager, ibl_prefilterTexture: any, ibl_irradianceTexture: any) {
        const textureUpdates = [[this.#prevIBL_prefilterTexture, ibl_prefilterTexture], [this.#prevIBL_irradianceTexture, ibl_irradianceTexture]];
        textureUpdates.forEach(([prevTexture, newTexture]) => {
            if (prevTexture && prevTexture !== newTexture) this.#manageIBLResourceState(resourceManager, prevTexture.cacheKey, false);
            if (newTexture && prevTexture !== newTexture) this.#manageIBLResourceState(resourceManager, newTexture.cacheKey, true);
        });
        this.#prevIBL_prefilterTexture = ibl_prefilterTexture;
        this.#prevIBL_irradianceTexture = ibl_irradianceTexture;
    }

    #manageIBLResourceState(resourceManager: ResourceManager, cacheKey: string, isAddingListener: boolean) {
        const targetResourceManagedState = resourceManager['managedCubeTextureState']
        const targetState = targetResourceManagedState?.table.get(cacheKey);
        if (targetState) isAddingListener ? targetState.useNum++ : targetState.useNum--;
    }

    #init() {
        const systemUniform_Vertex_UniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        this.#systemUniform_Vertex_UniformBuffer = new UniformBuffer(this.redGPUContext, systemUniform_Vertex_UniformData, 'SYSTEM_UNIFORM_BUFFER_VERTEX', 'SYSTEM_UNIFORM_BUFFER_VERTEX');
        this.#shadowDepthSampler = new Sampler(this.redGPUContext, {addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE, addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE, addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE, compare: GPU_COMPARE_FUNCTION.LESS_EQUAL}).gpuSampler
        this.#basicSampler = new Sampler(this.redGPUContext).gpuSampler
        this.#basicPackedSampler = new Sampler(this.redGPUContext, {addressModeU: GPU_ADDRESS_MODE.REPEAT, addressModeV: GPU_ADDRESS_MODE.REPEAT}).gpuSampler
    }
}

Object.freeze(View3D)
export default View3D
