let removeTimeout;

// 각 리소스(URL)별 로딩 상태를 저장할 저장소
const loadingStates = new Map();

/**
 * 포맷팅 함수: 바이트를 읽기 좋은 단위로 변환
 */
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const loadingProgressInfoHandler = (info) => {
    const resourceKey = info.url || 'default';
    loadingStates.set(resourceKey, info);

    let loaderUI = document.querySelector('.loading-ui');
    if (!loaderUI) {
        loaderUI = document.createElement('div');
        loaderUI.className = 'loading-ui';
        loaderUI.style.transition = 'opacity 0.5s ease';
        loaderUI.innerHTML = `
            <div class="loading-ui-title">📦 Loading Resources...</div>
            
            <div class="info-container-model loading-ui-info" >
                <div class="loading-ui-info-wrapper">
                    <div class="loading-ui-info-title">model</div>
                    <div class="loading-ui-info-detail"><span class="percent">0%</span><span class="size" style="margin-left:10px; opacity:0.7;">0 / 0</span></div>
                    <div class="loading-ui-progress"><div class="bar"></div></div>
                    <div class="loading-ui-info-file"></div>
                </div>
            </div>

            <div class="info-container-buffers loading-ui-info" >
                <div class="loading-ui-info-wrapper">
                    <div class="loading-ui-info-title">buffers</div>
                    <div class="loading-ui-info-detail"><span class="percent">0%</span><span class="count" style="margin-left:10px; opacity:0.7;">0 / 0</span></div>
                    <div class="loading-ui-progress"><div class="bar"></div></div>
                </div>
            </div>

            <div class="info-container-textures loading-ui-info" >
                <div class="loading-ui-info-wrapper">
                    <div class="loading-ui-info-title">textures</div>
                    <div class="loading-ui-info-detail"><span class="percent">0%</span><span class="count" style="margin-left:10px; opacity:0.7;">0 / 0</span></div>
                    <div class="loading-ui-progress"><div class="bar"></div></div>
                </div>
            </div>
            
            <div class="total-progress-section" >
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
                    <span>TOTAL PROGRESS</span>
                    <span class="total-percent-text">0%</span>
                </div>
                <div class="loading-ui-progress" style="height:8px; background:#111;">
                    <div class="total-progress-bar" style="width:0%; background:#4caf50; height:100%; transition:width 0.2s;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(loaderUI);
    }

    // 데이터 집계
    const totals = {
        model: {loaded: 0, total: 0},
        buffers: {loaded: 0, total: 0},
        textures: {loaded: 0, total: 0}
    };

    loadingStates.forEach(state => {
        if (state.model) {
            totals.model.loaded += (state.model.loaded || 0);
            totals.model.total += (state.model.total || 0);
        }
        if (state.buffers) {
            totals.buffers.loaded += (state.buffers.loaded || 0);
            totals.buffers.total += (state.buffers.total || 0);
        }
        if (state.textures) {
            totals.textures.loaded += (state.textures.loaded || 0);
            totals.textures.total += (state.textures.total || 0);
        }
    });

    // 각 카테고리 진행도 및 유효성 판단 (total이 0이면 완료된 것으로 간주하여 평균 계산에 영향 안 주게 함)
    const mRatio = totals.model.total > 0 ? totals.model.loaded / totals.model.total : 1;
    const bRatio = totals.buffers.total > 0 ? totals.buffers.loaded / totals.buffers.total : 1;
    const tRatio = totals.textures.total > 0 ? totals.textures.loaded / totals.textures.total : 1;

    // 1. Model 섹션 노출 및 업데이트
    const mContainer = loaderUI.querySelector('.info-container-model');
    if (totals.model.total > 0) {
        mContainer.classList.add('active');
        const mPercent = mRatio * 100;
        mContainer.querySelector('.bar').style.width = `${mPercent}%`;
        mContainer.querySelector('.percent').textContent = `${Math.floor(mPercent)}%`;
        mContainer.querySelector('.size').textContent = `${formatBytes(totals.model.loaded)} / ${formatBytes(totals.model.total)}`;

        mContainer.querySelector('.loading-ui-info-file').innerHTML = Array.from(loadingStates, ([key, value]) => {
            if (!value.model || value.model.total === 0) return '';
            return `<div class="file"><span>${key}</span><span>${formatBytes(value.model.total)}</span></div>`;
        }).join('');
    } else {
        mContainer.classList.remove('active');
    }

    // 2. Buffers 섹션 노출 및 업데이트
    const bContainer = loaderUI.querySelector('.info-container-buffers');
    if (totals.buffers.total > 0) {
        bContainer.classList.add('active');
        const bPercent = bRatio * 100;
        bContainer.querySelector('.bar').style.width = `${bPercent}%`;
        bContainer.querySelector('.percent').textContent = `${Math.floor(bPercent)}%`;
        bContainer.querySelector('.count').textContent = `${totals.buffers.loaded} / ${totals.buffers.total}`;
    } else {
        bContainer.classList.remove('active');
    }

    // 3. Textures 섹션 노출 및 업데이트
    const tContainer = loaderUI.querySelector('.info-container-textures');
    if (totals.textures.total > 0) {
        tContainer.classList.add('active');
        const tPercent = tRatio * 100;
        tContainer.querySelector('.bar').style.width = `${tPercent}%`;
        tContainer.querySelector('.percent').textContent = `${Math.floor(tPercent)}%`;
        tContainer.querySelector('.count').textContent = `${totals.textures.loaded} / ${totals.textures.total}`;
    } else {
        tContainer.classList.remove('active');
    }

    // 4. 전체 진행도 섹션 표시 여부 (리소스가 2개 이상 로드 중일 때)
    const totalSection = document.querySelector('.total-progress-section');
    if (totalSection) {
        totalSection.style.display = loadingStates.size >= 2 ? 'block' : 'none';

        // 실제 데이터가 있는 항목들만 평균 계산
        const activeSections = [totals.model.total, totals.buffers.total, totals.textures.total].filter(t => t > 0).length;
        const avgTotal = activeSections > 0
            ? (((totals.model.total > 0 ? mRatio : 0) + (totals.buffers.total > 0 ? bRatio : 0) + (totals.textures.total > 0 ? tRatio : 0)) / activeSections) * 100
            : 100;

        const totalBar = document.querySelector('.total-progress-bar');
        const totalText = document.querySelector('.total-percent-text');
        if (totalBar) totalBar.style.width = `${avgTotal}%`;
        if (totalText) totalText.textContent = `${Math.floor(avgTotal)}%`;
    }

    // 5. 완료 처리 및 제거
    const isAllFinished = (mRatio >= 1 && bRatio >= 1 && tRatio >= 1);

    if (removeTimeout) clearTimeout(removeTimeout);

    if (isAllFinished) {
        removeTimeout = setTimeout(() => {
            if (loaderUI) {
                loaderUI.style.opacity = '0';
                loaderUI.addEventListener('transitionend', () => {
                    if (loaderUI.parentNode) {
                        loaderUI.remove();
                    }
                    loadingStates.clear();
                    removeTimeout = null;
                }, {once: true});
            }
        }, 1000);
    }
};

export {loadingProgressInfoHandler};