/**
 * [KO] 메시 렌더 파이프라인의 특수 타입을 정의하는 상수입니다.
 * [EN] Constants defining special types of mesh render pipelines.
 *
 * @category Core
 */
declare const PIPELINE_TYPE: {
    /**
     * [KO] 그림자 렌더링 파이프라인 타입
     * [EN] Shadow rendering pipeline type
     */
    readonly SHADOW: "shadow";
    /**
     * [KO] 마우스 피킹 렌더링 파이프라인 타입
     * [EN] Mouse picking rendering pipeline type
     */
    readonly PICKING: "picking";
};
export default PIPELINE_TYPE;
