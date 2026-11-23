import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('BaseObject.RedGPUObject', () => {
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

    // RedGPUContext 전달 시 내부 매니저 Getter 참조 일치 검증
    test('exposes matching context, device, and manager getters', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            class TestRedGPUObject extends RedGPU.BaseObject.RedGPUObject {
                constructor(c: any) {
                    super(c);
                }
            }

            const obj = new TestRedGPUObject(ctx);
            return (
                obj.redGPUContext === ctx &&
                obj.gpuDevice === ctx.gpuDevice &&
                obj.resourceManager === ctx.resourceManager &&
                obj.antialiasingManager === ctx.antialiasingManager &&
                obj.commandEncoderManager === ctx.commandEncoderManager
            );
        });

        expect(ok).toBe(true);
    });

    // RedGPUContext 인스턴스가 아닌 비정상 인자 전달 시 생성자 예외 발생 검증
    test('rejects non-RedGPUContext arguments in constructor', async () => {
        const allThrew = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;

            class TestRedGPUObject extends RedGPU.BaseObject.RedGPUObject {
                constructor(c: any) {
                    super(c);
                }
            }

            const invalidValues = [null, undefined, NaN, 123, 'string', {}, []];
            return invalidValues.every((v) => {
                try {
                    new TestRedGPUObject(v);
                    return false;
                } catch {
                    return true;
                }
            });
        });

        expect(allThrew).toBe(true);
    });
});
