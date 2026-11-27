import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Multi-Canvas RedGPUContext Isolation', () => {
    // 2개 독립 캔버스에서 동시 RedGPUContext 생성·렌더링 후 1번 destroy() 시 2번 컨텍스트 정상 동작 유지 검증
    test('destroying context #1 does not affect GPU rendering or buffers of context #2', async ({page}) => {
        await openWebGPUHarness(page);

        const res = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            const initCanvas = (width: number, height: number) =>
                new Promise<any>((resolve, reject) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    document.body.appendChild(canvas);
                    RedGPU.init(
                        canvas,
                        (ctx: any) => resolve({ctx, canvas}),
                        (err: any) => reject(err)
                    );
                });

            const pair1 = await initCanvas(256, 256);
            const pair2 = await initCanvas(256, 256);

            const setupScene = (ctx: any, color: string) => {
                const scene = new RedGPU.Display.Scene();
                const cam = new RedGPU.Camera.PerspectiveCamera();
                cam.setPosition(0, 0, 5);
                cam.lookAt(0, 0, 0);
                const view = new RedGPU.Display.View3D(ctx, scene, cam);
                const mesh = new RedGPU.Display.Mesh(
                    ctx,
                    new RedGPU.Primitive.Box(ctx),
                    new RedGPU.Material.ColorMaterial(ctx, color)
                );
                scene.addChild(mesh);
                ctx.addView(view);
                const renderer = new RedGPU.Renderer();
                return {scene, view, mesh, renderer};
            };

            const env1 = setupScene(pair1.ctx, '#ff2222');
            const env2 = setupScene(pair2.ctx, '#2222ff');

            // 두 컨텍스트 모두 초기 프레임 렌더링
            env1.renderer.renderFrame(pair1.ctx, 16);
            env2.renderer.renderFrame(pair2.ctx, 16);

            const distinctDevices = pair1.ctx.gpuDevice !== pair2.ctx.gpuDevice;
            const drawCalls1Before = env1.view.renderViewStateData.renderResults.numDrawCalls;
            const drawCalls2Before = env2.view.renderViewStateData.renderResults.numDrawCalls;

            // 1번 컨텍스트 완전 파괴
            env1.renderer.destroy(pair1.ctx);
            pair1.ctx.destroy();
            pair1.canvas.remove();

            const ctx1Destroyed = pair1.ctx.destroyed;
            const ctx2Destroyed = pair2.ctx.destroyed;

            // 2번 컨텍스트에서 신규 GPU 버퍼 생성 + 데이터 업로드 + 추가 프레임 렌더링 수행
            const bufData = new Float32Array([7.25, 8.5, 9.75, 10.0]);
            const storageBuf = new RedGPU.Resource.StorageBuffer(
                pair2.ctx,
                bufData.buffer,
                'Ctx2PostDestroyCheck'
            );

            env2.mesh.rotationY = 45;
            env2.renderer.renderFrame(pair2.ctx, 32);
            const drawCalls2After = env2.view.renderViewStateData.renderResults.numDrawCalls;

            // 2번 컨텍스트 GPU 메모리 Readback으로 디바이스 생존 및 데이터 무결성 확인
            const readBuf = pair2.ctx.gpuDevice.createBuffer({
                size: bufData.byteLength,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
            });
            await pair2.ctx.commandEncoderManager.immediateSubmit('Ctx2Readback', (enc: GPUCommandEncoder) => {
                enc.copyBufferToBuffer(storageBuf.gpuBuffer, 0, readBuf, 0, bufData.byteLength);
            });
            await readBuf.mapAsync(GPUMapMode.READ);
            const readback = Array.from(new Float32Array(readBuf.getMappedRange().slice(0)));
            readBuf.unmap();
            readBuf.destroy();
            storageBuf.destroy();

            env2.renderer.destroy(pair2.ctx);
            pair2.ctx.destroy();
            pair2.canvas.remove();

            return {
                distinctDevices,
                drawCalls1Before,
                drawCalls2Before,
                ctx1Destroyed,
                ctx2Destroyed,
                drawCalls2After,
                readback
            };
        });

        expect(res.distinctDevices).toBe(true);
        expect(res.drawCalls1Before).toBeGreaterThanOrEqual(1);
        expect(res.drawCalls2Before).toBeGreaterThanOrEqual(1);
        expect(res.ctx1Destroyed).toBe(true);
        expect(res.ctx2Destroyed).toBe(false);
        expect(res.drawCalls2After).toBeGreaterThanOrEqual(1);
        expect(res.readback).toEqual([7.25, 8.5, 9.75, 10.0]);
    });

    // destroy() 시 onDestroy 콜백 1회 호출 및 SPA pageshow 리스너 완전 해제 검증
    test('invokes onDestroy once and aborts pageshow listener on explicit SPA destroy()', async ({page}) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));
        await openWebGPUHarness(page);

        const res = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            let onDestroyCount = 0;
            let onDestroyReason = '';

            const ctx = await new Promise<any>((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                document.body.appendChild(canvas);
                RedGPU.init(
                    canvas,
                    (c: any) => resolve(c),
                    (err: any) => reject(err),
                    (info: GPUDeviceLostInfo) => {
                        onDestroyCount++;
                        onDestroyReason = info.reason;
                    }
                );
            });

            ctx.destroy();
            // device.lost 마이크로태스크 완료 대기
            await new Promise((r) => setTimeout(r, 50));

            // SPA destroy() 이후 pageshow(persisted: true)가 발송되어도 리스너가 abort되어 리로드/에러가 발생하지 않아야 함
            window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted: true}));
            await new Promise((r) => setTimeout(r, 30));

            return {
                destroyed: ctx.destroyed,
                onDestroyCount,
                onDestroyReason
            };
        });

        expect(pageErrors).toEqual([]);
        expect(res.destroyed).toBe(true);
        expect(res.onDestroyCount).toBe(1);
        expect(res.onDestroyReason).toBe('destroyed');
    });

    // pagehide 이벤트 발송 시 null.remove() TypeError 미발생 및 컨텍스트 정상 파기 검증
    test('pagehide event destroys context cleanly without TypeError', async ({page}) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));
        await openWebGPUHarness(page);

        const res = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = await new Promise<any>((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                document.body.appendChild(canvas);
                RedGPU.init(canvas, (c: any) => resolve(c), (err: any) => reject(err));
            });

            window.dispatchEvent(new PageTransitionEvent('pagehide', {persisted: false}));
            await new Promise((r) => setTimeout(r, 50));

            return {destroyed: ctx.destroyed};
        });

        expect(pageErrors).toEqual([]);
        expect(res.destroyed).toBe(true);
    });

    // 비동기 BitmapTexture 로딩 도중 SPA ctx.destroy() 호출 시 크래시/에러 0건 검증
    test('destroying context while async BitmapTexture load is in flight emits no errors', async ({page}) => {
        const pageErrors: string[] = [];
        const consoleErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));
        page.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });

        // 1x1 SVG 응답을 120ms 지연시켜 로딩 도중 destroy() 경쟁 상태 재현
        await page.route('**/delayed-spa-teardown.svg', async (route) => {
            await new Promise((r) => setTimeout(r, 120));
            await route.fulfill({
                status: 200,
                contentType: 'image/svg+xml',
                body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'
            });
        });

        await openWebGPUHarness(page);

        await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = await new Promise<any>((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                document.body.appendChild(canvas);
                RedGPU.init(canvas, (c: any) => resolve(c), (err: any) => reject(err));
            });

            // 비동기 텍스처 로딩 시작 직후 컨텍스트 파기
            new RedGPU.Resource.BitmapTexture(ctx, '/delayed-spa-teardown.svg');
            await new Promise((r) => setTimeout(r, 20));
            ctx.destroy();

            // 지연된 응답이 도착하고 마이크로태스크가 모두 정리될 때까지 대기
            await new Promise((r) => setTimeout(r, 200));
        });

        expect(pageErrors).toEqual([]);
        expect(consoleErrors).toEqual([]);
    });

    // Scene.destroy() 및 RedGPUContext.destroy() 시 연결된 physicsEngine.destroy() 1회 호출 및 참조 해제 검증
    test('Scene.destroy() invokes physicsEngine.destroy() once and clears reference', async ({page}) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));
        await openWebGPUHarness(page);

        const res = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const ctx = await new Promise<any>((resolve, reject) => {
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                document.body.appendChild(canvas);
                RedGPU.init(canvas, (c: any) => resolve(c), (err: any) => reject(err));
            });

            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            ctx.addView(view);

            let physicsDestroyCount = 0;
            scene.physicsEngine = {
                destroy() {
                    physicsDestroyCount++;
                }
            };

            ctx.destroy();
            // 중복 destroy()에도 추가 호출되지 않아야 함
            scene.destroy();

            return {
                physicsDestroyCount,
                physicsEngineAfterDestroy: scene.physicsEngine
            };
        });

        expect(pageErrors).toEqual([]);
        expect(res.physicsDestroyCount).toBe(1);
        expect(res.physicsEngineAfterDestroy).toBeNull();
    });

    // 실제 브라우저 페이지 이동 후 뒤로가기(goBack) / 앞으로가기(goForward) 시 정상 렌더링 복구 검증
    test('back and forward navigation restores active WebGPU canvas rendering without freezing', async ({page}) => {
        const pageErrors: string[] = [];
        page.on('pageerror', (err) => pageErrors.push(err.message));

        await page.goto('/examples/3d/primitive/box/', {waitUntil: 'domcontentloaded'});
        await page.waitForSelector('canvas', {timeout: 15000});
        await page.waitForTimeout(500);

        await page.goto('/examples/3d/primitive/sphere/', {waitUntil: 'domcontentloaded'});
        await page.waitForSelector('canvas', {timeout: 15000});
        await page.waitForTimeout(500);

        // 뒤로가기 -> box 페이지 복귀
        await page.goBack({waitUntil: 'domcontentloaded'});
        await page.waitForTimeout(1000);
        const afterBack = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return {
                url: location.pathname,
                hasCanvas: Boolean(canvas),
                canvasWidth: canvas?.width ?? 0,
                canvasHeight: canvas?.height ?? 0
            };
        });

        // 앞으로가기 -> sphere 페이지 복귀
        await page.goForward({waitUntil: 'domcontentloaded'});
        await page.waitForTimeout(1000);
        const afterForward = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return {
                url: location.pathname,
                hasCanvas: Boolean(canvas),
                canvasWidth: canvas?.width ?? 0,
                canvasHeight: canvas?.height ?? 0
            };
        });

        expect(pageErrors).toEqual([]);
        expect(afterBack.hasCanvas).toBe(true);
        expect(afterBack.canvasWidth).toBeGreaterThan(0);
        expect(afterForward.hasCanvas).toBe(true);
        expect(afterForward.canvasWidth).toBeGreaterThan(0);
    });
});
