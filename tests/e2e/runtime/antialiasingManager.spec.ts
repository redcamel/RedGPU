import {expect, openWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('AntialiasingManager', () => {
    // devicePixelRatio 기반 기본값 설정 및 TAA/MSAA/FXAA 상호 배타적 전환 검증
    test('initializes defaults by devicePixelRatio and toggles TAA/MSAA/FXAA exclusively', async ({page}) => {
        await openWebGPUHarness(page);

        const result = await page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const manager = new RedGPU.Antialiasing.AntialiasingManager();

            // 고해상도(DPR > 1)는 TAA, 일반 해상도는 MSAA가 기본 활성화되는지 확인
            const defaultMatchesDpr =
                window.devicePixelRatio > 1.0
                    ? manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false
                    : manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false;

            const hasValidMsaaId = typeof manager.msaaID === 'string' && manager.msaaID.length > 0;

            // TAA 활성화 시 MSAA/FXAA 자동 해제 검증
            manager.useMSAA = true;
            manager.useTAA = true;
            const taaExclusive = manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false;

            manager.useTAA = false;
            const taaOff = manager.useTAA === false;

            // MSAA 활성화 시 TAA/FXAA 해제 및 msaaID 갱신 검증
            const beforeId = manager.msaaID;
            manager.useTAA = true;
            manager.useMSAA = true;
            const msaaExclusive = manager.useMSAA === true && manager.useTAA === false && manager.useFXAA === false;
            const msaaIdChanged = manager.msaaID !== beforeId;

            manager.useMSAA = false;
            const msaaOff = manager.useMSAA === false;

            // FXAA 활성화 시 TAA/MSAA 자동 해제 검증
            manager.useTAA = true;
            manager.useFXAA = true;
            const fxaaExclusive = manager.useFXAA === true && manager.useTAA === false && manager.useMSAA === false;

            manager.useFXAA = false;
            const fxaaOff = manager.useFXAA === false;

            return {
                defaultMatchesDpr,
                hasValidMsaaId,
                taaExclusive,
                taaOff,
                msaaExclusive,
                msaaIdChanged,
                msaaOff,
                fxaaExclusive,
                fxaaOff
            };
        });

        expect(result).toEqual({
            defaultMatchesDpr: true,
            hasValidMsaaId: true,
            taaExclusive: true,
            taaOff: true,
            msaaExclusive: true,
            msaaIdChanged: true,
            msaaOff: true,
            fxaaExclusive: true,
            fxaaOff: true
        });
    });
});
