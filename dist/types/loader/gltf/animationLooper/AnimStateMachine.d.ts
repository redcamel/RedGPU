import { GLTFParsedSingleClip } from "../parsers/animation/GLTFParsedSingleClip";
import { PlayAnimationInfo } from "../GLTFLoader";
/**
 * [KO] 애니메이션 상태 추상 클래스입니다.
 * [EN] Abstract class for animation states.
 */
export declare abstract class AnimState {
    name: string;
    startTime: number;
    constructor(name: string);
    abstract enter(timestamp: number): void;
    abstract update(deltaTime: number, timestamp: number): void;
    abstract exit(): void;
}
/**
 * [KO] 단일 glTF 클립을 래핑하는 애니메이션 상태 클래스입니다.
 * [EN] Animation state class wrapping a single glTF clip.
 */
export declare class ClipAnimState extends AnimState {
    clip: GLTFParsedSingleClip;
    constructor(name: string, clip: GLTFParsedSingleClip);
    enter(timestamp: number): void;
    update(deltaTime: number, timestamp: number): void;
    exit(): void;
}
/**
 * [KO] 애니메이션 상태 전이 규칙 인터페이스입니다.
 * [EN] Interface for animation state transition rules.
 */
export interface AnimTransition {
    fromState: string;
    toState: string;
    duration: number;
    conditions: () => boolean;
}
/**
 * [KO] 애니메이션 상태를 관리하고 보간 가중치를 산출하는 상태 머신 엔진입니다.
 * [EN] State machine engine managing animation states and calculating interpolation weights.
 */
export declare class AnimStateMachine {
    currentState: AnimState | null;
    targetState: AnimState | null;
    private states;
    private transitions;
    private blendTime;
    private maxBlendDuration;
    constructor(initialState?: AnimState);
    /**
     * [KO] 새로운 애니메이션 상태를 추가합니다.
     * [EN] Adds a new animation state.
     */
    addState(state: AnimState): void;
    /**
     * [KO] 상태 전이 조건을 추가합니다.
     * [EN] Adds a transition condition.
     */
    addTransition(transition: AnimTransition): void;
    /**
     * [KO] 매 프레임 상태 머신을 업데이트하고 블렌딩 가중치를 제어합니다.
     * [EN] Updates the state machine every frame and controls blending weights.
     */
    update(deltaTime: number, timestamp: number, playInfo: PlayAnimationInfo): void;
}
