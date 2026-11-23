import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('ToneMapping.ToneMappingManager', () => {
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

    // ToneMappingManager 초기 모드(KHRONOS_PBR_NEUTRAL) 및 기본 contrast/brightness 검증
    test('initializes with KHRONOS_PBR_NEUTRAL mode and default contrast/brightness', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const manager = new RedGPU.ToneMapping.ToneMappingManager(ctx);
            const valid =
                manager.redGPUContext === ctx &&
                manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL &&
                manager.contrast === 1.0 &&
                manager.brightness === 0.0 &&
                typeof manager.render === 'function';
            manager.clear();
            return valid;
        });

        expect(ok).toBe(true);
    });

    // contrast/brightness 변경 시 내부 톤매핑 이펙트 인스턴스에 즉시 동기화되는지 검증
    test('synchronizes contrast and brightness to underlying toneMapping effect', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const manager = new RedGPU.ToneMapping.ToneMappingManager(ctx);
            manager.contrast = 1.5;
            manager.brightness = 0.5;
            const valid =
                manager.toneMapping.contrast === 1.5 &&
                manager.toneMapping.brightness === 0.5;
            manager.clear();
            return valid;
        });

        expect(ok).toBe(true);
    });

    // 모드 전환 시 톤매핑 패스 지연 생성(Lazy Loading) 및 clear() 해제 검증
    test('lazy-loads toneMapping effect on mode change and clears cleanly', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const manager = new RedGPU.ToneMapping.ToneMappingManager(ctx);
            manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;
            const effect = manager.toneMapping;
            const modeOk =
                Boolean(effect && effect.isInstanceofPostEffect) &&
                manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;

            manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
            void manager.toneMapping;
            manager.clear();
            return modeOk;
        });

        expect(ok).toBe(true);
    });
});
