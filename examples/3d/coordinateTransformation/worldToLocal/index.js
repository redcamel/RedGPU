import * as RedGPU from "../../../../dist/index.js?t=1767866967649";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -45;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// 명확한 메시 이름으로 변경
		const {parentMesh, localToWorldMesh, worldToLocalMesh} = createTestMeshes(redGPUContext, scene);

		// 명확한 오버레이 박스 이름으로 변경
		const overlayBoxes = createOverlayBoxes();

		// 라이팅 설정
		setupLighting(scene);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 부모 메시만 회전
			parentMesh.rotationX += 1.2;

			// 좌표 변환 Test 및 화면 표시
			updateCoordinateTests(parentMesh, localToWorldMesh, worldToLocalMesh, view, overlayBoxes);
		};

		renderer.start(redGPUContext, render);
		renderTestPane(redGPUContext)
	},
	(failReason) => {
		console.error('RedGPU 초기화 실패:', failReason);
		document.body.innerHTML = `<div>오류: ${failReason}</div>`;
	}
);
const renderTestPane = async (redGPUContext) => {
	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes/index.js?t=1767866967649");
	setDebugButtons(redGPUContext);
};

function createTestMeshes(redGPUContext, scene) {
	// 텍스처 머티리얼
	const textureMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
	textureMaterial.diffuseTexture = new RedGPU.Resource.BitmapTexture(
		redGPUContext,
		'../../../assets/UV_Grid_Sm.jpg'
	);

	// 🔴 부모 메시 (화면 좌표 Test용)
	const parentMesh = new RedGPU.Display.Mesh(
		redGPUContext,
		new RedGPU.Primitive.Sphere(redGPUContext),
		textureMaterial
	);
	scene.addChild(parentMesh);

	// 🟢 localToWorld Test용 메시
	const localToWorldMesh = new RedGPU.Display.Mesh(
		redGPUContext,
		new RedGPU.Primitive.Sphere(redGPUContext),
		textureMaterial
	);
	localToWorldMesh.setScale(0.5);
	localToWorldMesh.setPosition(-6, 2, 2);
	parentMesh.addChild(localToWorldMesh);

	// 🔵 worldToLocal Test용 메시
	const worldToLocalMesh = new RedGPU.Display.Mesh(
		redGPUContext,
		new RedGPU.Primitive.Sphere(redGPUContext),
		textureMaterial
	);
	worldToLocalMesh.setPosition(6, -2, -2);
	worldToLocalMesh.setScale(0.5);
	parentMesh.addChild(worldToLocalMesh);

	return {parentMesh, localToWorldMesh, worldToLocalMesh};
}

function createOverlayBoxes() {
	const boxStyle = {
		position: 'absolute',
		color: '#fff',
		fontSize: '12px',
		padding: '10px',
		minWidth: '200px',
		fontFamily: 'monospace',
		borderRadius: '4px',
		pointerEvents: 'none',
		zIndex: 1000
	};

	// 🔴 부모 메시 정보 박스
	const parentMeshInfoBox = document.createElement('div');
	Object.assign(parentMeshInfoBox.style, boxStyle, {
		background: 'rgba(255,107,107,0.9)',
		border: '2px solid #ff6b6b'
	});
	document.body.appendChild(parentMeshInfoBox);

	// 🟢 localToWorld Test 박스
	const localToWorldTestBox = document.createElement('div');
	Object.assign(localToWorldTestBox.style, boxStyle, {
		background: 'rgba(78,205,196,0.9)',
		border: '2px solid #4ecdc4'
	});
	document.body.appendChild(localToWorldTestBox);

	// 🔵 worldToLocal Test 박스
	const worldToLocalTestBox = document.createElement('div');
	Object.assign(worldToLocalTestBox.style, boxStyle, {
		background: 'rgba(0,136,255,0.9)',
		border: '2px solid #0088ff'
	});
	document.body.appendChild(worldToLocalTestBox);

	return {
		parentMeshInfoBox,
		localToWorldTestBox,
		worldToLocalTestBox
	};
}

function setupLighting(scene) {
	// 방향성 라이트
	const directionalLight = new RedGPU.Light.DirectionalLight();
	scene.lightManager.addDirectionalLight(directionalLight);

	// 앰비언트 라이트
	const ambientLight = new RedGPU.Light.AmbientLight('#404040', 0.4);
	scene.lightManager.ambientLight = ambientLight;
}

