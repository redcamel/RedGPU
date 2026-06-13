import Camera2D from "../../../camera/camera/Camera2D";
import View3D from "../View3D";
import {CommandBatchStats} from "../../../commandEncoderManager/CommandEncoderManager";
import GBUFFER_TYPE from "./GBUFFER_TYPE";


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
class RenderViewStateData {
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
    renderResults = {
        num3DGroups: 0,
        num3DObjects: 0,
        numDrawCalls: 0,
        numDirtyPipelines: 0,
        numInstances: 0,
        numTriangles: 0,
        numPoints: 0
    };

    // Time related
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
    prevTimestamp: number = 0;
    /**
     * [KO] 이전 프레임으로부터 경과된 시간 (ms)
     * [EN] Elapsed time since the previous frame (ms)
     */
    elapsed: number = 0;
    /**
     * [KO] 뷰 렌더링 준비에 소요된 시간 (밀리초)
     * [EN] Time taken for view render preparation (ms)
     */
    viewRenderCPURecordingTime: number;
    /**
     * [KO] 현재 프레임 인덱스 (누적 렌더링 횟수)
     * [EN] Current frame index (accumulated rendering count)
     */
    frameIndex: number = 0;
    interleavedCullingInfo = {
        prevCameraX: 0,
        prevCameraY: 0,
        prevCameraZ: 0,
        prevCameraRotX: 0,
        prevCameraRotY: 0,
        prevCameraRotZ: 0,
        forceCullingCheck: false,
        skipCullingCheck: false,
        interleavedCullingCheckFrameIndex: 0,
        projectionScale: 0
    };
    /**
     * [KO] 현재 프레임의 절대 시간 (초)
     * [EN] Absolute time of the current frame (seconds)
     */
    time: number = 0;
    /**
     * [KO] 프레임 간 경과 시간 (초)
     * [EN] Elapsed time between frames (seconds)
     */
    deltaTime: number = 0;
    /**
     * [KO] sin(time)의 계산된 값
     * [EN] Calculated value of sin(time)
     */
    sinTime: number = 0;
    /**
     * [KO] 물리 엔진 등에 사용될 고정 타임스텝 업데이트가 필요한 횟수
     * [EN] Number of fixed timestep updates needed for physics engine etc.
     */
    numFixedSteps: number = 0;
    /**
     * [KO] 고정 타임스텝의 간격 (초)
     * [EN] Fixed timestep interval (seconds)
     */
    fixedStepDeltaTime: number = 1 / 60;

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
    swapBufferIndex: number = 1;
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
    dirtyVertexUniformFromMaterial = {};

    /**
     * [KO] 렌더링 레이어별 번들 리스트 그룹
     * [EN] Group of bundle lists for each rendering layer
     */
    renderBundleResults = {
        bundleListAlphaLayer: [] as GPURenderBundle[],
        bundleListTransparentLayer: [] as GPURenderBundle[],
        bundleListParticleLayer: [] as GPURenderBundle[],
        bundleListRender2PathLayer: [] as GPURenderBundle[],
        bundleListBasicList: [] as GPURenderBundle[]
    };

    /**
     * [KO] 처리할 스킨 메시 목록
     * [EN] List of skin meshes to process
     */
    skinList = [];
    /**
     * [KO] 처리할 애니메이션 목록
     * [EN] List of animations to process
     */
    animationList = [];

    /**
     * [KO] 씬이 2D 모드인지 여부
     * [EN] Whether the scene is in 2D mode
     */
    isScene2DMode: boolean = false;
    /**
     * [KO] 커맨드 배치 통계 정보
     * [EN] Command batch statistics info
     */
    commandBatchStats: CommandBatchStats | null = null;
    /**
     * [KO] 연결된 View3D 인스턴스 (private)
     * [EN] Connected View3D instance (private)
     */
    readonly #view: View3D;


    /**
     * [KO] 새로운 RenderViewStateData 인스턴스를 생성합니다.
     * [EN] Creates a new RenderViewStateData instance.
     *
     * @param view -
     * [KO] 이 상태 데이터가 연결될 View3D 인스턴스
     * [EN] View3D instance this state data will link to
     */
    constructor(view: View3D) {
        this.#view = view;
    }

