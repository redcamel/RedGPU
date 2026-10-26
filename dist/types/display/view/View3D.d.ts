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
import ClusterLightManager from "../../light/core/clusterLight/ClusterLightManager";
import HierarchicalZBuffer from "./hzb/HierarchicalZBuffer";
/**
 * [KO] 3D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 3D rendering.
 *
 * [KO] `Scene`, `Camera`, `IBL`, `SkyBox`, `PostEffectManager`, `ToneMappingManager` 등을 소유하며 3D 씬을 그리는 렌더링의 단위입니다.
 * [EN] Represents a rendering unit that draws a 3D scene, owning `Scene`, `Camera`, `IBL`, `SkyBox`, `PostEffectManager`, `ToneMappingManager`, etc.
 *
 * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * const camera = new RedGPU.Camera.ObitController(redGPUContext);
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 * redGPUContext.addView(view);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/view/singleView/" style="width:100%; height:500px;"></iframe>
 *
 * @see [singleView Example](/RedGPU/examples/3d/view/singleView/)
 * @see [multiView Example](/RedGPU/examples/3d/view/multiView/)
 * @category View
 */
declare class View3D extends AView {
    #private;
    /**
     * [KO] `View3D` 인스턴스를 생성합니다.
     * [EN] Creates a `View3D` instance.
     *
     * ### Example
     * ```typescript
     * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera, 'Main3DView');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param scene -
     * [KO] 뷰에 렌더링할 씬
     * [EN] Scene to render in the view
     * @param camera -
     * [KO] 뷰에서 사용할 카메라 또는 컨트롤러
     * [EN] Camera or controller to use in the view
     * @param name -
     * [KO] 뷰 이름 (선택)
     * [EN] View name (optional)
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D, name?: string);
    /**
     * [KO] Hierarchical Z-Buffer (HZB) 전역 피라미드 객체를 반환합니다.
     * [EN] Returns the Hierarchical Z-Buffer (HZB) global pyramid instance.
     *
     * @returns
     * [KO] `HierarchicalZBuffer` 인스턴스
     * [EN] `HierarchicalZBuffer` instance
     */
    get hierarchicalZBuffer(): HierarchicalZBuffer;
    /**
     * [KO] 클러스터 라이트 매니저를 반환합니다.
     * [EN] Returns the cluster light manager.
     *
     * @returns
     * [KO] `ClusterLightManager` 인스턴스
     * [EN] `ClusterLightManager` instance
     */
    get clusterLightManager(): ClusterLightManager;
    /**
     * [KO] 뷰 렌더 텍스처 매니저를 반환합니다.
     * [EN] Returns the view render texture manager.
     *
     * @returns
     * [KO] `ViewRenderTextureManager` 인스턴스
     * [EN] `ViewRenderTextureManager` instance
     */
    get viewRenderTextureManager(): ViewRenderTextureManager;
    /**
     * [KO] 시스템 버텍스 유니폼의 구조체 정보를 반환합니다.
     * [EN] Returns the structure information of the system vertex uniform.
     *
     * @returns
     * [KO] 시스템 유니폼 구조체 정보
     * [EN] System uniform structure information
     */
    get systemUniform_Vertex_StructInfo(): any;
    /**
     * [KO] 현재 렌더링 중인 CSM 캐스케이드 인덱스(0 ~ 3)를 반환하거나 설정합니다.
     * [EN] Returns or sets the CSM cascade index (0 to 3) currently being rendered.
     *
     * @returns
     * [KO] 현재 캐스케이드 인덱스 또는 `undefined`
     * [EN] Current cascade index or `undefined`
     */
    get currentCascadeIndex(): number | undefined;
    set currentCascadeIndex(value: number | undefined);
    /**
     * [KO] 시스템 버텍스 유니폼 바인드 그룹을 반환합니다. 캐스케이드 렌더링 중에는 해당 캐스케이드 바인드 그룹을 반환합니다.
     * [EN] Returns the system vertex uniform bind group. Returns the corresponding cascade bind group during cascade rendering.
     *
     * @returns
     * [KO] 시스템 유니폼 `GPUBindGroup`
     * [EN] System uniform `GPUBindGroup`
     */
    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup;
    /**
     * [KO] 시스템 버텍스 유니폼 버퍼를 반환합니다.
     * [EN] Returns the system vertex uniform buffer.
     *
     * @returns
     * [KO] `UniformBuffer` 인스턴스
     * [EN] `UniformBuffer` instance
     */
    get systemUniform_Vertex_UniformBuffer(): UniformBuffer;
    /**
     * [KO] 이미지 기반 조명(IBL) 객체를 반환하거나 설정합니다.
     * [EN] Returns or sets the Image-Based Lighting (IBL) object.
     *
     * @returns
     * [KO] `IBL` 인스턴스
     * [EN] `IBL` instance
     */
    get ibl(): IBL;
    /**
     * [KO] 포스트 이펙트 매니저를 반환합니다.
     * [EN] Returns the post-effect manager.
     *
     * @returns
     * [KO] `PostEffectManager` 인스턴스
     * [EN] `PostEffectManager` instance
     */
    get postEffectManager(): PostEffectManager;
    set ibl(value: IBL);
    /**
     * [KO] 톤 매핑 매니저를 반환합니다.
     * [EN] Returns the tone mapping manager.
     *
     * @returns
     * [KO] `ToneMappingManager` 인스턴스
     * [EN] `ToneMappingManager` instance
     */
    get toneMappingManager(): ToneMappingManager;
    /**
     * [KO] 뷰 렌더링 상태 데이터를 반환합니다.
     * [EN] Returns the view rendering state data.
     *
     * @returns
     * [KO] `RenderViewStateData` 인스턴스
     * [EN] `RenderViewStateData` instance
     */
    get renderViewStateData(): RenderViewStateData;
    /**
     * [KO] 스카이박스 객체를 반환하거나 설정합니다.
     * [EN] Returns or sets the skybox object.
     *
     * @returns
     * [KO] `SkyBox` 인스턴스
     * [EN] `SkyBox` instance
     */
    get skybox(): SkyBox;
    /**
     * [KO] 스카이 대기(`SkyAtmosphere`) 객체를 반환하거나 설정합니다.
     * [EN] Returns or sets the `SkyAtmosphere` object.
     *
     * @returns
     * [KO] `SkyAtmosphere` 인스턴스
     * [EN] `SkyAtmosphere` instance
     */
    get skyAtmosphere(): SkyAtmosphere;
    set skybox(value: SkyBox);
    /**
     * [KO] 기본 렌더 번들 인코더 디스크립터를 반환합니다.
     * [EN] Returns the basic render bundle encoder descriptor.
     *
     * @returns
     * [KO] `GPURenderBundleEncoderDescriptor` 객체
     * [EN] `GPURenderBundleEncoderDescriptor` object
     */
    get basicRenderBundleEncoderDescriptor(): GPURenderBundleEncoderDescriptor;
    set skyAtmosphere(value: SkyAtmosphere);
    /**
     * [KO] 지터(Jitter)가 적용되지 않은 투영 뷰 행렬을 반환합니다.
     * [EN] Returns the projection view matrix without jitter.
     *
     * @returns
     * [KO] 투영 뷰 행렬 (`mat4`)
     * [EN] Projection view matrix (`mat4`)
     */
    get noneJitterProjectionViewMatrix(): mat4;
    /**
     * [KO] 이전 프레임의 지터가 적용되지 않은 투영 뷰 행렬을 반환합니다.
     * [EN] Returns the projection view matrix without jitter from the previous frame.
     *
     * @returns
     * [KO] 이전 프레임 투영 뷰 행렬 (`mat4`)
     * [EN] Previous frame projection view matrix (`mat4`)
     */
    get prevNoneJitterProjectionViewMatrix(): mat4;
    /**
     * [KO] 지정된 캐스케이드 인덱스에 대응하는 시스템 버텍스 유니폼 바인드 그룹을 반환합니다.
     * [EN] Returns the system vertex uniform bind group corresponding to the specified cascade index.
     *
     * @param cascadeIndex -
     * [KO] 캐스케이드 인덱스 (0 ~ 3)
     * [EN] Cascade index (0 to 3)
     * @returns
     * [KO] 시스템 유니폼 `GPUBindGroup`
     * [EN] System uniform `GPUBindGroup`
     */
    getCascadeUniformBindGroup(cascadeIndex: number): GPUBindGroup;
    /**
     * [KO] 뷰와 연결된 모든 GPU 리소스 및 하위 매니저를 해제합니다.
     * [EN] Destroys all GPU resources and sub-managers associated with the view.
     */
    destroy(): void;
    /**
     * [KO] 매 프레임 뷰의 시스템 유니폼 및 바인드 그룹 상태를 업데이트합니다.
     * [EN] Updates the view's system uniform and bind group state every frame.
     *
     * @param renderPath1ResultTextureView -
     * [KO] 렌더 패스 1단계 결과 텍스처 뷰 (선택)
     * [EN] Render path 1 result texture view (optional)
     * @param renderPath1DepthTextureView -
     * [KO] 렌더 패스 1단계 깊이 결과 텍스처 뷰 (선택)
     * [EN] Render path 1 depth result texture view (optional)
     */
    update(renderPath1ResultTextureView?: GPUTextureView, renderPath1DepthTextureView?: GPUTextureView): void;
}
export default View3D;
