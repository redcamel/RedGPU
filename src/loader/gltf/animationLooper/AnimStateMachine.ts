import {GLTFParsedSingleClip} from "../parsers/animation/GLTFParsedSingleClip";
import {PlayAnimationInfo} from "../GLTFLoader";

/**
 * [KO] 애니메이션 상태 추상 클래스입니다.
 * [EN] Abstract class for animation states.
 */
export abstract class AnimState {
    name: string;
    startTime: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    abstract enter(timestamp: number): void;

    abstract update(deltaTime: number, timestamp: number): void;

    abstract exit(): void;
}

/**
 * [KO] 단일 glTF 클립을 래핑하는 애니메이션 상태 클래스입니다.
 * [EN] Animation state class wrapping a single glTF clip.
 */
export class ClipAnimState extends AnimState {
    clip: GLTFParsedSingleClip;

    constructor(name: string, clip: GLTFParsedSingleClip) {
        super(name);
        this.clip = clip;
    }

    enter(timestamp: number) {
        this.startTime = timestamp;
    }

    update(deltaTime: number, timestamp: number) {
        // [KO] 단일 애니메이션 상태에 대한 필요한 업데이트 연산 처리
        // [EN] Process any necessary update operations for a single animation state
    }

    exit() {
        // [KO] 상태가 해제될 때의 리소스 정리
        // [EN] Clean up resources when the state is deactivated
    }
}

/**
 * [KO] 애니메이션 상태 전이 규칙 인터페이스입니다.
 * [EN] Interface for animation state transition rules.
 */
export interface AnimTransition {
    fromState: string;
    toState: string;
    duration: number; // [KO] 크로스페이드 시간 (초 단위) [EN] Crossfade duration in seconds
    conditions: () => boolean; // [KO] 전이 조건 판별식 [EN] Condition predicate for starting transition
}

/**
 * [KO] 애니메이션 상태를 관리하고 보간 가중치를 산출하는 상태 머신 엔진입니다.
 * [EN] State machine engine managing animation states and calculating interpolation weights.
 */
export class AnimStateMachine {
    public currentState: AnimState | null = null;
    public targetState: AnimState | null = null;
    private states: Map<string, AnimState> = new Map();
    private transitions: AnimTransition[] = [];
    private blendTime: number = 0;
    private maxBlendDuration: number = 0;

    constructor(initialState?: AnimState) {
        if (initialState) {
            this.addState(initialState);
            this.currentState = initialState;
        }
    }

    /**
     * [KO] 새로운 애니메이션 상태를 추가합니다.
     * [EN] Adds a new animation state.
     */
    addState(state: AnimState) {
        this.states.set(state.name, state);
    }

    /**
     * [KO] 상태 전이 조건을 추가합니다.
     * [EN] Adds a transition condition.
     */
    addTransition(transition: AnimTransition) {
        this.transitions.push(transition);
    }

    /**
     * [KO] 매 프레임 상태 머신을 업데이트하고 블렌딩 가중치를 제어합니다.
     * [EN] Updates the state machine every frame and controls blending weights.
     */
    update(deltaTime: number, timestamp: number, playInfo: PlayAnimationInfo) {
        if (!this.currentState) return;

        // 1. 최초 진입 시 시작 시간 기록
        if (this.currentState.startTime === 0) {
            this.currentState.enter(timestamp);
            playInfo.startTime = timestamp;
        }

        // 2. 전이 조건 검사 (현재 전이 중이 아닐 때)
        if (!this.targetState) {
            const activeTransition = this.transitions.find(t =>
                t.fromState === this.currentState!.name && t.conditions()
            );

            if (activeTransition) {
                const toState = this.states.get(activeTransition.toState);
                if (toState) {
                    this.targetState = toState;
                    this.targetState.enter(timestamp);

                    this.blendTime = 0;
                    this.maxBlendDuration = activeTransition.duration * 1000; // 초 -> ms 변환

                    playInfo.isBlending = true;
                    if (this.currentState instanceof ClipAnimState) {
                        playInfo.fromClip = this.currentState;
                        playInfo.startTimeFrom = this.currentState.startTime;
                    }
                    if (this.targetState instanceof ClipAnimState) {
                        playInfo.toClip = this.targetState;
                        playInfo.startTimeTo = timestamp;
                    }
                    playInfo.blendWeight = 0;
                }
            }
        }

        // 3. 블렌드 전이 진행
        if (this.targetState) {
            this.blendTime += deltaTime;
            const alpha = Math.min(this.blendTime / this.maxBlendDuration, 1.0);
            playInfo.blendWeight = alpha;

            if (alpha >= 1.0) {
                this.currentState.exit();
                this.currentState = this.targetState;
                this.targetState = null;

                playInfo.isBlending = false;
                if (this.currentState instanceof ClipAnimState) {
                    playInfo.targetGLTFParsedSingleClip = this.currentState;
                    playInfo.startTime = this.currentState.startTime;
                }

                // 블렌딩 데이터 정리
                playInfo.fromClip = undefined;
                playInfo.toClip = undefined;
                playInfo.blendWeight = undefined;
                playInfo.startTimeFrom = undefined;
                playInfo.startTimeTo = undefined;
            }
        } else {
            // 4. 단일 상태 재생 유지
            this.currentState.update(deltaTime, timestamp);
            playInfo.isBlending = false;
            if (this.currentState instanceof ClipAnimState) {
                playInfo.targetGLTFParsedSingleClip = this.currentState;
                playInfo.startTime = this.currentState.startTime;
            }
        }
    }
}
