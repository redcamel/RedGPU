import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import PerspectiveCamera from "../camera/camera/PerspectiveCamera";
import View3D from "../display/view/View3D";
import validatePositiveNumberRange from "../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../runtimeChecker/validateFunc/validateUintRange";
import calculateTextureByteSize from "../utils/texture/calculateTextureByteSize";
import keepLog from "../utils/keepLog";
import {mat4, vec3} from "gl-matrix";

const g_invVM = mat4.create();
const g_lightDir = vec3.create();
const g_lightPos = vec3.create();
const g_frustumCenter = vec3.create();
const g_snappedCenter = vec3.create();
const g_localCenter = vec3.create();
const g_up = vec3.create();
const g_p = vec3.create();
const g_zero = vec3.fromValues(0, 0, 0);

const g_lightRotMat = mat4.create();
const g_invLightRotMat = mat4.create();
const g_tempLightP = mat4.create();
const g_tempLightV = mat4.create();
const g_cascadeSplits = new Float32Array(5);

/**
 * [KO] 직사광(Directional Light)의 CSM (Cascaded Shadow Maps) 뎁스 텍스처 배열과 관련 설정을 총괄 관리하는 클래스입니다.
 * [EN] Class that manages CSM (Cascaded Shadow Maps) depth texture arrays and related settings for directional lights.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Shadow
 */
class DirectionalShadowManager {
    #shadowDepthTextureSize: number = 2048;
    #bias: number = 0.00015;
    #strength: number = 0.9;
    #maxShadowDistance: number = 200;
    #cascadeCount: number = 4;
    #pcssLightSize: number = 1.0;
    #targetNearTexelSize: number = 0.01;

    #shadowDepthTexture: GPUTexture;
    #shadowDepthTextureView: GPUTextureView;
    #cascadeLayerViews: GPUTextureView[] = [];
    #shadowDepthTextureEmpty: GPUTexture;
    #shadowDepthTextureViewEmpty: GPUTextureView;

    #redGPUContext: RedGPUContext;
    #castingList: (Mesh | InstancingMesh)[] = [];
    #videoMemorySize: number = 0;

    #cascadeSplitDepths: Float32Array = new Float32Array(4);
    #cascadeBoundingSpheres: Float32Array = new Float32Array(16); // 4 cascades * [center.x, center.y, center.z, radius]
    #cascadeProjectionViewMatrices: mat4[] = [mat4.create(), mat4.create(), mat4.create(), mat4.create()];

    #casterBoundingCenter: Float32Array = new Float32Array(3);
    #casterBoundingRadiusSq: number = -1;
    #hasCastingListCycleStarted: boolean = false;

    /**
     * [KO] 각 캐스케이드의 월드 공간 외접구 정보 [center.x, center.y, center.z, radius] * 4 (길이 16 Float32Array)를 반환합니다.
     * [EN] Returns the world-space bounding sphere info [center.x, center.y, center.z, radius] * 4 (length 16 Float32Array) for each cascade.
     */
    get cascadeBoundingSpheres(): Float32Array {
        return this.#cascadeBoundingSpheres;
    }

    /**
     * [KO] 캐스터들의 그림자 유효 영역 중심 좌표(vec3)를 반환합니다.
     * [EN] Returns the center coordinates (vec3) of the casters' effective shadow volume.
     */
    get casterBoundingCenter(): Float32Array {
        return this.#casterBoundingCenter;
    }

    /**
     * [KO] 캐스터들의 그림자 유효 영역 반경 제곱값을 반환합니다. (0.0: 캐스터 없음, <0.0: 전역 캐스터 존재로 가드 우회, >0.0: 유효 반경 제곱)
     * [EN] Returns the squared radius of the casters' effective shadow volume (0.0: no casters, <0.0: global casters bypass, >0.0: valid squared radius).
     */
    get casterBoundingRadiusSq(): number {
        return this.#casterBoundingRadiusSq;
    }

    /**
     * [KO] 현재 섀도우 맵이 사용하는 비디오 메모리 크기(Bytes)를 반환합니다.
     * [EN] Returns the video memory size (Bytes) used by the current shadow map.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 그림자를 생성할 대상 객체 리스트를 반환합니다.
     * [EN] Returns the list of objects that will cast shadows.
     *
     * @returns
     * [KO] 섀도우 캐스팅 대상 배열
     * [EN] Array of shadow casting objects
     */
    get castingList(): (Mesh | InstancingMesh)[] {
        return this.#castingList;
    }