function updateCoordinateTests(parentMesh, localToWorldMesh, worldToLocalMesh, view, overlayBoxes) {
	const {parentMeshInfoBox, localToWorldTestBox, worldToLocalTestBox} = overlayBoxes;

	// 🔴 부모 메시 정보 표시
	const parentScreenPoint = parentMesh.getScreenPoint(view);
	parentMeshInfoBox.style.top = parentScreenPoint[1] + 'px';
	parentMeshInfoBox.style.left = parentScreenPoint[0] + 'px';
	parentMeshInfoBox.innerHTML = `
        <strong>🔴 parent Mesh</strong><br>
        Screen: (${parentScreenPoint[0].toFixed(1)}, ${parentScreenPoint[1].toFixed(1)})<br>
        World: (${parentMesh.x.toFixed(2)}, ${parentMesh.y.toFixed(2)}, ${parentMesh.z.toFixed(2)})<br>
        Rotation: (${parentMesh.rotationX.toFixed(0)}°, ${parentMesh.rotationY.toFixed(0)}°, ${parentMesh.rotationZ.toFixed(0)}°)
    `;

	// 🟢 localToWorld Test
	const localCoords = [-1, 1, 0]; // 입력할 로컬 좌표
	const convertedWorldCoords = localToWorldMesh.localToWorld(localCoords[0], localCoords[1], localCoords[2]);

	// localToWorld 정확성 검증
	const localToWorldAccuracy = validateLocalToWorldAccuracy(localToWorldMesh, localCoords, convertedWorldCoords);

	// UI 색상 설정
	const localToWorldIcon = localToWorldAccuracy.isAccurate ? '✅' : '⚠️';
	const localToWorldColor = localToWorldAccuracy.isAccurate ? '#4CAF50' : '#FF9800';
	const localToWorldBgColor = 'rgba(0,0,0,0.6)';

	const localToWorldScreenPoint = localToWorldMesh.getScreenPoint(view);
	localToWorldTestBox.style.top = localToWorldScreenPoint[1] + 'px';
	localToWorldTestBox.style.left = localToWorldScreenPoint[0] + 'px';
	localToWorldTestBox.innerHTML = `
        <strong>🟢 localToWorld Test</strong><br>
        localToWorldMesh.localToWorld(${localCoords.join(', ')})<br>
        <br>
        Input Local: (${localCoords.join(', ')})<br>
        Result World: (${convertedWorldCoords[0].toFixed(3)}, ${convertedWorldCoords[1].toFixed(3)}, ${convertedWorldCoords[2].toFixed(3)})<br>
        Screen: (${localToWorldScreenPoint[0].toFixed(1)}, ${localToWorldScreenPoint[1].toFixed(1)})<br>
        <br>
        <div style="background: ${localToWorldBgColor}; padding: 4px; border-radius: 4px; margin-top: 4px; border-left: 3px solid ${localToWorldColor};">
            <div style="font-size: 11px; font-weight: bold; color: ${localToWorldColor};">
                ${localToWorldIcon} 변환 정확도
            </div>
            <div style="font-size: 10px; margin-top: 2px;">
                상대 오차율: ${localToWorldAccuracy.relativeErrorPercentage.toFixed(4)}%
            </div>
        </div>
    `;

	// 🔵 worldToLocal Test
	const worldCoords = [3, 0, 1]; // 입력할 월드 좌표
	const convertedLocalCoords = worldToLocalMesh.worldToLocal(worldCoords[0], worldCoords[1], worldCoords[2]);

	// worldToLocal 정확성 검증
	const worldToLocalAccuracy = validateWorldToLocalAccuracy(worldToLocalMesh, worldCoords, convertedLocalCoords);

	// UI 색상 설정
	const worldToLocalIcon = worldToLocalAccuracy.isAccurate ? '✅' : '⚠️';
	const worldToLocalColor = worldToLocalAccuracy.isAccurate ? '#4CAF50' : '#FF9800';
	const worldToLocalBgColor = 'rgba(0,0,0,0.6)';

	const worldToLocalScreenPoint = worldToLocalMesh.getScreenPoint(view);
	worldToLocalTestBox.style.top = worldToLocalScreenPoint[1] + 'px';
	worldToLocalTestBox.style.left = worldToLocalScreenPoint[0] + 'px';
	worldToLocalTestBox.innerHTML = `
        <strong>🔵 worldToLocal Test</strong><br>
        worldToLocalMesh.worldToLocal(${worldCoords.join(', ')})<br>
        <br>
        Input World: (${worldCoords.join(', ')})<br>
        Result Local: (${convertedLocalCoords[0].toFixed(3)}, ${convertedLocalCoords[1].toFixed(3)}, ${convertedLocalCoords[2].toFixed(3)})<br>
        Screen: (${worldToLocalScreenPoint[0].toFixed(1)}, ${worldToLocalScreenPoint[1].toFixed(1)})<br>
        <br>
        <div style="background: ${worldToLocalBgColor}; padding: 4px; border-radius: 4px; margin-top: 4px; border-left: 3px solid ${worldToLocalColor};">
            <div style="font-size: 11px; font-weight: bold; color: ${worldToLocalColor};">
                ${worldToLocalIcon} 변환 정확도
            </div>
            <div style="font-size: 10px; margin-top: 2px;">
                상대 오차율: ${worldToLocalAccuracy.relativeErrorPercentage.toFixed(4)}%
            </div>
        </div>
    `;
}

