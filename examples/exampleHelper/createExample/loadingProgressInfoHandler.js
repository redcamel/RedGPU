
const loadingProgressInfoHandler = (info) => {
    let loaderUI = document.querySelector('.loading-ui');
    if (!loaderUI) {
        loaderUI = document.createElement('div');
        loaderUI.className = 'loading-ui'
        document.body.appendChild(loaderUI);
    }
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
    if (info.percent === 100) {
        loaderUI.style.opacity = 0
        setTimeout(() => loaderUI.remove(), 300);
    }
}
export {
    loadingProgressInfoHandler
};