    /**
     * [KO] 전체 2D Texture Array 형태의 섀도우 뎁스 텍스처 뷰를 반환합니다. (메인 렌더링 셰이더 바인딩용)
     * [EN] Returns the shadow depth texture view in 2D Texture Array dimension. (For main rendering shader binding)
     *
     * @returns
     * [KO] 2D Array 섀도우 뎁스 GPUTextureView
     * [EN] 2D Array Shadow depth GPUTextureView
     */
    get shadowDepthTextureView(): GPUTextureView {
        return this.#shadowDepthTextureView;
    }

    /**
     * [KO] 그림자가 없는 상태를 위한 빈(1x1x4) 2D Array 뎁스 텍스처 뷰를 반환합니다.
     * [EN] Returns an empty (1x1x4) 2D Array depth texture view for non-shadow states.
     *
     * @returns
     * [KO] 빈 뎁스 GPUTextureView
     * [EN] Empty depth GPUTextureView
     */
    get shadowDepthTextureViewEmpty(): GPUTextureView {
        return this.#shadowDepthTextureViewEmpty;
    }

    /**
     * [KO] 그림자 바이어스(Bias) 값을 설정합니다. (0.0 ~ 1.0)
     * [EN] Sets the shadow bias value. (0.0 to 1.0)
     *
     * @param value -
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    set bias(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#bias = value;
    }

    /**
     * [KO] 그림자 바이어스(Bias) 값을 반환합니다.
     * [EN] Returns the shadow bias value.
     *
     * @returns
     * [KO] 바이어스 값
     * [EN] Bias value
     */
    get bias(): number {
        return this.#bias;
    }

    /**
     * [KO] 그림자의 세기(Strength) 값을 설정합니다. (0.0 ~ 1.0)
     * [EN] Sets the shadow strength value. (0.0 to 1.0)
     *
     * @param value -
     * [KO] 세기 값
     * [EN] Strength value
     */
    set strength(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#strength = value;
    }

    /**
     * [KO] 그림자의 세기(Strength) 값을 반환합니다.
     * [EN] Returns the shadow strength value.
     *
     * @returns
     * [KO] 세기 값 (0.0 ~ 1.0)
     * [EN] Strength value (0.0 to 1.0)
     */
    get strength(): number {
        return this.#strength;
    }

    /**
     * [KO] CSM(Cascaded Shadow Maps)의 캐스케이드 분할 수(1 ~ 4, 기본값: 3)를 반환합니다.
     * [EN] Returns the number of cascade splits for CSM (Cascaded Shadow Maps) (1 to 4, default: 3).
     *
     * @returns
     * [KO] 캐스케이드 개수
     * [EN] Cascade count
     */
    get cascadeCount(): number {
        return this.#cascadeCount;
    }

    /**
     * [KO] 직사광 그림자가 도달할 수 있는 최대 가시거리(언리얼 엔진 표준 기본값: 200m)를 반환합니다.
     * [EN] Returns the maximum shadow distance (Unreal Engine standard default: 200m).
     */
    get maxShadowDistance(): number {
        return this.#maxShadowDistance;
    }

    /**
     * [KO] 직사광 그림자가 도달할 수 있는 최대 가시거리(언리얼 엔진 표준 기본값: 200m)를 설정합니다.
     * [EN] Sets the maximum shadow distance (Unreal Engine standard default: 200m).
     *
     * @param value - 최대 그림자 가시거리 (m)
     */
    set maxShadowDistance(value: number) {
        validatePositiveNumberRange(value, 1);
        this.#maxShadowDistance = value;
    }

    /**
     * [KO] CSM(Cascaded Shadow Maps)의 캐스케이드 분할 수(1 ~ 4)를 설정합니다.
     * [EN] Sets the number of cascade splits for CSM (Cascaded Shadow Maps) (1 to 4).
     *
     * @param value -
     * [KO] 캐스케이드 개수 (1 ~ 4)
     * [EN] Cascade count (1 to 4)
     */
    set cascadeCount(value: number) {
        validateUintRange(value, 1, 4);
        this.#cascadeCount = value;
    }

