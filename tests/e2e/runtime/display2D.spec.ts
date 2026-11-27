import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('Display 2D Core (View2D · Group2D · Sprite2D · TextField2D)', () => {
    let harness: SharedWebGPUHarness;

    test.beforeAll(async ({browser}) => {
        harness = await createSharedWebGPUHarness(browser);
    });

    test.afterEach(async () => {
        await harness.page.evaluate(() => {
            const ctx = (window as any).__REDGPU_CTX__;
            if (ctx) ctx.removeAllViews();
        });
        harness.assertNoErrors();
    });

    test.afterAll(async () => {
        await harness.dispose();
    });

    // Group2D 부모-자식 변환 전파, Sprite2D setSize/scale/rotation 반영 및 visible=false 서브트리 드로우 제외 검증
    test('propagates Group2D transforms to Sprite2D, updates TextField2D, and skips invisible subtree', async () => {
        const res = await harness.page.evaluate(() => {
            const RedGPU = (window as any).RedGPU;
            const ctx = (window as any).__REDGPU_CTX__;
            const renderer = new RedGPU.Renderer();

            const scene = new RedGPU.Display.Scene();
            const view2D = new RedGPU.Display.View2D(ctx, scene, 'E2E_View2D');
            ctx.addView(view2D);

            const group = new RedGPU.Display.Group2D('ParentGroup');
            group.setPosition(120, 80);
            group.setScale(2, 2);

            const sprite = new RedGPU.Display.Sprite2D(
                ctx,
                new RedGPU.Material.ColorMaterial(ctx, '#33aaee')
            );
            sprite.setSize(50, 30);
            sprite.setPosition(10, 5);
            group.addChild(sprite);

            const textField = new RedGPU.Display.TextField2D(ctx);
            textField.text = 'Hello RedGPU';
            textField.fontSize = 20;
            textField.setPosition(200, 150);
            scene.addChild(group);
            scene.addChild(textField);

            renderer.renderFrame(ctx, 16);
            const drawCallsVisible = view2D.renderViewStateData.renderResults.numDrawCalls;
            // 부모(120, 80) + 스케일 2 * 자식(10, 5) = 월드 (140, 90)
            const worldX = sprite.modelMatrix[12];
            const worldY = sprite.modelMatrix[13];
            const spriteWidth = sprite.width;
            const spriteHeight = sprite.height;

            // 텍스트 변경 후 재렌더 무결성
            textField.text = 'Updated 2D Text';
            renderer.renderFrame(ctx, 32);

            // 부모 그룹 비가시화 시 자식 Sprite2D까지 드로우 제외되어야 함
            group.visible = false;
            renderer.renderFrame(ctx, 48);
            const drawCallsGroupHidden = view2D.renderViewStateData.renderResults.numDrawCalls;

            textField.visible = false;
            renderer.renderFrame(ctx, 64);
            const drawCallsAllHidden = view2D.renderViewStateData.renderResults.numDrawCalls;

            renderer.destroy(ctx);
            return {
                drawCallsVisible,
                worldX,
                worldY,
                spriteWidth,
                spriteHeight,
                textValue: textField.text,
                drawCallsGroupHidden,
                drawCallsAllHidden
            };
        });

        expect(res.drawCallsVisible).toBeGreaterThanOrEqual(2);
        expect(res.worldX).toBeCloseTo(140, 3);
        expect(res.worldY).toBeCloseTo(90, 3);
        expect(res.spriteWidth).toBe(50);
        expect(res.spriteHeight).toBe(30);
        expect(res.textValue).toBe('Updated 2D Text');
        expect(res.drawCallsGroupHidden).toBeLessThan(res.drawCallsVisible);
        expect(res.drawCallsAllHidden).toBe(0);
    });
});
