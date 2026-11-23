import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Material (ColorMaterial, PhongMaterial, PBRMaterial)', () => {
    // ColorMaterial, PhongMaterial, PBRMaterial 기본 속성, Setter 갱신 및 NaN/범위 초과 차단 검증
    test('validates defaults, property updates, opacity/transparent flags, and NaN rejection across core materials', async ({page}) => {
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
                            // 1. ColorMaterial 초기화, 색상 변경 및 투명도 설정 검증
                            const colorMat = new RedGPU.Material.ColorMaterial(ctx, '#ff0000');
                            const colorInitOk =
                                colorMat.color.r === 255 &&
                                colorMat.color.g === 0 &&
                                colorMat.color.b === 0 &&
                                colorMat.opacity === 1 &&
                                colorMat.transparent === false;

                            colorMat.opacity = 0.4;
                            colorMat.transparent = true;
                            const colorUpdateOk =
                                Math.abs(colorMat.opacity - 0.4) < 1e-4 &&
                                colorMat.transparent === true &&
                                expectThrows(() => {
                                    colorMat.opacity = NaN;
                                });

                            // 2. PhongMaterial 기본값, 광택도/스펙큘러 강도 갱신 및 음수·NaN 차단 검증
                            const phongMat = new RedGPU.Material.PhongMaterial(ctx, '#00ff00');
                            phongMat.shininess = 64;
                            phongMat.specularStrength = 0.8;
                            phongMat.emissiveStrength = 1.5;
                            const phongOk =
                                phongMat.color.g === 255 &&
                                phongMat.shininess === 64 &&
                                Math.abs(phongMat.specularStrength - 0.8) < 1e-4 &&
                                Math.abs(phongMat.emissiveStrength - 1.5) < 1e-4 &&
                                expectThrows(() => {
                                    phongMat.shininess = NaN;
                                }) &&
                                expectThrows(() => {
                                    phongMat.specularStrength = -1;
                                });

                            // 3. PBRMaterial 기본 Factor, metallic/roughness/emissive/clearcoat 갱신 및 NaN 차단 검증
                            const pbrMat = new RedGPU.Material.PBRMaterial(ctx);
                            const pbrDefaultsOk =
                                pbrMat.metallicFactor === 0 &&
                                pbrMat.roughnessFactor === 1 &&
                                pbrMat.occlusionStrength === 1;

                            pbrMat.baseColorFactor = [0.2, 0.4, 0.6, 1.0];
                            pbrMat.metallicFactor = 0.9;
                            pbrMat.roughnessFactor = 0.25;
                            pbrMat.emissiveFactor = [0.5, 0.5, 0.5];
                            pbrMat.KHR_clearcoatFactor = 0.7;
                            const pbrUpdateOk =
                                Math.abs(pbrMat.metallicFactor - 0.9) < 1e-4 &&
                                Math.abs(pbrMat.roughnessFactor - 0.25) < 1e-4 &&
                                Math.abs(pbrMat.KHR_clearcoatFactor - 0.7) < 1e-4 &&
                                Math.abs(pbrMat.baseColorFactor[0] - 0.2) < 1e-4 &&
                                Math.abs(pbrMat.emissiveFactor[0] - 0.5) < 1e-4 &&
                                expectThrows(() => {
                                    pbrMat.metallicFactor = NaN;
                                }) &&
                                expectThrows(() => {
                                    pbrMat.roughnessFactor = -0.1;
                                });

                            ctx.destroy();
                            resolve({
                                colorInitOk,
                                colorUpdateOk,
                                phongOk,
                                pbrDefaultsOk,
                                pbrUpdateOk
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
            colorInitOk: true,
            colorUpdateOk: true,
            phongOk: true,
            pbrDefaultsOk: true,
            pbrUpdateOk: true
        });
    });
});
