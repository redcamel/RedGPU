let timeout;
let timeout2;

/**
 * 로딩 UI 구성 요소를 생성하고 업데이트하는 핸들러
 */
const loadingProgressInfoHandler = (info) => {
    let loaderUI = document.querySelector('.loading-ui');
    console.log('여기', info)
    // 1. 초기 1회만 실행: 뼈대 생성 및 선택자 캐싱
    if (!loaderUI) {
        loaderUI = document.createElement('div');
        loaderUI.className = 'loading-ui';
        loaderUI.innerHTML = `
            <div class="loading-ui-title">📦 Loading Model...</div>
       
            <div class="info-container-model loading-ui-info">
                <div class="loading-ui-info-wrapper">
                    <div class="loading-ui-info-title">model</div>
                    <div class="loading-ui-info-detail"><span class="percent">0%</span><span class="size">0 / 0</span></div>
                    <div class="loading-ui-progress"><div class="bar"></div></div>
                </div>
            </div>
            <div class="info-container-buffers loading-ui-info">
                <div class="loading-ui-info-wrapper">
                    <div class="loading-ui-info-title">buffers</div>
                    <div class="loading-ui-info-detail"><span class="percent">0%</span><span class="size">0 / 0</span></div>
                    <div class="loading-ui-progress"><div class="bar"></div></div>
                </div>
            </div>
            <div class="info-container-textures loading-ui-info">
                <div class="loading-ui-info-wrapper">
                    <div class="loading-ui-info-title">textures</div>
                    <div class="loading-ui-info-detail"><span class="percent">0%</span><span class="size">0 / 0</span></div>
                    <div class="loading-ui-progress"><div class="bar"></div></div>
                </div>
            </div>
        `;
        document.body.appendChild(loaderUI);
    }

    const {model, buffers, textures, percent} = info;

    const updateSection = (key, data, isBytes = false) => {
        const container = loaderUI.querySelector(`.info-container-${key}`);
        if (data) {
            container.classList.add('active');
            container.querySelector('.loading-ui-progress .bar').style.width = `${data.percent}%`;
            container.querySelector('.percent').textContent = `${data.percent}%`;
            container.querySelector('.size').textContent = isBytes
                ? `${data.transferred} / ${data.totalSize}`
                : `${data.loaded} / ${data.total}`;
        } else {
            container.classList.remove('active');
        }
    };

    // 전체 프로그레스 바 업데이트
    loaderUI.querySelector('.loading-ui-progress .bar').style.width = `${percent}%`;

    // 각 섹션 업데이트
    updateSection('model', model, true);
    updateSection('buffers', buffers);
    updateSection('textures', textures);

    // 3. 로딩 완료 및 제거 로직 (안정화)
    const isModelDone = model ? model.percent >= 100 : true;
    const isBuffersDone = buffers ? buffers.percent >= 100 : true;
    const isTexturesDone = textures ? textures.percent >= 100 : true;
    const isAllLoaded = isModelDone && isBuffersDone && isTexturesDone;
    if (timeout) clearTimeout(timeout);
    if (timeout2) clearTimeout(timeout2);
    if (isAllLoaded) {


        timeout = setTimeout(() => {
            if (loaderUI) loaderUI.style.opacity = '0';
            timeout2 = setTimeout(() => {
                if (loaderUI && loaderUI.parentNode) loaderUI.remove();
            }, 500);
        }, 1000);
    }
};

export {loadingProgressInfoHandler};