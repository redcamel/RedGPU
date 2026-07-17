import View3D from "../../View3D";
import GBUFFER_TYPE from "../GBUFFER_TYPE";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] G-Buffer 텍스처 및 관련 뷰 정보를 정의하는 타입
 * [EN] Type defining G-Buffer texture and related view information
 */
type GBufferInfo = {
    /**
     * [KO] GPU 텍스처 객체
     * [EN] GPU texture object
     */
    texture: GPUTexture;
    /**
     * [KO] GPU 텍스처 뷰 객체
     * [EN] GPU texture view object
     */
    textureView: GPUTextureView;
    /**
     * [KO] GPU 텍스처 디스크립터
     * [EN] GPU texture descriptor
     */
    textureDescriptor: GPUTextureDescriptor;
    /**
     * [KO] MSAA용 Resolve 대상 GPU 텍스처 객체 (선택 사항)
     * [EN] Resolve target GPU texture object for MSAA (optional)
     */
    resolveTexture?: GPUTexture;
    /**
     * [KO] MSAA용 Resolve 대상 GPU 텍스처 뷰 객체 (선택 사항)
     * [EN] Resolve target GPU texture view object for MSAA (optional)
     */
    resolveTextureView?: GPUTextureView;
    /**
     * [KO] MSAA용 Resolve 대상 GPU 텍스처 디스크립터 (선택 사항)
     * [EN] Resolve target GPU texture descriptor for MSAA (optional)
     */
    resolveTextureDescriptor?: GPUTextureDescriptor;
};
/**
 * [KO] View3D/2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성 및 관리하는 매니저 클래스입니다.
 * [EN] Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/2D.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
declare class ViewRenderTextureManager extends RedGPUObject {
    #private;
    /**
     * [KO] ViewRenderTextureManager 인스턴스를 생성합니다.
     * [EN] Creates a new ViewRenderTextureManager instance.
     * @param view -
     * [KO] 이 매니저가 관리할 View3D 인스턴스
     * [EN] View3D instance this manager will manage
     */
    constructor(view: View3D);
    /**
     * [KO] G-Buffer 맵을 반환합니다.
     * [EN] Returns the G-Buffer map.
     */
    get gBuffers(): Map<string, GBufferInfo>;
    /**
     * [KO] 현재 계산된 비디오 메모리 사용량 (바이트 단위)을 반환합니다.
     * [EN] Returns the currently calculated video memory usage (in bytes).
     */
    get videoMemorySize(): number;
    /**
     * [KO] 렌더 패스 1단계 결과 텍스처 생성에 사용된 디스크립터를 반환합니다.
     * [EN] Returns the descriptor used to create the render path 1 stage result texture.
     */
    get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor;
    /**
     * [KO] 깊이(depth) 텍스처를 반환합니다. (스왑 버퍼링 반영)
     * [EN] Returns the depth texture. (reflects swap buffering)
     */
    get depthTexture(): GPUTexture;
    /**
     * [KO] 깊이(depth) 텍스처 뷰를 반환합니다. (스왑 버퍼링 반영)
     * [EN] Returns the depth texture view. (reflects swap buffering)
     */
    get depthTextureView(): GPUTextureView;
    /**
     * [KO] 이전 프레임의 깊이(depth) 텍스처 뷰를 반환합니다. (스왑 버퍼링 반영)
     * [EN] Returns the depth texture view of the previous frame. (reflects swap buffering)
     */
    get prevDepthTextureView(): GPUTextureView;
    /**
     * [KO] 첫 번째 깊이(depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the first depth texture view.
     */
    get depthTexture0View(): GPUTextureView;
    /**
     * [KO] 두 번째 깊이(depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the second depth texture view.
     */
    get depthTexture1View(): GPUTextureView;
    /**
     * [KO] 렌더 패스 1단계 결과 텍스처 뷰를 반환합니다.
     * [EN] Returns the render path 1 stage result texture view.
     */
    get renderPath1ResultTextureView(): GPUTextureView;
    /**
     * [KO] 렌더 패스 1단계 결과 텍스처를 반환합니다.
     * [EN] Returns the render path 1 stage result texture.
     */
    get renderPath1ResultTexture(): GPUTexture;
    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처를 반환합니다.
     * [EN] Returns the G-Buffer texture of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferTexture(type: GBUFFER_TYPE): GPUTexture;
    /**
     * [KO] 지정된 타입의 G-Buffer Resolve 텍스처를 반환합니다. (MSAA 해제 시 대상)
     * [EN] Returns the G-Buffer resolve texture of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferResolveTexture(type: GBUFFER_TYPE): GPUTexture;
    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.
     * [EN] Returns the G-Buffer texture view of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferTextureView(type: GBUFFER_TYPE): GPUTextureView;
    /**
     * [KO] 지정된 타입의 G-Buffer Resolve 텍스처 뷰를 반환합니다. (MSAA 해제 시 대상 뷰)
     * [EN] Returns the G-Buffer resolve texture view of the specified type.
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     */
    getGBufferResolveTextureView(type: GBUFFER_TYPE): GPUTextureView;
    /**
     * [KO] ViewRenderTextureManager 인스턴스를 파기하고 내부에 보관 중이던 G-Buffer 및 Depth 텍스처들을 물리적으로 해제합니다.
     * [EN] Destroys the ViewRenderTextureManager instance and physically releases all G-Buffer and Depth textures held inside.
     */
    destroy(): void;
}
export default ViewRenderTextureManager;