// 🟢 localToWorld 정확성 검증 함수
function validateLocalToWorldAccuracy(targetMesh, inputLocalCoords, outputWorldCoords) {
	// localToWorld → worldToLocal 역변환으로 정확성 검증
	const backToLocalCoords = targetMesh.worldToLocal(outputWorldCoords[0], outputWorldCoords[1], outputWorldCoords[2]);

	// 절대 오차 계산
	const absoluteError = Math.sqrt(
		Math.pow(backToLocalCoords[0] - inputLocalCoords[0], 2) +
		Math.pow(backToLocalCoords[1] - inputLocalCoords[1], 2) +
		Math.pow(backToLocalCoords[2] - inputLocalCoords[2], 2)
	);

	// 상대 오차율 계산
	const originalMagnitude = Math.sqrt(
		Math.pow(inputLocalCoords[0], 2) +
		Math.pow(inputLocalCoords[1], 2) +
		Math.pow(inputLocalCoords[2], 2)
	);

	const relativeErrorPercentage = originalMagnitude > 0 ? (absoluteError / originalMagnitude) * 100 : 0;

	// 콘솔 로그
	const status = absoluteError < 0.001 ? '✅ localToWorld 정확함' : '⚠️ localToWorld 오차 발생';
	console.log(`${status} - 상대오차: ${relativeErrorPercentage.toFixed(4)}%`);

	return {
		relativeErrorPercentage,
		isAccurate: absoluteError < 0.001
	};
}

// 🔵 worldToLocal 정확성 검증 함수
function validateWorldToLocalAccuracy(targetMesh, inputWorldCoords, outputLocalCoords) {
	// worldToLocal → localToWorld 역변환으로 정확성 검증
	const backToWorldCoords = targetMesh.localToWorld(outputLocalCoords[0], outputLocalCoords[1], outputLocalCoords[2]);

	// 절대 오차 계산
	const absoluteError = Math.sqrt(
		Math.pow(backToWorldCoords[0] - inputWorldCoords[0], 2) +
		Math.pow(backToWorldCoords[1] - inputWorldCoords[1], 2) +
		Math.pow(backToWorldCoords[2] - inputWorldCoords[2], 2)
	);

	// 상대 오차율 계산
	const originalMagnitude = Math.sqrt(
		Math.pow(inputWorldCoords[0], 2) +
		Math.pow(inputWorldCoords[1], 2) +
		Math.pow(inputWorldCoords[2], 2)
	);

	const relativeErrorPercentage = originalMagnitude > 0 ? (absoluteError / originalMagnitude) * 100 : 0;

	// 콘솔 로그
	const status = absoluteError < 0.001 ? '✅ worldToLocal 정확함' : '⚠️ worldToLocal 오차 발생';
	console.log(`${status} - 상대오차: ${relativeErrorPercentage.toFixed(4)}%`);

	return {
		relativeErrorPercentage,
		isAccurate: absoluteError < 0.001
	};
}
