import View3D from "../View3D";
import { CommandBatchStats } from "../../../commandEncoderManager/CommandEncoderManager";
/**
 * [KO] 뷰포트의 크기와 위치를 나타내는 인터페이스
 * [EN] Interface representing the size and position of the viewport
 */
interface ViewportSize {
    /**
     * [KO] 뷰포트의 x 좌표 (픽셀 단위 또는 백분율 문자열)
     * [EN] Viewport x coordinate (in pixels or percentage string)
     */
    x: number | string;
    /**
     * [KO] 뷰포트의 y 좌표 (픽셀 단위 또는 백분율 문자열)
     * [EN] Viewport y coordinate (in pixels or percentage string)
     */
    y: number | string;
    /**
     * [KO] 뷰포트의 가로 너비 (픽셀 단위 또는 백분율 문자열)
     * [EN] Viewport width (in pixels or percentage string)
     */
    width: number | string;
    /**
     * [KO] 뷰포트의 세로 높이 (픽셀 단위 또는 백분율 문자열)
     * [EN] Viewport height (in pixels or percentage string)
     */
    height: number | string;
    /**
     * [KO] 뷰포트의 실제 픽셀 좌표를 나타내는 배열 ([x, y, width, height])
     * [EN] Array representing the actual pixel coordinates of the viewport ([x, y, width, height])
     */
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
    /**
     * [KO] 이 뷰에 대해 거리 컬링이 활성화되어 있는지 여부
     * [EN] Whether distance culling is enabled for this view
     */
    useDistanceCulling: boolean;
    /**
     * [KO] 컬링 계산에 사용되는 거리의 제곱 값
     * [EN] Squared distance value used for culling calculations
     */
    cullingDistanceSquared: number;
    /**
     * [KO] 객체를 컬링하기 위한 거리 임계값
     * [EN] Distance threshold for culling objects
     */
    distanceCulling: number;
    /**
     * [KO] 렌더링 통계 결과 데이터 그룹
     * [EN] Group of rendering statistics results
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
     * [KO] 뷰 렌더링 시작을 표시하는 성능 타임스탬프 (ms)
     * [EN] Performance timestamp marking the start of rendering (ms)
     */
    viewRenderStartTime: number;
    /**
     * [KO] 렌더링 프레임의 현재 타임스탬프 (ms)
     * [EN] Current timestamp of the rendering frame (ms)
     */
    timestamp: number;
    /**
     * [KO] 이전 프레임의 타임스탬프 (ms)
     * [EN] Timestamp of the previous frame (ms)
     */
    prevTimestamp: number;
    /**
     * [KO] 이전 프레임으로부터 경과된 시간 (ms)
     * [EN] Elapsed time since the previous frame (ms)
     */
    elapsed: number;
    /**
     * [KO] 뷰 렌더링 준비에 소요된 시간 (밀리초)
     * [EN] Time taken for view render preparation (ms)
     */
    viewRenderCPURecordingTime: number;
    /**
     * [KO] 현재 프레임 인덱스 (누적 렌더링 횟수)
     * [EN] Current frame index (accumulated rendering count)
     */
    frameIndex: number;
    /**
     * [KO] 현재 프레임의 절대 시간 (초)
     * [EN] Absolute time of the current frame (seconds)
     */
    time: number;
    /**
     * [KO] 프레임 간 경과 시간 (초)
     * [EN] Elapsed time between frames (seconds)
     */
    deltaTime: number;
    /**
     * [KO] sin(time)의 계산된 값
     * [EN] Calculated value of sin(time)
     */
    sinTime: number;
    /**
     * [KO] 물리 엔진 등에 사용될 고정 타임스텝 업데이트가 필요한 횟수
     * [EN] Number of fixed timestep updates needed for physics engine etc.
     */
    numFixedSteps: number;
    /**
     * [KO] 고정 타임스텝의 간격 (초)
     * [EN] Fixed timestep interval (seconds)
     */
    fixedStepDeltaTime: number;
    /**
     * [KO] 현재 뷰포트 크기 및 위치 정보
     * [EN] Current viewport size and position information
     */
    viewportSize: ViewportSize;
    /**
     * [KO] 뷰 인덱스
     * [EN] View index
     */
    viewIndex: number;
    /**
     * [KO] 더블 버퍼링용 스왑 버퍼 인덱스
     * [EN] Swap buffer index for double buffering
     */
    swapBufferIndex: number;
    /**
     * [KO] 렌더 텍스처가 사용하는 비디오 메모리 양 (바이트 단위)
     * [EN] Amount of video memory used by render textures (in bytes)
     */
    usedVideoMemory: number;
    /**
     * [KO] 현재 사용 중인 GPU 렌더 패스 인코더
     * [EN] Current GPU render pass encoder in use
     */
    currentRenderPassEncoder: GPURenderPassEncoder;
    /**
     * [KO] 컬링을 위한 프러스텀 평면 배열
     * [EN] Frustum planes array for culling
     */
    frustumPlanes: number[][];
    /**
     * [KO] 머티리얼로부터 변경된 버텍스 유니폼의 맵
     * [EN] Map of vertex uniforms changed from materials
     */
    dirtyVertexUniformFromMaterial: {};
    /**
     * [KO] 렌더링 레이어별 번들 리스트 그룹
     * [EN] Group of bundle lists for each rendering layer
     */
    renderBundleResults: {
        bundleListAlphaLayer: GPURenderBundle[];
        bundleListTransparentLayer: GPURenderBundle[];
        bundleListParticleLayer: GPURenderBundle[];
        bundleListRender2PathLayer: GPURenderBundle[];
        bundleListBasicList: GPURenderBundle[];
    };
    /**
     * [KO] 처리할 스킨 메시 목록
     * [EN] List of skin meshes to process
     */
    skinList: any[];
    /**
     * [KO] 처리할 애니메이션 목록
     * [EN] List of animations to process
     */
    animationList: any[];
    /**
     * [KO] 씬이 2D 모드인지 여부
     * [EN] Whether the scene is in 2D mode
     */
    isScene2DMode: boolean;
    /**
     * [KO] 커맨드 배치 통계 정보
     * [EN] Command batch statistics info
     */
    commandBatchStats: CommandBatchStats | null;
    /**
     * [KO] 새로운 RenderViewStateData 인스턴스를 생성합니다.
     * [EN] Creates a new RenderViewStateData instance.
     *
     * @param view -
     * [KO] 이 상태 데이터가 연결될 View3D 인스턴스
     * [EN] View3D instance this state data will link to
     */
    constructor(view: View3D);
    /**
     * [KO] 연결된 View3D 인스턴스를 가져옵니다.
     * [EN] Returns the connected View3D instance.
     *
     * @readonly
     */
    get view(): View3D;
    /**
     * [KO] 새로운 프레임을 위해 렌더 상태 데이터를 초기화합니다.
     * [EN] Resets render state data for a new frame.
     *
     * [KO] 이 메서드는 모든 카운터를 초기화하고, 레이어 배열을 비우며, 현재 렌더링 패스를 위한 GPU 리소스를 설정합니다. 또한 비디오 메모리 사용량을 계산하고 뷰 설정에 따라 컬링 매개변수를 구성합니다.
     * [EN] This method resets all counters, clears layer arrays, and configures GPU resources for the current rendering pass. It also calculates video memory usage and configures culling parameters according to view settings.
     *
     * @throws
     * [KO] 잘못된 매개변수가 제공되거나 필수 뷰 속성이 없는 경우, 혹은 텍스처 크기 계산이 실패한 경우 에러가 발생합니다.
     * [EN] Throws an error if invalid parameters are provided, required view properties are missing, or texture size calculation fails.
     */
    reset(): void;
}
export default RenderViewStateData;
