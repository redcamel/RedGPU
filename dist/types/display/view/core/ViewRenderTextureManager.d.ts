import View3D from "../View3D";
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
declare class ViewRenderTextureManager {
    #private;
    /**
     * 생성자
     * @param {View3D} view - 이 매니저가 관리할 View3D 인스턴스
     */
    constructor(view: View3D);
    /**
     * 현재 계산된 비디오 메모리 사용량(바이트)을 반환합니다.
     * @returns {number}
     */
    get videoMemorySize(): number;
    /**
     * 렌더 패스1 결과 텍스처 생성에 사용된 디스크립터를 반환합니다.
     * @returns {GPUTextureDescriptor}
     */
    get renderPath1ResultTextureDescriptor(): GPUTextureDescriptor;
    /**
     * 깊이 텍스처를 반환합니다. 필요 시 내부에서 생성합니다.
     * @returns {GPUTexture}
     */
    get depthTexture(): GPUTexture;
    /**
     * 깊이 텍스처 뷰를 반환합니다. 필요 시 내부에서 생성합니다.
     * @returns {GPUTextureView}
     */
    get depthTextureView(): GPUTextureView;
    get prevDepthTextureView(): GPUTextureView;
    /**
     * 렌더 패스1 결과 텍스처 뷰를 반환합니다.
     * @returns {GPUTextureView}
     */
    get renderPath1ResultTextureView(): GPUTextureView;
    /**
     * 렌더 패스1 결과 텍스처를 반환합니다. 필요 시 내부에서 생성합니다.
     * @returns {GPUTexture}
     */
    get renderPath1ResultTexture(): GPUTexture;
    /**
     * G-Buffer color 텍스처 반환 (미리 생성되지 않았으면 undefined)
     * @returns {GPUTexture}
     */
    get gBufferColorTexture(): GPUTexture;
    /**
     * G-Buffer color resolve 텍스처 반환 (MSAA 사용 시 resolve 대상)
     * @returns {GPUTexture}
     */
    get gBufferColorResolveTexture(): GPUTexture;
    /**
     * G-Buffer color 텍스처 뷰 반환. 내부에서 생성 보장.
     * @returns {GPUTextureView}
     */
    get gBufferColorTextureView(): GPUTextureView;
    /**
     * G-Buffer color resolve 텍스처 뷰 반환.
     * @returns {GPUTextureView}
     */
    get gBufferColorResolveTextureView(): GPUTextureView;
    /**
     * G-Buffer normal 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferNormalTexture(): GPUTexture;
    /**
     * G-Buffer normal resolve 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferNormalResolveTexture(): GPUTexture;
    /**
     * G-Buffer normal 텍스처 뷰 반환. 내부에서 생성 보장.
     * @returns {GPUTextureView}
     */
    get gBufferNormalTextureView(): GPUTextureView;
    /**
     * G-Buffer normal resolve 텍스처 뷰 반환.
     * @returns {GPUTextureView}
     */
    get gBufferNormalResolveTextureView(): GPUTextureView;
    /**
     * G-Buffer 모션 벡터 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferMotionVectorTexture(): GPUTexture;
    /**
     * G-Buffer 모션 벡터 resolve 텍스처 반환
     * @returns {GPUTexture}
     */
    get gBufferMotionVectorResolveTexture(): GPUTexture;
    /**
     * G-Buffer 모션 벡터 텍스처 뷰 반환. 내부에서 생성 보장.
     * @returns {GPUTextureView}
     */
    get gBufferMotionVectorTextureView(): GPUTextureView;
    /**
     * G-Buffer 모션 벡터 resolve 텍스처 뷰 반환.
     * @returns {GPUTextureView}
     */
    get gBufferMotionVectorResolveTextureView(): GPUTextureView;
}
export default ViewRenderTextureManager;
