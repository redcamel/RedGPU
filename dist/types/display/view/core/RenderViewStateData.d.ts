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
 * [KO] 3D 뷰의 렌더링 상태 데이터를 관리하고 추적하는 클래스입니다.
 * [EN] Class that manages and tracks the rendering state data of a 3D view.
 *
 * [KO] 이 클래스는 렌더링 프로세스 중에 필요한 모든 상태 정보를 캡슐화합니다. 컬링 설정, 성능 메트릭, GPU 리소스, 레이어 관리 등을 포함합니다.
 * [EN] This class encapsulates all state information needed during the rendering process. Includes culling settings, performance metrics, GPU resources, layer management, etc.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 데이터 구조체입니다.<br/>직접 인스턴스를 생성하여 사용하지 마십시오.
 * [EN] This class is a data structure used internally by the system.<br/>Do not create or use instances directly.
 * :::
 *
 * @category Core
 */
declare class RenderViewStateData {
    #private;
    /** [KO] 이 뷰에 대해 거리 컬링이 활성화되어 있는지 여부 [EN] Whether distance culling is enabled for this view */
    useDistanceCulling: boolean;
    /** [KO] 컬링 계산에 사용되는 거리의 제곱 값 [EN] Squared distance value used for culling calculations */
    cullingDistanceSquared: number;
    /** [KO] 객체를 컬링하기 위한 거리 임계값 [EN] Distance threshold for culling objects */
    distanceCulling: number;
    /** [KO] 현재 프레임에서 렌더링된 3D 그룹의 수 [EN] Number of 3D groups rendered in the current frame */
    num3DGroups: number;
    /** [KO] 현재 프레임에서 렌더링된 3D 객체의 수 [EN] Number of 3D objects rendered in the current frame */
    num3DObjects: number;
    /** [KO] 현재 프레임에서 발행된 드로우 콜의 수 [EN] Number of draw calls issued in the current frame */
    numDrawCalls: number;
    /** [KO] 업데이트가 필요했던 더티 파이프라인의 수 [EN] Number of dirty pipelines that needed updating */
    numDirtyPipelines: number;
    /** [KO] 렌더링된 총 인스턴스 수 [EN] Total number of instances rendered */
    numInstances: number;
    /** [KO] 렌더링된 총 삼각형 수 [EN] Total number of triangles rendered */
    numTriangles: number;
    /** [KO] 렌더링된 총 포인트 수 [EN] Total number of points rendered */
    numPoints: number;
    /** [KO] 렌더링 시작을 표시하는 성능 타임스탬프 (ms) [EN] Performance timestamp marking the start of rendering (ms) */
    startTime: number;
    /** [KO] 렌더링 프레임의 현재 타임스탬프 (ms) [EN] Current timestamp of the rendering frame (ms) */
    timestamp: number;
    /** [KO] 이전 프레임의 타임스탬프 (ms) [EN] Timestamp of the previous frame (ms) */
    prevTimestamp: number;
    /** [KO] 뷰 렌더링에 소요된 시간 (밀리초) [EN] Time taken for view rendering (ms) */
    viewRenderTime: number;
    /** [KO] 현재 프레임 인덱스 (누적 렌더링 횟수) [EN] Current frame index (accumulated rendering count) */
    frameIndex: number;
    /** [KO] 현재 프레임의 절대 시간 (초) [EN] Absolute time of the current frame (seconds) */
    time: number;
    /** [KO] 프레임 간 경과 시간 (초) [EN] Elapsed time between frames (seconds) */
    deltaTime: number;
    /** [KO] sin(time)의 계산된 값 [EN] Calculated value of sin(time) */
    sinTime: number;
    /** [KO] 현재 뷰포트 크기 및 위치 정보 [EN] Current viewport size and position information */
    viewportSize: ViewportSize;
    viewIndex: number;
    swapBufferIndex: number;
    /** [KO] 렌더 텍스처가 사용하는 비디오 메모리 양 (바이트) [EN] Amount of video memory used by render textures (bytes) */
    usedVideoMemory: number;
    /** [KO] 현재 사용 중인 GPU 렌더 패스 인코더 [EN] Current GPU render pass encoder in use */
    currentRenderPassEncoder: GPURenderPassEncoder;
    /** [KO] 컬링을 위한 프러스텀 평면 배열 [EN] Frustum planes array for culling */
    frustumPlanes: number[][];
    /** [KO] 최적화를 위해 이전에 사용한 버텍스 GPU 버퍼 [EN] Previously used vertex GPU buffer for optimization */
    prevVertexGpuBuffer: GPUBuffer;
    /** [KO] 최적화를 위해 이전에 사용한 프래그먼트 유니폼 바인드 그룹 [EN] Previously used fragment uniform bind group for optimization */
    prevFragmentUniformBindGroup: GPUBindGroup;
    /** [KO] 머티리얼로부터 변경된 버텍스 유니폼의 맵 [EN] Map of vertex uniforms changed from materials */
    dirtyVertexUniformFromMaterial: {};
    /** [KO] 알파 렌더링 레이어의 객체 배열 [EN] Array of objects in the alpha rendering layer */
    bundleListAlphaLayer: any[];
    /** [KO] 투명 렌더링 레이어의 객체 배열 [EN] Array of objects in the transparent rendering layer */
    bundleListTransparentLayer: any[];
    /** [KO] 파티클 렌더링 레이어의 객체 배열 [EN] Array of objects in the particle rendering layer */
    bundleListParticleLayer: any[];
    /** [KO] 2D 패스 렌더링 레이어의 객체 배열 [EN] Array of objects in the 2D pass rendering layer */
    bundleListRender2PathLayer: any[];
    /** [KO] 처리할 스킨 메시 목록 [EN] List of skin meshes to process */
    skinList: any[];
    /** [KO] 처리할 애니메이션 목록 [EN] List of animations to process */
    animationList: any[];
    /** [KO] 효율적인 렌더링을 위한 렌더 번들 목록 [EN] List of render bundles for efficient rendering */
    bundleListBasicList: any[];
    /** [KO] 씬이 2D 모드인지 여부 [EN] Whether the scene is in 2D mode */
    isScene2DMode: boolean;
    needResetRenderLayer: boolean;
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
