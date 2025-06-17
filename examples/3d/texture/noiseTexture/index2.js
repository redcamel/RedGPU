import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// Global animation control variables
// 전역 애니메이션 컨트롤 변수들
window.noiseAnimationSpeed = 1.0;
window.noiseAutoRotate = true;

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		// Create a camera controller (Orbit type)
		// 궤도형 카메라 컨트롤러 생성
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.distance = 10;
		controller.speedDistance = 0.3;

		// Create a scene and add a view with the camera controller
		// 씬을 생성하고 카메라 컨트롤러와 함께 뷰 추가
		const scene = new RedGPU.Display.Scene();

		// Add multiple lights for better material visualization
		// 머티리얼 시각화를 위한 다중 조명 추가
		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 0.8;
		scene.lightManager.addDirectionalLight(directionalLight);

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.3;
		// scene.lightManager.addAmbientLight(ambientLight);

		// Add a view and configure it
		// 뷰 생성 및 설정 추가
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// Add multiple meshes to showcase different effects
		// 다양한 효과를 보여주는 여러 메쉬 추가
		const meshes = addMultipleMeshes(redGPUContext, scene);

		// Create a renderer and start rendering
		// 렌더러 생성 후 렌더링 시작
		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, (time) => {
			// Use global animation speed control
			// 전역 애니메이션 속도 컨트롤 사용
			const globalSpeed = window.noiseAnimationSpeed || 1.0;
			const autoRotate = window.noiseAutoRotate !== false;

			// Animate all noise textures
			// 모든 노이즈 텍스처 애니메이션
			meshes.forEach((mesh, index) => {
				// Different animation speeds for variety
				// 다양성을 위한 서로 다른 애니메이션 속도
				const timeScale = (index + 1) * 0.3 * globalSpeed;

				if (mesh.material.diffuseTexture && mesh.material.diffuseTexture.render) {
					mesh.material.diffuseTexture.render(time / 1000 * timeScale);
				}
				if (mesh.material.normalTexture && mesh.material.normalTexture.render) {
					mesh.material.normalTexture.render(time / 1000 * timeScale);
				}
				if (mesh.material.alphaTexture && mesh.material.alphaTexture.render) {
					mesh.material.alphaTexture.render(time / 1000 * timeScale);
				}

				// Apply auto rotation control
				// 자동 회전 컨트롤 적용
				if (autoRotate) {
					mesh.rotationY += 0.005 * globalSpeed;
				}
			});
		});

		// Render enhanced control pane with error handling
		// 에러 처리가 포함된 향상된 컨트롤 패널 렌더링
		renderEnhancedTestPane(redGPUContext, meshes, view).catch(error => {
			console.error("Failed to load control panel:", error);
		});
	},
	(failReason) => {
		// Handle initialization failure
		// 초기화 실패 처리
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		errorMessage.style.color = "red";
		errorMessage.style.fontSize = "18px";
		errorMessage.style.padding = "20px";
		document.body.appendChild(errorMessage);
	}
);

// Function to add multiple meshes showcasing different noise effects
// 다양한 노이즈 효과를 보여주는 여러 메쉬 추가 함수
const addMultipleMeshes = (redGPUContext, scene) => {
	const meshes = [];

	// Define different noise effects and their configurations
	// 다양한 노이즈 효과와 설정 정의
	const effectConfigs = [
		{
			name: "Water",
			effect: RedGPU.Resource.NoiseEffects.water(),
			position: [-6, 2, 0],
			geometry: "sphere",
			useAsNormal: false
		},
		{
			name: "Fire",
			effect: RedGPU.Resource.NoiseEffects.fire(),
			position: [-2, 2, 0],
			geometry: "box",
			useAsNormal: false
		},
		{
			name: "Clouds",
			effect: RedGPU.Resource.NoiseEffects.clouds(),
			position: [2, 2, 0],
			geometry: "sphere",
			useAsNormal: false
		},
		{
			name: "Electric",
			effect: RedGPU.Resource.NoiseEffects.electric(),
			position: [6, 2, 0],
			geometry: "box",
			useAsNormal: false
		},
		{
			name: "Water Normal",
			effect: RedGPU.Resource.NoiseEffects.waterNormal(),
			position: [-4, -2, 0],
			geometry: "sphere",
			useAsNormal: true
		},
		{
			name: "Rock Normal",
			effect: RedGPU.Resource.NoiseEffects.rockNormal(),
			position: [0, -2, 0],
			geometry: "box",
			useAsNormal: true
		},
	];

	effectConfigs.forEach((config, index) => {
		// Create appropriate geometry
		// 적절한 지오메트리 생성
		let geometry;
		if (config.geometry === "sphere") {
			geometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 32, 16);
		} else {
			geometry = new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2, 8, 8, 8, 1);
		}

		// Create noise texture with the specified effect
		// 지정된 효과로 노이즈 텍스처 생성
		const noiseTexture = new RedGPU.Resource.NoiseTexture(
			redGPUContext,
			512,
			512,
			config.effect
		);

		// Create material with appropriate settings
		// 적절한 설정으로 머티리얼 생성
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);

		if (config.useAsNormal) {
			// For normal maps, use a neutral diffuse color
			// 노말맵의 경우 중성적인 디퓨즈 색상 사용
			material.diffuseColor = [0.8, 0.8, 0.8, 1.0];
			material.normalTexture = noiseTexture;
		} else {
			// For color effects, use as diffuse texture
			// 컬러 효과의 경우 디퓨즈 텍스처로 사용
			material.diffuseTexture = noiseTexture;
		}

		// Create and position mesh
		// 메쉬 생성 및 위치 설정
		const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
		mesh.setPosition(...config.position);
		mesh.effectConfig = config; // Store config for UI reference
		mesh.visible = true; // Ensure mesh is visible by default
		scene.addChild(mesh);

		meshes.push(mesh);
	});

	return meshes;
};

