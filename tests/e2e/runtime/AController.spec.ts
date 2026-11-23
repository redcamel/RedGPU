import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Camera.Core.AController', () => {
    // 기본 카메라 초기화, 좌표 전달, keyboardActiveView 상태 관리 및 destroy 해제 검증
    test('initializes camera, passes through coordinates, manages keyboardActiveView, and destroys cleanly', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            // 추상 클래스 AController 검증용 테스트 서브클래스
            class TestController extends RedGPU.Camera.Core.AController {
                constructor(ctx: any, info: any) {
                    super(ctx, info);
                }
            }

            const canvas = document.createElement('canvas');
            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const controller = new TestController(ctx, {});
                            const initialOk =
                                controller.camera instanceof RedGPU.Camera.PerspectiveCamera &&
                                controller.x === 0 &&
                                controller.y === 0 &&
                                controller.z === 0 &&
                                controller.hoveredView === null &&
                                controller.keyboardActiveView === null;

                            // 내부 카메라 위치가 컨트롤러 x/y/z Getter로 그대로 노출되는지 확인
                            controller.camera.setPosition(10, 20, 30);
                            const coordsOk = controller.x === 10 && controller.y === 20 && controller.z === 30;

                            // 전역 키보드 활성 뷰 지정 및 해제 검증
                            const mockView = {name: 'mockView'};
                            controller.keyboardActiveView = mockView;
                            const keyboardSetOk =
                                controller.keyboardActiveView === mockView &&
                                controller.isKeyboardActiveController === true;

                            controller.keyboardActiveView = null;
                            const keyboardClearOk =
                                controller.keyboardActiveView === null &&
                                controller.isKeyboardActiveController === false;

                            controller.keyboardProcessedThisFrame = true;
                            const processedOk = controller.keyboardProcessedThisFrame === true;

                            controller.destroy();
                            ctx.destroy();

                            resolve({initialOk, coordsOk, keyboardSetOk, keyboardClearOk, processedOk});
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
            initialOk: true,
            coordsOk: true,
            keyboardSetOk: true,
            keyboardClearOk: true,
            processedOk: true
        });
    });
});
