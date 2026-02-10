import * as RedGPU from "../../../../../dist/index.js?t=1770697269592";

/**
 * [KO] Mesh Mouse Event 예제
 * [EN] Mesh Mouse Event example
 *
 * [KO] Mesh 객체에 대한 마우스 이벤트 처리를 보여줍니다.
 * [EN] Demonstrates mouse event handling for Mesh objects.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
    canvas,
    (redGPUContext) => {
		const isMobile = redGPUContext.detector.isMobile;
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);
        controller.distance = isMobile ? 12 : 9.5; // [KO] 구도 확보를 위해 거리 약간 확대 [EN] Slightly increased distance for better view
        controller.tilt = 0;

        const scene = new RedGPU.Display.Scene();
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        redGPUContext.addView(view);

		// [KO] 정보 표시용 HTML 요소 생성
		// [EN] Create HTML element for displaying information
		const infoBox = document.createElement('div');
		const updateInfoBoxStyle = () => {
			const isMobile = redGPUContext.detector.isMobile;
			Object.assign(infoBox.style, {
				position: 'absolute',
				bottom: isMobile ? '100px' : '70px',
				left: '12px',
				width: isMobile ? 'calc(100% - 64px)' : 'auto',
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(255, 255, 255, 0.2)',
				color: '#fff',
				padding: '6px 12px',
				borderRadius: '12px',
				fontSize: isMobile ? '12px' : '11px',
				lineHeight: '1.6',
				pointerEvents: 'none',
				textAlign: 'left',
				whiteSpace: 'pre-wrap',
				display: 'none',
				userSelect: 'none',
				zIndex: '100',
				boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
			});
		};
		updateInfoBoxStyle();
		document.body.appendChild(infoBox);

		const updateInfo = (eventName, e) => {
			infoBox.style.display = 'block';
			infoBox.innerHTML = `[Event Info]
Object: ${e.target.name}
Event: ${eventName}
Distance: ${e.distance ? e.distance.toFixed(4) : 'N/A'}
World Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]
Local Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]
Face Index: ${e.faceIndex}
UV: [${e.uv ? e.uv[0].toFixed(3) : 'N/A'}, ${e.uv ? e.uv[1].toFixed(3) : 'N/A'}]`;
		};

        const { updateLayout } = createSampleMesh(redGPUContext, scene, infoBox, updateInfo);

        redGPUContext.onResize = (resizeEvent) => {
			const { width, height } = resizeEvent.pixelRectObject;
			const aspect = width / height;
			const isMobile = redGPUContext.detector.isMobile;
			const baseDistance = isMobile ? 10 : 9.5;
			controller.distance = aspect < 1 ? baseDistance / aspect : baseDistance;
			updateInfoBoxStyle();
			updateLayout();
		};
		redGPUContext.onResize({
			target: redGPUContext,
			screenRectObject: redGPUContext.screenRectObject,
			pixelRectObject: redGPUContext.pixelRectObject
		});

        const renderer = new RedGPU.Renderer(redGPUContext);
        renderer.start(redGPUContext);

        renderTestPane(redGPUContext);
    },
    (failReason) => {
        console.error('Initialization failed:', failReason);
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = failReason;
        document.body.appendChild(errorMessage);
    }
);

/**
 * [KO] 샘플 메시를 생성합니다.
 * [EN] Creates a sample mesh.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Scene} scene
 * @param {HTMLElement} infoBox
 * @param {function} updateInfo
 * @returns {{meshes: Array<RedGPU.Display.Mesh>, updateLayout: function}}
 */
const createSampleMesh = (redGPUContext, scene, infoBox, updateInfo) => {
    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../../assets/UV_Grid_Sm.jpg');
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
	const meshes = [];
    const labels = [];

    Object.values(RedGPU.Picking.PICKING_EVENT_TYPE).forEach((eventName, index, array) => {
        const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
        material.useTint = true;
        
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.name = `Mesh_${eventName}`;
        scene.addChild(mesh);
        
        mesh.addListener(eventName, (e) => {
			updateInfo(eventName, e);
            TweenMax.to(material.tint, 0.5, {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255),
                roundProps: "r,g,b",
                ease: Power2.easeOut
            });
        });

        const label = new RedGPU.Display.TextField3D(redGPUContext);
        label.text = eventName;
        label.fontSize = 14;
        label.worldSize = 0.7;
        scene.addChild(label);
		
		meshes.push(mesh);
        labels.push(label);
    });

	const updateLayout = () => {
		const isMobile = redGPUContext.detector.isMobile;
		const radius = isMobile ? 2.5 : 3;
        const labelRadius = radius + 1.5; // [KO] 라벨 간격 1.5배 확대 [EN] Increased label radius by 1.5x
		const total = meshes.length;
		meshes.forEach((mesh, index) => {
			const angle = (index / total) * Math.PI * 2;
			mesh.x = Math.cos(angle) * radius;
			mesh.y = Math.sin(angle) * radius;
            
            const label = labels[index];
            label.x = Math.cos(angle) * labelRadius;
            label.y = Math.sin(angle) * labelRadius;
		});
	};

	updateLayout();
	return { meshes, updateLayout };
};

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 */
const renderTestPane = async (redGPUContext) => {
    const {
        setDebugButtons
    } = await import("../../../../exampleHelper/createExample/panes/index.js?t=1770697269592");
    setDebugButtons(RedGPU, redGPUContext);
};