    /**
     * [KO] 카메라 근경(Cascade 0)에서 보장할 물리적 목표 텍셀 크기(단위: m, 기본값: 0.01m = 1cm)를 반환합니다.
     * [EN] Returns the target physical texel size (in meters, default: 0.01m = 1cm) guaranteed at near camera range (Cascade 0).
     *
     * @returns
     * [KO] 목표 텍셀 크기 (m)
     * [EN] Target texel size in meters
     */
    get targetNearTexelSize(): number {
        return this.#targetNearTexelSize;
    }

    /**
     * [KO] 카메라 근경(Cascade 0)에서 보장할 물리적 목표 텍셀 크기(단위: m, 0.001 ~ 0.1)를 설정합니다.
     * [EN] Sets the target physical texel size (in meters, 0.001 to 0.1) guaranteed at near camera range (Cascade 0).
     *
     * @param value -
     * [KO] 목표 텍셀 크기 (m)
     * [EN] Target texel size in meters
     */
    set targetNearTexelSize(value: number) {
        validatePositiveNumberRange(value, 0.001, 0.1);
        this.#targetNearTexelSize = value;
    }

    /**
     * [KO] 각 캐스케이드의 분할 깊이(Split Depth) 배열(길이 4)을 반환합니다.
     * [EN] Returns the array of split depths for each cascade (length 4).
     *
     * @returns
     * [KO] 분할 깊이 Float32Array
     * [EN] Split depth Float32Array
     */
    get cascadeSplitDepths(): Float32Array {
        return this.#cascadeSplitDepths;
    }

