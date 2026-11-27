import {createSharedWebGPUHarness, expect, type SharedWebGPUHarness, test} from '../fixtures/webgpuTest';

test.describe('PostEffect.PostEffectManager & BuiltInEffectManager', () => {
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

	// PostEffectManager 초기 리소스(texturePool, uniformBuffer, G-Buffer layout) 및 이펙트 목록 CRUD 검증
	test('initializes manager GPU resources and manages custom effect list', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const scene = new RedGPU.Display.Scene(ctx);
			const camera = new RedGPU.Camera.PerspectiveCamera(ctx);
			const view = new RedGPU.Display.View3D(ctx, scene, camera);
			const manager = view.postEffectManager;

			const initialOk =
				manager.view === view &&
				manager.texturePool instanceof RedGPU.PostEffect.Core.PostEffectTexturePool &&
				manager.postEffectSystemUniformBuffer instanceof RedGPU.Resource.UniformBuffer &&
				Array.isArray(manager.effectList) &&
				manager.effectList.length === 0 &&
				manager.gbufferBindGroupLayout instanceof GPUBindGroupLayout &&
				typeof manager.videoMemorySize === 'number' &&
				typeof manager.render === 'function';

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

			manager.clear();
			return initialOk && addOk && removeOk && removeAtOk && removeAllOk;
		});

		expect(ok).toBe(true);
	});

	// BuiltInEffectManager 11종 빌트인 이펙트 지연 생성(Lazy Loading) 및 활성화 토글 검증
	test('lazy-loads all 11 built-in effects and toggles use* flags', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const scene = new RedGPU.Display.Scene(ctx);
			const camera = new RedGPU.Camera.PerspectiveCamera(ctx);
			const view = new RedGPU.Display.View3D(ctx, scene, camera);
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
				b.useSSAO && b.useSSR && b.useFog && b.useHeightFog && b.useDOF &&
				b.useBloom && b.useChromaticAberration && b.useLensDistortion && b.useVignetting && b.useFilmGrain;

			view.postEffectManager.clear();
			return lazyOk && togglesOk;
		});

		expect(ok).toBe(true);
	});

	// HeightFog 기본 속성, Setter 갱신 및 NaN/음수 fogType 차단 검증
	test('validates HeightFog defaults, setter updates, and invalid input rejection', async () => {
		const ok = await harness.page.evaluate(() => {
			const RedGPU = (window as any).RedGPU;
			const ctx = (window as any).__REDGPU_CTX__;
			const expectThrows = (fn: () => void) => {
				try {
					fn();
					return false;
				} catch {
					return true;
				}
			};
			const scene = new RedGPU.Display.Scene(ctx);
			const camera = new RedGPU.Camera.PerspectiveCamera(ctx);
			const view = new RedGPU.Display.View3D(ctx, scene, camera);
			const hf = view.builtInEffectManager.heightFog;

			const defaultsOk =
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

			const updatedOk =
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

			const validationOk =
				expectThrows(() => (hf.density = NaN)) &&
				expectThrows(() => (hf.baseHeight = NaN)) &&
				expectThrows(() => (hf.fogType = -1));

			view.postEffectManager.clear();
			return defaultsOk && updatedOk && validationOk;
		});

		expect(ok).toBe(true);
	});
});
