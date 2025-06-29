import * as RedGPU from "../../../../dist/index.js";

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

		const sprite2D_color = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.ColorMaterial(redGPUContext, '#cf8989'));
		sprite2D_color.setSize(200, 200);
		sprite2D_color.material.tint.setColorByRGBA(255, 128, 0, 1);
		scene.addChild(sprite2D_color); // Sprite를 장면에 추가

		const sprite2D_bitmap = new RedGPU.Display.Sprite2D(redGPUContext, new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base));
		sprite2D_bitmap.setSize(200, 200);
		sprite2D_bitmap.material.tint.setColorByRGBA(255, 128, 0, 1);
		scene.addChild(sprite2D_bitmap); // Sprite를 장면에 추가

		const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24)
		const spriteSheet2D = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
		spriteSheet2D.material.tint.setColorByRGBA(255, 128, 0, 1);
		scene.addChild(spriteSheet2D);

		const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
		textField2D.text = 'RedGPU';
		textField2D.material.tint.setColorByRGBA(255, 128, 0, 1);
		scene.addChild(textField2D); // Sprite를 장면에 추가

		redGPUContext.onResize = () => {
			const {width, height} = redGPUContext.screenRectObject;

			// 자식 Sprite 배치 관련 설정
			const gap = 220; // 자식들 간 간격
			const totalChildren = scene.children.length; // 자식 개수

			// 배치된 전체 Row의 가로 폭 계산
			const rowWidth = (totalChildren - 1) * gap;

			// 그리드 시작 좌표 (화면 중앙 맞춤)
			const startX = (width - rowWidth) / 2; // 가로 기준 정중앙
			const startY = height / 2; // 화면 세로 중앙 (Y축 고정)

			// 자식 객체 순회하면서 위치 배치
			scene.children.forEach((child, index) => {
				child.x = startX + index * gap; // 가로 위치 계산
				child.y = startY; // 세로 위치 고정
			});
		};
		redGPUContext.onResize(); // 초기 위치 계산

		// Tint 테스트용 Tweakpane 설정
		renderTestPane(redGPUContext, scene);

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
const renderTestPane = async (redGPUContext, scene) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	// Tint 설정 초기값 - 첫 번째 자식 혹은 기본값으로 초기화
	const firstChild = scene.children[0];
	const defaultTint = firstChild ? firstChild.material.tint : {r: 255, g: 255, b: 255, a: 1};
	const tintSettings = {
		tintR: defaultTint.r,
		tintG: defaultTint.g,
		tintB: defaultTint.b,
		tintA: defaultTint.a,
		tint: {r: defaultTint.r, g: defaultTint.g, b: defaultTint.b, a: defaultTint.a},
		useTint: firstChild ? firstChild.material.useTint : true,
		tintBlendMode: firstChild ? RedGPU.Material.TINT_BLEND_MODE[firstChild.material.tintBlendMode] : 0,
	};

	// useTint 토글 바인딩
	pane.addBinding(tintSettings, 'useTint', {label: 'Use Tint'}).on('change', (ev) => {
		// Scene 내 모든 자식들에게 적용
		scene.children.forEach((sprite) => {
			sprite.material.useTint = ev.value;
		});
	});

	// TINT_BLEND_MODE 드롭다운 추가
	pane.addBinding(tintSettings, 'tintBlendMode', {
		label: 'Tint Mode',
		options: RedGPU.Material.TINT_BLEND_MODE,
	}).on('change', (ev) => {
		// Scene 내 모든 자식들에게 적용
		scene.children.forEach((sprite) => {
			sprite.material.tintBlendMode = ev.value;
		});
	});

	// Tint 컬러 슬라이더 (R, G, B, A) 추가
	pane.addBinding(tintSettings, 'tintR', {label: 'Tint R', min: 0, max: 255, step: 1}).on('change', (ev) => {
		scene.children.forEach((sprite) => {
			sprite.material.tint.r = ev.value;
		});
	});
	pane.addBinding(tintSettings, 'tintG', {label: 'Tint G', min: 0, max: 255, step: 1}).on('change', (ev) => {
		scene.children.forEach((sprite) => {
			sprite.material.tint.g = ev.value;
		});
	});
	pane.addBinding(tintSettings, 'tintB', {label: 'Tint B', min: 0, max: 255, step: 1}).on('change', (ev) => {
		scene.children.forEach((sprite) => {
			sprite.material.tint.b = ev.value;
		});
	});
	pane.addBinding(tintSettings, 'tintA', {label: 'Tint A (Alpha)', min: 0, max: 1, step: 0.01}).on('change', (ev) => {
		scene.children.forEach((sprite) => {
			sprite.material.tint.a = ev.value;
		});
	});

	// Tint 컬러 피커 추가 (RGB + Alpha)
	pane.addBinding(tintSettings, 'tint', {
		picker: 'inline',
		view: 'color',
		expanded: true,
	}).on('change', (ev) => {
		scene.children.forEach((sprite) => {
			const r = Math.floor(ev.value.r);
			const g = Math.floor(ev.value.g);
			const b = Math.floor(ev.value.b);
			const a = ev.value.a;
			sprite.material.tint.setColorByRGBA(r, g, b, a); // RGBA 값 일괄 반영
		});
	});
};
