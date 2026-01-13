
const loadGLTF = (view, url) => {
    const {redGPUContext, scene} = view;

    const loaderUI = document.createElement('div');
    loaderUI.className = 'loading-ui'
    document.body.appendChild(loaderUI);

    new RedGPU.GLTFLoader(
        redGPUContext,
        url,
        (result) => {
            const mesh = result.resultMesh
            scene.addChild(mesh)
            view.camera.fitMeshToScreenCenter(mesh, view)
            loaderUI.style.opacity = 0
            setTimeout(() => loaderUI.remove(), 300);
        },
        (info) => {
            loaderUI.innerHTML = `
				<div class="loading-ui-title">📦 Loading Model...</div>
				<div class="loading-ui-progress">
					<div style="width: ${info.percent}%;"></div>
				</div>
				<div class="loading-ui-info">
					<span>${info.percent}%</span>
					<span>${info.transferred} / ${info.totalSize}</span>
				</div>
			`;
        }
    );
}
export default loadGLTF