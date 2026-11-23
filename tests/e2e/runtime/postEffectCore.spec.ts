import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.Core', () => {
    // createBasicComputePassPostEffectCode 셰이더 생성 및 Single/MultiPass 포스트이펙트 기본 동작 검증
    test('verifies createBasicComputePassPostEffectCode, ASingleComputePassPostEffect, and AMultiPassPostEffect', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;

            // 1. 컴퓨트 셰이더 기본 생성, 워크그룹 크기 반영 및 커스텀 텍스처 바인딩 선언 검증
            const code1 = RedGPU.PostEffect.Core.createBasicComputePassPostEffectCode(
                {WORK_SIZE_X: 16, WORK_SIZE_Y: 16, WORK_SIZE_Z: 1},
                'return;'
            );
            const code2 = RedGPU.PostEffect.Core.createBasicComputePassPostEffectCode(
                {WORK_SIZE_X: 8, WORK_SIZE_Y: 4, WORK_SIZE_Z: 2},
                'return;'
            );
            const code3 = RedGPU.PostEffect.Core.createBasicComputePassPostEffectCode(
                {WORK_SIZE_X: 16, WORK_SIZE_Y: 16, WORK_SIZE_Z: 1},
                'return;',
                '',
                [{name: 'tex1'}, {name: 'tex2', textureType: 'texture_3d<f32>'}]
            );

            const codeGenOk =
                typeof code1 === 'string' &&
                code1.length > 0 &&
                code2.includes('@workgroup_size(8, 4, 2)') &&
                code3.includes('var tex1 : texture_2d<f32>;') &&
                code3.includes('var tex2 : texture_3d<f32>;');

            // 추상 포스트이펙트 베이스 클래스 검증용 테스트 서브클래스
            class SinglePass extends RedGPU.PostEffect.Core.ASingleComputePassPostEffect {
                constructor(ctx: any, options?: any) {
                    super(ctx, options);
                }
            }

            class MultiPass extends RedGPU.PostEffect.Core.AMultiPassPostEffect {
                constructor(ctx: any, passes: any) {
                    super(ctx, passes);
                }
            }

            // 2. GPUDevice 기반 SinglePass / MultiPass 초기화 및 null passList 예외 차단 검증
            const canvas = document.createElement('canvas');
            const gpuOk = await new Promise<boolean>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const eDefault = new SinglePass(ctx);
                            const eCustom = new SinglePass(ctx, {workSizeX: 8, workSizeY: 4, workSizeZ: 2});

                            const singleOk =
                                eDefault.WORK_SIZE_X === 16 &&
                                eDefault.WORK_SIZE_Y === 16 &&
                                eDefault.WORK_SIZE_Z === 1 &&
                                eCustom.WORK_SIZE_X === 8 &&
                                eCustom.WORK_SIZE_Y === 4 &&
                                eCustom.WORK_SIZE_Z === 2 &&
                                eDefault.videoMemorySize === 0 &&
                                eDefault.isInstanceofPostEffect === true;

                            const multi = new MultiPass(ctx, [eDefault, eCustom]);
                            const multiOk =
                                multi.passList.length === 2 &&
                                multi.passList[0] === eDefault &&
                                multi.passList[1] === eCustom;

                            let nullPassThrew = false;
                            try {
                                new MultiPass(ctx, null);
                            } catch {
                                nullPassThrew = true;
                            }

                            ctx.destroy();
                            resolve(singleOk && multiOk && nullPassThrew);
                        } catch (e) {
                            ctx.destroy();
                            reject(e);
                        }
                    },
                    (err: any) => reject(err)
                );
            });

            return {codeGenOk, gpuOk};
        });

        expect(result).toEqual({codeGenOk: true, gpuOk: true});
    });
});
