import {expect, test} from '../fixtures/webgpuTest';

// 주요 Built-in 포스트이펙트 스모크 검증 대상 예제 목록
const BUILT_IN_EFFECT_EXAMPLES = [
    {
        name: 'AutoExposure',
        url: '/examples/postEffect/builtIn/lens/autoExposure/index.html'
    },
    {
        name: 'Bloom',
        url: '/examples/postEffect/builtIn/lens/bloom/index.html'
    },
    {
        name: 'DOF',
        url: '/examples/postEffect/builtIn/lens/dof/index.html'
    },
    {
        name: 'LensFlare (SkyBox)',
        url: '/examples/postEffect/builtIn/lens/lensFlareSkyBox/index.html'
    }
];

test.describe('Built-in PostEffect Examples', () => {
    for (const example of BUILT_IN_EFFECT_EXAMPLES) {
        // Built-in 포스트이펙트 예제가 WebGPU 검증 오류 및 콘솔 에러 없이 렌더링되는지 검증
        test(`renders ${example.name} without WebGPU or console errors`, async ({page}) => {
            // IBL/HDR 및 모델 에셋 로딩 완료까지 대기
            await page.goto(example.url, {waitUntil: 'networkidle'});

            const canvas = page.locator('canvas').first();
            await expect(canvas).toBeVisible({timeout: 15_000});

            // 컴퓨트/렌더 패스 파이프라인이 안정적으로 동작하는지 20프레임 실행 후 캔버스 크기 확인
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
