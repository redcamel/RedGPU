/**
 * VitePress 우측 목차(Outline) 접기/펼치기(Collapsible Tree) 컨트롤러
 */

let isGlobalListenerAttached = false;
let observer = null;
let rafId = null;

// 아래를 가리키는 기본 꺾쇠 아이콘 (열린 상태)
const CARET_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>`;

const LABELS = {
    ko: {collapseAll: '모두 접기', expandAll: '모두 펼치기'},
    en: {collapseAll: 'Collapse all', expandAll: 'Expand all'}
};

function getLang() {
    return (typeof document !== 'undefined' && document.documentElement.lang?.startsWith('ko')) ? 'ko' : 'en';
}

/**
 * 상단 '모두 접기 / 모두 펼치기' 버튼 텍스트 동기화
 */
function syncToggleAllButton(outlineRoot) {
    const btnAll = outlineRoot.querySelector('.outline-toggle-all-btn');
    if (!btnAll) return;

    const nestedLis = outlineRoot.querySelectorAll('.VPDocOutlineItem li.has-nested');
    if (!nestedLis.length) {
        btnAll.style.display = 'none';
        return;
    }

    btnAll.style.display = '';
    const hasAnyOpen = Array.from(nestedLis).some(li => !li.classList.contains('is-collapsed'));
    const lang = getLang();
    btnAll.textContent = hasAnyOpen ? LABELS[lang].collapseAll : LABELS[lang].expandAll;
}

/**
 * 특정 상위 항목 토글 (접기/펼치기)
 */
function toggleListItem(li, forceState) {
    if (!li || !li.classList.contains('has-nested')) return;

    const isCollapsed = typeof forceState === 'boolean'
        ? !forceState
        : li.classList.toggle('is-collapsed');

    if (typeof forceState === 'boolean') {
        li.classList.toggle('is-collapsed', isCollapsed);
    }

    const toggleBtn = li.querySelector(':scope > .outline-toggle-btn');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    }

    const outlineRoot = li.closest('.VPDocAsideOutline');
    if (outlineRoot) {
        syncToggleAllButton(outlineRoot);
    }
}

/**
 * 목차 내 각 항목에 토글 버튼 주입 및 상태 초기화
 */
export function updateOutlineElements() {
    if (typeof document === 'undefined') return;

    const outlineRoot = document.querySelector('.VPDocAsideOutline');
    if (!outlineRoot) return;

    const outlineItems = outlineRoot.querySelectorAll('.VPDocOutlineItem li');
    if (!outlineItems.length) return;

    let hasAnyNested = false;

    // 1. 하위 목록(ul)을 가진 항목들에 토글 버튼 추가 및 클래스 지정
    outlineItems.forEach(li => {
        const hasChildren = !!li.querySelector(':scope > ul');
        if (hasChildren) {
            hasAnyNested = true;
            li.classList.add('has-nested');
            let toggleBtn = li.querySelector(':scope > .outline-toggle-btn');
            if (!toggleBtn) {
                toggleBtn = document.createElement('button');
                toggleBtn.type = 'button';
                toggleBtn.className = 'outline-toggle-btn';
                toggleBtn.setAttribute('aria-label', 'Toggle subsection');
                toggleBtn.innerHTML = CARET_SVG;
                li.insertBefore(toggleBtn, li.firstChild);
            }
            toggleBtn.setAttribute('aria-expanded', !li.classList.contains('is-collapsed'));
        }
    });

    // 2. 하위 항목이 있는 경우에만 상단 '모두 접기/펼치기' 버튼 표시
    const titleEl = outlineRoot.querySelector('.outline-title');
    let btnAll = outlineRoot.querySelector('.outline-toggle-all-btn');

    if (hasAnyNested) {
        if (!btnAll && titleEl) {
            const lang = getLang();
            btnAll = document.createElement('button');
            btnAll.type = 'button';
            btnAll.className = 'outline-toggle-all-btn';
            btnAll.textContent = LABELS[lang].collapseAll;
            titleEl.parentNode.insertBefore(btnAll, titleEl.nextSibling);
        }
        syncToggleAllButton(outlineRoot);
    } else if (btnAll) {
        btnAll.remove();
    }
}

/**
 * 디바운스된 DOM 업데이트 요청 (GC 부하 방지 및 RAF 활용)
 */
export function scheduleOutlineUpdate() {
    if (typeof window === 'undefined') return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
        updateOutlineElements();
        rafId = null;
    });
}

/**
 * 전역 이벤트 위임 처리 (1회만 등록하여 클로저 생성 최소화)
 */
function attachGlobalEventListener() {
    if (isGlobalListenerAttached || typeof window === 'undefined') return;
    isGlobalListenerAttached = true;

    document.addEventListener('click', (e) => {
        // 1. 개별 화살표 버튼 클릭 시 -> 순수 토글
        const toggleBtn = e.target.closest('.outline-toggle-btn');
        if (toggleBtn) {
            e.preventDefault();
            e.stopPropagation();
            toggleListItem(toggleBtn.closest('li'));
            return;
        }

        // 2. '모두 접기/펼치기' 버튼 클릭 시
        const toggleAllBtn = e.target.closest('.outline-toggle-all-btn');
        if (toggleAllBtn) {
            e.preventDefault();
            e.stopPropagation();
            const outlineRoot = toggleAllBtn.closest('.VPDocAsideOutline');
            if (!outlineRoot) return;

            const nestedLis = outlineRoot.querySelectorAll('.VPDocOutlineItem li.has-nested');
            const hasAnyOpen = Array.from(nestedLis).some(li => !li.classList.contains('is-collapsed'));
            const lang = getLang();

            if (hasAnyOpen) {
                // 모두 접기
                nestedLis.forEach(li => {
                    li.classList.add('is-collapsed');
                    const btn = li.querySelector(':scope > .outline-toggle-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                toggleAllBtn.textContent = LABELS[lang].expandAll;
            } else {
                // 모두 펼치기
                nestedLis.forEach(li => {
                    li.classList.remove('is-collapsed');
                    const btn = li.querySelector(':scope > .outline-toggle-btn');
                    if (btn) btn.setAttribute('aria-expanded', 'true');
                });
                toggleAllBtn.textContent = LABELS[lang].collapseAll;
            }
            return;
        }

        // 3. 목차 링크(a.outline-link) 클릭 시
        const outlineLink = e.target.closest('.outline-link');
        if (outlineLink) {
            const parentLi = outlineLink.closest('li');

            // 상위 카테고리(하위 목록을 가진 행)인 경우: 가로 폭 전체 클릭 시 토글
            if (parentLi && parentLi.classList.contains('has-nested')) {
                const isCurrentlyCollapsed = parentLi.classList.contains('is-collapsed');

                if (isCurrentlyCollapsed) {
                    // 접혀있던 상태면 -> 펼침 (링크 이동도 정상 허용하여 해당 위치로 스크롤)
                    toggleListItem(parentLi, true);
                } else {
                    // 이미 열려있던 상태에서 클릭 -> 접기 (스크롤 점프 방지)
                    e.preventDefault();
                    e.stopPropagation();
                    toggleListItem(parentLi, false);
                }
            }
        }
    }, true);
}

/**
 * MutationObserver 및 테마 연동 진입점
 */
export function setupOutlineToggle() {
    if (typeof window === 'undefined') return;

    attachGlobalEventListener();
    scheduleOutlineUpdate();

    if (!observer) {
        observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (let i = 0; i < mutations.length; i++) {
                const m = mutations[i];
                if (m.type === 'childList') {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                scheduleOutlineUpdate();
            }
        });

        const target = document.querySelector('.VPDoc') || document.body;
        observer.observe(target, {
            childList: true,
            subtree: true
        });
    }
}
