import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.PostEffectManager & BuiltInEffectManager', () => {
    // 매니저 기본 리소스, 이펙트 목록 제어, 빌트인 이펙트 지연 생성 및 HeightFog 유효성 검증
    test('verifies manager properties, effect list ops, lazy-loaded built-in effects, G-Buffer layout, and HeightFog validation', async ({page}) => {
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
                            const scene = new RedGPU.Display.Scene(ctx);
                            const camera = new RedGPU.Camera.PerspectiveCamera(ctx);
                            const view = new RedGPU.Display.View3D(ctx, scene, camera);
                            const manager = view.postEffectManager;

                            // 1. PostEffectManager 초기 상태 및 G-Buffer 레이아웃/유니폼 버퍼 검증
                            const initialOk =
                                manager.view === view &&
                                manager.texturePool instanceof RedGPU.PostEffect.Core.PostEffectTexturePool &&
                                manager.postEffectSystemUniformBuffer instanceof RedGPU.Resource.UniformBuffer &&
                                Array.isArray(manager.effectList) &&
                                manager.effectList.length === 0 &&
                                manager.gbufferBindGroupLayout instanceof GPUBindGroupLayout &&
                                typeof manager.videoMemorySize === 'number' &&
                                typeof manager.render === 'function';

                            // 2. 커스텀 이펙트 추가·조회·개별 삭제·전체 삭제 검증
                            const effect = {
                                clear: () => {
                                }, render: () => {
                                }
                            };
                            manager.addEffect(effect);
                            const addOk = manager.effectList.length === 1 && manager.getEffectAt(0) === effect;
                            manager.removeEffect(effect);
                            const removeOk = manager.effectList.length === 0;
                            manager.addEffect(effect);
                            manager.removeEffectAt(0);
                            const removeAtOk = manager.effectList.length === 0;
                            manager.addEffect(effect);
                            manager.addEffect({
                                clear: () => {
                                }
                            });
                            manager.removeAllEffect();
                            const removeAllOk = manager.effectList.length === 0;

                            // 3. BuiltInEffectManager 11종 빌트인 이펙트 지연 생성 및 토글 검증
                            const b = view.builtInEffectManager;
                            const lazyOk =
                                b.ssao instanceof RedGPU.PostEffect.Core.AMultiPassPostEffect &&
                                b.ssr instanceof RedGPU.PostEffect.Core.ASingleComputePassPostEffect &&
                                b.fog instanceof RedGPU.PostEffect.BuiltIn.Fog &&
                                b.heightFog instanceof RedGPU.PostEffect.BuiltIn.HeightFog &&
                                b.dof instanceof RedGPU.PostEffect.Core.AMultiPassPostEffect &&
                                b.bloom instanceof RedGPU.PostEffect.Core.AMultiPassPostEffect &&
                                b.autoExposure instanceof RedGPU.PostEffect.BuiltIn.AutoExposure &&
                                b.chromaticAberration instanceof RedGPU.PostEffect.BuiltIn.ChromaticAberration &&
                                b.lensDistortion instanceof RedGPU.PostEffect.BuiltIn.LensDistortion &&
                                b.vignetting instanceof RedGPU.PostEffect.BuiltIn.Vignetting &&
                                b.filmGrain instanceof RedGPU.PostEffect.BuiltIn.FilmGrain;

                            b.useSSAO = true;
                            b.useSSR = true;
                            b.useFog = true;
                            b.useHeightFog = true;
                            b.useDOF = true;
                            b.useBloom = true;
                            b.useChromaticAberration = true;
                            b.useLensDistortion = true;
                            b.useVignetting = true;
                            b.useFilmGrain = true;
                            const togglesOk =
                                b.useSSAO &&
                                b.useSSR &&
                                b.useFog &&
                                b.useHeightFog &&
                                b.useDOF &&
                                b.useBloom &&
                                b.useChromaticAberration &&
                                b.useLensDistortion &&
                                b.useVignetting &&
                                b.useFilmGrain;

                            // 4. HeightFog 기본값, Setter 갱신 및 NaN/음수 fogType 차단 검증
                            const hf = b.heightFog;
                            const hfDefaultsOk =
                                hf.density === 0.02 &&
                                hf.baseHeight === 0 &&
                                hf.height === 20 &&
                                hf.nearDistance === 0 &&
                                hf.farDistance === 50 &&
                                hf.maxOpacity === 1 &&
                                hf.fogType === RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL &&
                                hf.fogColor instanceof RedGPU.Color.ColorRGB;

                            hf.density = 0.5;
                            hf.baseHeight = -5;
                            hf.height = 15;
                            hf.nearDistance = 2;
                            hf.farDistance = 80;
                            hf.maxOpacity = 0.85;
                            hf.fogType = RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL_SQUARED;
                            hf.fogColor.setColorByRGB(180, 200, 240);

                            const hfUpdatedOk =
                                Math.abs(hf.density - 0.5) < 1e-4 &&
                                hf.baseHeight === -5 &&
                                hf.height === 15 &&
                                hf.nearDistance === 2 &&
                                hf.farDistance === 80 &&
                                Math.abs(hf.maxOpacity - 0.85) < 1e-4 &&
                                hf.fogType === RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL_SQUARED &&
                                hf.fogColor.r === 180 &&
                                hf.fogColor.g === 200 &&
                                hf.fogColor.b === 240;

                            const hfValidationOk =
                                expectThrows(() => {
                                    hf.density = NaN;
                                }) &&
                                expectThrows(() => {
                                    hf.baseHeight = NaN;
                                }) &&
                                expectThrows(() => {
                                    hf.fogType = -1;
                                });

                            manager.clear();
                            ctx.destroy();

                            resolve({
                                initialOk,
                                listOpsOk: addOk && removeOk && removeAtOk && removeAllOk,
                                lazyOk,
                                togglesOk,
                                hfDefaultsOk,
                                hfUpdatedOk,
                                hfValidationOk
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
            initialOk: true,
            listOpsOk: true,
            lazyOk: true,
            togglesOk: true,
            hfDefaultsOk: true,
            hfUpdatedOk: true,
            hfValidationOk: true
        });
    });
});
