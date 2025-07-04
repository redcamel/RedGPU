import * as RedGPU from "../../../../dist";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -45;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// 간단한 screenToWorld 데모 설정
		const demo = setupSimpleDemo(redGPUContext, scene, view);

		// 라이팅 설정
		setupLighting(scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			updateInfoDisplay(demo);
		};

		renderer.start(redGPUContext, render);
	},
	(failReason) => {
		console.error('RedGPU 초기화 실패:', failReason);
		document.body.innerHTML = `<div style="color: red; padding: 20px;">오류: ${failReason}</div>`;
	}
);

function setupSimpleDemo(redGPUContext, scene, view) {
	// 🎯 단일 타겟 메시 (구체)
	const material = new RedGPU.Material.PhongMaterial(redGPUContext);
	material.color.setColorByRGB(255, 100, 100); // 빨간색

	const targetMesh = new RedGPU.Display.Mesh(
		redGPUContext,
		new RedGPU.Primitive.Sphere(redGPUContext, 0.8, 16, 16),
		material
	);
	scene.addChild(targetMesh);

	// 📊 정보 표시 UI
	const infoDisplay = createInfoDisplay();

	// 🖱️ 마우스 추적 데이터
	const mouseData = {
		screen: {x: 0, y: 0},
		world: {x: 0, y: 0, z: 0},
		isInCanvas: false
	};

	// 마우스 이벤트 설정
	setupMouseEvents(canvas, view, targetMesh, mouseData);

	return {
		targetMesh,
		infoDisplay,
		mouseData,
		view
	};
}

function setupMouseEvents(canvas, view, targetMesh, mouseData) {
	canvas.addEventListener('mousemove', (event) => {
		const rect = canvas.getBoundingClientRect();

		// CSS 픽셀 좌표 계산
		mouseData.screen.x = event.clientX - rect.left;
		mouseData.screen.y = event.clientY - rect.top;
		mouseData.isInCanvas = true;

		// 🌍 Screen to World 변환
		const worldCoords = view.screenToWorld(mouseData.screen.x, mouseData.screen.y);

		mouseData.world.x = worldCoords[0];
		mouseData.world.y = worldCoords[1];
		mouseData.world.z = worldCoords[2];

		// 타겟 메시 위치 업데이트
		targetMesh.setPosition(worldCoords[0], worldCoords[1], worldCoords[2]);
	});

	canvas.addEventListener('mouseleave', () => {
		mouseData.isInCanvas = false;
	});

	canvas.addEventListener('mouseenter', () => {
		mouseData.isInCanvas = true;
	});

	// 클릭으로 월드 좌표 로깅
	canvas.addEventListener('click', (event) => {
		console.log('🎯 클릭 위치:');
		console.log(`Screen: (${mouseData.screen.x}, ${mouseData.screen.y})`);
		console.log(`World: (${mouseData.world.x.toFixed(3)}, ${mouseData.world.y.toFixed(3)}, ${mouseData.world.z.toFixed(3)})`);
	});
}

function createInfoDisplay() {
	const infoDisplay = document.createElement('div');
	Object.assign(infoDisplay.style, {
		position: 'absolute',
		top: '56px',
		right: '0px',
		color: '#fff',
		fontSize: '13px',
		padding: '20px',
		minWidth: '320px',
		fontFamily: 'Consolas, Monaco, monospace',
		border: '1px solid rgba(0,0,0,0.16)',
		borderRadius: '12px',
		boxShadow: '0 10px 40px rgba(0,255,136,0.2)',
		zIndex: 1000,
		backdropFilter: 'blur(15px)'
	});
	document.body.appendChild(infoDisplay);
	return infoDisplay;
}

function updateInfoDisplay(demo) {
	const {targetMesh, mouseData, view} = demo;
	const devicePixelRatio = window.devicePixelRatio || 1;

	// 화면 좌표 계산 (World to Screen 역변환 테스트)
	const targetScreenPoint = targetMesh.getScreenPoint(view);

	demo.infoDisplay.innerHTML = `
        <div style="background: rgba(0,255,136,0.15); padding: 15px; border-radius: 8px; margin: 12px 0; ">
            <strong> Mouse Info:</strong><br>
            <span style="color: #ffaa00;">CSS Pixel:</span> (${mouseData.screen.x.toFixed(0)}, ${mouseData.screen.y.toFixed(0)})<br>
            <span style="color: #ff6666;">Device Pixel:</span> (${(mouseData.screen.x * devicePixelRatio).toFixed(0)}, ${(mouseData.screen.y * devicePixelRatio).toFixed(0)})<br>
            <span style="color: #00aaff;">World:</span> (${mouseData.world.x.toFixed(2)}, ${mouseData.world.y.toFixed(2)}, ${mouseData.world.z.toFixed(2)})<br>
            <span style="color: #aaaaaa;">Status:</span> ${mouseData.isInCanvas ? '✅ Inside Canvas' : '❌ Outside Canvas'}
        </div>
        
        <div style="background: rgba(255,100,100,0.15); padding: 15px; border-radius: 8px; margin: 12px 0; ">
            <strong>Target Mesh Info</strong><br>
            <span style="color: #ffaa00;">World:</span> (${targetMesh.x.toFixed(2)}, ${targetMesh.y.toFixed(2)}, ${targetMesh.z.toFixed(2)})<br>
            <span style="color: #00aaff;">Screen:</span> (${targetScreenPoint[0].toFixed(1)}, ${targetScreenPoint[1].toFixed(1)})<br>
         </div>
        
        <div style="background: rgba(100,100,255,0.15); padding: 15px; border-radius: 8px; margin: 12px 0; ">
            <strong> Display Info:</strong><br>
            Device Pixel Ratio: ${devicePixelRatio}x<br>
            Canvas: ${canvas.width} × ${canvas.height}<br>
            ViewPort: ${view.pixelRectArray[2]} × ${view.pixelRectArray[3]}
        </div>
        
        
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 15px;">
            💡 마우스를 움직여 빨간 구체를 조종해보세요!<br>
            ScreenToWorld 변환이 실시간으로 적용됩니다.
        </div>
    `;
}

function setupLighting(scene) {
	// 방향성 라이트
	const directionalLight = new RedGPU.Light.DirectionalLight();
	directionalLight.direction = [-0.5, -1, -0.5];
	directionalLight.intensity = 0.8;
	scene.lightManager.addDirectionalLight(directionalLight);

}
