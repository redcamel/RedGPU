import { mat4 } from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import PassClusterLightBound from "../../light/clusterLight/PassClusterLightBound";
import PostEffectManager from "../../postEffect/PostEffectManager";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import IBL from "../../resources/texture/ibl/IBL";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import AView from "./core/AView";
import RenderViewStateData from "./core/RenderViewStateData";
import ViewRenderTextureManager from "./core/ViewRenderTextureManager";
import ToneMappingManager from "../../toneMapping/ToneMappingManager";
/**
 * [KO] 3D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 3D rendering.
 *
 * [KO] AView를 확장하여 3D 장면 렌더링, 조명, 그림자, 포스트 이펙트, IBL(이미지 기반 조명) 처리 등을 담당합니다.
 * [EN] Extends AView to handle 3D scene rendering, lighting, shadows, post-effects, and IBL (Image-Based Lighting) processing.
 *
 * * ### Example
 * ```typescript
 * // RedGPU.init 콜백 내부 (Inside RedGPU.init callback)
 * const scene = new RedGPU.Display.Scene();
 * const camera = new RedGPU.Camera.RedObitController(redGPUContext);
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 *
 * view.grid = true;
 * redGPUContext.addView(view);
 * ```
 * <iframe src="/RedGPU/examples/3d/view/singleView/" ></iframe>
 *
 * [KO] 아래는 View3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of View3D.
 * @see [Multi View3D example](/RedGPU/examples/3d/view/multiView/)
 * @category View
 */
declare class View3D extends AView {
    #private;
    /**
     * [KO] View3D 인스턴스를 생성합니다.
     * [EN] Creates a View3D instance.
     * [KO] 3D 렌더링에 필요한 모든 컴포넌트(조명, 포스트 이펙트, 리소스 관리)를 초기화합니다.
     * [EN] Initializes all components (lights, post-effects, resource management) needed for 3D rendering.
     *
     * @param redGPUContext -
     * [KO] 렌더링 작업을 위한 WebGPU 컨텍스트
     * [EN] WebGPU context for rendering tasks
     * @param scene -
     * [KO] 렌더링할 3D 장면
     * [EN] 3D scene to render
     * @param camera -
     * [KO] 카메라 컨트롤러 (3D 또는 2D 카메라)
     * [EN] Camera controller (3D or 2D camera)
     * @param name -
     * [KO] 뷰의 선택적 이름 식별자
     * [EN] Optional name identifier for the view
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string);
    /**
     * [KO] 뷰 렌더 텍스처 매니저를 반환합니다.
     * [EN] Returns the ViewRenderTextureManager instance.
     */
    get viewRenderTextureManager(): ViewRenderTextureManager;
    /**
     * [KO] 정점 셰이더용 시스템 유니폼 구조 정보를 반환합니다.
     * [EN] Returns system uniform structure information for vertex shaders.
     */
    get systemUniform_Vertex_StructInfo(): any;
    /**
     * [KO] 정점 셰이더 시스템 유니폼용 GPU 바인드 그룹을 반환합니다.
     * [EN] Returns the GPU bind group for vertex shader system uniforms.
     */
    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup;
    /**
     * [KO] 정점 셰이더 시스템 유니폼용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the UniformBuffer instance for vertex shader system uniforms.
     */
    get systemUniform_Vertex_UniformBuffer(): UniformBuffer;
    /**
     * [KO] 클러스터 라이트 경계 패스를 반환합니다.
     * [EN] Returns the cluster light boundary pass.
     */
    get passLightClustersBound(): PassClusterLightBound;
    /**
     * [KO] IBL(이미지 기반 조명) 설정을 반환합니다.
     * [EN] Returns the IBL (Image-Based Lighting) settings.
     */
    get ibl(): IBL;
    /**
     * [KO] IBL(이미지 기반 조명) 설정을 설정합니다.
     * [EN] Sets the IBL (Image-Based Lighting) settings.
     * @param value -
     * [KO] 설정할 IBL 인스턴스
     * [EN] IBL instance to set
     */
    set ibl(value: IBL);
    /**
     * [KO] 포스트 이펙트 매니저를 반환합니다.
     * [EN] Returns the post-effect manager.
     */
    get postEffectManager(): PostEffectManager;
    /**
     * [KO] 톤 매핑 매니저를 반환합니다.
     * [EN] Returns the tone mapping manager.
     */
    get toneMappingManager(): ToneMappingManager;
    /**
     * [KO] 디버그 뷰 렌더링 상태를 반환합니다.
     * [EN] Returns the render state data.
     */
    get renderViewStateData(): RenderViewStateData;
    /**
     * [KO] 스카이박스를 반환합니다.
     * [EN] Returns the skybox.
     */
    get skybox(): SkyBox;
    /**
     * [KO] 스카이박스를 설정합니다.
     * [EN] Sets the skybox.
     * [KO] 이전 텍스처의 리소스 상태를 관리하고 새 텍스처로 교체합니다.
     * [EN] Manages resource states of previous textures and replaces them with new ones.
     * @param value -
     * [KO] 설정할 SkyBox 인스턴스
     * [EN] SkyBox instance to set
     */
    set skybox(value: SkyBox);
    get basicRenderBundleEncoderDescriptor(): GPURenderBundleEncoderDescriptor;
    get noneJitterProjectionCameraMatrix(): mat4;
    /**
     * [KO] 뷰를 업데이트하고 렌더링 준비를 수행합니다.
     * [EN] Updates the view and prepares for rendering.
     * [KO] 유니폼 데이터 업데이트, 바인드 그룹 생성, 클러스터 라이트 계산을 처리합니다.
     * [EN] Handles uniform data updates, bind group creation, and cluster light calculations.
     *
     * @param shadowRender -
     * [KO] 그림자 렌더링 여부 (기본값: false)
     * [EN] Whether to render shadows (default: false)
     * @param calcPointLightCluster -
     * [KO] 포인트 라이트 클러스터 계산 여부 (기본값: false)
     * [EN] Whether to calculate point light clusters (default: false)
     * @param renderPath1ResultTextureView -
     * [KO] 렌더 패스 1 결과 텍스처 뷰 (선택사항)
     * [EN] Render pass 1 result texture view (optional)
     */
    update(shadowRender?: boolean, calcPointLightCluster?: boolean, renderPath1ResultTextureView?: GPUTextureView): void;
}
export default View3D;
