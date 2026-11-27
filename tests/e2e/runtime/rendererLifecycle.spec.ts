import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Renderer & Multi-View Lifecycle', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(async () => {
        await harness.page.evaluate(() => {
            const ctx = (window as any).__REDGPU_CTX__;
            if (ctx) {
                ctx.removeAllViews();
                ctx.renderScale = 1;
            }
        });
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // View3D + View2D 멀티 뷰 동시 renderFrame 실행 및 visible = false 시 드로우 스킵 검증
    test('renders View3D + View2D simultaneously and skips draw calls when mesh is invisible', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const renderer = new RedGPU.Renderer();

            const scene3D = new RedGPU.Display.Scene();
            const cam3D = new RedGPU.Camera.PerspectiveCamera();
            cam3D.setPosition(0, 0, 5);
            cam3D.lookAt(0, 0, 0);
            const view3D = new RedGPU.Display.View3D(ctx, scene3D, cam3D);
            const mesh3D = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Box(ctx),
                new RedGPU.Material.ColorMaterial(ctx, '#ff4444')
            );
            scene3D.addChild(mesh3D);

            const scene2D = new RedGPU.Display.Scene();
            const view2D = new RedGPU.Display.View2D(ctx, scene2D);
            const sprite2D = new RedGPU.Display.Sprite2D(
                ctx,
                new RedGPU.Material.ColorMaterial(ctx, '#44ff44')
            );
            sprite2D.setSize(64, 64);
            sprite2D.setPosition(100, 100);
            scene2D.addChild(sprite2D);

            ctx.addView(view3D);
            ctx.addView(view2D);

            renderer.renderFrame(ctx, 16);
            const drawCalls3DVisible = view3D.renderViewStateData.renderResults.numDrawCalls;
            const drawCalls2DVisible = view2D.renderViewStateData.renderResults.numDrawCalls;

            mesh3D.visible = false;
            sprite2D.visible = false;
            renderer.renderFrame(ctx, 32);
            const drawCalls3DHidden = view3D.renderViewStateData.renderResults.numDrawCalls;
            const drawCalls2DHidden = view2D.renderViewStateData.renderResults.numDrawCalls;

            renderer.destroy(ctx);
            return {
                drawCalls3DVisible,
                drawCalls2DVisible,
                drawCalls3DHidden,
                drawCalls2DHidden
            };
        });

        expect(res.drawCalls3DVisible).toBeGreaterThanOrEqual(1);
        expect(res.drawCalls2DVisible).toBeGreaterThanOrEqual(1);
        expect(res.drawCalls3DHidden).toBe(0);
        expect(res.drawCalls2DHidden).toBe(0);
    });

    // start() / stop() 루프 타임스탬프 단조 증가 및 stop() 이후 콜백 미호출 검증
    test('start() invokes monotonically increasing frame timestamps and stop() halts callbacks', async () => {
        const res = await harness.page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const renderer = new RedGPU.Renderer();
            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            ctx.addView(view);

            const timestamps: number[] = [];
            await new Promise<void>((resolve) => {
                renderer.start(ctx, (time: number) => {
                    timestamps.push(time);
                    if (timestamps.length === 4) {
                        resolve();
                    }
                });
            });
            renderer.stop(ctx);

            const countAtStop = timestamps.length;
            await new Promise((r) => setTimeout(r, 80));
            const countAfterWait = timestamps.length;

            let monotonic = true;
            for (let i = 1; i < timestamps.length; i++) {
                if (!(timestamps[i] >= timestamps[i - 1])) monotonic = false;
            }

            renderer.destroy(ctx);
            return {countAtStop, countAfterWait, monotonic};
        });

        expect(res.countAtStop).toBeGreaterThanOrEqual(4);
        expect(res.countAfterWait).toBe(res.countAtStop);
        expect(res.monotonic).toBe(true);
    });

    // start() 콜백 내부에서 renderer.stop(ctx) 호출 시 다음 프레임 재예약 없이 즉시 중단 검증
    test('stop() invoked inside start() callback immediately halts subsequent frames', async () => {
        const res = await harness.page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const renderer = new RedGPU.Renderer();
            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            ctx.addView(view);

            let frameCount = 0;
            await new Promise<void>((resolve) => {
                renderer.start(ctx, () => {
                    frameCount++;
                    renderer.stop(ctx);
                    resolve();
                });
            });

            await new Promise((r) => setTimeout(r, 100));
            const countAfterWait = frameCount;
            renderer.destroy(ctx);
            return {countAfterWait};
        });

        expect(res.countAfterWait).toBe(1);
    });

    // view.setSize() 및 ctx.renderScale 변경 시 pixelRectObject와 onResize(RedResizeEvent) 페이로드 정확도 검증
    test('updates pixelRectObject and fires onResize RedResizeEvent on setSize() and renderScale change', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            ctx.addView(view);

            const resizeEvents: any[] = [];
            view.onResize = (ev: any) => {
                resizeEvents.push({
                    width: ev.pixelRectObject.width,
                    height: ev.pixelRectObject.height,
                    screenWidth: ev.screenRectObject.width,
                    screenHeight: ev.screenRectObject.height
                });
            };

            ctx.renderScale = 1;
            view.setSize(320, 240);
            const afterSetSize = {
                w: view.pixelRectObject.width,
                h: view.pixelRectObject.height,
                sw: view.screenRectObject.width,
                sh: view.screenRectObject.height
            };

            ctx.renderScale = 0.5;
            const afterHalfScale = {
                w: view.pixelRectObject.width,
                h: view.pixelRectObject.height
            };

            return {
                afterSetSize,
                afterHalfScale,
                eventCount: resizeEvents.length,
                lastEvent: resizeEvents[resizeEvents.length - 1]
            };
        });

        expect(res.afterSetSize.sw).toBe(320);
        expect(res.afterSetSize.sh).toBe(240);
        expect(res.afterHalfScale.w).toBe(Math.round(res.afterSetSize.w * 0.5));
        expect(res.afterHalfScale.h).toBe(Math.round(res.afterSetSize.h * 0.5));
        expect(res.eventCount).toBeGreaterThanOrEqual(2);
        expect(res.lastEvent.width).toBe(res.afterHalfScale.w);
        expect(res.lastEvent.height).toBe(res.afterHalfScale.h);
    });
});
