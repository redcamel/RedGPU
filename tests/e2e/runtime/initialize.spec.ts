import {test as rawTest} from '@playwright/test';
import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('RedGPU.init', () => {
    // 최소 인자 초기화 및 validateRedGPUContext 정상 통과 검증
    test('initializes RedGPUContext with minimal arguments and passes validateRedGPUContext', async ({page}) => {
        await openWebGPUHarness(page);

        const res = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');
            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        const isInstance = ctx instanceof RedGPU.Context.RedGPUContext;
                        const isValid = RedGPU.RuntimeChecker.validateRedGPUContext(ctx);
                        ctx.destroy();
                        resolve({isInstance, isValid});
                    },
                    (err: any) => reject(err)
                );
            });
        });

        expect(res).toEqual({isInstance: true, isValid: true});
    });

    // alphaMode = 'opaque' 옵션 전달 시 컨텍스트 alphaMode 반영 검증
    test('initializes with alphaMode = opaque', async ({page}) => {
        await openWebGPUHarness(page);

        const alphaMode = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');
            return await new Promise<string>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        const mode = ctx.alphaMode;
                        ctx.destroy();
                        resolve(mode);
                    },
                    (err: any) => reject(err),
                    undefined,
                    'opaque'
                );
            });
        });

        expect(alphaMode).toBe('opaque');
    });

    // 커스텀 requestAdapterOptions(powerPreference) 전달 초기화 검증
    test('initializes with custom requestAdapterOptions', async ({page}) => {
        await openWebGPUHarness(page);

        const ok = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');
            return await new Promise<boolean>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        const isInstance = ctx instanceof RedGPU.Context.RedGPUContext;
                        ctx.destroy();
                        resolve(isInstance);
                    },
                    (err: any) => reject(err),
                    undefined,
                    'premultiplied',
                    {powerPreference: 'low-power'}
                );
            });
        });

        expect(ok).toBe(true);
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

        expect(results).toEqual({
            nullCanvas: true,
            divCanvas: true,
            nullCallback: true,
            objectCallback: true
        });
    });
});