    /**
     * [KO] 각 캐스케이드의 투영-뷰(Projection-View) 행렬 배열(길이 4)을 반환합니다.
     * [EN] Returns the array of projection-view matrices for each cascade (length 4).
     *
     * @returns
     * [KO] 투영-뷰 행렬 배열
     * [EN] Array of projection-view matrices
     */
    get cascadeProjectionViewMatrices(): mat4[] {
        return this.#cascadeProjectionViewMatrices;
    }

    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도, 기본값: 2048)를 반환합니다.
     * [EN] Returns the size (resolution, default: 2048) of the shadow depth texture.
     *
     * @returns
     * [KO] 해상도 값
     * [EN] Resolution value
     */
    get shadowDepthTextureSize(): number {
        return this.#shadowDepthTextureSize;
    }

    /**
     * [KO] 섀도우 뎁스 텍스처의 크기(해상도, 기본값: 2048)를 설정합니다. (정수)
     * [EN] Sets the size (resolution, default: 2048) of the shadow depth texture. (Integer)
     *
     * @param value -
     * [KO] 해상도 값 (기본값: 2048)
     * [EN] Resolution value (default: 2048)
     */
    set shadowDepthTextureSize(value: number) {
        validateUintRange(value, 1);
        this.#shadowDepthTextureSize = value;
    }

    /**
     * [KO] PCSS 광원의 가상 크기(Light Radius / Angular Size, 기본값: 2.0)를 반환합니다.
     * [EN] Returns the virtual light size for PCSS (Light Radius / Angular Size, default: 2.0).
     */
    get pcssLightSize(): number {
        return this.#pcssLightSize;
    }

    /**
     * [KO] PCSS 광원의 가상 크기(Light Radius / Angular Size, 기본값: 2.0)를 설정합니다. (0.0 이상)
     * [EN] Sets the virtual light size for PCSS (Light Radius / Angular Size, default: 2.0). (0.0 or greater)
     */
    set pcssLightSize(value: number) {
        validatePositiveNumberRange(value, 0);
        this.#pcssLightSize = value;
    }

    /**
     * [KO] 특정 캐스케이드 레이어의 단일 2D 뎁스 텍스처 뷰를 반환합니다. (캐스케이드 렌더 패스 Attachment용)
     * [EN] Returns a single 2D depth texture view for a specific cascade layer. (For cascade render pass attachment)
     *
     * @param index - 캐스케이드 인덱스 (0 ~ 3)
     * @returns 해당 레이어의 2D GPUTextureView
     */
    getCascadeLayerView(index: number): GPUTextureView {
        return this.#cascadeLayerViews[index] || this.#shadowDepthTextureViewEmpty;
    }

    /**
     * [KO] 섀도우 캐스팅 대상 리스트를 초기화합니다.
     * [EN] Resets the list of shadow casting objects.
     */
    resetCastingList() {
        this.#castingList.length = 0;
        this.#hasCastingListCycleStarted = true;
    }

    /**
     * [KO] Auto-CSM 물리 기반 텍셀 밀도 역산 모델 및 절두체 8정점 완전 포섭 대칭 외접구(Symmetric Bounding Sphere)
     *      알고리즘을 적용하여 CSM 행렬과 분할 깊이를 직접(In-Place) 계산합니다.
     * [EN] In-place calculates jitter-free high-precision CSM matrices and split depths directly into member buffers
     *      using the Auto-CSM physical texel density inversion model and symmetric bounding sphere algorithm.
     *
     * @param view - 대상 View3D
     */
    calculateCSMMatrices(view: View3D): void {
        const rawCamera = view.rawCamera;
        const lightManager = view.scene?.lightManager;
        const directionalLights = lightManager?.directionalLights;

        const cascadeCount = Math.min(4, Math.max(1, this.#cascadeCount || 3));
        const maxDist = this.#maxShadowDistance ?? 200.0;
        const textureSize = this.#shadowDepthTextureSize || 2048;

        const splitDepths = this.#cascadeSplitDepths;
        const cascadePV = this.#cascadeProjectionViewMatrices;

        if (!directionalLights?.length || !(rawCamera instanceof PerspectiveCamera)) {
            splitDepths.fill(1000.0);
            this.#casterBoundingRadiusSq = 0.0;
            return;
        }

        const camViewMatrix = rawCamera.viewMatrix;
        if (!mat4.invert(g_invVM, camViewMatrix)) {
            splitDepths.fill(1000.0);
            this.#casterBoundingRadiusSq = 0.0;
            return;
        }

        const shadowFar = Math.min(rawCamera.farClipping, maxDist);
        const near = rawCamera.nearClipping;
        const fov = (Math.PI / 180) * rawCamera.fieldOfView;
        const aspect = view.aspect;

        const light = directionalLights[0];
        vec3.set(g_lightDir, light.direction[0], light.direction[1], light.direction[2]);
        vec3.normalize(g_lightDir, g_lightDir);

        // 🌟 [캐스터 바운딩 볼륨 연산] 0-Tap 조기 탈출 가드용 투영 구(Bounding Sphere) 계산
        this.#updateCasterBoundingVolume(view, g_lightDir);

        vec3.set(g_up, 0, 1, 0);
        if (Math.abs(vec3.dot(g_lightDir, g_up)) > 0.99) {
            vec3.set(g_up, 0, 0, 1);
        }

        // 원점 기준 고정 라이트 방향 행렬 (스냅 계산용)
        mat4.lookAt(g_lightRotMat, g_zero, g_lightDir, g_up);
        mat4.invert(g_invLightRotMat, g_lightRotMat);

        // 🌟 1. [Auto-CSM: 물리 기반 텍셀 밀도 역산 모델 및 등비수열(Geometric Progression) 분할]
        // 카메라 화각(FOV), 종횡비(Aspect), 섀도우 해상도(textureSize)로부터 목표 텍셀 크기(targetNearTexelSize, 기본 1cm)를 역산하여
        // 전체 가시거리(maxShadowDistance)의 증감에 구애받지 않고 근경(Cascade 0)의 1cm 핀샤프 해상도를 상시 보장합니다.
        g_cascadeSplits[0] = near;

        const tanHalfFov = Math.tan(fov * 0.5);
        const k = tanHalfFov * Math.sqrt(1.0 + aspect * aspect);
        const kSafe = Math.max(k, 0.001);

        if (cascadeCount === 1) {
            g_cascadeSplits[1] = shadowFar;
            splitDepths[0] = shadowFar;
            for (let i = 1; i < 4; i++) {
                splitDepths[i] = shadowFar * 2.0;
            }
        } else {
            // 4대 안전 가드를 포함한 Cascade 0 거리 (d0) 역산
            const maxD0 = shadowFar / cascadeCount;
            const minD0 = Math.min(Math.max(near + 0.5, 15.0), maxD0 * 0.5);
            const calculatedD0 = (textureSize * this.#targetNearTexelSize) / (2.0 * kSafe);
            const d0 = Math.min(Math.max(calculatedD0, minD0), maxD0);

            g_cascadeSplits[1] = d0;
            splitDepths[0] = d0;

            // 잔여 구간 [d0, shadowFar]을 등비수열(Geometric Progression)로 분할
            const remainingCount = cascadeCount - 1;
            const ratio = Math.pow(shadowFar / d0, 1.0 / remainingCount);

            for (let j = 1; j <= remainingCount; j++) {
                const cascadeIndex = j + 1;
                const dist = (j === remainingCount) ? shadowFar : d0 * Math.pow(ratio, j);
                g_cascadeSplits[cascadeIndex] = dist;
                if (cascadeIndex - 1 < 4) {
                    splitDepths[cascadeIndex - 1] = dist;
                }
            }

            for (let i = cascadeCount; i < 4; i++) {
                splitDepths[i] = shadowFar * 2.0;
            }
        }

        // 2. 각 캐스케이드별 절두체 8정점 완전 포섭 대칭 외접구(Symmetric Bounding Sphere) 및 텍셀 스냅핑
        for (let c = 0; c < cascadeCount; c++) {
            const subNear = g_cascadeSplits[c];
            const subFar = g_cascadeSplits[c + 1];

            // 🌟 [수학적 정석] 절두체 슬라이스 8정점 완전 포섭 대칭 외접구 (Frustum Clipping 원천 차단)
            const cz = (subFar + subNear) * 0.5;
            const halfDepth = (subFar - subNear) * 0.5;
            const farDiag = subFar * k;
            let sphereRadius = Math.sqrt(halfDepth * halfDepth + farDiag * farDiag);

            // 🌟 [화면 모서리 클리핑 방지] 텍셀 스냅핑(최대 1.414 텍셀) + 16-Tap PCF 필터 반경(3.8 텍셀) 여유 마진 (6텍셀)
            const rawWorldUnitsPerTexel = (sphereRadius * 2.0) / textureSize;
            sphereRadius += rawWorldUnitsPerTexel * 6.0;

            // 🌟 [텍셀 크기 정수배 스냅] 물리 텍셀 크기 단위로 올림 정렬하여 텍스처 해상도 변경 시에도 1:1 완벽 정렬
            sphereRadius = Math.ceil(sphereRadius / rawWorldUnitsPerTexel) * rawWorldUnitsPerTexel;

            // 카메라 시선 방향 로컬 중심 (0, 0, -cz)을 월드 좌표로 변환
            vec3.set(g_localCenter, 0, 0, -cz);
            vec3.transformMat4(g_frustumCenter, g_localCenter, g_invVM);

            // 🌟 [원점 뷰 공간 기준 텍셀 스냅핑] 카메라 이동 시 서브픽셀 떨림 완벽 제거
            const worldUnitsPerTexel = (sphereRadius * 2.0) / textureSize;
            vec3.transformMat4(g_p, g_frustumCenter, g_lightRotMat);
            g_p[0] = Math.floor(g_p[0] / worldUnitsPerTexel) * worldUnitsPerTexel;
            g_p[1] = Math.floor(g_p[1] / worldUnitsPerTexel) * worldUnitsPerTexel;
            vec3.transformMat4(g_snappedCenter, g_p, g_invLightRotMat);

            // 라이트 위치: 스냅된 중심에서 광원 반대 방향으로 안전하게 후퇴
            const lightDistance = Math.max(sphereRadius * 2.0 + 50.0, 100.0);
            vec3.scaleAndAdd(g_lightPos, g_snappedCenter, g_lightDir, -lightDistance);

            // 최종 라이트 뷰 행렬 생성 (Zero-GC 재사용 스크래치 행렬)
            mat4.lookAt(g_tempLightV, g_lightPos, g_snappedCenter, g_up);

            // 직교 투영 행렬: 완전 대칭 박스
            const left = -sphereRadius;
            const right = sphereRadius;
            const bottom = -sphereRadius;
            const top = sphereRadius;
            const nearPlane = 0.1;
            const farPlane = lightDistance + sphereRadius * 2.0;

            mat4.orthoZO(g_tempLightP, left, right, bottom, top, nearPlane, farPlane);

            mat4.multiply(cascadePV[c], g_tempLightP, g_tempLightV);

            // 🌟 [캐스케이드별 Bounding Sphere 정보 기록 (Zero-GC)]
            const sphereIdx = c * 4;
            this.#cascadeBoundingSpheres[sphereIdx] = g_snappedCenter[0];
            this.#cascadeBoundingSpheres[sphereIdx + 1] = g_snappedCenter[1];
            this.#cascadeBoundingSpheres[sphereIdx + 2] = g_snappedCenter[2];
            this.#cascadeBoundingSpheres[sphereIdx + 3] = sphereRadius;
        }

        // 미사용 캐스케이드 슬롯은 마지막 캐스케이드 행렬 및 외접구로 복제
        for (let c = cascadeCount; c < 4; c++) {
            mat4.copy(cascadePV[c], cascadePV[cascadeCount - 1]);
            const srcIdx = (cascadeCount - 1) * 4;
            const dstIdx = c * 4;
            this.#cascadeBoundingSpheres[dstIdx] = this.#cascadeBoundingSpheres[srcIdx];
            this.#cascadeBoundingSpheres[dstIdx + 1] = this.#cascadeBoundingSpheres[srcIdx + 1];
            this.#cascadeBoundingSpheres[dstIdx + 2] = this.#cascadeBoundingSpheres[srcIdx + 2];
            this.#cascadeBoundingSpheres[dstIdx + 3] = this.#cascadeBoundingSpheres[srcIdx + 3];
        }
    }

    /**
     * [KO] 사용 중인 GPU 리소스를 해제합니다.
     * [EN] Releases GPU resources in use.
     */
    destroy() {
        const {commandEncoderManager} = this.#redGPUContext || {};
        if (this.#shadowDepthTexture) {
            commandEncoderManager?.addDeferredDestroy(this.#shadowDepthTexture);
            this.#shadowDepthTexture = null;
            this.#shadowDepthTextureView = null;
            this.#cascadeLayerViews = [];
        }
        if (this.#shadowDepthTextureEmpty) {
            commandEncoderManager?.addDeferredDestroy(this.#shadowDepthTextureEmpty);
            this.#shadowDepthTextureEmpty = null;
            this.#shadowDepthTextureViewEmpty = null;
        }
        this.#hasCastingListCycleStarted = false;
        keepLog('🧹 DirectionalShadowManager destroy 완료');
    }

    /**
     * [KO] 내부 상태를 업데이트합니다. (주로 해상도 변경 체크)
     * [EN] Updates internal state. (Mainly checks for resolution changes)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    update(redGPUContext: RedGPUContext): boolean {
        this.#redGPUContext = redGPUContext;
        return this.#checkDepthTexture();
    }

    /**
     * [KO] 그림자를 드리우는 캐스터 메쉬들의 바운딩 AABB를 종합하여
     *      그림자가 도달할 수 있는 지면 유효 영역(Bounding Sphere)을 산출하고
     *      0-Tap 조기 탈출 가드용 센터 및 반경 제곱값을 업데이트합니다.
     * [EN] Computes the effective ground shadow bounding sphere from casters' AABBs
     *      and updates the center and squared radius for 0-Tap early exit culling.
     *
     * @param view - 대상 View3D
     * @param lightDir - 정규화된 직사광 방향 벡터 (광원을 향하는 방향)
     */
    #updateCasterBoundingVolume(view: View3D, lightDir: vec3): void {
        // 1. 전역 분산 캐스터(식생/잔디) 활성화 여부 확인
        const landscape = view.scene?.landscape;
        if (landscape) {
            const foliageManager = landscape.foliageManager;
            if (foliageManager?.enabled) {
                const types = foliageManager.types;
                const len = types.length;
                for (let i = 0; i < len; i++) {
                    if (types[i].castShadow) {
                        this.#casterBoundingRadiusSq = -1.0;
                        return;
                    }
                }
            }
            const grassManager = landscape.grassManager;
            if (grassManager?.enabled) {
                const types = grassManager.types;
                const len = types.length;
                for (let i = 0; i < len; i++) {
                    if (types[i].castShadow) {
                        this.#casterBoundingRadiusSq = -1.0;
                        return;
                    }
                }
            }
        }

        // 2. 캐스팅 목록 확인 (캐스터가 0개면 그림자 연산 불필요)
        const castingList = this.#castingList;
        const count = castingList.length;
        if (count === 0) {
            this.#casterBoundingRadiusSq = this.#hasCastingListCycleStarted ? 0.0 : -1.0;
            return;
        }

        // 3. Zero-GC 캐스터 통합 바운딩 박스(AABB) 산출
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;

        for (let i = 0; i < count; i++) {
            const aabb = castingList[i].boundingAABB;
            if (aabb.minX < minX) minX = aabb.minX;
            if (aabb.maxX > maxX) maxX = aabb.maxX;
            if (aabb.minY < minY) minY = aabb.minY;
            if (aabb.maxY > maxY) maxY = aabb.maxY;
            if (aabb.minZ < minZ) minZ = aabb.minZ;
            if (aabb.maxZ > maxZ) maxZ = aabb.maxZ;
        }

        const cx = (minX + maxX) * 0.5;
        const cy = (minY + maxY) * 0.5;
        const cz = (minZ + maxZ) * 0.5;

        const dx = (maxX - minX) * 0.5;
        const dy = (maxY - minY) * 0.5;
        const dz = (maxZ - minZ) * 0.5;
        const casterRadius = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // 4. 방향광의 그림자 투영 연장(Shadow Projection Extension) 계산
        // lightDir는 광선이 나아가는 방향(Light Ray Forward)이므로 그림자도 동일한 방향으로 드리워집니다.
        const shadowDirX = lightDir[0];
        const shadowDirZ = lightDir[2];
        const horizLen = Math.sqrt(shadowDirX * shadowDirX + shadowDirZ * shadowDirZ);

        const clampedLy = Math.max(Math.abs(lightDir[1]), 0.15);
        const maxDist = this.#maxShadowDistance ?? 200.0;
        const shadowExtension = Math.min((2.0 * casterRadius) / clampedLy, maxDist);

        let normShadowDirX = 0;
        let normShadowDirZ = 0;
        if (horizLen > 0.0001) {
            const invLen = 1.0 / horizLen;
            normShadowDirX = shadowDirX * invLen;
            normShadowDirZ = shadowDirZ * invLen;
        }

        // 5. 그림자 볼륨 중심 이동 및 안전 여유 반경(고저차 대응 15m 안전 마진) 설정
        const halfExt = shadowExtension * 0.5;
        this.#casterBoundingCenter[0] = cx + normShadowDirX * halfExt;
        this.#casterBoundingCenter[1] = cy;
        this.#casterBoundingCenter[2] = cz + normShadowDirZ * halfExt;

        const shadowRadius = casterRadius + halfExt + 15.0;
        this.#casterBoundingRadiusSq = shadowRadius * shadowRadius;
    }

    /** 비디오 메모리 계산 */
    #calcVideoMemory() {
        const texture = this.#shadowDepthTexture;
        if (!texture) return 0;
        this.#videoMemorySize = calculateTextureByteSize(texture);
    }

    /** 뎁스 텍스처 변경 여부 확인 및 재생성 */
    #checkDepthTexture(): boolean {
        if (this.#shadowDepthTexture?.width !== this.#shadowDepthTextureSize) {
            this.destroy();
            this.#createDepthTexture();
            this.#calcVideoMemory();
            return true;
        }
        return false;
    }

    /** 빈 뎁스 텍스처(1x1x4 2D Array) 생성 */
    #createEmptyDepthTexture(gpuDevice: GPUDevice) {
        this.#shadowDepthTextureEmpty = gpuDevice.createTexture({
            size: [1, 1, 4],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `DirectionalShadowManager_EmptyDepthTexture_1x1x4_${Date.now()}`,
        });
        this.#shadowDepthTextureViewEmpty = this.#shadowDepthTextureEmpty.createView({
            dimension: '2d-array',
            label: this.#shadowDepthTextureEmpty.label
        });
    }

    /** 실제 CSM 섀도우 뎁스 텍스처 어레이(4 레이어) 생성 */
    #createDepthTexture() {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
        this.#shadowDepthTexture = resourceManager.createManagedTexture({
            size: [this.#shadowDepthTextureSize, this.#shadowDepthTextureSize, 4],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            format: 'depth32float',
            label: `DirectionalShadowManager_CSM_Array_${this.#shadowDepthTextureSize}x${this.#shadowDepthTextureSize}_4Layers_${Date.now()}`,
        });
        this.#shadowDepthTextureView = this.#shadowDepthTexture.createView({
            dimension: '2d-array',
            label: `${this.#shadowDepthTexture.label}_ArrayView`
        });

        this.#cascadeLayerViews.length = 0;
        for (let layerIndex = 0; layerIndex < 4; layerIndex++) {
            this.#cascadeLayerViews[layerIndex] = this.#shadowDepthTexture.createView({
                label: `${this.#shadowDepthTexture.label}_Layer_${layerIndex}`,
                dimension: '2d',
                baseArrayLayer: layerIndex,
                arrayLayerCount: 1
            });
        }

        if (!this.#shadowDepthTextureViewEmpty) this.#createEmptyDepthTexture(gpuDevice);
    }
}

Object.freeze(DirectionalShadowManager);
export default DirectionalShadowManager;
