import {expect, test} from '../fixtures/webgpuTest';

// glTF PBR 핵심 회귀 검증 대상 예제 목록
const GLTF_PBR_EXAMPLES = [
    {
        name: 'TransmissionOrderTest',
        url: '/examples/gltf/gltfExtensions/transmission/transmissionOrderTest/index.html'
    },
    {
        name: 'AlphaBlendModeTest',
        url: '/examples/gltf/basic/alphaBlendModeTest/index.html'
    }
];

test.describe('glTF PBR Regression Examples', () => {
    for (const example of GLTF_PBR_EXAMPLES) {
        // glTF PBR 예제가 WebGPU 검증 오류 및 콘솔 에러 없이 캔버스에 정상 렌더링되는지 검증
        test(`renders ${example.name} without WebGPU or console errors`, async ({page}) => {
            // 외부 glTF/HDR 에셋 로딩이 완료될 때까지 대기
            await page.goto(example.url, {waitUntil: 'networkidle'});

            const canvas = page.locator('canvas').first();
            await expect(canvas).toBeVisible({timeout: 15_000});

            // 에셋 로딩 후 20프레임 이상 렌더 패스를 실행하여 WebGPU 파이프라인/셰이더 안정성 확인
            const canvasSize = await page.evaluate(async () => {
                const el = document.querySelector('canvas');
                await new Promise<void>((resolve) => {
                    let frames = 0;
                    const tick = () => {
                        frames += 1;
                        if (frames >= 20) resolve();
                        else requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                });
                return {
                    width: el?.width ?? 0,
                    height: el?.height ?? 0
                };
            });

            expect(canvasSize.width).toBeGreaterThan(0);
            expect(canvasSize.height).toBeGreaterThan(0);
        });
    }
});
