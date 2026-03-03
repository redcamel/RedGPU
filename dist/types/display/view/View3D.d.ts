import { mat4 } from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import PostEffectManager from "../../postEffect/PostEffectManager";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import IBL from "../../resources/texture/ibl/IBL";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import SkyAtmosphere from "../skyAtmosphere/SkyAtmosphere";
import AView from "./core/AView";
import RenderViewStateData from "./core/RenderViewStateData";
import ViewRenderTextureManager from "./core/ViewRenderTextureManager";
import ToneMappingManager from "../../toneMapping/ToneMappingManager";
import ClusterLightManager from "../../light/clusterLight/ClusterLightManager";
/**
 * [KO] 3D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 3D rendering.
 *
 * [KO] AView를 확장하여 3D 장면 렌더링, 조명, 그림자, 포스트 이펙트, IBL(이미지 기반 조명) 처리 등을 담당합니다.
 * [EN] Extends AView to handle 3D scene rendering, lighting, shadows, post-effects, and IBL (Image-Based Lighting) processing.
 */
declare class View3D extends AView {
    #private;
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string);
    get clusterLightManager(): ClusterLightManager;
    get viewRenderTextureManager(): ViewRenderTextureManager;
    get systemUniform_Vertex_StructInfo(): any;
    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup;
    get systemUniform_Vertex_UniformBuffer(): UniformBuffer;
    get ibl(): IBL;
    set ibl(value: IBL);
    get postEffectManager(): PostEffectManager;
    get toneMappingManager(): ToneMappingManager;
    get renderViewStateData(): RenderViewStateData;
    get skybox(): SkyBox;
    set skybox(value: SkyBox);
    get skyAtmosphere(): SkyAtmosphere;
    set skyAtmosphere(value: SkyAtmosphere);
    get basicRenderBundleEncoderDescriptor(): GPURenderBundleEncoderDescriptor;
    get noneJitterProjectionViewMatrix(): mat4;
    update(shadowRender?: boolean, calcPointLightCluster?: boolean, renderPath1ResultTextureView?: GPUTextureView): void;
}
export default View3D;
