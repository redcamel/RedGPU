import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Display (Scene, Object3DContainer, Mesh, View3D)', () => {
    // 씬 그래프 자식 추가·조회·인덱스 변경·제거, Mesh 변환/불투명도 및 View3D 바인딩 검증
    test('manages scene graph hierarchy, mesh transforms/opacity, and View3D bindings cleanly', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            const canvas = document.createElement('canvas');
            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const scene = new RedGPU.Display.Scene();
                            const camera = new RedGPU.Camera.PerspectiveCamera();
                            const view = new RedGPU.Display.View3D(ctx, scene, camera);

                            const box = new RedGPU.Primitive.Box(ctx, 2, 2, 2);
                            const mat = new RedGPU.Material.ColorMaterial(ctx, '#ff0000');
                            const parent = new RedGPU.Display.Mesh(ctx, box, mat);
                            const childA = new RedGPU.Display.Mesh(ctx, box, mat);
                            const childB = new RedGPU.Display.Mesh(ctx, box, mat);

                            // 1. Scene 및 Mesh 계층 추가/포함/조회 검증
                            scene.addChild(parent);
                            parent.addChild(childA);
                            parent.addChild(childB);
                            const hierarchyOk =
                                scene.numChildren === 1 &&
                                scene.contains(parent) === true &&
                                parent.numChildren === 2 &&
                                parent.getChildAt(0) === childA &&
                                parent.getChildAt(1) === childB &&
                                childA.parent === parent;

                            // 2. 인덱스 변경(setChildIndex) 및 위치 교환(swapChildren) 검증
                            parent.swapChildren(childA, childB);
                            const swapOk =
                                parent.getChildAt(0) === childB &&
                                parent.getChildAt(1) === childA;

                            // 3. Mesh 위치·회전·스케일·불투명도 설정, dirty 플래그 갱신 및 opacity NaN/범위 초과 차단 검증
                            parent.dirtyTransform = false;
                            parent.dirtyOpacity = false;
                            parent.setPosition(10, 20, 30);
                            parent.setRotation(15, 30, 45);
                            parent.setScale(2, 3, 4);
                            parent.opacity = 0.5;
                            const transformOk =
                                parent.x === 10 &&
                                parent.y === 20 &&
                                parent.z === 30 &&
                                parent.rotationX === 15 &&
                                parent.rotationY === 30 &&
                                parent.rotationZ === 45 &&
                                parent.scaleX === 2 &&
                                parent.scaleY === 3 &&
                                parent.scaleZ === 4 &&
                                parent.opacity === 0.5 &&
                                parent.dirtyTransform === true &&
                                parent.dirtyOpacity === true &&
                                expectThrows(() => {
                                    parent.opacity = NaN;
                                }) &&
                                expectThrows(() => {
                                    parent.opacity = 1.5;
                                });

                            // 4. 자식 제거(removeChild / removeAllChildren) 및 부모 참조 해제 검증
                            parent.removeChild(childA);
                            const removeOneOk = parent.numChildren === 1 && childA.parent === null;
                            parent.removeAllChildren();
                            const removeAllOk = parent.numChildren === 0 && childB.parent === null;

                            // 5. View3D 씬/카메라 바인딩 및 RedGPUContext 뷰 등록·해제 검증
                            ctx.addView(view);
                            const viewOk =
                                view.scene === scene &&
                                view.camera === camera &&
                                ctx.numViews === 1;
                            ctx.removeView(view);
                            const removeViewOk = ctx.numViews === 0;

                            ctx.destroy();
                            resolve({
                                hierarchyOk,
                                swapOk,
                                transformOk,
                                removeOneOk,
                                removeAllOk,
                                viewOk,
                                removeViewOk
                            });
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });
        });

        expect(result).toEqual({
            hierarchyOk: true,
            swapOk: true,
            transformOk: true,
            removeOneOk: true,
            removeAllOk: true,
            viewOk: true,
            removeViewOk: true
        });
    });
});
