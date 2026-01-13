const loadingProgressInfoHandler = (info) => {
    let loaderUI = document.querySelector('.loading-ui');
    if (!loaderUI) {
        loaderUI = document.createElement('div');
        loaderUI.className = 'loading-ui'
        document.body.appendChild(loaderUI);
        loaderUI.style.transition = 'opacity 1s'
        setTimeout(() => {
            loaderUI.style.opacity = 1
        }, 1000)
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
    if (info.percent >= 100) {
        setTimeout(() => {
            loaderUI.style.transition = 'opacity 0.3s'
            loaderUI.style.opacity = 0
        }, 300);
        setTimeout(() => loaderUI.remove(), 600);
    }
}
export {
    loadingProgressInfoHandler
};