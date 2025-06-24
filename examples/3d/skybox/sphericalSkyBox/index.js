import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);
		controller.tilt = 0
		controller.pan = 85



		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);

		redGPUContext.addView(view);

		createSphericalSkyBox(view);

		const renderer = new RedGPU.Renderer(redGPUContext);
		renderer.start(redGPUContext, () => {
		});
	},
	(failReason) => {
		console.error("Initialization failed:", failReason);
		const errorMessage = document.createElement("div");
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

const  createSphericalSkyBox = async (view) => {
	const {redGPUContext} = view;


	const hdrTexture =  new RedGPU.Resource.HDRTexture(
		redGPUContext,
		// '../../../assets/hdr/sphericalSkyBox.hdr'
		'../../../assets/hdr/Cannon_Exterior.hdr'
		// '../../../assets/hdr/field.hdr'
		// '../../../assets/hdr/neutral.37290948.hdr'
		// '../../../assets/hdr/pisa.hdr'
	);
	console.log('hdrTexture',hdrTexture)

	{
		setTimeout(()=>{

			const material = new RedGPU.Material.BitmapMaterial(redGPUContext,hdrTexture); // Red material / 빨간색 재질
			const geometry = new RedGPU.Primitive.Box(redGPUContext, 1, 1, 1); // Box geometry / 박스 형태 지오메트리
			const childMesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
			// view.scene.addChild(childMesh);
			view.skybox = new RedGPU.Display.SkyBox(redGPUContext, hdrTexture.iblTextures.environmentMap)
			view.iblTexture = hdrTexture.iblTextures.irradianceMap;
			renderTestPane(redGPUContext,view,hdrTexture.iblTextures.irradianceMap);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Corset/glTF/Corset.gltf',);
			loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearcoatWicker/glTF/ClearcoatWicker.gltf',);
			// loadGLTF(view, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ClearCoatTest/glTF/ClearCoatTest.gltf',);

		},1000)
	}

};

function loadGLTF(view, url) {
	const {redGPUContext, scene} = view

	let mesh
	new RedGPU.GLTFLoader(
		redGPUContext,
		url,
		(v) => {
			mesh = scene.addChild(v['resultMesh'])
			mesh.y = -1
			// mesh.setScale(50)
		}
	)
}

const renderTestPane = async (redGPUContext, view,iblTexture) => {

	const {Pane} = await import(
		"https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js"
		);

	const pane = new Pane();
	const {camera} = view.camera
	console.log('camera',camera)
	pane.addBinding(camera, 'fieldOfView',{
		min:12,
		max:100,
		step:0.1
	}).on("change", (ev) => {

	});
	const testData = {
		useIBLTexture : true
	}
	pane.addBinding(testData, 'useIBLTexture',{
		min:12,
		max:100,
		step:0.1
	}).on("change", (ev) => {
		if(ev.value) view.iblTexture = iblTexture
		else view.iblTexture = null

	});
};
