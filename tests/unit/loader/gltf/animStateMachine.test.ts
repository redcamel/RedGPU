import {describe, expect, it, vi} from 'vitest';
import {AnimState, AnimStateMachine, ClipAnimState} from '../../../../src/loader/gltf/animationLooper/AnimStateMachine';
import {PlayAnimationInfo} from '../../../../src/loader/gltf/GLTFLoader';
import {GLTFParsedSingleClip} from '../../../../src/loader/gltf/parsers/animation/GLTFParsedSingleClip';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

class SpyState extends AnimState {
    entered = 0;
    updated = 0;
    exited = 0;

    enter(timestamp: number): void {
        this.startTime = timestamp;
        this.entered++;
    }

    update(): void {
        this.updated++;
    }

    exit(): void {
        this.exited++;
    }
}

describe('AnimStateMachine & GLTFParsedSingleClip', () => {
    it('drives enter/update/exit lifecycle and transitions smoothly across crossfade duration', () => {
        const idleClip = new GLTFParsedSingleClip('Idle');
        const runClip = new GLTFParsedSingleClip('Run');
        const idleState = new ClipAnimState('Idle', idleClip);
        const runState = new ClipAnimState('Run', runClip);

        let shouldRun = false;
        const sm = new AnimStateMachine(idleState);
        sm.addState(runState);
        sm.addTransition({
            fromState: 'Idle',
            toState: 'Run',
            duration: 0.5, // 500ms
            conditions: () => shouldRun,
        });

        const playInfo = new PlayAnimationInfo(0, idleState);

        // 첫 프레임: Idle enter 호출
        sm.update(16, 1000, playInfo);
        expect(playInfo.isBlending).toBe(false);
        expect(playInfo.targetGLTFParsedSingleClip).toBe(idleState);
        expect(playInfo.startTime).toBe(1000);

        // 조건 충족 -> 블렌딩 시작 (250ms 경과 = 0.5)
        shouldRun = true;
        sm.update(250, 1250, playInfo);
        expect(playInfo.isBlending).toBe(true);
        expect(playInfo.fromClip).toBe(idleState);
        expect(playInfo.toClip).toBe(runState);
        expect(playInfo.blendWeight).toBeCloseTo(0.5, 5);

        // 추가 250ms 경과 -> blendWeight >= 1.0 -> 전이 완료 및 임시 블렌드 필드 정리
        sm.update(250, 1500, playInfo);
        expect(sm.currentState).toBe(runState);
        expect(sm.targetState).toBeNull();
        expect(playInfo.isBlending).toBe(false);
        expect(playInfo.targetGLTFParsedSingleClip).toBe(runState);
        expect(playInfo.fromClip).toBeUndefined();
        expect(playInfo.toClip).toBeUndefined();
        expect(playInfo.blendWeight).toBeUndefined();
    });

    it('invokes custom AnimState enter/update/exit hooks in order', () => {
        const s1 = new SpyState('A');
        const s2 = new SpyState('B');
        let go = false;
        const sm = new AnimStateMachine(s1);
        sm.addState(s2);
        sm.addTransition({fromState: 'A', toState: 'B', duration: 0.1, conditions: () => go});

        const playInfo = new PlayAnimationInfo(0, new ClipAnimState('dummy', new GLTFParsedSingleClip('dummy')));
        sm.update(16, 100, playInfo);
        expect(s1.entered).toBe(1);
        expect(s1.updated).toBe(1);

        go = true;
        sm.update(150, 250, playInfo);
        expect(s2.entered).toBe(1);
        expect(s1.exited).toBe(1);
        expect(sm.currentState).toBe(s2);
    });

    it('GLTFParsedSingleClip.findTrack resolves tracks in O(1) and invalidates cache when tracks grow', () => {
        const clip = new GLTFParsedSingleClip('Walk');
        const meshA = {name: 'A'} as any;
        const meshB = {name: 'B'} as any;
        const rotTrackA = {animationTargetMesh: meshA, keyType: 1} as any;
        const posTrackA = {animationTargetMesh: meshA, keyType: 2} as any;
        const scaleTrackB = {animationTargetMesh: meshB, keyType: 3} as any;

        clip.tracks.push(rotTrackA, posTrackA);
        expect(clip.findTrack(meshA, 1)).toBe(rotTrackA);
        expect(clip.findTrack(meshA, 2)).toBe(posTrackA);
        expect(clip.findTrack(meshB, 3)).toBeUndefined();

        // 트랙 추가 후 캐시 자동 무효화 확인
        clip.tracks.push(scaleTrackB);
        expect(clip.findTrack(meshB, 3)).toBe(scaleTrackB);
    });
});
