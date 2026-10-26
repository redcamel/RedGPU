import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../../display/mesh/Mesh";
import AnimationData_GLTF from "../AnimationData_GLTF";
/**
 * [KO] glTF 애니메이션의 개별 채널(회전, 이동, 스케일, 모프 가중치) 트랙 데이터와 보간 상태를 관리하는 클래스입니다.
 * [EN] Class that manages individual channel (rotation, translation, scale, morph weights) track data and interpolation states for glTF animations.
 *
 * ::: warning
 * [KO] 이 클래스는 GLTFLoader에 의해 내부적으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is internally created by GLTFLoader.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category GLTF
 */
declare class AniTrack_GLTF {
    #private;
    /**
     * [KO] 마지막으로 탐색된 이전 키프레임 인덱스
     * [EN] Last searched previous keyframe index
     */
    lastPrevIdx: number;
    /**
     * [KO] 마지막으로 탐색된 다음 키프레임 인덱스
     * [EN] Last searched next keyframe index
     */
    lastNextIdx: number;
    /**
     * [KO] 마지막으로 계산된 보간 비율 값
     * [EN] Last calculated interpolation ratio value
     */
    lastInterpolationValue: number;
    /**
     * [KO] 키프레임 시간(`input`) 애니메이션 데이터
     * [EN] Keyframe time (`input`) animation data
     */
    timeAnimationInfo: AnimationData_GLTF;
    /**
     * [KO] 키프레임 변환값(`output`) 애니메이션 데이터
     * [EN] Keyframe transform value (`output`) animation data
     */
    aniDataAnimationInfo: AnimationData_GLTF;
    /**
     * [KO] 모프 가중치 애니메이션이 적용될 대상 메쉬 목록
     * [EN] List of target meshes to which morph weight animation is applied
     */
    weightMeshes: Mesh[];
    /**
     * [KO] 애니메이션이 적용될 대상 메쉬
     * [EN] Target mesh to which the animation is applied
     */
    animationTargetMesh: Mesh;
    /**
     * [KO] 쿼터니언 보간 연산 캐시 테이블
     * [EN] Quaternion interpolation calculation cache table
     */
    cacheTable: {};
    /**
     * [KO] 애니메이션 대상 속성 키 (`'rotation'`, `'translation'`, `'scale'`, `'weights'`)
     * [EN] Animation target property key (`'rotation'`, `'translation'`, `'scale'`, `'weights'`)
     */
    key: any;
    /**
     * [KO] 정수형으로 인코딩된 애니메이션 키 타입 (1: 회전, 2: 이동, 3: 스케일, 4: 모프 가중치)
     * [EN] Integer-encoded animation key type (1: rotation, 2: translation, 3: scale, 4: morph weights)
     */
    keyType: number;
    /**
     * [KO] 보간 방식 문자열 (`'CUBICSPLINE'`, `'STEP'`, `'LINEAR'`)
     * [EN] Interpolation mode string (`'CUBICSPLINE'`, `'STEP'`, `'LINEAR'`)
     */
    interpolation: "CUBICSPLINE" | "STEP" | "LINEAR" | string;
    /**
     * [KO] 정수형으로 인코딩된 보간 방식 (0: STEP, 1: LINEAR, 2: CUBICSPLINE)
     * [EN] Integer-encoded interpolation mode (0: STEP, 1: LINEAR, 2: CUBICSPLINE)
     */
    interpolationType: number;
    /**
     * [KO] 마지막으로 조회된 캐시 키
     * [EN] Last looked-up cache key
     */
    lastCachedKey: number;
    /**
     * [KO] 마지막으로 조회된 캐시 데이터
     * [EN] Last looked-up cache data
     */
    lastCachedItem: Float32Array | null;
    /**
     * [KO] AniTrack_GLTF 인스턴스를 생성합니다.
     * [EN] Creates an AniTrack_GLTF instance.
     *
     * @param key -
     * [KO] 애니메이션 속성 키 (`'rotation'`, `'translation'`, `'scale'`, `'weights'`)
     * [EN] Animation property key (`'rotation'`, `'translation'`, `'scale'`, `'weights'`)
     * @param time -
     * [KO] 키프레임 시간 데이터
     * [EN] Keyframe time data
     * @param data -
     * [KO] 키프레임 변환값 데이터
     * [EN] Keyframe transform value data
     * @param interpolation -
     * [KO] 보간 방식 (`'STEP'`, `'LINEAR'`, `'CUBICSPLINE'`)
     * [EN] Interpolation mode (`'STEP'`, `'LINEAR'`, `'CUBICSPLINE'`)
     * @param targetMesh -
     * [KO] 애니메이션 대상 메쉬
     * [EN] Target mesh for animation
     * @param weightMeshes -
     * [KO] 모프 가중치 적용 대상 메쉬 배열
     * [EN] Array of target meshes for morph weight application
     */
    constructor(key: any, time: any, data: any, interpolation: any, targetMesh: Mesh, weightMeshes: any);
    /**
     * [KO] 컴퓨트 셰이더를 디스패치하여 대상 메쉬의 모프 타겟 가중치 변형을 계산합니다.
     * [EN] Dispatches the compute shader to calculate morph target weight deformation for the target mesh.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param computePassEncoder -
     * [KO] 컴퓨트 패스 인코더
     * [EN] Compute pass encoder
     * @param targetMesh -
     * [KO] 모프 변형을 적용할 대상 메쉬
     * [EN] Target mesh to apply morph deformation
     * @param interpolationValue -
     * [KO] 현재 키프레임 간 보간 비율
     * [EN] Interpolation ratio between current keyframes
     * @param prevIDX -
     * [KO] 이전 키프레임 인덱스
     * [EN] Previous keyframe index
     * @param nextIDX -
     * [KO] 다음 키프레임 인덱스
     * [EN] Next keyframe index
     */
    renderWeight(redGPUContext: RedGPUContext, computePassEncoder: GPUComputePassEncoder, targetMesh: Mesh, interpolationValue: number, prevIDX: number, nextIDX: number): Promise<void>;
    /**
     * [KO] 애니메이션 트랙과 관련된 모든 GPU 버퍼 및 캐시 리소스를 해제합니다.
     * [EN] Destroys all GPU buffers and cache resources associated with the animation track.
     */
    destroy(): void;
}
export default AniTrack_GLTF;
