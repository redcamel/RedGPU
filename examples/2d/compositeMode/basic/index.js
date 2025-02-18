import * as RedGPU from "../../../../dist";

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
				bottomGroup.setPosition(width / 2, height - 200, 0); // 화면 중앙으로 이동

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
					const startY = ((numRows - 1) * spacingY) / 2; // 로컬 좌표 기준 행 중심 정렬

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
	Object.entries(RedGPU.Material.COMPOSITE_MODE).map(([key, value]) => {
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
		shape_origin.setBlendFactorsFromCompositeModePreset(value)
		subGroup.addChild(shape_origin);

		// Adding TextField2D titles below each texture

		// Title for base_origin
		const title = new RedGPU.Display.TextField2D(redGPUContext);
		title.text = key;
		title.fontSize = 11
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
	baseTitle.fontSize = 12
	baseTitle.setPosition(0, 78); // Positioned below base_origin sprite (300 + 200 + offset)
	base_origin.addChild(baseTitle);

	// Title for shape_origin
	const shapeTitle = new RedGPU.Display.TextField2D(redGPUContext);
	shapeTitle.text = 'Shape Origin';
	shapeTitle.fontSize = 12
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

	const setBlendModeTest = () => {
		const folder = pane.addFolder({title: 'setBlendFactorsFromCompositeModePreset'})

		Object.values(RedGPU.Material.COMPOSITE_MODE).forEach(key => {
			folder.addButton({title: key}).on('click', () => {
				shape.setBlendFactorsFromCompositeModePreset(key);
			});
		});

		const options = {
			colorOperation: shape.material.blendColorState.operation,
			colorSrcFactor: shape.material.blendColorState.srcFactor,
			colorDstFactor: shape.material.blendColorState.dstFactor,
			alphaOperation: shape.material.blendAlphaState.operation,
			alphaSrcFactor: shape.material.blendAlphaState.srcFactor,
			alphaDstFactor: shape.material.blendAlphaState.dstFactor
		};

		const displayContainer = document.createElement('div');
		displayContainer.style.cssText = 'position: absolute; bottom: 0; left: 0;display:flex;flex-direction: column;gap:6px';
		displayContainer.style.margin = '12px';
		displayContainer.style.padding = '12px';
		displayContainer.style.border = 0;
		displayContainer.style.backgroundColor = '#f9f9f9';
		displayContainer.style.borderRadius = '12px';
		displayContainer.style.fontFamily = 'Arial, sans-serif';

		const parentElement = (folder.controller_ &&
			folder.controller_.view &&
			folder.controller_.view.element)
			? folder.controller_.view.element
			: document.body;
		parentElement.appendChild(displayContainer);

		function createDisplay(label, key) {
			const wrapper = document.createElement('div');
			wrapper.style.fontSize = '12px';
			const spanLabel = document.createElement('span');
			spanLabel.style.fontWeight = 'bold';
			spanLabel.textContent = `${label}: `;
			const spanValue = document.createElement('span');
			spanValue.id = `display_${key}`;
			spanValue.textContent = options[key];
			wrapper.appendChild(spanLabel);
			wrapper.appendChild(spanValue);
			displayContainer.appendChild(wrapper);
		}

		createDisplay('Color Operation', 'colorOperation');
		createDisplay('Color Src Factor', 'colorSrcFactor');
		createDisplay('Color Dst Factor', 'colorDstFactor');
		createDisplay('Alpha Operation', 'alphaOperation');
		createDisplay('Alpha Src Factor', 'alphaSrcFactor');
		createDisplay('Alpha Dst Factor', 'alphaDstFactor');

		function updateDisplay() {
			document.getElementById('display_colorOperation').textContent =
				shape.material.blendColorState.operation;
			document.getElementById('display_colorSrcFactor').textContent =
				shape.material.blendColorState.srcFactor;
			document.getElementById('display_colorDstFactor').textContent =
				shape.material.blendColorState.dstFactor;
			document.getElementById('display_alphaOperation').textContent =
				shape.material.blendAlphaState.operation;
			document.getElementById('display_alphaSrcFactor').textContent =
				shape.material.blendAlphaState.srcFactor;
			document.getElementById('display_alphaDstFactor').textContent =
				shape.material.blendAlphaState.dstFactor;
		}

		function monitorMaterialChanges() {
			const material = shape.material;
			let prevBlendColorState = {...material.blendColorState};
			let prevBlendAlphaState = {...material.blendAlphaState};
			setInterval(() => {
				if (
					JSON.stringify(prevBlendColorState) !== JSON.stringify(material.blendColorState) ||
					JSON.stringify(prevBlendAlphaState) !== JSON.stringify(material.blendAlphaState)
				) {
					prevBlendColorState = {...material.blendColorState};
					prevBlendAlphaState = {...material.blendAlphaState};
					updateDisplay();
				}
			}, 100);
		}

		monitorMaterialChanges();
	}
	setBlendModeTest()
};
