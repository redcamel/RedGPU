import View3D from "../../View3D";
import GBUFFER_TYPE from "../GBUFFER_TYPE";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] G-Buffer 텍스처 및 관련 뷰 정보를 정의하는 타입입니다.
 * [EN] Type defining G-Buffer texture and related view information.
 *
 * @category Core
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
     * [KO] MSAA Resolve 대상 GPU 텍스처 객체
     * [EN] Resolve target GPU texture object for MSAA
     */
    resolveTexture?: GPUTexture;
    /**
     * [KO] MSAA Resolve 대상 GPU 텍스처 뷰 객체
     * [EN] Resolve target GPU texture view object for MSAA
     */
    resolveTextureView?: GPUTextureView;
    /**
     * [KO] MSAA Resolve 대상 GPU 텍스처 디스크립터
     * [EN] Resolve target GPU texture descriptor for MSAA
     */
    resolveTextureDescriptor?: GPUTextureDescriptor;
};
/**
 * [KO] View3D/View2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성 및 관리하는 매니저 클래스입니다.
 * [EN] Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/View2D.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D 인스턴스를 통해 접근
 * // [EN] Access via View3D instance
 * const viewRenderTextureManager = view.viewRenderTextureManager;
 * ```
 *
 * @category Core
 */
declare class ViewRenderTextureManager extends RedGPUObject {
    #private;
    /**
     * [KO] ViewRenderTextureManager 인스턴스를 생성합니다.
     * [EN] Creates a ViewRenderTextureManager instance.
     *
     * @param view -
     * [KO] 이 매니저가 관리할 View3D 인스턴스
     * [EN] View3D instance this manager will manage
     */
    constructor(view: View3D);
    /**
     * [KO] G-Buffer 맵(`Map<string, GBufferInfo>`)을 반환합니다.
     * [EN] Returns the G-Buffer map (`Map<string, GBufferInfo>`).
     *
     * @returns
     * [KO] G-Buffer 정보 맵
     * [EN] G-Buffer information map
     */
    get gBuffers(): Map<string, GBufferInfo>;
    /**
     * [KO] 현재 관리 중인 렌더 텍스처들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of the currently managed render textures.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (바이트)
     * [EN] Video memory usage (bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 1차 렌더 패스 결과 텍스처의 디스크립터를 반환합니다.
     * [EN] Returns the texture descriptor of the render path 1 result texture.
     *
     * @returns
     * [KO] 1차 렌더 패스 결과 텍스처 디스크립터
     * [EN] Render path 1 result texture descriptor
     */
    get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor;
    /**
     * [KO] 현재 프레임의 깊이(Depth) 텍스처를 반환합니다.
     * [EN] Returns the depth texture of the current frame.
     *
     * @returns
     * [KO] 현재 깊이 텍스처
     * [EN] Current depth texture
     */
    get depthTexture(): GPUTexture;
    /**
     * [KO] 현재 프레임의 깊이(Depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the depth texture view of the current frame.
     *
     * @returns
     * [KO] 현재 깊이 텍스처 뷰
     * [EN] Current depth texture view
     */
    get depthTextureView(): GPUTextureView;
    /**
     * [KO] 이전 프레임의 깊이(Depth) 텍스처 뷰를 반환합니다.
     * [EN] Returns the depth texture view of the previous frame.
     *
     * @returns
     * [KO] 이전 프레임 깊이 텍스처 뷰
     * [EN] Previous frame depth texture view
     */
    get prevDepthTextureView(): GPUTextureView;
    /**
     * [KO] 첫 번째 깊이 텍스처(`depthTexture0`)의 뷰를 반환합니다.
     * [EN] Returns the view of the first depth texture (`depthTexture0`).
     *
     * @returns
     * [KO] 첫 번째 깊이 텍스처 뷰
     * [EN] First depth texture view
     */
    get depthTexture0View(): GPUTextureView;
    /**
     * [KO] 두 번째 깊이 텍스처(`depthTexture1`)의 뷰를 반환합니다.
     * [EN] Returns the view of the second depth texture (`depthTexture1`).
     *
     * @returns
     * [KO] 두 번째 깊이 텍스처 뷰
     * [EN] Second depth texture view
     */
    get depthTexture1View(): GPUTextureView;
    /**
     * [KO] 1차 렌더 패스 컬러 결과 텍스처 뷰를 반환합니다.
     * [EN] Returns the render path 1 color result texture view.
     *
     * @returns
     * [KO] 1차 렌더 패스 결과 텍스처 뷰
     * [EN] Render path 1 result texture view
     */
    get renderPath1ResultTextureView(): GPUTextureView;
    /**
     * [KO] 1차 렌더 패스 컬러 결과 텍스처를 반환합니다.
     * [EN] Returns the render path 1 color result texture.
     *
     * @returns
     * [KO] 1차 렌더 패스 결과 텍스처
     * [EN] Render path 1 result texture
     */
    get renderPath1ResultTexture(): GPUTexture;
    /**
     * [KO] 1차 렌더 패스 깊이 결과 텍스처 뷰를 반환합니다.
     * [EN] Returns the render path 1 depth result texture view.
     *
     * @returns
     * [KO] 1차 렌더 패스 깊이 결과 텍스처 뷰
     * [EN] Render path 1 depth result texture view
     */
    get renderPath1DepthResultTextureView(): GPUTextureView;
    /**
     * [KO] 1차 렌더 패스 깊이 결과 텍스처를 반환합니다.
     * [EN] Returns the render path 1 depth result texture.
     *
     * @returns
     * [KO] 1차 렌더 패스 깊이 결과 텍스처
     * [EN] Render path 1 depth result texture
     */
    get renderPath1DepthResultTexture(): GPUTexture;
    /**
     * [KO] 1차 렌더 패스의 깊이 버퍼를 2차 패스 참조용 `renderPath1DepthResultTexture`에 복사 또는 MSAA 리졸브합니다.
     * [EN] Copies or MSAA-resolves the depth buffer of render path 1 into `renderPath1DepthResultTexture` for reading in path 2.
     *
     * @param encoder -
     * [KO] GPUCommandEncoder 인스턴스
     * [EN] GPUCommandEncoder instance
     */
    copyDepthToRenderPath1(encoder: GPUCommandEncoder): void;
    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처를 반환합니다.
     * [EN] Returns the G-Buffer texture of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] G-Buffer GPU 텍스처
     * [EN] G-Buffer GPU texture
     */
    getGBufferTexture(type: GBUFFER_TYPE): GPUTexture;
    /**
     * [KO] 지정된 타입의 MSAA Resolve G-Buffer 텍스처를 반환합니다.
     * [EN] Returns the MSAA resolve G-Buffer texture of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] Resolve 대상 GPU 텍스처
     * [EN] Resolve target GPU texture
     */
    getGBufferResolveTexture(type: GBUFFER_TYPE): GPUTexture;
    /**
     * [KO] 지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.
     * [EN] Returns the G-Buffer texture view of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] G-Buffer GPU 텍스처 뷰
     * [EN] G-Buffer GPU texture view
     */
    getGBufferTextureView(type: GBUFFER_TYPE): GPUTextureView;
    /**
     * [KO] 지정된 타입의 MSAA Resolve G-Buffer 텍스처 뷰를 반환합니다.
     * [EN] Returns the MSAA resolve G-Buffer texture view of the specified type.
     *
     * @param type -
     * [KO] G-Buffer 타입 상수
     * [EN] G-Buffer type constant
     * @returns
     * [KO] Resolve 대상 GPU 텍스처 뷰
     * [EN] Resolve target GPU texture view
     */
    getGBufferResolveTextureView(type: GBUFFER_TYPE): GPUTextureView;
    /**
     * [KO] 관리 중인 모든 G-Buffer 및 깊이 텍스처 리소스를 해제하고 매니저를 파기합니다.
     * [EN] Releases all managed G-Buffer and depth texture resources and destroys the manager.
     */
    destroy(): void;
}
export default ViewRenderTextureManager;
