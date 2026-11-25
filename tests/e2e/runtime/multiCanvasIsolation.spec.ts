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
});
