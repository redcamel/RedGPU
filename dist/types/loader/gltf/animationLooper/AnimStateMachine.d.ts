import { GLTFParsedSingleClip } from "../parsers/animation/GLTFParsedSingleClip";
import { PlayAnimationInfo } from "../GLTFLoader";
/**
 * [KO] 애니메이션 상태의 기본이 되는 추상 클래스입니다.
 * [EN] Abstract class that serves as the base for animation states.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
export declare abstract class AnimState {
    /**
     * [KO] 애니메이션 상태 이름
     * [EN] Animation state name
     */
    name: string;
    /**
     * [KO] 상태 진입 시작 시간 (ms)
     * [EN] State entry start time (ms)
     */
    startTime: number;
    /**
     * [KO] AnimState 인스턴스를 초기화합니다.
     * [EN] Initializes an AnimState instance.
     *
     * @param name -
     * [KO] 애니메이션 상태 이름
     * [EN] Animation state name
     */
    constructor(name: string);
    /**
     * [KO] 상태에 진입할 때 호출됩니다.
     * [EN] Called when entering the state.
     *
     * @param timestamp -
     * [KO] 진입 시점 타임스탬프 (ms)
     * [EN] Entry timestamp (ms)
     */
    abstract enter(timestamp: number): void;
    /**
     * [KO] 상태가 활성화된 동안 매 프레임 호출됩니다.
     * [EN] Called every frame while the state is active.
     *
     * @param deltaTime -
     * [KO] 프레임 간 경과 시간 (ms)
     * [EN] Elapsed time between frames (ms)
     * @param timestamp -
     * [KO] 현재 프레임 타임스탬프 (ms)
     * [EN] Current frame timestamp (ms)
     */
    abstract update(deltaTime: number, timestamp: number): void;
    /**
     * [KO] 상태에서 빠져나갈 때 호출됩니다.
     * [EN] Called when exiting the state.
     */
    abstract exit(): void;
}
/**
 * [KO] 단일 glTF 애니메이션 클립을 래핑하는 애니메이션 상태 클래스입니다.
 * [EN] Animation state class wrapping a single glTF animation clip.
 *
 * @category Loader
 */
export declare class ClipAnimState extends AnimState {
    /**
     * [KO] 파싱된 단일 glTF 애니메이션 클립
     * [EN] Parsed single glTF animation clip
     */
    clip: GLTFParsedSingleClip;
    /**
     * [KO] ClipAnimState 인스턴스를 생성합니다.
     * [EN] Creates a ClipAnimState instance.
     *
     * @param name -
     * [KO] 상태 이름
     * [EN] State name
     * @param clip -
     * [KO] 파싱된 단일 glTF 애니메이션 클립
     * [EN] Parsed single glTF animation clip
     */
    constructor(name: string, clip: GLTFParsedSingleClip);
    /**
     * [KO] 상태 진입 시 시작 타임스탬프를 기록합니다.
     * [EN] Records the start timestamp when entering the state.
     *
     * @param timestamp -
     * [KO] 진입 시점 타임스탬프 (ms)
     * [EN] Entry timestamp (ms)
     */
    enter(timestamp: number): void;
    /**
     * [KO] 단일 애니메이션 상태를 프레임 단위로 갱신합니다.
     * [EN] Updates the single animation state per frame.
     *
     * @param deltaTime -
     * [KO] 프레임 간 경과 시간 (ms)
     * [EN] Elapsed time between frames (ms)
     * @param timestamp -
     * [KO] 현재 프레임 타임스탬프 (ms)
     * [EN] Current frame timestamp (ms)
     */
    update(deltaTime: number, timestamp: number): void;
    /**
     * [KO] 상태가 해제될 때 호출됩니다.
     * [EN] Called when the state is deactivated.
     */
    exit(): void;
}
/**
 * [KO] 애니메이션 상태 전이 규칙 인터페이스입니다.
 * [EN] Interface for animation state transition rules.
 *
 * @category Loader
 */
export interface AnimTransition {
    /**
     * [KO] 전이 출발 상태 이름
     * [EN] Source state name for transition
     */
    fromState: string;
    /**
     * [KO] 전이 도착 상태 이름
     * [EN] Target state name for transition
     */
    toState: string;
    /**
     * [KO] 크로스페이드 시간 (초 단위)
     * [EN] Crossfade duration in seconds
     */
    duration: number;
    /**
     * [KO] 전이 시작 조건 판별 함수
     * [EN] Condition predicate function for starting transition
     */
    conditions: () => boolean;
}
/**
 * [KO] 애니메이션 상태 전이와 블렌딩 가중치를 관리하는 상태 머신 클래스입니다.
 * [EN] State machine class that manages animation state transitions and blending weights.
 *
 * @category Loader
 */
export declare class AnimStateMachine {
    /**
     * [KO] 현재 활성 애니메이션 상태
     * [EN] Currently active animation state
     */
    currentState: AnimState | null;
    /**
     * [KO] 전이 목표 애니메이션 상태
     * [EN] Target animation state for transition
     */
    targetState: AnimState | null;
    private states;
    private transitions;
    private blendTime;
    private maxBlendDuration;
    /**
     * [KO] AnimStateMachine 인스턴스를 생성합니다.
     * [EN] Creates an AnimStateMachine instance.
     *
     * @param initialState -
     * [KO] 초기 애니메이션 상태 (선택)
     * [EN] Initial animation state (optional)
     */
    constructor(initialState?: AnimState);
    /**
     * [KO] 새로운 애니메이션 상태를 등록합니다.
     * [EN] Registers a new animation state.
     *
     * @param state -
     * [KO] 추가할 애니메이션 상태 인스턴스
     * [EN] Animation state instance to add
     */
    addState(state: AnimState): void;
    /**
     * [KO] 상태 전이 규칙을 추가합니다.
     * [EN] Adds a state transition rule.
     *
     * @param transition -
     * [KO] 추가할 전이 규칙 객체
     * [EN] Transition rule object to add
     */
    addTransition(transition: AnimTransition): void;
    /**
     * [KO] 매 프레임 상태 머신을 갱신하고 모션 블렌딩 가중치를 계산합니다.
     * [EN] Updates the state machine every frame and calculates motion blending weights.
     *
     * @param deltaTime -
     * [KO] 프레임 간 경과 시간 (ms)
     * [EN] Elapsed time between frames (ms)
     * @param timestamp -
     * [KO] 현재 프레임 타임스탬프 (ms)
     * [EN] Current frame timestamp (ms)
     * @param playInfo -
     * [KO] 갱신할 애니메이션 재생 정보 객체
     * [EN] Animation playback info object to update
     */
    update(deltaTime: number, timestamp: number, playInfo: PlayAnimationInfo): void;
}
