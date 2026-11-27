import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Raycaster3D & Raycaster2D with Live View', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(async () => {
        await harness.page.evaluate(() => {
            const ctx = (window as any).__REDGPU_CTX__;
            if (ctx) ctx.removeAllViews();
        });
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // View3D 카메라 행렬 기반 Raycaster3D.setFromCamera() 정밀 교차·거리순 정렬·UV 검증
    test('Raycaster3D.setFromCamera() hits front/back meshes sorted by distance with valid UV', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const renderer = new RedGPU.Renderer();

            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            cam.setPosition(0, 0, 10);
            cam.lookAt(0, 0, 0);
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            ctx.addView(view);

            const frontMesh = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Plane(ctx, 4, 4),
                new RedGPU.Material.ColorMaterial(ctx, '#ff0000')
            );
            frontMesh.setPosition(0, 0, 2);

            const backMesh = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Plane(ctx, 4, 4),
                new RedGPU.Material.ColorMaterial(ctx, '#0000ff')
            );
            backMesh.setPosition(0, 0, -2);

            scene.addChild(frontMesh);
            scene.addChild(backMesh);

            // modelMatrix / projectionMatrix 갱신을 위해 1프레임 렌더
            renderer.renderFrame(ctx, 16);

            const raycaster = new RedGPU.Picking.Raycaster3D();
            // 정중앙 대각선 공유 변(edge) 이중 교차를 피해 중앙에서 소폭 오프셋된 지점 투사
            const cx = view.screenRectObject.width * 0.5 + 8;
            const cy = view.screenRectObject.height * 0.5 + 8;
            raycaster.setFromCamera(cx, cy, view);

            const centerHits = raycaster.intersectObjects([backMesh, frontMesh]);

            // 화면 구석(메쉬 바깥) 레이는 미스
            raycaster.setFromCamera(2, 2, view);
            const cornerHits = raycaster.intersectObjects([backMesh, frontMesh]);

            renderer.destroy(ctx);
            return {
                hitCount: centerHits.length,
                firstIsFront: centerHits[0]?.object === frontMesh,
                secondIsBack: centerHits[1]?.object === backMesh,
                firstDistance: centerHits[0]?.distance,
                secondDistance: centerHits[1]?.distance,
                hasFiniteUv:
                    centerHits[0]?.uv !== undefined &&
                    Number.isFinite(centerHits[0].uv[0]) &&
                    Number.isFinite(centerHits[0].uv[1]),
                cornerHitCount: cornerHits.length
            };
        });

        expect(res.hitCount).toBe(2);
        expect(res.firstIsFront).toBe(true);
        expect(res.secondIsBack).toBe(true);
        expect(res.firstDistance).toBeCloseTo(8, 1);
        expect(res.secondDistance).toBeCloseTo(12, 1);
        expect(res.hasFiniteUv).toBe(true);
        expect(res.cornerHitCount).toBe(0);
    });

    // View2D 기반 Raycaster2D.setFromCamera() 스프라이트 내부 히트 / 외부 미스 검증
    test('Raycaster2D.setFromCamera() hits Sprite2D inside bounds and misses outside', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const renderer = new RedGPU.Renderer();

            const scene = new RedGPU.Display.Scene();
            const view2D = new RedGPU.Display.View2D(ctx, scene);
            ctx.addView(view2D);

            const sprite = new RedGPU.Display.Sprite2D(
                ctx,
                new RedGPU.Material.ColorMaterial(ctx, '#00ff88')
            );
            sprite.setSize(100, 100);
            sprite.setPosition(200, 150);
            scene.addChild(sprite);

            renderer.renderFrame(ctx, 16);

            const raycaster = new RedGPU.Picking.Raycaster2D();
            raycaster.setFromCamera(200, 150, view2D);
            const insideHits = raycaster.intersectObject(sprite);

            raycaster.setFromCamera(10, 10, view2D);
            const outsideHits = raycaster.intersectObject(sprite);

            renderer.destroy(ctx);
            return {
                insideCount: insideHits.length,
                insideTargetMatch: insideHits[0]?.object === sprite,
                outsideCount: outsideHits.length
            };
        });

        expect(res).toEqual({
            insideCount: 1,
            insideTargetMatch: true,
            outsideCount: 0
        });
    });
});
