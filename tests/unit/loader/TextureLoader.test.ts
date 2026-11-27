import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import TextureLoader from '../../../src/loader/TextureLoader';

interface PendingTextureJob {
    src: string;
    onLoad?: () => void;
    onError?: () => void;
    instance: { src: string };
}

const activeJobs: PendingTextureJob[] = [];
let peakActiveCount = 0;
let totalStartedCount = 0;

vi.mock('../../../src/resources/texture/BitmapTexture', () => {
    class MockBitmapTexture {
        src: string;

        constructor(
            _ctx: any,
            srcInfo: any,
            _useMipmap?: boolean,
            onLoad?: () => void,
            onError?: () => void
        ) {
            this.src = typeof srcInfo === 'string' ? srcInfo : srcInfo?.src;
            totalStartedCount++;
            const job: PendingTextureJob = {
                src: this.src,
                onLoad,
                onError,
                instance: this,
            };
            activeJobs.push(job);
            if (activeJobs.length > peakActiveCount) {
                peakActiveCount = activeJobs.length;
            }
        }
    }

    return {default: MockBitmapTexture};
});

vi.mock('../../../src/resources/texture/CubeTexture', () => {
    class MockCubeTexture {
        src: any;

        constructor(_ctx: any, srcInfo: any, _useMipmap?: boolean, onLoad?: () => void) {
            this.src = srcInfo?.src;
            onLoad?.();
        }
    }

    return {default: MockCubeTexture};
});

class MockRedGPUContext {
    destroyed = false;
}

Object.defineProperty(MockRedGPUContext, 'name', {value: 'RedGPUContext'});

const createMockContext = () => new MockRedGPUContext() as any;

const finishJob = (jobIndex: number, success: boolean = true) => {
    const [job] = activeJobs.splice(jobIndex, 1);
    if (!job) throw new Error(`No active job at index ${jobIndex}`);
    if (success) {
        job.onLoad?.();
    } else {
        job.onError?.();
    }
};

describe('TextureLoader — Concurrency Queue & Lifecycle', () => {
    beforeEach(() => {
        activeJobs.length = 0;
        peakActiveCount = 0;
        totalStartedCount = 0;
        vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
            cb(0);
            return 1;
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('maxConcurrency 상한을 준수하며 완료 순서가 뒤바뀌어도 getTextureByIndex 인덱스를 보존한다', () => {
        const ctx = createMockContext();
        const items = Array.from({length: 10}, (_, i) => ({src: `tex_${i}.png`, useMipmap: true}));
        const onComplete = vi.fn();
        const progressPercents: number[] = [];

        const loader = new TextureLoader(
            ctx,
            items,
            onComplete,
            (p: { percent: number }) => progressPercents.push(p.percent),
            3
        );

        expect(activeJobs.length).toBe(3);
        expect(peakActiveCount).toBe(3);

        // 역순/임의 순서로 완료시켜도 동시성 상한 3을 절대 넘지 않아야 함
        while (activeJobs.length > 0) {
            finishJob(activeJobs.length - 1, true);
            expect(activeJobs.length).toBeLessThanOrEqual(3);
        }

        expect(peakActiveCount).toBe(3);
        expect(totalStartedCount).toBe(10);
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(progressPercents[progressPercents.length - 1]).toBe(100);

        for (let i = 0; i < items.length; i++) {
            const tex = loader.getTextureByIndex(i) as any;
            expect(tex?.src).toBe(`tex_${i}.png`);
            expect(loader.textures[i].loadSuccess).toBe(true);
            expect(loader.textures[i].loadEnd).toBe(true);
        }
    });

    it('일부 텍스처가 실패해도 큐가 멈추지 않고 끝까지 완료 콜백을 호출한다', () => {
        const ctx = createMockContext();
        const items = Array.from({length: 6}, (_, i) => ({src: `img_${i}.png`, useMipmap: false}));
        const onComplete = vi.fn();

        const loader = new TextureLoader(ctx, items, onComplete, undefined, 2);
        expect(activeJobs.length).toBe(2);

        let step = 0;
        while (activeJobs.length > 0) {
            finishJob(0, step % 2 === 0);
            step++;
        }

        expect(totalStartedCount).toBe(6);
        expect(onComplete).toHaveBeenCalledTimes(1);
        expect(loader.textures.every((t) => t.loadEnd)).toBe(true);
        expect(loader.textures.filter((t) => !t.loadSuccess).length).toBe(3);
    });

    it('redGPUContext.destroyed가 true가 되면 잔여 대기 큐를 중단하고 완료 콜백을 호출하지 않는다', () => {
        const ctx = createMockContext();
        const items = Array.from({length: 8}, (_, i) => ({src: `spa_${i}.png`, useMipmap: true}));
        const onComplete = vi.fn();

        new TextureLoader(ctx, items, onComplete, undefined, 2);
        expect(activeJobs.length).toBe(2);
        expect(totalStartedCount).toBe(2);

        // 컨텍스트 파괴 시뮬레이션
        ctx.destroyed = true;
        finishJob(0, true);
        finishJob(0, true);

        // 파괴 이후 추가 텍스처 시작 및 완료 콜백 호출이 없어야 함
        expect(totalStartedCount).toBe(2);
        expect(activeJobs.length).toBe(0);
        expect(onComplete).not.toHaveBeenCalled();
    });

    it('동일 RedGPUContext에서 다수의 TextureLoader를 동시에 실행해도 전역 상한(4)을 초과하지 않고 모두 완주한다', () => {
        const ctx = createMockContext();
        const callbacks = [vi.fn(), vi.fn(), vi.fn()];

        const loaders = callbacks.map((cb, loaderIdx) => {
            const items = Array.from({length: 5}, (_, i) => ({
                src: `loader${loaderIdx}_tex_${i}.png`,
                useMipmap: true,
            }));
            return new TextureLoader(ctx, items, cb, undefined, 4);
        });

        expect(activeJobs.length).toBe(4);
        expect(peakActiveCount).toBe(4);

        while (activeJobs.length > 0) {
            finishJob(0, true);
            expect(activeJobs.length).toBeLessThanOrEqual(4);
        }

        expect(peakActiveCount).toBe(4);
        expect(totalStartedCount).toBe(15);
        callbacks.forEach((cb) => expect(cb).toHaveBeenCalledTimes(1));
        loaders.forEach((loader, loaderIdx) => {
            for (let i = 0; i < 5; i++) {
                expect((loader.getTextureByIndex(i) as any)?.src).toBe(`loader${loaderIdx}_tex_${i}.png`);
            }
        });
    });
});
