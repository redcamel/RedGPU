import { mat4 } from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import OrthographicCamera from "../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../camera/camera/PerspectiveCamera";
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
import ViewRenderTextureManager from "./core/viewRenderTextureManager/ViewRenderTextureManager";
import ToneMappingManager from "../../toneMapping/ToneMappingManager";
import ClusterLightManager from "../../light/core/ClusterLightManager";
/**
 * [KO] 3D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 3D rendering.
 *
 * [KO] Scene, Camera, IBL, SkyBox, PostEffectManager, ToneMappingManager 등을 소유하며 3D 씬을 그리는 렌더링의 단위입니다.
 * [EN] Represents a unit of rendering that draws a 3D scene, owning a Scene, Camera, IBL, SkyBox, PostEffectManager, ToneMappingManager, etc.
 *
 * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * const camera = new RedGPU.Camera.ObitController(redGPUContext);
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 * redGPUContext.addView(view);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/view/singleView/" ></iframe>
 *
 * @see [singleView Example](/RedGPU/examples/3d/view/singleView/)
 * @see [multiView Example](/RedGPU/examples/3d/view/multiView/)
 * @category View
 */
declare class View3D extends AView {
    #private;
    /**
     * [KO] 새로운 View3D 인스턴스를 생성합니다.
     * [EN] Creates a new View3D instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param scene -
     * [KO] 뷰에 렌더링할 씬
     * [EN] Scene to render in the view
     * @param camera -
     * [KO] 뷰에서 사용할 카메라 컨트롤러
     * [EN] Camera controller to use in the view
     * @param name -
     * [KO] 뷰의 선택적 이름
     * [EN] Optional name of the view
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D, name?: string);
    /**
     * [KO] 클러스터 라이트 매니저를 반환합니다.
     * [EN] Returns the cluster light manager.
     */
    get clusterLightManager(): ClusterLightManager;
    /**
     * [KO] 뷰 렌더 텍스처 매니저를 반환합니다.
     * [EN] Returns the view render texture manager.
     */
    get viewRenderTextureManager(): ViewRenderTextureManager;
    /**
     * [KO] 시스템 버텍스 유니폼의 구조체 정보를 반환합니다.
     * [EN] Returns the system vertex uniform structure information.
     */
    get systemUniform_Vertex_StructInfo(): any;
    /**
     * [KO] 시스템 버텍스 유니폼 바인드 그룹을 반환합니다.
     * [EN] Returns the system vertex uniform bind group.
     */
    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup;
    /**
     * [KO] 시스템 버텍스 유니폼 버퍼를 반환합니다.
     * [EN] Returns the system vertex uniform buffer.
     */
    get systemUniform_Vertex_UniformBuffer(): UniformBuffer;
    /**
     * [KO] 현재 설정된 IBL(기반 조명) 객체를 반환합니다.
     * [EN] Returns the currently configured IBL (Image-Based Lighting) object.
     */
    get ibl(): IBL;
    /**
     * [KO] IBL(기반 조명) 객체를 설정합니다.
     * [EN] Sets the IBL (Image-Based Lighting) object.
     * @param value -
     * [KO] 설정할 IBL 인스턴스
     * [EN] IBL instance to set
     */
    set ibl(value: IBL);
    /**
     * [KO] 포스트 이펙트 매니저를 반환합니다.
     * [EN] Returns the post effect manager.
     */
    get postEffectManager(): PostEffectManager;
    /**
     * [KO] 톤 매핑 매니저를 반환합니다.
     * [EN] Returns the tone mapping manager.
     */
    get toneMappingManager(): ToneMappingManager;
    /**
     * [KO] 렌더링 상태 및 디버그용 상태 데이터를 반환합니다.
     * [EN] Returns the rendering state data for tracking.
     */
    get renderViewStateData(): RenderViewStateData;
    /**
     * [KO] 스카이박스 객체를 반환합니다.
     * [EN] Returns the skybox object.
     */
    get skybox(): SkyBox;
    /**
     * [KO] 스카이박스 객체를 설정합니다.
     * [EN] Sets the skybox object.
     * @param value -
     * [KO] 설정할 스카이박스 인스턴스
     * [EN] Skybox instance to set
     */
    set skybox(value: SkyBox);
    /**
     * [KO] 스카이 대기(SkyAtmosphere) 객체를 반환합니다.
     * [EN] Returns the sky atmosphere object.
     */
    get skyAtmosphere(): SkyAtmosphere;
    /**
     * [KO] 스카이 대기(SkyAtmosphere) 객체를 설정합니다.
     * [EN] Sets the sky atmosphere object.
     * @param value -
     * [KO] 설정할 스카이 대기 인스턴스
     * [EN] Sky atmosphere instance to set
     */
    set skyAtmosphere(value: SkyAtmosphere);
    /**
     * [KO] 기본 렌더 번들 인코더 디스크립터를 반환합니다.
     * [EN] Returns the basic render bundle encoder descriptor.
     */
    get basicRenderBundleEncoderDescriptor(): GPURenderBundleEncoderDescriptor;
    /**
     * [KO] 지터(Jitter)가 적용되지 않은 투영 뷰 행렬을 반환합니다.
     * [EN] Returns the projection view matrix with jitter excluded.
     */
    get noneJitterProjectionViewMatrix(): mat4;
    /**
     * [KO] 매 프레임마다 뷰 및 라이팅 데이터를 업데이트합니다.
     * [EN] Updates view and lighting data every frame.
     * @param shadowRender -
     * [KO] 그림자 맵 생성 렌더 패스인지 여부
     * [EN] Whether it is a shadow map generation render pass
     * @param calcPointLightCluster -
     * [KO] 포인트 라이트 클러스터 계산 여부
     * [EN] Whether to calculate point light cluster
     * @param renderPath1ResultTextureView -
     * [KO] 렌더 패스 1단계 결과 텍스처 뷰
     * [EN] Render path 1 stage result texture view
     */
    update(shadowRender?: boolean, calcPointLightCluster?: boolean, renderPath1ResultTextureView?: GPUTextureView): void;
}
export default View3D;
