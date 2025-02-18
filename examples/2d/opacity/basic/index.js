import * as RedGPU from "../../../../dist";

// 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.Camera2D(redGPUContext);

		// 씬 및 뷰 생성
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View2D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		// 하이라키 구조 생성
		const parentSprite2D = createParentSprite2D(redGPUContext, scene);
		const childSprite2D = createChildSprite2D(redGPUContext, parentSprite2D);
		const childTextField2D = createChildTextField2D(redGPUContext, parentSprite2D);
		const childSpriteSheet2D = createChildSpriteSheet2D(redGPUContext, parentSprite2D);

		// 렌더러 생성 및 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = () => {
			// 매 프레임 실행될 로직 (필요시 추가)

		};
		renderer.start(redGPUContext, render);

		// 테스트 패널 생성 (실시간 제어)
		renderTestPane(redGPUContext, parentSprite2D, [childSprite2D,childTextField2D,childSpriteSheet2D]);
	},
	(failReason) => {
		console.error('Initialization failed:', failReason);
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

// 부모 메쉬 생성 함수
const createParentSprite2D = (redGPUContext, scene) => {
	const material = new RedGPU.Material.BitmapMaterial(redGPUContext, new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg'));
	const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
	sprite2D.setSize(100, 100);
	sprite2D.x = redGPUContext.screenRectObject.width / 2;
	sprite2D.y = redGPUContext.screenRectObject.height / 2;
	scene.addChild(sprite2D);

	const title = new RedGPU.Display.TextField2D(redGPUContext)
	title.text = `Sprite2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`
	title.fontSize = 12
	title.y = 85
	sprite2D.addChild(title)

	return sprite2D;
};

// 자식 메쉬 생성 함수
const createChildSprite2D = (redGPUContext, parent) => {
	const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
	const sprite2D = new RedGPU.Display.Sprite2D(redGPUContext, material);
	sprite2D.setSize(75);
	sprite2D.x = 150
	sprite2D.y = 150
	parent.addChild(sprite2D);

	const title = new RedGPU.Display.TextField2D(redGPUContext)
	title.text = `Sprite2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`
	title.fontSize = 12
	title.y = 72
	sprite2D.addChild(title)
	return sprite2D;
};

const createChildSpriteSheet2D = (redGPUContext, parent) => {
	const spriteSheetInfo = new RedGPU.Display.SpriteSheetInfo(redGPUContext, '../../../assets/spriteSheet/spriteSheet.png', 5, 3, 15, 0, true, 24)
	const sprite2D = new RedGPU.Display.SpriteSheet2D(redGPUContext, spriteSheetInfo);
	sprite2D.x = -150
	sprite2D.y = 150
	parent.addChild(sprite2D);

	const title = new RedGPU.Display.TextField2D(redGPUContext)
	title.text = `SpriteSheet2D<br/>Opacity ${title.opacity}<br/>combinedOpacity ${title.getCombinedOpacity()}`
	title.fontSize = 12
	title.y = 120
	sprite2D.addChild(title)
	return sprite2D;
};
const createChildTextField2D = (redGPUContext, parent) => {
	const textField2D = new RedGPU.Display.TextField2D(redGPUContext);
	textField2D.x = 0
	textField2D.y = -150
	textField2D.text = `TextField2D<br/>Opacity ${textField2D.opacity}<br/>combinedOpacity ${textField2D.getCombinedOpacity()}`
	parent.addChild(textField2D);
	return textField2D
};
// 테스트 패널 렌더링 함수
const renderTestPane = async (redGPUContext, parent, children) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const maxW = redGPUContext.screenRectObject.width;
	const maxH = redGPUContext.screenRectObject.height;

	// 부모 메쉬 설정
	const parentConfig = {
		x: parent.x,
		y: parent.y,
		width: parent.width,
		height: parent.height,
		rotation: parent.rotation,
		scaleX: parent.scaleX,
		scaleY: parent.scaleY,
		opacity: parent.opacity,
	};

	// 부모 메쉬 설정 패널
	const parentFolder = pane.addFolder({title: 'Parent Sprite2D', expanded: true});
	parentFolder.addBinding(parentConfig, 'opacity', {
		min: 0,
		max: 1,
		step: 0.01
	}).on('change', (evt) => {
		parent.opacity = evt.value;

		// 부모 타이틀 업데이트
		const parentTitle = parent.children.find(child => child instanceof RedGPU.Display.TextField2D);
		if (parentTitle) {
			parentTitle.text = `Opacity ${parent.opacity.toFixed(2)}<br/>combinedOpacity ${parent.getCombinedOpacity().toFixed(2)}`;
		}

		// 자식들의 combinedOpacity 업데이트
		children.forEach((child) => {

			if (child instanceof RedGPU.Display.TextField2D) {
				// 자식이 TextField2D인 경우 text를 직접 변경
				console.log('걸리긴하냐')
				child.text = `TextField2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
			} else {
				// 자식이 일반 Sprite2D인 경우 children에서 TextField2D를 찾아 업데이트
				const childTitle = child.children?.find(
					(child) => child instanceof RedGPU.Display.TextField2D
				);
				if (childTitle) {
					childTitle.text = `Sprite2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
				}
			}
		});
	});

	// 각 자식에 대해 설정 생성
	children.forEach((child, index) => {
		const childConfig = {
			x: child.x,
			y: child.y,
			width: child.width,
			height: child.height,
			rotation: child.rotation,
			scaleX: child.scaleX,
			scaleY: child.scaleY,
			opacity: child.opacity,
		};

		// 자식 메쉬 설정 패널
		const childFolder = pane.addFolder({title: `Child ${child.constructor.name} `, expanded: true});
		childFolder.addBinding(childConfig, 'opacity', {
			min: 0,
			max: 1,
			step: 0.01,
		}).on('change', (evt) => {
			child.opacity = evt.value;
			console.log(child)

			if (child instanceof RedGPU.Display.TextField2D) {
				// 자식이 TextField2D인 경우 text를 직접 변경
				console.log('걸리긴하냐')
				child.text = `TextField2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
			} else {
				// 자식이 일반 Sprite2D인 경우 children에서 TextField2D를 찾아 업데이트
				const childTitle = child.children?.find(
					(child) => child instanceof RedGPU.Display.TextField2D
				);
				if (childTitle) {
					childTitle.text = `Sprite2D<br/>Opacity ${child.opacity.toFixed(2)}<br/>combinedOpacity ${child.getCombinedOpacity().toFixed(2)}`;
				}
			}
		});

	});
};