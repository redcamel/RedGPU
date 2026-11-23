import {test as rawTest} from '@playwright/test';
import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('RedGPU.init', () => {
    // 최소 인자, opaque alphaMode, 커스텀 어댑터 옵션 초기화 및 validateRedGPUContext 검증
    test('initializes RedGPUContext with minimal args, opaque alphaMode, custom adapter options, and validates context', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            // 콜백 기반 RedGPU.init을 Promise로 감싸 순차 검증
            const initAsync = (...args: any[]) =>
                new Promise<any>((resolve, reject) => {
                    const [canvas, ...rest] = args;
                    RedGPU.init(
                        canvas,
                        (ctx: any) => resolve(ctx),
                        (err: any) => reject(err),
                        ...rest
                    );
                });

            // 1. 최소 인자 초기화 및 RuntimeChecker.validateRedGPUContext 정상 통과 검증
            const c1 = document.createElement('canvas');
            const ctx1 = await initAsync(c1);
            const isInstance1 = ctx1 instanceof RedGPU.Context.RedGPUContext;
            const isContextValid = RedGPU.RuntimeChecker.validateRedGPUContext(ctx1);
            ctx1.destroy();

            // 2. alphaMode = 'opaque' 옵션 반영 검증
            const c2 = document.createElement('canvas');
            const ctx2 = await initAsync(c2, undefined, 'opaque');
            const alphaMode2 = ctx2.alphaMode;
            ctx2.destroy();

            // 3. 커스텀 requestAdapterOptions(powerPreference) 전달 초기화 검증
            const c3 = document.createElement('canvas');
            const ctx3 = await initAsync(c3, undefined, 'premultiplied', {powerPreference: 'low-power'});
            const isInstance3 = ctx3 instanceof RedGPU.Context.RedGPUContext;
            ctx3.destroy();

            return {isInstance1, isContextValid, alphaMode2, isInstance3};
        });

        expect(result.isInstance1).toBe(true);
        expect(result.isContextValid).toBe(true);
        expect(result.alphaMode2).toBe('opaque');
        expect(result.isInstance3).toBe(true);
    });

    // RedGPU.init 내부 errorHandler가 console.error를 출력하므로 의도된 실패 검증에는 rawTest 사용
    rawTest('rejects invalid canvas and callback arguments via onError callback', async ({page}) => {
        await openWebGPUHarness(page);

        const results = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');

            const callInitExpectError = (targetCanvas: any, onInit: any) =>
                new Promise<boolean>((resolve) => {
                    try {
                        RedGPU.init(
                            targetCanvas,
                            typeof onInit === 'function'
                                ? (ctx: any) => {
                                    ctx.destroy();
                                    resolve(false);
                                }
                                : onInit,
                            () => resolve(true)
                        );
                    } catch {
                        resolve(true);
                    }
                });

            return {
                nullCanvas: await callInitExpectError(null, (ctx: any) => ctx.destroy()),
                divCanvas: await callInitExpectError(document.createElement('div'), (ctx: any) => ctx.destroy()),
                nullCallback: await callInitExpectError(canvas, null),
                objectCallback: await callInitExpectError(canvas, {})
            };
        });

        expect(results.nullCanvas).toBe(true);
        expect(results.divCanvas).toBe(true);
        expect(results.nullCallback).toBe(true);
        expect(results.objectCallback).toBe(true);
    });
});
