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

// 하위 멤버 목록을 담는 대표 카테고리 키워드 (GC 방지용 모듈 상수)
const CATEGORY_NAMES = new Set([
    'properties', '속성',
    'accessors', '액세서',
    'methods', '메서드',
    'events', '이벤트',
    'constructors', '생성자',
    'variables', '변수',
    'functions', '함수',
    'classes', '클래스',
    'interfaces', '인터페이스',
    'type-aliases', 'type aliases', '타입 별칭', '타입별칭',
    'enumerations', '열거형',
    'namespaces', '네임스페이스',
    'parameters', '매개변수'
]);

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

    // 0. Constructor 이후에 등장하는 하위 Example 항목은 목차에서 숨김 처리 (Constructor 이전의 클래스 Example만 보존)
    let pastConstructors = false;
    outlineItems.forEach(li => {
        const link = li.querySelector(':scope > .outline-link');
        if (link) {
            const text = link.textContent?.trim().toLowerCase();
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (text === 'constructors' || text === '생성자' || href === '#constructors') {
                pastConstructors = true;
            } else if (pastConstructors && (text === 'example' || text === '예제' || href.includes('example'))) {
                li.style.display = 'none';
            }
        }
    });

    // 0-1. 하위 항목이 하나도 없는 카테고리 및 본문에 내용이 없는 빈 섹션 숨김 처리
    outlineItems.forEach(li => {
        if (li.style.display === 'none') return;
        const isTopLevel = !li.parentElement?.closest('li');
        if (!isTopLevel) return;

        const link = li.querySelector(':scope > .outline-link');
        if (!link) return;

        const text = (link.textContent || '').trim().toLowerCase();
        const href = (link.getAttribute('href') || '').toLowerCase();
        const targetId = href.startsWith('#') ? decodeURIComponent(href.slice(1)) : '';
        const rawKey = text.replace(/[\s\-_]/g, '');

        // 자식 li 중 표시되는 항목 수 카운트
        let visibleChildCount = 0;
        const childLis = li.querySelectorAll(':scope > ul > li');
        for (let i = 0; i < childLis.length; i++) {
            if (childLis[i].style.display !== 'none') {
                visibleChildCount++;
            }
        }

        // 자식 항목이 이미 존재하는 카테고리(상속받은 속성/메서드, Accessors 등)는 절대 숨기지 않음
        if (visibleChildCount > 0) {
            return;
        }

        let isKnownCategory = false;
        for (const cat of CATEGORY_NAMES) {
            if (text === cat || href === `#${cat}` || rawKey === cat.replace(/[\s\-_]/g, '')) {
                isKnownCategory = true;
                break;
            }
        }

        // 멤버 카테고리인데 자식 항목이 0개인 경우 즉시 숨김
        if (isKnownCategory) {
            li.style.display = 'none';
            if (targetId) {
                const targetEl = document.getElementById(targetId);
                if (targetEl) targetEl.style.display = 'none';
            }
            return;
        }

        // 자식이 없는 일반 섹션(See, Extends 등)의 경우 본문 내용 검사
        let hasBodyContent = true;
        if (targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                hasBodyContent = false;
                let curr = targetEl.nextElementSibling;
                while (curr && curr.tagName !== 'H2') {
                    const tag = curr.tagName.toUpperCase();
                    // HR 태그를 제외하고 유의미한 텍스트 또는 자식 요소가 있는 경우 콘텐츠로 인정
                    if (tag !== 'HR') {
                        if (curr.textContent.trim().length > 0 || curr.children.length > 0) {
                            hasBodyContent = true;
                            break;
                        }
                    }
                    curr = curr.nextElementSibling;
                }
                if (!hasBodyContent) {
                    targetEl.style.display = 'none';
                }
            }
        }

        if (!hasBodyContent) {
            li.style.display = 'none';
        }
    });

    let hasAnyNested = false;

    // 1. 하위 목록(ul)을 가진 항목들에 토글 버튼 추가 및 클래스 지정
    outlineItems.forEach(li => {
        if (li.style.display === 'none') return;
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

    // 3. 프로퍼티(Accessors) 항목들에 g/s, get, set 배지 자동 주입
    applyAccessorBadges(outlineRoot);
}

/**
 * 프로퍼티(Accessors) 항목들에 g/s, get, set 배지 부여 (동일 규격 크기)
 */
function applyAccessorBadges(outlineRoot) {
    const nestedLis = outlineRoot.querySelectorAll('.VPDocOutlineItem li.has-nested');
    if (!nestedLis.length) return;

    nestedLis.forEach(parentLi => {
        const parentLink = parentLi.querySelector(':scope > .outline-link');
        if (!parentLink) return;

        const text = (parentLink.textContent || '').trim().toLowerCase();
        const href = (parentLink.getAttribute('href') || '').toLowerCase();

        // 'Properties', '속성', 'Accessors', '상속받은 속성' 등 프로퍼티 관련 폴더인지 판별
        const isPropSection = text.includes('properties') || text.includes('속성') || text.includes('accessors') ||
            href.includes('properties') || href.includes('accessors');

        if (!isPropSection) return;

        const childLinks = parentLi.querySelectorAll(':scope > ul > li > .outline-link');
        childLinks.forEach(link => {
            const rawHref = link.getAttribute('href');
            if (!rawHref || !rawHref.startsWith('#')) return;

            let badge = link.querySelector('.accessor-badge');

            const targetId = decodeURIComponent(rawHref.slice(1));
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            let hasGet = false;
            let hasSet = false;

            let curr = targetEl.nextElementSibling;
            while (curr) {
                const tagName = curr.tagName ? curr.tagName.toUpperCase() : '';
                // 다음 H2나 H3가 나오면 탐색 종료
                if (tagName === 'H2' || tagName === 'H3') {
                    break;
                }

                if (tagName === 'H4') {
                    const h4Text = curr.textContent || '';
                    if (h4Text.includes('Get Signature') || curr.id?.includes('get-signature')) {
                        hasGet = true;
                    } else if (h4Text.includes('Set Signature') || curr.id?.includes('set-signature')) {
                        hasSet = true;
                    }
                }
                curr = curr.nextElementSibling;
            }

            if (!hasGet && !hasSet) {
                if (badge) badge.remove();
                return;
            }

            let badgeText = '';
            let badgeClass = '';

            if (hasGet && hasSet) {
                badgeText = 'G/S';
                badgeClass = 'badge-gs';
            } else if (hasGet) {
                badgeText = 'GET';
                badgeClass = 'badge-get';
            } else {
                badgeText = 'SET';
                badgeClass = 'badge-set';
            }

            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'accessor-badge ' + badgeClass;
                badge.textContent = badgeText;
                link.insertBefore(badge, link.firstChild);
            } else {
                badge.className = 'accessor-badge ' + badgeClass;
                badge.textContent = badgeText;
                if (link.firstChild !== badge) {
                    link.insertBefore(badge, link.firstChild);
                }
            }
        });
    });
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
