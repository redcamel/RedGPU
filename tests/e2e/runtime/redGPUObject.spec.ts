import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('BaseObject.RedGPUObject', () => {
    // RedGPUObject 컨텍스트/디바이스/매니저 Getter 노출 및 비정상 RedGPUContext 입력 차단 검증
    test('exposes context/device/manager getters and rejects invalid RedGPUContext values', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            // RedGPUObject 상속 검증용 테스트 서브클래스
            class TestRedGPUObject extends RedGPU.BaseObject.RedGPUObject {
                constructor(ctx: any) {
                    super(ctx);
                }
            }

            // RedGPUContext가 아닌 값 전달 시 생성자에서 예외 발생 검증
            const invalidValues = [null, undefined, NaN, 123, 'string', {}, []];
            const invalidAllThrew = invalidValues.every((v) => {
                try {
                    new TestRedGPUObject(v);
                    return false;
                } catch {
                    return true;
                }
            });

            // 실제 RedGPUContext 전달 시 내부 매니저 Getter 참조 일치 검증
            const canvas = document.createElement('canvas');
            const gettersOk = await new Promise<boolean>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const obj = new TestRedGPUObject(ctx);
                            const ok =
                                obj.redGPUContext === ctx &&
                                obj.gpuDevice === ctx.gpuDevice &&
                                obj.resourceManager === ctx.resourceManager &&
                                obj.antialiasingManager === ctx.antialiasingManager &&
                                obj.commandEncoderManager === ctx.commandEncoderManager;
                            ctx.destroy();
                            resolve(ok);
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });

            return {gettersOk, invalidAllThrew};
        });

        expect(result).toEqual({gettersOk: true, invalidAllThrew: true});
    });
});
