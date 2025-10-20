import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import PassClusterLightBound from "../../light/clusterLight/PassClusterLightBound";
import PostEffectManager from "../../postEffect/PostEffectManager";
import RenderViewStateData from "./core/RenderViewStateData";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import IBL from "../../resources/texture/ibl/IBL";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import AView from "./core/AView";
import ViewRenderTextureManager from "./core/ViewRenderTextureManager";
/**
 * 3D 렌더링 뷰 클래스입니다. AView를 확장하여 3D 장면 렌더링 기능을 제공합니다.
 *
 * 3D 장면 렌더링, 조명, 그림자, 포스트 이펙트, IBL(이미지 기반 조명) 처리를 담당합니다.
 *
 * @example
 * ```javascript
 * const scene = new RedGPU.Display.Scene();
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
 * view.grid = true;
 * redGPUContext.addView(view);
 * ```
 * <iframe src="/RedGPU/examples/3d/view/singleView/" ></iframe>
 *
 * 아래는 View3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Multi View3D example](/RedGPU/examples/3d/view/multiView/)
 * @category View
 */
declare class View3D extends AView {
    #private;
    /**
     * View3D 인스턴스를 생성합니다.
     * 3D 렌더링에 필요한 모든 컴포넌트(조명, 포스트 이펙트, 리소스 관리)를 초기화합니다.
     *
     * @param redGPUContext - 렌더링 작업을 위한 WebGPU 컨텍스트
     * @param scene - 렌더링할 3D 장면
     * @param camera - 카메라 컨트롤러 (3D 또는 2D 카메라)
     * @param name - 뷰의 선택적 이름 식별자
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string);
    /**
     * 뷰 렌더 텍스처 매니저를 가져옵니다.
     * @returns ViewRenderTextureManager 인스턴스
     */
    get viewRenderTextureManager(): ViewRenderTextureManager;
    /**
     * 정점 셰이더용 시스템 유니폼 구조 정보를 가져옵니다.
     * @returns 유니폼 구조 정보 객체
     */
    get systemUniform_Vertex_StructInfo(): any;
    /**
     * 정점 셰이더 시스템 유니폼용 GPU 바인드 그룹을 가져옵니다.
     * @returns 정점 유니폼용 GPUBindGroup
     */
    get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup;
    /**
     * 정점 셰이더 시스템 유니폼용 유니폼 버퍼를 가져옵니다.
     * @returns UniformBuffer 인스턴스
     */
    get systemUniform_Vertex_UniformBuffer(): UniformBuffer;
    /**
     * 클러스터 라이트 경계 패스를 가져옵니다.
     * @returns PassClusterLightBound 인스턴스
     */
    get passLightClustersBound(): PassClusterLightBound;
    /**
     * IBL(이미지 기반 조명) 설정을 가져옵니다.
     * @returns IBL 인스턴스
     */
    get ibl(): IBL;
    /**
     * IBL(이미지 기반 조명) 설정을 설정합니다.
     * @param value - 설정할 IBL 인스턴스
     */
    set ibl(value: IBL);
    /**
     * 포스트 이펙트 매니저를 가져옵니다.
     * @returns PostEffectManager 인스턴스
     */
    get postEffectManager(): PostEffectManager;
    /**
     * 디버그 뷰 렌더링 상태를 가져옵니다.
     * @returns RenderViewStateData 인스턴스
     */
    get renderViewStateData(): RenderViewStateData;
    /**
     * 스카이박스를 가져옵니다.
     * @returns SkyBox 인스턴스
     */
    get skybox(): SkyBox;
    /**
     * 스카이박스를 설정합니다.
     * 이전 텍스처의 리소스 상태를 관리하고 새 텍스처로 교체합니다.
     * @param value - 설정할 SkyBox 인스턴스
     */
    set skybox(value: SkyBox);
    /**
     * 뷰를 업데이트하고 렌더링 준비를 수행합니다.
     * 유니폼 데이터 업데이트, 바인드 그룹 생성, 클러스터 라이트 계산을 처리합니다.
     *
     * @param view - 업데이트할 View3D 인스턴스
     * @param shadowRender - 그림자 렌더링 여부 (기본값: false)
     * @param calcPointLightCluster - 포인트 라이트 클러스터 계산 여부 (기본값: false)
     * @param renderPath1ResultTextureView - 렌더 패스 1 결과 텍스처 뷰 (선택사항)
     */
    update(shadowRender?: boolean, calcPointLightCluster?: boolean, renderPath1ResultTextureView?: GPUTextureView): void;
}
export default View3D;
