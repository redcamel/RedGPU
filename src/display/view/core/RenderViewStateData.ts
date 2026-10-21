import Camera2D from "../../../camera/camera/Camera2D";
import View3D from "../View3D";
import {CommandBatchStats} from "../../../commandEncoderManager/CommandEncoderManager";
import GBUFFER_TYPE from "./GBUFFER_TYPE";
import {computeFrustumPlanesFromPVMatrixFlat} from "../../../math/computeFrustumPlanes";

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
class RenderViewStateData {
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
    renderResults = {
        num3DGroups: 0,
        num3DObjects: 0,
        numDrawCalls: 0,
        numDirtyPipelines: 0,
        numInstances: 0,
        numTriangles: 0,
        numPoints: 0
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
    prevTimestamp: number = 0;
    /**
     * [KO] 이전 프레임으로부터 경과된 시간 (ms)
     * [EN] Elapsed time since the previous frame (ms)
     */
    elapsed: number = 0;
    /**
     * [KO] 뷰 렌더링 CPU 기록에 소요된 시간 (ms)
     * [EN] Time taken for view render CPU recording (ms)
     */
    viewRenderCPURecordingTime: number;
    /**
     * [KO] 현재 누적 렌더링 프레임 인덱스
     * [EN] Current accumulated rendering frame index
     */
    frameIndex: number = 0;
    /**
     * [KO] 인터리빙(분산) 컬링 처리를 위한 카메라 및 뷰포트 상태 추적 정보
     * [EN] Camera and viewport state tracking information for interleaved culling
     */
    interleavedCullingInfo = {
        prevCameraX: 0,
        prevCameraY: 0,
        prevCameraZ: 0,
        prevCameraRotX: 0,
        prevCameraRotY: 0,
        prevCameraRotZ: 0,
        forceCullingCheck: false,
        interleavedCullingCheckFrameIndex: 0,
        projectionScale: 0,
        prevViewportWidth: 0,
        prevViewportHeight: 0
    };
    /**
     * [KO] 현재 프레임의 누적 시간 (초)
     * [EN] Accumulated time of the current frame (seconds)
     */
    time: number = 0;
    /**
     * [KO] 프레임 간 경과 시간 (초)
     * [EN] Elapsed time between frames (seconds)
     */
    deltaTime: number = 0;
    /**
     * [KO] `Math.sin(time)` 계산값
     * [EN] Calculated value of `Math.sin(time)`
     */
    sinTime: number = 0;
    /**
     * [KO] 현재 프레임에 실행할 고정 타임스텝 업데이트 횟수
     * [EN] Number of fixed timestep updates to execute in the current frame
     */
    numFixedSteps: number = 0;
    /**
     * [KO] 고정 타임스텝 간격 (초)
     * [EN] Fixed timestep interval (seconds)
     */
    fixedStepDeltaTime: number = 1 / 60;

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
    swapBufferIndex: number = 1;
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
    readonly frustumPlanesFlat: Float32Array = new Float32Array(24);
    /**
     * [KO] 4개 캐스케이드 통합 1차원 평탄 섀도우 프러스텀 평면 버퍼 (`Float32Array(96)`)
     * [EN] 1D flattened cascade shadow frustum planes buffer for 4 cascades (`Float32Array(96)`)
     */
    readonly cascadeShadowFrustumPlanesFlat: Float32Array = new Float32Array(96);
    /**
     * [KO] 캐스케이드별 24-float 서브어레이 뷰 캐시 배열
     * [EN] Per-cascade 24-float subarray view cache array
     */
    readonly cascadeShadowFrustumPlanesByCascade: Float32Array[] = [
        this.cascadeShadowFrustumPlanesFlat.subarray(0, 24),
        this.cascadeShadowFrustumPlanesFlat.subarray(24, 48),
        this.cascadeShadowFrustumPlanesFlat.subarray(48, 72),
        this.cascadeShadowFrustumPlanesFlat.subarray(72, 96)
    ];
    /**
     * [KO] 캐스케이드별 최대 분할 깊이 배열
     * [EN] Maximum split depth array per cascade
     */
    readonly cascadeSplitDepths: Float32Array = new Float32Array(4);
    /**
     * [KO] 현재 활성화된 캐스케이드 수 (`0` ~ `4`)
     * [EN] Currently active cascade count (`0` to `4`)
     */
    activeCascadeCount: number = 0;
    /**
     * [KO] 재질로부터 변경된 버텍스 유니폼 상태 맵
     * [EN] Map of vertex uniform states dirtied by materials
     */
    dirtyVertexUniformFromMaterial = {};
    #lastCascadePVFlat: Float32Array = new Float32Array(64);
    #hasInitializedShadowFrustum: boolean = false;

    /**
     * [KO] 렌더링 레이어별 렌더 번들 목록
     * [EN] Render bundle lists categorized by rendering layer
     */
    renderBundleResults = {
        bundleListAlphaLayer: [] as GPURenderBundle[],
        bundleListTransparentLayer: [] as GPURenderBundle[],
        bundleListParticleLayer: [] as GPURenderBundle[],
        bundleListRender2PathLayer: [] as GPURenderBundle[],
        bundleListBasicList: [] as GPURenderBundle[]
    };

    /**
     * [KO] 프레임 내 처리할 스킨 메시 목록
     * [EN] List of skin meshes to process in the frame
     */
    skinList = [];
    /**
     * [KO] 프레임 내 처리할 애니메이션 목록
     * [EN] List of animations to process in the frame
     */
    animationList = [];

    /**
     * [KO] 현재 씬이 2D 카메라 모드인지 여부
     * [EN] Whether the current scene is in 2D camera mode
     */
    isScene2DMode: boolean = false;
    /**
     * [KO] 커맨드 배치 실행 통계 정보
     * [EN] Command batch execution statistics information
     */
    commandBatchStats: CommandBatchStats | null = null;
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
    constructor(view: View3D) {
        this.view = view;
    }

    /**
     * [KO] 새 프레임 렌더링을 위해 통계 카운터, 레이어 번들 목록, 시간 및 컬링 상태를 초기화합니다.
     * [EN] Resets statistics counters, layer bundle lists, time, and culling states for a new frame.
     *
     * @throws
     * [KO] 연결된 뷰나 필수 렌더 텍스처가 유효하지 않거나 비디오 메모리 크기 계산에 실패한 경우 에러가 발생합니다.
     * [EN] Throws an error if the linked view or required render textures are invalid, or if video memory size calculation fails.
     */
    reset() {
        if (!this.view) {
            throw new Error('Invalid parameters provided');
        }
        const view = this.view;
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
        const {renderBundleResults} = this;
        renderBundleResults.bundleListAlphaLayer.length = 0;
        renderBundleResults.bundleListTransparentLayer.length = 0;
        renderBundleResults.bundleListParticleLayer.length = 0;
        renderBundleResults.bundleListRender2PathLayer.length = 0;
        renderBundleResults.bundleListBasicList.length = 0;
        this.skinList.length = 0;
        this.animationList.length = 0;
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
        this.frustumPlanesFlat.set(view.frustumPlanesFlat);
        this.#updateInterleavedCullingInfo(view);
        this.#updateShadowFrustumPlanes(view);
    }

    #updateShadowFrustumPlanes(view: View3D): void {
        const shadowManager = view.scene?.shadowManager;
        const dirShadow = shadowManager?.directionalShadowManager;
        if (!dirShadow || !dirShadow.cascadeCount) {
            this.activeCascadeCount = 0;
            return;
        }

        if (view.pixelRectObject.width && view.pixelRectObject.height) {
            dirShadow.calculateCSMMatrices(view);
        }

        const cascadeCount = Math.min(dirShadow.cascadeCount, 4);
        this.activeCascadeCount = cascadeCount;
        const cascadePV = dirShadow.cascadeProjectionViewMatrices;
        const splitDepths = dirShadow.cascadeSplitDepths;

        const isCameraStill = !this.interleavedCullingInfo.forceCullingCheck;
        let isDirty = !this.#hasInitializedShadowFrustum || !isCameraStill;

        if (!isDirty) {
            const lastFlat = this.#lastCascadePVFlat;
            outer: for (let c = 0; c < cascadeCount; c++) {
                if (this.cascadeSplitDepths[c] !== (splitDepths[c] ?? 200.0)) {
                    isDirty = true;
                    break;
                }
                const pv = cascadePV[c];
                if (pv) {
                    const baseIdx = c * 16;
                    for (let i = 0; i < 16; i++) {
                        if (lastFlat[baseIdx + i] !== pv[i]) {
                            isDirty = true;
                            break outer;
                        }
                    }
                }
            }
        }

        if (isDirty) {
            const lastFlat = this.#lastCascadePVFlat;
            for (let c = 0; c < cascadeCount; c++) {
                const pv = cascadePV[c];
                this.cascadeSplitDepths[c] = splitDepths[c] ?? 200.0;
                if (pv) {
                    lastFlat.set(pv, c * 16);
                    computeFrustumPlanesFromPVMatrixFlat(pv, this.cascadeShadowFrustumPlanesByCascade[c]);
                }
            }
            this.#hasInitializedShadowFrustum = true;
        }
    }

