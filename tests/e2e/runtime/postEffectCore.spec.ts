import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.Core', () => {
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

    // createBasicComputePassPostEffectCode의 워크그룹 크기 및 커스텀 텍스처 바인딩 코드 생성 검증
    test('generates compute pass WGSL code with workgroup sizes and custom texture bindings', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
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
            return (
                typeof code1 === 'string' &&
                code1.length > 0 &&
                code2.includes('@workgroup_size(8, 4, 2)') &&
                code3.includes('var tex1 : texture_2d<f32>;') &&
                code3.includes('var tex2 : texture_3d<f32>;')
            );
        });

        expect(ok).toBe(true);
    });

    // ASingleComputePassPostEffect 기본/커스텀 WORK_SIZE, videoMemorySize 및 식별 플래그 검증
    test('initializes ASingleComputePassPostEffect workgroup sizes and base properties', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            class SinglePass extends RedGPU.PostEffect.Core.ASingleComputePassPostEffect {
                constructor(c: any, options?: any) {
                    super(c, options);
                }
            }

            const eDefault = new SinglePass(ctx);
            const eCustom = new SinglePass(ctx, {workSizeX: 8, workSizeY: 4, workSizeZ: 2});
            return (
                eDefault.WORK_SIZE_X === 16 &&
                eDefault.WORK_SIZE_Y === 16 &&
                eDefault.WORK_SIZE_Z === 1 &&
                eCustom.WORK_SIZE_X === 8 &&
                eCustom.WORK_SIZE_Y === 4 &&
                eCustom.WORK_SIZE_Z === 2 &&
                eDefault.videoMemorySize === 0 &&
                eDefault.isInstanceofPostEffect === true
            );
        });

        expect(ok).toBe(true);
    });

    // AMultiPassPostEffect 패스 체이닝 및 null passList 전달 시 예외 발생 검증
    test('chains passes in AMultiPassPostEffect and throws on null passList', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;

            class SinglePass extends RedGPU.PostEffect.Core.ASingleComputePassPostEffect {
                constructor(c: any) {
                    super(c);
                }
            }

            class MultiPass extends RedGPU.PostEffect.Core.AMultiPassPostEffect {
                constructor(c: any, passes: any) {
                    super(c, passes);
                }
            }

            const p1 = new SinglePass(ctx);
            const p2 = new SinglePass(ctx);
            const multi = new MultiPass(ctx, [p1, p2]);
            const chainOk = multi.passList.length === 2 && multi.passList[0] === p1 && multi.passList[1] === p2;

            let nullThrew = false;
            try {
                new MultiPass(ctx, null);
            } catch {
                nullThrew = true;
            }
            return chainOk && nullThrew;
        });

        expect(ok).toBe(true);
    });
});
