import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Material (ColorMaterial, PhongMaterial, PBRMaterial)', () => {
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

    // ColorMaterial 기본 색상/투명도 초기화, 갱신 및 opacity NaN 차단 검증
    test('validates ColorMaterial defaults, opacity/transparent updates, and NaN rejection', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const mat = new RedGPU.Material.ColorMaterial(ctx, '#ff0000');

            const initOk =
                mat.color.r === 255 &&
                mat.color.g === 0 &&
                mat.color.b === 0 &&
                mat.opacity === 1 &&
                mat.transparent === false;

            mat.opacity = 0.4;
            mat.transparent = true;

            let nanThrew = false;
            try {
                mat.opacity = NaN;
            } catch {
                nanThrew = true;
            }

            return initOk && Math.abs(mat.opacity - 0.4) < 1e-4 && mat.transparent === true && nanThrew;
        });

        expect(ok).toBe(true);
    });

    // PhongMaterial 광택도·스펙큘러·발광 강도 갱신 및 NaN/음수 차단 검증
    test('validates PhongMaterial lighting parameters and rejects NaN or negative strength', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const mat = new RedGPU.Material.PhongMaterial(ctx, '#00ff00');

            mat.shininess = 64;
            mat.specularStrength = 0.8;
            mat.emissiveStrength = 1.5;

            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            return (
                mat.color.g === 255 &&
                mat.shininess === 64 &&
                Math.abs(mat.specularStrength - 0.8) < 1e-4 &&
                Math.abs(mat.emissiveStrength - 1.5) < 1e-4 &&
                expectThrows(() => {
                    mat.shininess = NaN;
                }) &&
                expectThrows(() => {
                    mat.specularStrength = -1;
                })
            );
        });

        expect(ok).toBe(true);
    });

    // PBRMaterial 기본 Factor, metallic/roughness/emissive/clearcoat 갱신 및 NaN/음수 차단 검증
    test('validates PBRMaterial defaults, factor updates, and rejects NaN or negative roughness', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const mat = new RedGPU.Material.PBRMaterial(ctx);

            const defaultsOk =
                mat.metallicFactor === 0 &&
                mat.roughnessFactor === 1 &&
                mat.occlusionStrength === 1;

            mat.baseColorFactor = [0.2, 0.4, 0.6, 1.0];
            mat.metallicFactor = 0.9;
            mat.roughnessFactor = 0.25;
            mat.emissiveFactor = [0.5, 0.5, 0.5];
            mat.KHR_clearcoatFactor = 0.7;

            const expectThrows = (fn: () => void) => {
                try {
                    fn();
                    return false;
                } catch {
                    return true;
                }
            };

            return (
                defaultsOk &&
                Math.abs(mat.metallicFactor - 0.9) < 1e-4 &&
                Math.abs(mat.roughnessFactor - 0.25) < 1e-4 &&
                Math.abs(mat.KHR_clearcoatFactor - 0.7) < 1e-4 &&
                Math.abs(mat.baseColorFactor[0] - 0.2) < 1e-4 &&
                Math.abs(mat.emissiveFactor[0] - 0.5) < 1e-4 &&
                expectThrows(() => {
                    mat.metallicFactor = NaN;
                }) &&
                expectThrows(() => {
                    mat.roughnessFactor = -0.1;
                })
            );
        });

        expect(ok).toBe(true);
    });
});