    /**
     * [KO] 연결된 View3D 인스턴스를 가져옵니다.
     * [EN] Returns the connected View3D instance.
     *
     * @readonly
     */
    get view(): View3D {
        return this.#view;
    }

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
    reset() {
        if (!this.#view) {
            throw new Error('Invalid parameters provided');
        }
        const view = this.#view;
        const {
            useFrustumCulling,
            frustumPlanes,
            scene,
            postEffectManager,
            pickingManager,
            viewRenderTextureManager
        } = view;
        this.swapBufferIndex = this.swapBufferIndex ? 0 : 1
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const depthTexture = viewRenderTextureManager.depthTexture;
        const {shadowManager} = scene;
        if (!gBufferColorTexture || !depthTexture) {
            throw new Error('Invalid view properties');
        }
        this.useDistanceCulling = view.useDistanceCulling;
        this.distanceCulling = view.distanceCulling;
        this.cullingDistanceSquared = this.distanceCulling * this.distanceCulling;
        this.interleavedCullingInfo.projectionScale = view.projectionMatrix[5];

        const {renderResults} = this;
        renderResults.num3DGroups = 0;
        renderResults.num3DObjects = 0;
        renderResults.numDrawCalls = 0;
        renderResults.numInstances = 0;
        renderResults.numDirtyPipelines = 0;
        renderResults.numTriangles = 0;
        renderResults.numPoints = 0;
        this.#calcTimeInfo();
        this.dirtyVertexUniformFromMaterial = {};
        //
        const {renderBundleResults} = this;
        renderBundleResults.bundleListAlphaLayer.length = 0;
        renderBundleResults.bundleListTransparentLayer.length = 0;
        renderBundleResults.bundleListParticleLayer.length = 0;
        renderBundleResults.bundleListRender2PathLayer.length = 0;
        renderBundleResults.bundleListBasicList.length = 0;
        //
        this.skinList.length = 0;
        this.animationList.length = 0;
        //
        this.isScene2DMode = view.camera instanceof Camera2D;
        this.viewIndex = view.redGPUContext.getViewIndex(view);

        this.viewportSize = {
            x: view.x,
            y: view.y,
            width: view.width,
            height: view.height,
            pixelRectArray: view.pixelRectArray
        };
        try {
            this.usedVideoMemory = viewRenderTextureManager.videoMemorySize
                + shadowManager.directionalShadowManager.videoMemorySize
                + postEffectManager.videoMemorySize
                + pickingManager.videoMemorySize;
        } catch (e) {
            throw new Error('Could not calculate texture size: ' + e.message);
        }
        this.frustumPlanes = useFrustumCulling ? frustumPlanes : null;
        this.#updateInterleavedCullingInfo(view);
    }

    #updateInterleavedCullingInfo(view: View3D) {
        const info = this.interleavedCullingInfo;
        // [KO] 현재 프레임 인덱스에 따라 분산 검사할 인터리빙 프레임 인덱스를 계산합니다.
        // [EN] Calculate the interleaved frame index to distribute culling checks based on the current frame index.
        info.interleavedCullingCheckFrameIndex = this.frameIndex % 4;
        
