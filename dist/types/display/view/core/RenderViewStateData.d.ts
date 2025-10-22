import View3D from "../View3D";
/**
 * 뷰포트의 크기와 위치를 나타냅니다.
 *
 * @interface ViewportSize
 * @property {number | string} x - 뷰포트의 x 좌표
 * @property {number | string} y - 뷰포트의 y 좌표
 * @property {number | string} width - 뷰포트의 너비
 * @property {number | string} height - 뷰포트의 높이
 * @property {[number, number, number, number]} pixelRectArray - 뷰포트의 픽셀 좌표를 나타내는 배열 ([x, y, width, height])
 */
interface ViewportSize {
    x: number | string;
    y: number | string;
    width: number | string;
    height: number | string;
    pixelRectArray: [number, number, number, number];
}
/**
 * 3D 뷰의 렌더링 상태 데이터를 관리하고 추적합니다.
 *
 * 이 클래스는 렌더링 프로세스 중에 필요한 모든 상태 정보를 캡슐화합니다.
 * 컬링 설정, 성능 메트릭, GPU 리소스, 레이어 관리 등을 포함합니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 */
declare class RenderViewStateData {
    #private;
    /** 이 뷰에 대해 거리 컬링이 활성화되어 있는지 여부 */
    useDistanceCulling: boolean;
    /** 컬링 계산에 사용되는 거리의 제곱 값 */
    cullingDistanceSquared: number;
    /** 객체를 컬링하기 위한 거리 임계값 */
    distanceCulling: number;
    /** 현재 프레임에서 렌더링된 3D 그룹의 수 */
    num3DGroups: number;
    /** 현재 프레임에서 렌더링된 3D 객체의 수 */
    num3DObjects: number;
    /** 현재 프레임에서 발행된 드로우 콜의 수 */
    numDrawCalls: number;
    /** 업데이트가 필요했던 더티 파이프라인의 수 */
    numDirtyPipelines: number;
    /** 렌더링된 총 인스턴스 수 */
    numInstances: number;
    /** 렌더링된 총 삼각형 수 */
    numTriangles: number;
    /** 렌더링된 총 포인트 수 */
    numPoints: number;
    /** 뷰 렌더링에 소요된 시간 (밀리초) */
    viewRenderTime: number;
    /** 현재 뷰포트 크기 및 위치 정보 */
    viewportSize: ViewportSize;
    viewIndex: number;
    /** 렌더 텍스처가 사용하는 비디오 메모리 양 (바이트) */
    usedVideoMemory: number;
    /** 현재 사용 중인 GPU 렌더 패스 인코더 */
    currentRenderPassEncoder: GPURenderPassEncoder;
    /** 렌더링 프레임의 현재 타임스탬프 */
    timestamp: number;
    /** 컬링을 위한 프러스텀 평면 배열, 프러스텀 컬링이 비활성화된 경우 null */
    frustumPlanes: number[][];
    /** 최적화를 위해 이전에 사용한 버텍스 GPU 버퍼 */
    prevVertexGpuBuffer: GPUBuffer;
    /** 최적화를 위해 이전에 사용한 프래그먼트 유니폼 바인드 그룹 */
    prevFragmentUniformBindGroup: GPUBindGroup;
    /** 머티리얼로부터 변경된 버텍스 유니폼의 맵 */
    dirtyVertexUniformFromMaterial: {};
    /** 알파 렌더링 레이어의 객체 배열 */
    bundleListAlphaLayer: any[];
    /** 투명 렌더링 레이어의 객체 배열 */
    bundleListTransparentLayer: any[];
    /** 파티클 렌더링 레이어의 객체 배열 */
    bundleListParticleLayer: any[];
    /** 2D 패스 렌더링 레이어의 객체 배열 */
    bundleListRender2PathLayer: any[];
    /** 처리할 스킨 메시 목록 */
    skinList: any[];
    /** 처리할 애니메이션 목록 */
    animationList: any[];
    /** 효율적인 렌더링을 위한 렌더 번들 목록 */
    bundleListBasicList: any[];
    /** 렌더링 시작을 표시하는 성능 타임스탬프 */
    startTime: number;
    /** 씬이 2D 모드인지 여부 */
    isScene2DMode: boolean;
    /**
     * 새로운 RenderViewStateData 인스턴스를 생성합니다.
     *
     * @param {View3D} view - 이 상태 데이터가 연결될 View3D 인스턴스
     */
    constructor(view: View3D);
    /**
     * 연결된 View3D 인스턴스를 가져옵니다.
     *
     * @readonly
     * @returns {View3D} View3D 인스턴스
     */
    get view(): View3D;
    /**
     * 새로운 프레임을 위해 렌더 상태 데이터를 초기화합니다.
     *
     * 이 메서드는 모든 카운터를 초기화하고, 레이어 배열을 비우며,
     * 현재 렌더링 패스를 위한 GPU 리소스를 설정합니다.
     * 또한 비디오 메모리 사용량을 계산하고 뷰 설정에 따라 컬링 매개변수를 구성합니다.
     *
     * @param {GPURenderPassEncoder} viewRenderPassEncoder - 현재 프레임의 렌더 패스 인코더
     * @param {number} time - 프레임의 현재 타임스탬프
     *
     * @throws {Error} 잘못된 매개변수가 제공되거나 필수 뷰 속성이 없는 경우
     * @throws {Error} 텍스처 크기 계산이 실패한 경우
     */
    reset(viewRenderPassEncoder: GPURenderPassEncoder, time: number): void;
}
export default RenderViewStateData;
