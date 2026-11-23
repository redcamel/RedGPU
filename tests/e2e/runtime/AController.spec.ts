import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Camera.Core.AController', () => {
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

    // 기본 PerspectiveCamera 생성 및 초기 좌표·호버/키보드 뷰 상태 검증
    test('initializes default PerspectiveCamera and initial state getters', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            class TestController extends RedGPU.Camera.Core.AController {
                constructor(c: any, info: any) {
                    super(c, info);
                }
            }

            const controller = new TestController(ctx, {});
            const valid =
                controller.camera instanceof RedGPU.Camera.PerspectiveCamera &&
                controller.x === 0 &&
                controller.y === 0 &&
                controller.z === 0 &&
                controller.hoveredView === null &&
                controller.keyboardActiveView === null;
            controller.destroy();
            return valid;
        });

        expect(ok).toBe(true);
    });

    // 내부 카메라 위치 변경 시 컨트롤러 x/y/z Getter로 그대로 전달되는지 검증
    test('passes through camera coordinates via x, y, z getters', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            class TestController extends RedGPU.Camera.Core.AController {
                constructor(c: any, info: any) {
                    super(c, info);
                }
            }

            const controller = new TestController(ctx, {});
            controller.camera.setPosition(10, 20, 30);
            const valid = controller.x === 10 && controller.y === 20 && controller.z === 30;
            controller.destroy();
            return valid;
        });

        expect(ok).toBe(true);
    });

    // keyboardActiveView 및 keyboardProcessedThisFrame 상태 전환 검증
    test('manages keyboardActiveView and keyboardProcessedThisFrame state', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            class TestController extends RedGPU.Camera.Core.AController {
                constructor(c: any, info: any) {
                    super(c, info);
                }
            }

            const controller = new TestController(ctx, {});
            const mockView = {name: 'mockView'};
            controller.keyboardActiveView = mockView;
            const setOk =
                controller.keyboardActiveView === mockView &&
                controller.isKeyboardActiveController === true;

            controller.keyboardActiveView = null;
            const clearOk =
                controller.keyboardActiveView === null &&
                controller.isKeyboardActiveController === false;

            controller.keyboardProcessedThisFrame = true;
            const processedOk = controller.keyboardProcessedThisFrame === true;
            controller.destroy();
            return setOk && clearOk && processedOk;
        });

        expect(ok).toBe(true);
    });
});
