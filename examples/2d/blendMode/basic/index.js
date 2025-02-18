import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene);
		redGPUContext.addView(view);
		redGPUContext.backgroundColor.setColorByRGB(223, 132, 255)
		redGPUContext.backgroundColor.a = 1

		const texture_blendTest_base = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/blendTest/blendTest_base.png'
		);
		const texture_blendTest_shape = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/blendTest/blendTest_shape.png'
		);
		const {
			base_origin,
			shape_origin
		} = createSourceView(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape);
		const bottomGroup = createResults(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape);
		const material_base = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_base);
		const base = new RedGPU.Display.Sprite2D(redGPUContext, material_base);
		base.setSize(200, 200);
		base.x = view.screenRectObject.width / 2;
		base.y = view.screenRectObject.height / 2;
		scene.addChild(base);
		const material_shape = new RedGPU.Material.BitmapMaterial(redGPUContext, texture_blendTest_shape);
		const shape = new RedGPU.Display.Sprite2D(redGPUContext, material_shape);
		shape.setSize(200, 200);
		shape.x = view.screenRectObject.width / 2;
		shape.y = view.screenRectObject.height / 2;
		scene.addChild(shape);

		redGPUContext.onResize = () => {
			const {width, height} = redGPUContext.screenRectObject;
			base.x = width / 2;
			base.y = 200;
			shape.x = width / 2;
			shape.y = 200;

			base_origin.x = width / 2 - 210;
			shape_origin.x = width / 2 + 210;
			base_origin.y = 200
			shape_origin.y = 200

			{
				const spacingX = 150; // X축 간격
				const spacingY = 156; // Y축 간격
				const numColumns = Math.floor(width / spacingX); // 한 줄 최대 열 개수
				const numRows = Math.ceil(bottomGroup.children.length / numColumns); // 전체 행 개수

// bottomGroup 자체는 중심 정렬
				bottomGroup.setPosition(Math.floor(width / 2), height - 200, 0); // 화면 중앙으로 이동

// bottomGroup 내 자식들의 위치를 로컬 좌표로 배치
				bottomGroup.children.forEach((item, index) => {
					const t0 = item;

					// 현재 행과 열 계산
					const row = Math.floor(index / numColumns); // 현재 행 번호
					const col = index % numColumns; // 현재 열 번호

					// 현재 행의 실제 아이템 수 (마지막 행 처리용)
					const itemsInRow = Math.min(bottomGroup.children.length - row * numColumns, numColumns);

					// 행 중심 X 좌표 계산 (로컬 좌표)
					const startX = -((itemsInRow - 1) * spacingX) / 2; // 로컬 좌표 기준 중심 정렬

					// Y 좌표 계산 (로컬 좌표)
					const startY = ((numRows - 1) * spacingY) / 2 - 50; // 로컬 좌표 기준 행 중심 정렬

					// 아이템 위치 설정 (로컬 좌표)
					t0.x = Math.floor(startX + col * spacingX); // 열 중심 배치
					t0.y = Math.floor(startY - row * spacingY); // 행 중심 배치
					t0.z = 0; // 기본적으로 z는 0
				});
			}
		};
		redGPUContext.onResize()

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			base.rotation += 1;
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, base, shape);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function createResults(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape) {

	const rootGroup = new RedGPU.Display.Group3D()
	scene.addChild(rootGroup)
	Object.entries(RedGPU.Material.BLEND_MODE).map(([key, value]) => {
		const subGroup = new RedGPU.Display.Group3D()
		// subGroup.setScale(2,2,1)
		rootGroup.addChild(subGroup)
		const material_base_origin = new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			texture_blendTest_base
		);
		const material_shape_origin = new RedGPU.Material.BitmapMaterial(
			redGPUContext,
			texture_blendTest_shape
		);
		const base_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_base_origin);
		base_origin.setSize(128, 128);
		subGroup.addChild(base_origin);

		const shape_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_shape_origin);
		shape_origin.setSize(128, 128);
		shape_origin.blendMode = value;
		subGroup.addChild(shape_origin);

		// Adding TextField2D titles below each texture

		// Title for base_origin
		const title = new RedGPU.Display.TextField2D(redGPUContext);
		title.text = key;
		title.fontSize = 12
		title.setPosition(0, 78); // Positioned below base_origin sprite (300 + 200 + offset)
		base_origin.addChild(title);

	})
	return rootGroup

}

function createSourceView(redGPUContext, scene, texture_blendTest_base, texture_blendTest_shape) {
	const material_base_origin = new RedGPU.Material.BitmapMaterial(
		redGPUContext,
		texture_blendTest_base
	);
	const material_shape_origin = new RedGPU.Material.BitmapMaterial(
		redGPUContext,
		texture_blendTest_shape
	);
	const base_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_base_origin);
	base_origin.primitiveState.cullMode = 'none';
	base_origin.setSize(128, 128);
	scene.addChild(base_origin);

	const shape_origin = new RedGPU.Display.Sprite2D(redGPUContext, material_shape_origin);
	shape_origin.setSize(128, 128);
	shape_origin.primitiveState.cullMode = 'none';
	scene.addChild(shape_origin);

	// Adding TextField2D titles below each texture

	// Title for base_origin
	const baseTitle = new RedGPU.Display.TextField2D(redGPUContext);
	baseTitle.text = 'Base Origin';
	baseTitle.fontFamily = 'SUIT Variable';
	baseTitle.fontSize = 12
	baseTitle.setPosition(0, 78); // Positioned below base_origin sprite (300 + 200 + offset)
	base_origin.addChild(baseTitle);

	// Title for shape_origin
	const shapeTitle = new RedGPU.Display.TextField2D(redGPUContext);
	shapeTitle.text = 'Shape Origin';
	shapeTitle.fontSize = 12
	shapeTitle.fontFamily = 'SUIT Variable';
	shapeTitle.setPosition(0, 78); // Positioned below shape_origin sprite
	shape_origin.addChild(shapeTitle);
	return {
		base_origin,
		shape_origin,
	}
}

const renderTestPane = async (redGPUContext, base, shape) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const {setRedGPUTest_pane} = await import("../../../exampleHelper/createExample/panes");

	const pane = new Pane();
	setRedGPUTest_pane(pane, redGPUContext, false);
	const tintSettings = {
		blendMode: RedGPU.Material.BLEND_MODE[shape.blendMode],
	};
	console.log('shape', shape, shape.blendMode)
	const setBlendModeTest = () => {
		const folder = pane.addFolder({title: '2D Object BlendMode'})

		// BLEND_MODE 드롭다운 추가
		folder.addBinding(tintSettings, 'blendMode', {
			label: 'Blend Mode',
			options: RedGPU.Material.BLEND_MODE,
		}).on('change', (ev) => {
			// Find the key that corresponds to the selected value
			const selectedKey = Object.keys(RedGPU.Material.BLEND_MODE).find(
				(key) => RedGPU.Material.BLEND_MODE[key] === ev.value
			);
			console.log(`Selected Blend Mode: ${selectedKey}`); // Log the key name

			// Apply the value to the material
			shape.blendMode = ev.value; // BLEND_MODE 값 반영
		});
	}
	setBlendModeTest()
};
