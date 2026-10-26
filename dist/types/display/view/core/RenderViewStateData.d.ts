import View3D from "../View3D";
import { CommandBatchStats } from "../../../commandEncoderManager/CommandEncoderManager";
/**
 * [KO] 뷰포트의 크기와 위치를 정의하는 인터페이스입니다.
 * [EN] Interface defining the size and position of the viewport.
 *
 * @category Core
 */
interface ViewportSize {
    /**
     * [KO] 뷰포트의 X 좌표 (픽셀 또는 백분율 문자열)
     * [EN] Viewport X coordinate (pixels or percentage string)
     */
    x: number | string;
    /**
     * [KO] 뷰포트의 Y 좌표 (픽셀 또는 백분율 문자열)
     * [EN] Viewport Y coordinate (pixels or percentage string)
     */
    y: number | string;
    /**
     * [KO] 뷰포트의 너비 (픽셀 또는 백분율 문자열)
     * [EN] Viewport width (pixels or percentage string)
     */
    width: number | string;
    /**
     * [KO] 뷰포트의 높이 (픽셀 또는 백분율 문자열)
     * [EN] Viewport height (pixels or percentage string)
     */
    height: number | string;
    /**
     * [KO] 뷰포트의 물리 픽셀 영역 배열 (`[x, y, width, height]`)
     * [EN] Physical pixel rectangle array of the viewport (`[x, y, width, height]`)
     */
    pixelRectArray: [number, number, number, number];
}
/**
 * [KO] 3D 뷰의 프레임별 렌더링 상태, 컬링 정보 및 성능 통계를 관리하는 클래스입니다.
 * [EN] Class that manages per-frame rendering states, culling data, and performance statistics of a 3D view.
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
 * const renderViewStateData = view.renderViewStateData;
 * ```
 *
 * @category Core
 */