        const camera = view.rawCamera as any;
        if (camera) {
            // [KO] 카메라의 현재 위치와 회전 정보를 추출합니다. (속성이 없을 경우 기본값 0을 적용)
            // [EN] Extract current camera position and rotation values. (Fallback to 0 if properties are undefined)
            const cx = camera.x || 0;
            const cy = camera.y || 0;
            const cz = camera.z || 0;
            const rx = camera.rotationX || 0;
            const ry = camera.rotationY || 0;
            const rz = camera.rotationZ || 0;

            // [KO] 이전 프레임 상태와 비교한 이동 및 회전 변화량을 산출합니다.
            // [EN] Calculate the delta values of position and rotation relative to the previous frame state.
            const dx = cx - info.prevCameraX;
            const dy = cy - info.prevCameraY;
            const dz = cz - info.prevCameraZ;
            const drx = rx - info.prevCameraRotX;
            const dry = ry - info.prevCameraRotY;
            const drz = rz - info.prevCameraRotZ;

            // [KO] 연산 속도 향상을 위해 제곱 거리(Squared Distance) 형태로 계산합니다.
            // [EN] Calculate squared values to optimize calculation performance by avoiding Math.sqrt.
            const moveDistanceSq = dx * dx + dy * dy + dz * dz;
            const rotateDistanceSq = drx * drx + dry * dry + drz * drz;

            // [KO] 카메라 움직임 정도를 판정할 임계값을 설정합니다.
            // [EN] Define threshold parameters to classify camera movements.
            const MOVE_THRESHOLD_FAST = 0.05 * 0.05; // [KO] 고속 이동 임계값 [EN] Fast translation threshold
            const ROTATE_THRESHOLD_FAST = 0.01 * 0.01; // [KO] 고속 회전 임계값 [EN] Fast rotation threshold
            const STILL_THRESHOLD = 0.00001; // [KO] 정지 상태 임계값 [EN] Still state threshold

            if (moveDistanceSq > MOVE_THRESHOLD_FAST || rotateDistanceSq > ROTATE_THRESHOLD_FAST) {
                // [KO] 카메라가 빠르게 움직이는 경우: 팝인 현상을 줄이기 위해 전체 객체의 컬링을 강제 매 프레임 재검사합니다.
                // [EN] Camera moving fast: Force culling checks every frame for all meshes to prevent pop-in issues.
                info.forceCullingCheck = true;
                info.skipCullingCheck = false;
            } else if (moveDistanceSq < STILL_THRESHOLD && rotateDistanceSq < STILL_THRESHOLD) {
                // [KO] 카메라가 정지된 경우: 컬링 검사를 생략하고 이전 프레임의 결과를 재사용하여 CPU 자원을 절약합니다.
                // [EN] Camera is still: Skip recalculating culling, reuse cached culling results to save CPU overhead.
                info.forceCullingCheck = false;
                info.skipCullingCheck = true;
            } else {
                // [KO] 일반적인 속도의 움직임인 경우: 분산(인터리빙) 컬링 검사를 적용합니다.
                // [EN] Normal camera movement: Apply standard interleaved culling distribution.
                info.forceCullingCheck = false;
                info.skipCullingCheck = false;
            }

            // [KO] 다음 프레임 비교를 위해 카메라 상태를 갱신합니다.
            // [EN] Save current camera state for comparison in the next frame.
            info.prevCameraX = cx;
            info.prevCameraY = cy;
            info.prevCameraZ = cz;
            info.prevCameraRotX = rx;
            info.prevCameraRotY = ry;
            info.prevCameraRotZ = rz;
        } else {
            info.forceCullingCheck = false;
            info.skipCullingCheck = false;
        }
    }

    /**
     * [KO] 시간 관련 정보(frameIndex, elapsed, time, deltaTime, sinTime, timestamp)를 계산하고 업데이트합니다.
     * [EN] Calculates and updates time-related information (frameIndex, elapsed, time, deltaTime, sinTime, timestamp).
     * @private
     */
    #calcTimeInfo() {
        const now = performance.now();
        this.viewRenderCPURecordingTime = 0;
        this.frameIndex++;
        // [KO] 이전 물리 업데이트 시점으로부터의 누적 경과 시간 계산
        // [EN] Calculate accumulated elapsed time since the last physics update point
        const physicsElapsed = now - this.prevTimestamp;
        const fpsInterval = 1000 / 60; // 60FPS (~16.67ms)

        // [KO] 이번 프레임에 실행해야 할 고정 스텝 수 계산 (최대 10회 제한으로 폭주 방지)
        // [EN] Calculate number of fixed steps to run this frame (capped at 10 to prevent spiral of death)
        this.numFixedSteps = Math.min(Math.floor(physicsElapsed / fpsInterval), 10);

        if (this.numFixedSteps > 0) {
            // [KO] 실행할 스텝만큼만 시간 축적기(prevTimestamp) 전진
            // [EN] Advance the time accumulator (prevTimestamp) only by the steps to be processed
            this.prevTimestamp += this.numFixedSteps * fpsInterval;
        }

        // [KO] 시각적 애니메이션 등에 사용할 실제 프레임 간 경과 시간 계산
        // [EN] Calculate actual frame-to-frame elapsed time for visual animations etc.
        this.elapsed = now - this.timestamp;
        this.time = now / 1000;
        this.deltaTime = this.elapsed / 1000;
        this.sinTime = Math.sin(this.time);
        this.timestamp = now;
        this.viewRenderStartTime = now;
    }
}

export default RenderViewStateData;
