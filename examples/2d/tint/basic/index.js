import * as RedGPU from "../../../../dist";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);

		// Texture와 Material 준비
		const texture_blendTest_base = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/UV_Grid_Sm.jpg'
		);
		const material_base = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base);

		// 중앙 Sprite 생성
		const base = new RedGPU.Display.Sprite2D(redGPUContext, material_base);
		base.setSize(200, 200);
		base.material.tint.setColorByRGBA(255, 128, 0, 1);
		scene.addChild(base); // Sprite를 장면에 추가

		const material_subChild = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base);

		const subChild = new RedGPU.Display.Sprite2D(redGPUContext, material_subChild);
		subChild.setSize(100, 100);
		subChild.setPosition(150, 150);
		base.addChild(subChild); // Sprite를 장면에 추가
		// 윈도우 크기에 따라 중앙의 위치를 다시 계산
		redGPUContext.onResize = () => {
			const {width, height} = redGPUContext.screenRectObject;
			base.x = width / 2;
			base.y = height / 2;
		};

		redGPUContext.onResize(); // 초기 위치 계산

		// Tint 테스트용 Tweakpane 설정
		renderTestPane(redGPUContext, base);

		// 애니메이션 설정 (회전)
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// base.rotation += 1;
		};
		renderer.start(redGPUContext, render);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);
// Tint 조작용 Tweakpane 구성
const renderTestPane = async (redGPUContext, sprite) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// Tint 테스트 추가
	const folder = pane.addFolder({title: 'Material Tint Test'});
	const targetTint = sprite.material.tint;
	const tintSettings = {
		tintR: targetTint.r,
		tintG: targetTint.g,
		tintB: targetTint.b,
		tintA: targetTint.a,
		tint: {r: targetTint.r, g: targetTint.g, b: targetTint.b, a: targetTint.a},
		useTint: sprite.material.useTint,
		tintBlendMode: RedGPU.Material.TINT_BLEND_MODE[sprite.material.tintBlendMode], // Default TINT_BLEND_MODE index
	};

	const refresh = () => {
		tintSettings.tintR = targetTint.r;
		tintSettings.tintG = targetTint.g;
		tintSettings.tintB = targetTint.b;
		tintSettings.tintA = targetTint.a;
		tintSettings.tint.r = targetTint.r;
		tintSettings.tint.g = targetTint.g;
		tintSettings.tint.b = targetTint.b;
		tintSettings.tint.a = targetTint.a;
		pane.refresh();
	};

	// useTint 토글
	folder.addBinding(tintSettings, 'useTint', {label: 'Use Tint'}).on('change', (ev) => {
		sprite.material.useTint = ev.value; // 사용 여부 반영
	});

// TINT_BLEND_MODE 드롭다운 추가
	folder.addBinding(tintSettings, 'tintBlendMode', {
		label: 'tintBlendMode',
		options: RedGPU.Material.TINT_BLEND_MODE,
	}).on('change', (ev) => {
		// Find the key that corresponds to the selected value
		const selectedKey = Object.keys(RedGPU.Material.TINT_BLEND_MODE).find(
			(key) => RedGPU.Material.TINT_BLEND_MODE[key] === ev.value
		);
		console.log(`Selected Tint Mode: ${selectedKey}`); // Log the key name

		// Apply the value to the material
		sprite.material.tintBlendMode = ev.value; // TINT_BLEND_MODE 값 반영
		refresh();
	});
	// Tint 컬러 슬라이더 구성
	folder.addBinding(tintSettings, 'tintR', {label: 'Tint R', min: 0, max: 255, step: 1}).on('change', (ev) => {
		sprite.material.tint.r = ev.value;
		refresh();
	});
	folder.addBinding(tintSettings, 'tintG', {label: 'Tint G', min: 0, max: 255, step: 1}).on('change', (ev) => {
		sprite.material.tint.g = ev.value;
		refresh();
	});
	folder.addBinding(tintSettings, 'tintB', {label: 'Tint B', min: 0, max: 255, step: 1}).on('change', (ev) => {
		sprite.material.tint.b = ev.value;
		refresh();
	});
	folder.addBinding(tintSettings, 'tintA', {label: 'Tint A (Alpha)', min: 0, max: 1, step: 0.01}).on('change', (ev) => {
		sprite.material.tint.a = ev.value;
		refresh();
	});
	folder.addBinding(tintSettings, 'tint', {
		picker: 'inline',
		view: 'color',
		expanded: true,
	}).on('change', (ev) => {
		// Update color using the RGB values
		const r = Math.floor(ev.value.r);
		const g = Math.floor(ev.value.g);
		const b = Math.floor(ev.value.b);
		const a = ev.value.a;
		sprite.material.tint.setColorByRGBA(r, g, b, a);
		refresh();
	});

};
