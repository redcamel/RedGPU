import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 조명 설정
		// [EN] Set up lighting
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		// [KO] 공통 재질 및 마커 생성
		// [EN] Create common material and marker
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
		const createMaterial = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.diffuseTexture = texture;
			return material;
		};

		const marker = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Sphere(redGPUContext, 0.15),
			new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
		);

		// [KO] 정보 표시용 HTML 요소 및 이벤트 설정
		// [EN] Set up HTML element for info display and events
		const infoBox = document.createElement('div');
		Object.assign(infoBox.style, {
			position: 'absolute',
			bottom: '70px',
			left: '20px',
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			backdropFilter: 'blur(10px)',
			border: '1px solid rgba(255, 255, 255, 0.2)',
			color: '#fff',
			padding: '6px 12px',
			borderRadius: '12px',
			fontSize: '11px',
			lineHeight: '1.6',
			pointerEvents: 'none',
			whiteSpace: 'pre-wrap',
			display: 'none',
			zIndex: '100'
		});
		document.body.appendChild(infoBox);

		const setupEvents = (mesh) => {
			mesh.addListener('over', (e) => {
				e.target.material.color.setColorByHEX('#00ff00');
				scene.addChild(marker);
				infoBox.style.display = 'block';
			});
			mesh.addListener('move', (e) => {
				marker.setPosition(e.point[0], e.point[1], e.point[2]);
				infoBox.innerHTML = `[Hit Info]\nObject: ${e.target.name}\nDistance: ${e.distance.toFixed(4)}\nWorld Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]\nLocal Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]\nFace Index: ${e.faceIndex}\nUV: [${e.uv[0].toFixed(3)}, ${e.uv[1].toFixed(3)}]`;
			});
			mesh.addListener('out', (e) => {
				e.target.material.color.setColorByHEX('#ffffff');
				scene.removeChild(marker);
				infoBox.style.display = 'none';
			});
		};

		// [KO] 객체 생성 및 이벤트 등록
		// [EN] Create objects and register events
		const primitives = [
			{ name: 'TorusKnot', geom: new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32, 2, 3), pos: [-6, 0, 0] },
			{ name: 'Box', geom: new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3), pos: [0, 0, 0] },
			{ name: 'Sphere', geom: new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32), pos: [6, 0, 0] },
			{ name: 'Cylinder', geom: new RedGPU.Primitive.Cylinder(redGPUContext, 1.5, 1.5, 4, 32), pos: [-4, 0, -5] },
			{ name: 'Torus', geom: new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5, 32, 32), pos: [4, 0, -5], rot: [90, 0, 0] }
		];

		primitives.forEach(p => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, p.geom, createMaterial());
			mesh.name = p.name;
			mesh.setPosition(...p.pos);
			if (p.rot) [mesh.rotationX, mesh.rotationY, mesh.rotationZ] = p.rot;
			scene.addChild(mesh);
			setupEvents(mesh);
		});

		new RedGPU.Renderer().start(redGPUContext);
		renderTestPane(redGPUContext);
	},
	(failReason) => console.error(failReason)
);

const renderTestPane = async (redGPUContext) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext);
	new Pane().addBlade({ view: 'text', label: 'Guide', value: 'Hover over objects to see raycasting in action!', parse: (v) => v, readonly: true });
};