    #updateInterleavedCullingInfo(view: View3D) {
        const info = this.interleavedCullingInfo;
        info.interleavedCullingCheckFrameIndex = this.frameIndex % 4;

        const camera = view.rawCamera as any;
        if (camera) {
            const cx = camera.x || 0;
            const cy = camera.y || 0;
            const cz = camera.z || 0;
            const rx = camera.rotationX || 0;
            const ry = camera.rotationY || 0;
            const rz = camera.rotationZ || 0;

            const dx = cx - info.prevCameraX;
            const dy = cy - info.prevCameraY;
            const dz = cz - info.prevCameraZ;
            const drx = rx - info.prevCameraRotX;
            const dry = ry - info.prevCameraRotY;
            const drz = rz - info.prevCameraRotZ;

            const moveDistanceSq = dx * dx + dy * dy + dz * dz;
            const rotateDistanceSq = drx * drx + dry * dry + drz * drz;

            const MOVE_THRESHOLD_FAST = 0.05 * 0.05;
            const ROTATE_THRESHOLD_FAST = 0.01 * 0.01;
            const STILL_THRESHOLD = 0.00001;

            const cw = view.pixelRectObject.width;
            const ch = view.pixelRectObject.height;
            const isViewportResized = (info.prevViewportWidth !== 0 && (info.prevViewportWidth !== cw || info.prevViewportHeight !== ch));

            if (isViewportResized || moveDistanceSq > MOVE_THRESHOLD_FAST || rotateDistanceSq > ROTATE_THRESHOLD_FAST) {
                info.forceCullingCheck = true;
            } else if (moveDistanceSq < STILL_THRESHOLD && rotateDistanceSq < STILL_THRESHOLD) {
                info.forceCullingCheck = false;
            } else {
                info.forceCullingCheck = false;
            }

            info.prevCameraX = cx;
            info.prevCameraY = cy;
            info.prevCameraZ = cz;
            info.prevCameraRotX = rx;
            info.prevCameraRotY = ry;
            info.prevCameraRotZ = rz;
            info.prevViewportWidth = cw;
            info.prevViewportHeight = ch;
        } else {
            info.forceCullingCheck = false;
        }
    }

    #calcTimeInfo() {
        const now = performance.now();
        this.viewRenderCPURecordingTime = 0;
        this.frameIndex++;
        const physicsElapsed = now - this.prevTimestamp;
        const fpsInterval = 1000 / 60;

        this.numFixedSteps = Math.min(Math.floor(physicsElapsed / fpsInterval), 10);

        if (this.numFixedSteps > 0) {
            this.prevTimestamp += this.numFixedSteps * fpsInterval;
        }

        this.elapsed = now - this.timestamp;
        this.time = now / 1000;
        this.deltaTime = this.elapsed / 1000;
        this.sinTime = Math.sin(this.time);
        this.timestamp = now;
        this.viewRenderStartTime = now;
    }
}

export default RenderViewStateData;
