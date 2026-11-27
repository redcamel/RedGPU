import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PickingManager GPU ID Buffer Picking', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(async () => {
        await harness.page.evaluate(() => {
            const ctx = (window as any).__REDGPU_CTX__;
            if (ctx) {
                if ((window as any).__E2E_PICKING_RENDERER__) {
                    (window as any).__E2E_PICKING_RENDERER__.destroy(ctx);
                    (window as any).__E2E_PICKING_RENDERER__ = null;
                }
                ctx.removeAllViews();
            }
        });
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // 좌/우 배치된 2개 메쉬에 대해 실제 마우스 클릭으로 GPU 피킹 ID 텍스처 판독 및 정확한 target.uuid 수신, visible=false 제외 검증
    test('dispatches GPU picking CLICK event with exact target.uuid and excludes hidden meshes', async () => {
        const setup = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const cam = new RedGPU.Camera.PerspectiveCamera();
            cam.setPosition(0, 0, 8);
            cam.lookAt(0, 0, 0);
            const view = new RedGPU.Display.View3D(ctx, scene, cam);
            ctx.addView(view);

            const leftMesh = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Box(ctx, 2.5, 2.5, 1),
                new RedGPU.Material.ColorMaterial(ctx, '#ff3333')
            );
            leftMesh.setPosition(-2.0, 0, 0);

            const rightMesh = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Box(ctx, 2.5, 2.5, 1),
                new RedGPU.Material.ColorMaterial(ctx, '#3333ff')
            );
            rightMesh.setPosition(2.0, 0, 0);

            const pickedIds: string[] = [];
            (window as any).__E2E_PICKED_IDS__ = pickedIds;
            (window as any).__E2E_LEFT_MESH__ = leftMesh;
            (window as any).__E2E_VIEW__ = view;

            const {CLICK} = RedGPU.Picking.PICKING_EVENT_TYPE;
            leftMesh.addListener(CLICK, (ev: any) => pickedIds.push(ev.target.uuid));
            rightMesh.addListener(CLICK, (ev: any) => pickedIds.push(ev.target.uuid));

            scene.addChild(leftMesh);
            scene.addChild(rightMesh);

            const renderer = new RedGPU.Renderer();
            (window as any).__E2E_PICKING_RENDERER__ = renderer;
            renderer.renderFrame(ctx, 16);
            renderer.start(ctx, () => {
            });

            const rect = ctx.htmlCanvas.getBoundingClientRect();
            const leftScreen = leftMesh.getScreenPoint(view);
            const rightScreen = rightMesh.getScreenPoint(view);
            return {
                leftUuid: leftMesh.uuid,
                rightUuid: rightMesh.uuid,
                leftScreenX: rect.left + leftScreen[0],
                leftScreenY: rect.top + leftScreen[1],
                rightScreenX: rect.left + rightScreen[0],
                rightScreenY: rect.top + rightScreen[1]
            };
        });

        // 첫 몇 프레임 렌더링 및 피킹 텍스처 준비 대기
        await harness.page.waitForTimeout(150);

        // 왼쪽 메쉬 클릭
        await harness.page.mouse.move(setup.leftScreenX, setup.leftScreenY);
        await harness.page.waitForTimeout(80);
        await harness.page.mouse.click(setup.leftScreenX, setup.leftScreenY);
        await harness.page.waitForTimeout(180);

        // 오른쪽 메쉬 클릭
        await harness.page.mouse.move(setup.rightScreenX, setup.rightScreenY);
        await harness.page.waitForTimeout(80);
        await harness.page.mouse.click(setup.rightScreenX, setup.rightScreenY);
        await harness.page.waitForTimeout(180);

        // 왼쪽 메쉬를 숨긴 뒤 동일 좌표 재클릭 (이벤트 미발생 확인)
        await harness.page.evaluate(() => {
            (window as any).__E2E_LEFT_MESH__.visible = false;
        });
        await harness.page.waitForTimeout(150);
        await harness.page.mouse.move(setup.leftScreenX, setup.leftScreenY);
        await harness.page.waitForTimeout(80);
        await harness.page.mouse.click(setup.leftScreenX, setup.leftScreenY);
        await harness.page.waitForTimeout(180);

        const result = await harness.page.evaluate(() => {
            const view = (window as any).__E2E_VIEW__;
            return {
                pickedIds: (window as any).__E2E_PICKED_IDS__,
                hasPickingTexture: Boolean(view.pickingManager.pickingGPUTexture),
                pickingVram: view.pickingManager.videoMemorySize
            };
        });

        expect(result.hasPickingTexture).toBe(true);
        expect(result.pickingVram).toBeGreaterThan(0);
        expect(result.pickedIds).toEqual([setup.leftUuid, setup.rightUuid]);
    });
});