// Enhanced test pane with noise effect controls
// 노이즈 효과 컨트롤이 포함된 향상된 테스트 패널
const renderEnhancedTestPane = async (redGPUContext, meshes, view) => {
	try {
		const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

		// Try to import setSeparator, but provide fallback
		// setSeparator 임포트 시도, 실패 시 대체 함수 제공
		let setSeparator;
		try {
			const helper = await import("../../../exampleHelper/createExample/panes/index.js");
			setSeparator = helper.setSeparator;
		} catch (e) {
			console.warn("Could not load setSeparator helper, using fallback");
			setSeparator = (folder) => {
				// Simple fallback - add a spacer
				folder.addSeparator();
			};
		}

		const pane = new Pane();

		// Global animation controls
		// 전역 애니메이션 컨트롤
		const globalControls = {
			animationSpeed: window.noiseAnimationSpeed,
			autoRotate: window.noiseAutoRotate,
		};

		const globalFolder = pane.addFolder({ title: '🎮 Global Controls', expanded: true });

		globalFolder.addBinding(globalControls, 'animationSpeed', {
			min: 0.0,
			max: 5.0,
			step: 0.1
		}).on('change', (evt) => {
			window.noiseAnimationSpeed = evt.value;
		});

		globalFolder.addBinding(globalControls, 'autoRotate').on('change', (evt) => {
			window.noiseAutoRotate = evt.value;
		});


		setSeparator(globalFolder);

		// Individual mesh controls
		// 개별 메쉬 컨트롤
		meshes.forEach((mesh, index) => {
			const config = mesh.effectConfig;
			const folderTitle = `${config.useAsNormal ? '🗺️' : '🎨'} ${config.name}`;

			const meshFolder = pane.addFolder({
				title: folderTitle,
				expanded: index === 0
			});

			// Mesh transform controls
			// 메쉬 변환 컨트롤
			const transformControls = {
				positionX: config.position[0],
				positionY: config.position[1],
				positionZ: config.position[2],
				visible: mesh.visible
			};

			meshFolder.addBinding(transformControls, 'positionX', {
				min: -10,
				max: 10,
				step: 0.5
			}).on('change', (evt) => {
				mesh.setPosition(evt.value, transformControls.positionY, transformControls.positionZ);
			});

			meshFolder.addBinding(transformControls, 'positionY', {
				min: -5,
				max: 5,
				step: 0.5
			}).on('change', (evt) => {
				mesh.setPosition(transformControls.positionX, evt.value, transformControls.positionZ);
			});

			meshFolder.addBinding(transformControls, 'positionZ', {
				min: -10,
				max: 10,
				step: 0.5
			}).on('change', (evt) => {
				mesh.setPosition(transformControls.positionX, transformControls.positionY, evt.value);
			});

			meshFolder.addBinding(transformControls, 'visible').on('change', (evt) => {
				mesh.visible = evt.value;
			});

			// Material controls
			// 머티리얼 컨트롤
			if (!config.useAsNormal && mesh.material.diffuseColor) {
				const materialControls = {
					opacity: mesh.material.diffuseColor[3] || 1.0,
					emissive: 0.0
				};

				meshFolder.addBinding(materialControls, 'opacity', {
					min: 0.0,
					max: 1.0,
					step: 0.05
				}).on('change', (evt) => {
					if (mesh.material.diffuseColor) {
						mesh.material.diffuseColor[3] = evt.value;
					}
				});

				meshFolder.addBinding(materialControls, 'emissive', {
					min: 0.0,
					max: 1.0,
					step: 0.05
				}).on('change', (evt) => {
					mesh.material.emissiveColor = [evt.value, evt.value, evt.value, 1.0];
				});
			}

			setSeparator(meshFolder);
		});

		// Performance info
		// 성능 정보
		const performanceFolder = pane.addFolder({ title: '📊 Performance', expanded: false });
		const performanceInfo = {
			fps: '60',
			meshCount: meshes.length.toString(),
			textureCount: meshes.length.toString()
		};

		performanceFolder.addBinding(performanceInfo, 'fps', {
			readonly: true
		});
		performanceFolder.addBinding(performanceInfo, 'meshCount', {
			readonly: true
		});
		performanceFolder.addBinding(performanceInfo, 'textureCount', {
			readonly: true
		});

		console.log("Control panel loaded successfully");

	} catch (error) {
		console.error("Error setting up control panel:", error);

		// Create a simple fallback panel
		// 간단한 대체 패널 생성
		const fallbackPanel = document.createElement('div');
		fallbackPanel.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: rgba(0,0,0,0.8);
			color: white;
			padding: 15px;
			border-radius: 5px;
			font-family: monospace;
			z-index: 1000;
		`;
		fallbackPanel.innerHTML = `
			<h3>Control Panel Error</h3>
			<p>Failed to load Tweakpane controls</p>
			<p>Using basic controls:</p>
			<button onclick="window.noiseAnimationSpeed = window.noiseAnimationSpeed > 0 ? 0 : 1">Toggle Animation</button>
		`;
		document.body.appendChild(fallbackPanel);
	}
};
