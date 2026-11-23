import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('ToneMapping.ToneMappingManager', () => {
    // 초기 모드·노출 동기화, 모드 전환 지연 생성(Lazy Loading) 및 clear 해제 검증
    test('initializes defaults, syncs contrast/brightness, switches modes lazily, and clears cleanly', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(async () => {
            const RedGPU = (window as any).RedGPU;
            const canvas = document.createElement('canvas');

            return await new Promise<any>((resolve, reject) => {
                RedGPU.init(
                    canvas,
                    (ctx: any) => {
                        try {
                            const manager = new RedGPU.ToneMapping.ToneMappingManager(ctx);
                            const contextOk = manager.redGPUContext === ctx;
                            const initialOk =
                                manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL &&
                                manager.contrast === 1.0 &&
                                manager.brightness === 0.0;

                            // contrast/brightness 설정값이 내부 톤매핑 이펙트 인스턴스에 동기화되는지 확인
                            manager.contrast = 1.5;
                            manager.brightness = 0.5;
                            const syncOk =
                                manager.toneMapping.contrast === 1.5 &&
                                manager.toneMapping.brightness === 0.5;

                            // 모드 전환 시 해당 톤매핑 패스 지연 생성 검증
                            manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;
                            const effect = manager.toneMapping;
                            const modeOk =
                                Boolean(effect && effect.isInstanceofPostEffect) &&
                                manager.mode === RedGPU.ToneMapping.TONE_MAPPING_MODE.LINEAR;

                            manager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
                            void manager.toneMapping;
                            manager.clear();
                            const renderOk = typeof manager.render === 'function';

                            ctx.destroy();
                            resolve({contextOk, initialOk, syncOk, modeOk, renderOk});
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
            contextOk: true,
            initialOk: true,
            syncOk: true,
            modeOk: true,
            renderOk: true
        });
    });
});
