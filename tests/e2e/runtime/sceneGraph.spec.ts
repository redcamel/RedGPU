import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Display (Scene, Object3DContainer, Mesh, View3D)', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(() => {
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // Scene 및 Mesh 부모-자식 계층 추가·포함 여부·인덱스 조회 검증
    test('adds and queries children in Scene and Mesh hierarchy', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const box = new RedGPU.Primitive.Box(ctx, 2, 2, 2);
            const mat = new RedGPU.Material.ColorMaterial(ctx, '#ff0000');
            const parent = new RedGPU.Display.Mesh(ctx, box, mat);
            const childA = new RedGPU.Display.Mesh(ctx, box, mat);
            const childB = new RedGPU.Display.Mesh(ctx, box, mat);

            scene.addChild(parent);
            parent.addChild(childA);
            parent.addChild(childB);

            return (
                scene.numChildren === 1 &&
                scene.contains(parent) === true &&
                parent.numChildren === 2 &&
                parent.getChildAt(0) === childA &&
                parent.getChildAt(1) === childB &&
                childA.parent === parent
            );
        });

        expect(ok).toBe(true);
    });

    // swapChildren 및 removeChild / removeAllChildren 계층 변경·부모 참조 해제 검증
    test('swaps and removes children while clearing parent references', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const box = new RedGPU.Primitive.Box(ctx, 1, 1, 1);
            const mat = new RedGPU.Material.ColorMaterial(ctx, '#00ff00');
            const parent = new RedGPU.Display.Mesh(ctx, box, mat);
            const childA = new RedGPU.Display.Mesh(ctx, box, mat);
            const childB = new RedGPU.Display.Mesh(ctx, box, mat);

            parent.addChild(childA);
            parent.addChild(childB);
            parent.swapChildren(childA, childB);
            const swapOk = parent.getChildAt(0) === childB && parent.getChildAt(1) === childA;

            parent.removeChild(childA);
            const removeOneOk = parent.numChildren === 1 && childA.parent === null;

            parent.removeAllChildren();
            const removeAllOk = parent.numChildren === 0 && childB.parent === null;

            return swapOk && removeOneOk && removeAllOk;
        });

        expect(ok).toBe(true);
    });

    // Mesh 위치·회전·스케일·불투명도 설정, dirty 플래그 갱신 및 opacity NaN/범위 초과 차단 검증
    test('updates Mesh transform/opacity with dirty flags and rejects invalid opacity', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const mesh = new RedGPU.Display.Mesh(
                ctx,
                new RedGPU.Primitive.Box(ctx),
                new RedGPU.Material.ColorMaterial(ctx)
            );

            mesh.dirtyTransform = false;
            mesh.dirtyOpacity = false;
            mesh.setPosition(10, 20, 30);
            mesh.setRotation(15, 30, 45);
            mesh.setScale(2, 3, 4);
            mesh.opacity = 0.5;

            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            return (
                mesh.x === 10 &&
                mesh.y === 20 &&
                mesh.z === 30 &&
                mesh.rotationX === 15 &&
                mesh.rotationY === 30 &&
                mesh.rotationZ === 45 &&
                mesh.scaleX === 2 &&
                mesh.scaleY === 3 &&
                mesh.scaleZ === 4 &&
                mesh.opacity === 0.5 &&
                mesh.dirtyTransform === true &&
                mesh.dirtyOpacity === true &&
                expectThrows(() => {
                    mesh.opacity = NaN;
                }) &&
                expectThrows(() => {
                    mesh.opacity = 1.5;
                })
            );
        });

        expect(ok).toBe(true);
    });

    // View3D 씬·카메라 바인딩 및 RedGPUContext 뷰 등록/해제 검증
    test('binds Scene/Camera to View3D and registers/removes view on RedGPUContext', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const camera = new RedGPU.Camera.PerspectiveCamera();
            const view = new RedGPU.Display.View3D(ctx, scene, camera);

            ctx.addView(view);
            const addedOk = view.scene === scene && view.camera === camera && ctx.numViews === 1;
            ctx.removeView(view);
            const removedOk = ctx.numViews === 0;

            return addedOk && removedOk;
        });

        expect(ok).toBe(true);
    });

    // Object3DContainer.visible 기본값, 비-불리언 거부 및 부모 visible=false 시 자식 렌더링 스킵 검증
    test('propagates visible flag across Scene, Group3D, and Mesh and skips hidden subtrees', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const scene = new RedGPU.Display.Scene();
            const group = new RedGPU.Display.Group3D();
            const child = new RedGPU.Display.Mesh(ctx);
            group.addChild(child);

            const defaultsOk = scene.visible === true && group.visible === true && child.visible === true;

            let nonBoolRejected = false;
            try {
                group.visible = 0;
            } catch {
                nonBoolRejected = true;
            }

            let childRendered = false;
            const origRender = child.render.bind(child);
            child.render = (state: any) => {
                childRendered = true;
                return origRender(state);
            };
            group.visible = false;
            group.render({view: {}, isScene2DMode: false, renderResults: {num3DGroups: 0}});
            const skipOk = group.visible === false && childRendered === false;

            return defaultsOk && nonBoolRejected && skipOk;
        });

        expect(ok).toBe(true);
    });
});