declare class RenderViewStateData {
    #private;
    /**
     * [KO] 거리 기반 컬링 활성화 여부
     * [EN] Whether distance-based culling is enabled
     */
    useDistanceCulling: boolean;
    /**
     * [KO] 거리 컬링 계산에 사용되는 임계 거리의 제곱값
     * [EN] Squared distance threshold used for distance culling calculations
     */
    cullingDistanceSquared: number;
    /**
     * [KO] 객체 컬링을 위한 거리 임계값
     * [EN] Distance threshold for culling objects
     */
    distanceCulling: number;
    /**
     * [KO] 현재 프레임의 렌더링 통계 결과
     * [EN] Rendering statistics results for the current frame
     */
    renderResults: {
        num3DGroups: number;
        num3DObjects: number;
        numDrawCalls: number;
        numDirtyPipelines: number;
        numInstances: number;
        numTriangles: number;
        numPoints: number;
    };
    /**
     * [KO] 뷰 렌더링 시작 시점의 성능 타임스탬프 (ms)
     * [EN] Performance timestamp at the start of view rendering (ms)
     */
    viewRenderStartTime: number;
    /**
     * [KO] 현재 프레임의 타임스탬프 (ms)
     * [EN] Timestamp of the current frame (ms)
     */
    timestamp: number;
    /**
     * [KO] 이전 물리 스텝 기준 타임스탬프 (ms)
     * [EN] Timestamp of the previous physics step (ms)
     */
    prevTimestamp: number;
    /**
     * [KO] 이전 프레임으로부터 경과된 시간 (ms)
     * [EN] Elapsed time since the previous frame (ms)
     */
    elapsed: number;
    /**
     * [KO] 뷰 렌더링 CPU 기록에 소요된 시간 (ms)
     * [EN] Time taken for view render CPU recording (ms)
     */
    viewRenderCPURecordingTime: number;
    /**
     * [KO] 현재 누적 렌더링 프레임 인덱스
     * [EN] Current accumulated rendering frame index
     */
    frameIndex: number;
    /**
     * [KO] 인터리빙(분산) 컬링 처리를 위한 카메라 및 뷰포트 상태 추적 정보
     * [EN] Camera and viewport state tracking information for interleaved culling
     */
    interleavedCullingInfo: {
        prevCameraX: number;
        prevCameraY: number;
        prevCameraZ: number;
        prevCameraRotX: number;
        prevCameraRotY: number;
        prevCameraRotZ: number;
        forceCullingCheck: boolean;
        interleavedCullingCheckFrameIndex: number;
        projectionScale: number;
        prevViewportWidth: number;
        prevViewportHeight: number;
    };
    /**
     * [KO] 현재 프레임의 누적 시간 (초)
     * [EN] Accumulated time of the current frame (seconds)
     */
    time: number;
    /**
     * [KO] 프레임 간 경과 시간 (초)
     * [EN] Elapsed time between frames (seconds)
     */
    deltaTime: number;
    /**
     * [KO] `Math.sin(time)` 계산값
     * [EN] Calculated value of `Math.sin(time)`
     */
    sinTime: number;
    /**
     * [KO] 현재 프레임에 실행할 고정 타임스텝 업데이트 횟수
     * [EN] Number of fixed timestep updates to execute in the current frame
     */
    numFixedSteps: number;
    /**
     * [KO] 고정 타임스텝 간격 (초)
     * [EN] Fixed timestep interval (seconds)
     */
    fixedStepDeltaTime: number;
    /**
     * [KO] 현재 뷰포트 크기 및 위치 정보
     * [EN] Current viewport size and position information
     */
    viewportSize: ViewportSize;
    /**
     * [KO] 컨텍스트 내 뷰 인덱스
     * [EN] View index within the context
     */
    viewIndex: number;
    /**
     * [KO] 더블 버퍼링용 스왑 버퍼 인덱스 (`0` 또는 `1`)
     * [EN] Swap buffer index for double buffering (`0` or `1`)
     */
    swapBufferIndex: number;
    /**
     * [KO] 뷰 관련 렌더 텍스처가 사용 중인 총 비디오 메모리 크기 (바이트)
     * [EN] Total video memory size used by view-related render textures (bytes)
     */
    usedVideoMemory: number;
    /**
     * [KO] 현재 활성화된 GPU 렌더 패스 인코더
     * [EN] Currently active GPU render pass encoder
     */
    currentRenderPassEncoder: GPURenderPassEncoder;
    /**
     * [KO] 프러스텀 컬링용 6개 평면 배열
     * [EN] Array of 6 planes for frustum culling
     */
    frustumPlanes: number[][];
    /**
     * [KO] GPU 업로드 및 고속 컬링용 1차원 평탄 프러스텀 평면 버퍼 (`Float32Array(24)`)
     * [EN] 1D flattened frustum planes buffer for GPU upload and fast culling (`Float32Array(24)`)
     */
    readonly frustumPlanesFlat: Float32Array;
    /**
     * [KO] 4개 캐스케이드 통합 1차원 평탄 섀도우 프러스텀 평면 버퍼 (`Float32Array(96)`)
     * [EN] 1D flattened cascade shadow frustum planes buffer for 4 cascades (`Float32Array(96)`)
     */
    readonly cascadeShadowFrustumPlanesFlat: Float32Array;
    /**
     * [KO] 캐스케이드별 24-float 서브어레이 뷰 캐시 배열
     * [EN] Per-cascade 24-float subarray view cache array
     */
    readonly cascadeShadowFrustumPlanesByCascade: Float32Array[];
    /**
     * [KO] 캐스케이드별 최대 분할 깊이 배열
     * [EN] Maximum split depth array per cascade
     */
    readonly cascadeSplitDepths: Float32Array;
    /**
     * [KO] 현재 활성화된 캐스케이드 수 (`0` ~ `4`)
     * [EN] Currently active cascade count (`0` to `4`)
     */
    activeCascadeCount: number;
    /**
     * [KO] 재질로부터 변경된 버텍스 유니폼 상태 맵
     * [EN] Map of vertex uniform states dirtied by materials
     */
    dirtyVertexUniformFromMaterial: {};
    /**
     * [KO] 렌더링 레이어별 렌더 번들 목록
     * [EN] Render bundle lists categorized by rendering layer
     */
    renderBundleResults: {
        bundleListAlphaLayer: GPURenderBundle[];
        bundleListTransparentLayer: GPURenderBundle[];
        bundleListParticleLayer: GPURenderBundle[];
        bundleListRender2PathLayer: GPURenderBundle[];
        bundleListBasicList: GPURenderBundle[];
    };
    /**
     * [KO] 프레임 내 처리할 스킨 메시 목록
     * [EN] List of skin meshes to process in the frame
     */
    skinList: any[];
    /**
     * [KO] 프레임 내 처리할 애니메이션 목록
     * [EN] List of animations to process in the frame
     */
    animationList: any[];
    /**
     * [KO] 현재 씬이 2D 카메라 모드인지 여부
     * [EN] Whether the current scene is in 2D camera mode
     */
    isScene2DMode: boolean;
    /**
     * [KO] 커맨드 배치 실행 통계 정보
     * [EN] Command batch execution statistics information
     */
    commandBatchStats: CommandBatchStats | null;
    /**
     * [KO] 연결된 View3D 인스턴스
     * [EN] Connected View3D instance
     */
    readonly view: View3D;
    /**
     * [KO] RenderViewStateData 인스턴스를 생성합니다.
     * [EN] Creates a RenderViewStateData instance.
     *
     * @param view -
     * [KO] 상태 데이터가 연결될 View3D 인스턴스
     * [EN] View3D instance to which this state data is linked
     */
    constructor(view: View3D);
    /**
     * [KO] 새 프레임 렌더링을 위해 통계 카운터, 레이어 번들 목록, 시간 및 컬링 상태를 초기화합니다.
     * [EN] Resets statistics counters, layer bundle lists, time, and culling states for a new frame.
     *
     * @throws
     * [KO] 연결된 뷰나 필수 렌더 텍스처가 유효하지 않거나 비디오 메모리 크기 계산에 실패한 경우 에러가 발생합니다.
     * [EN] Throws an error if the linked view or required render textures are invalid, or if video memory size calculation fails.
     */
    reset(): void;
}
export default RenderViewStateData;
