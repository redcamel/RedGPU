import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('AntialiasingManager', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        // 순수 상태 매니저이므로 GPU 컨텍스트 초기화 없이 하네스 페이지만 공유
        harness = await createSharedWebGPUHarness(browser, {initContext: false});
    });

    test.afterEach(() => {
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // devicePixelRatio 기반 초기 AA 모드 및 msaaID UUID 생성 검증
    test('initializes defaults by devicePixelRatio and generates msaaID', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            const defaultMatchesDpr =
                window.devicePixelRatio > 1.0
                    ? manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false
                    : manager.useTAA === false && manager.useMSAA === true && manager.useFXAA === false;
            const hasValidMsaaId = typeof manager.msaaID === 'string' && manager.msaaID.length > 0;
            return {defaultMatchesDpr, hasValidMsaaId};
        });

        expect(res).toEqual({defaultMatchesDpr: true, hasValidMsaaId: true});
    });

    // useTAA 활성화 시 MSAA/FXAA 상호 배타적 해제 검증
    test('toggles useTAA exclusively', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useMSAA = true;
            manager.useTAA = true;
            const exclusive = manager.useTAA === true && manager.useMSAA === false && manager.useFXAA === false;
            manager.useTAA = false;
            return exclusive && manager.useTAA === false;
        });

        expect(ok).toBe(true);
    });

    // useMSAA 활성화 시 TAA/FXAA 해제 및 msaaID 갱신 검증
    test('toggles useMSAA exclusively and updates msaaID on change', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useTAA = true;
            const beforeId = manager.msaaID;
            manager.useMSAA = true;
            const exclusive = manager.useMSAA === true && manager.useTAA === false && manager.useFXAA === false;
            const idChanged = manager.msaaID !== beforeId;
            manager.useMSAA = false;
            return exclusive && idChanged && manager.useMSAA === false;
        });

        expect(ok).toBe(true);
    });

    // useFXAA 활성화 시 TAA/MSAA 상호 배타적 해제 검증
    test('toggles useFXAA exclusively', async () => {
        const ok = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const manager = new RedGPU.Antialiasing.AntialiasingManager();
            manager.useTAA = true;
            manager.useFXAA = true;
            const exclusive = manager.useFXAA === true && manager.useTAA === false && manager.useMSAA === false;
            manager.useFXAA = false;
            return exclusive && manager.useFXAA === false;
        });

        expect(ok).toBe(true);
    });
});
