import ExampleList from './exampleList.js';

// 상태 관리 - sessionStorage에 저장/복원할 항목들
const STATE_KEY = 'redgpu_examples_state';
let currentActiveIndex = null;
let searchQueryGlobal = '';

// 상태 저장 함수
const saveState = () => {
    const state = {
        activeIndex: currentActiveIndex,
        searchQuery: searchQueryGlobal,
        scrollPosition: {
            x: document.querySelector('.example_container')?.scrollLeft || 0,
            y: document.querySelector('.example_container')?.scrollTop || 0
        }
    };
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
};

// 상태 복원 함수
const restoreState = () => {
    const savedState = sessionStorage.getItem(STATE_KEY);
    if (savedState) {
        const state = JSON.parse(savedState);
        currentActiveIndex = state.activeIndex;
        searchQueryGlobal = state.searchQuery || '';
        return state;
    }
    return null;
};

// 최상위 탭 생성
const createTopLevelTabs = (container) => {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'tabs-container';

    ExampleList.forEach((item, index) => {
        const tabButton = document.createElement('button');
        tabButton.textContent = item.name;
        tabButton.classList.add('tab-button');

        if (item.name === '2D') {
            tabButton.classList.add('twod');
        } else if (item.name === '3D') {
            tabButton.classList.add('threed');
        }

        // 상태 복원 시 활성화된 탭 설정
        if (index === currentActiveIndex) {
            tabButton.classList.add('active');
        }

        tabButton.addEventListener('click', () => {
            if (tabButton.classList.contains('active')) {
                tabButton.classList.remove('active');
                currentActiveIndex = null;
                loadDescription(container, searchQueryGlobal);
                saveState(); // 상태 저장
            } else {
                const allTabButtons = document.querySelectorAll('.tabs-container .tab-button');
                allTabButtons.forEach((btn) => btn.classList.remove('active'));
                tabButton.classList.add('active');
                currentActiveIndex = index;
                loadDescription(container, searchQueryGlobal);
                saveState(); // 상태 저장
            }
        });

        tabsContainer.appendChild(tabButton);
    });

    container.appendChild(tabsContainer);
    return tabsContainer;
};

// 검색어가 일치하는지 확인
const matchesSearch = (item, query) => {
    const lowerQuery = query.toLowerCase();
    return (
        !query ||
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.description?.ko && item.description.ko.toLowerCase().includes(lowerQuery)) ||
        (item.description?.en && item.description.en.toLowerCase().includes(lowerQuery))
    );
};
const createThumbnail = (item, link) => {
    // 썸네일 컨테이너 생성
    const thumbContainer = document.createElement('div');
    Object.assign(thumbContainer.style, {
        width: '100%',
        height: item.thumb ? '170px' : '90px',
        overflow: 'hidden',
        background: '#000',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)'
    });

    // 썸네일이 있는 경우
    if (item.thumb) {
        if (Array.isArray(item.thumb)) {
            // 그리드 레이아웃 처리 (여러 이미지)
            createGridThumbnails(item, thumbContainer);
        } else {
            // 단일 이미지 처리
            createSingleThumbnail(item, thumbContainer);
        }
    } else {
        // 썸네일이 없는 경우 타이틀만 표시
        createTitleOnly(item, thumbContainer);
    }

    link.appendChild(thumbContainer);
};

// 그리드 썸네일 생성 함수
const createGridThumbnails = (item, container) => {
    const gridContainer = document.createElement('div');
    Object.assign(gridContainer.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '3px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
    });

    // 최대 4개 이미지 처리
    const maxImages = Math.min(item.thumb.length, 4);
    for (let i = 0; i < maxImages; i++) {
        const thumbWrap = document.createElement('div');
        Object.assign(thumbWrap.style, {
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            position: 'relative'
        });

        const thumb = document.createElement('img');
        thumb.src = item.thumb[i];
        thumb.alt = `${item.name} thumbnail`;
        thumb.loading = 'lazy';

        Object.assign(thumb.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
        });

        thumbWrap.appendChild(thumb);
        gridContainer.appendChild(thumbWrap);
    }

    // 빈 셀 추가
    for (let i = maxImages; i < 4; i++) {
        const emptyCell = document.createElement('div');
        Object.assign(emptyCell.style, {
            background: '#1e1e1e',
            borderRadius: '4px'
        });
        gridContainer.appendChild(emptyCell);
    }

    container.appendChild(gridContainer);
};

// 단일 썸네일 생성 함수
const createSingleThumbnail = (item, container) => {
    const thumbWrap = document.createElement('div');
    Object.assign(thumbWrap.style, {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });

    const thumb = document.createElement('img');
    thumb.src = item.thumb;

    Object.assign(thumb.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: 'calc(100% - 41px)',
        objectFit: 'contain'
    });

    thumbWrap.appendChild(thumb);
    container.appendChild(thumbWrap);
};

// 타이틀 전용 컨테이너 생성 함수
const createTitleOnly = (item, container) => {
    const noThumbContainer = document.createElement('div');
    Object.assign(noThumbContainer.style, {
        width: '100%',
        height: 'calc(100% - 41px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '16px'
    });

    noThumbContainer.textContent = item.name || 'No thumbnail';
    container.appendChild(noThumbContainer);
};
const stripTags = (str) => str.replace(/<\/?[^>]+(>|$)/g, "");


// 아이템 렌더링 함수
const renderItem = (item, parent, query) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'example-item';

    if (item.path) {
        // 링크가 있는 예제 아이템
        const link = document.createElement('a');
        link.href = item.path;
        link.className = 'example-link';
        link.title = `${stripTags(item.name)} sample view`
        link.innerHTML = `<div class="example-name">${stripTags(item.name)}</div>`;

        // 샘플 페이지로 이동 시 현재 상태 저장
        link.addEventListener('click', (event) => {
            event.preventDefault();
            saveState(); // 전체 상태 저장
            window.location.href = link.href;
        });

        // 썸네일 추가
        createThumbnail(item, link);

        itemElement.appendChild(link);
    } else {
        // 링크가 없는 그룹 타이틀
        const titleElement = document.createElement('h3');
        titleElement.className = 'group-title';
        titleElement.textContent = item.name;
        itemElement.appendChild(titleElement);
    }

    parent.appendChild(itemElement);
    return itemElement;
};

// 아이템이 그룹인지 확인하는 함수
const isGroupItem = (item) => {
    return !item.path && item.list && Array.isArray(item.list);
};

// 그룹 내용 렌더링 함수
const renderGroupContent = (item, container, query) => {
    if (item.list && Array.isArray(item.list)) {
        // 일반 아이템과 그룹 아이템으로 분류
        const regularItems = [];
        const groupItems = [];

        item.list.forEach(subItem => {
            if (matchesSearch(subItem, query) ||
                (subItem.list && subItem.list.some(subSubItem => matchesSearch(subSubItem, query)))) {
                if (isGroupItem(subItem)) {
                    groupItems.push(subItem);
                } else {
                    regularItems.push(subItem);
                }
            }
        });

        // 일반 아이템이 있으면 가로 레이아웃으로 표시
        if (regularItems.length > 0) {
            const regularItemsContainer = document.createElement('div');
            regularItemsContainer.className = 'regular-items-container horizontal-layout';
            container.appendChild(regularItemsContainer);

            regularItems.forEach(subItem => {
                renderItem(subItem, regularItemsContainer, query);
            });
        }

        // 그룹 아이템이 있으면 세로 레이아웃으로 표시
        if (groupItems.length > 0) {
            const groupItemsContainer = document.createElement('div');
            groupItemsContainer.className = 'group-items-container vertical-layout';
            container.appendChild(groupItemsContainer);

            groupItems.forEach(subItem => {
                const subGroupContainer = document.createElement('div');
                subGroupContainer.className = 'subgroup-container';
                groupItemsContainer.appendChild(subGroupContainer);

                // 그룹 타이틀
                const subGroupTitle = document.createElement('h4');
                subGroupTitle.className = 'subgroup-title';
                subGroupTitle.textContent = subItem.name;
                subGroupContainer.appendChild(subGroupTitle);

                // 재귀적으로 하위 그룹 내용 렌더링
                renderGroupContent(subItem, subGroupContainer, query);
            });
        }
    }
};

// 메인 리스트 렌더링 함수
const renderExamplesList = (items, container, query) => {
    // 최상위 그룹 컨테이너 생성
    const groupsContainer = document.createElement('div');
    groupsContainer.className = 'groups-container vertical-layout';
    container.appendChild(groupsContainer);

    // 각 최상위 아이템을 그룹으로 처리
    items.forEach(item => {
        // 검색 필터링
        if (!matchesSearch(item, query) &&
            (!item.list || !item.list.some(subItem =>
                matchesSearch(subItem, query) ||
                (subItem.list && subItem.list.some(subSubItem => matchesSearch(subSubItem, query)))
            ))
        ) {
            return; // 검색에 해당하지 않는 항목은 건너뜀
        }

        // 그룹 컨테이너 생성
        const groupContainer = document.createElement('div');
        groupContainer.className = 'group-container';
        groupsContainer.appendChild(groupContainer);

        // 그룹 타이틀 렌더링
        renderItem(item, groupContainer, query);

        // 그룹 내용 렌더링 (하위 아이템들)
        renderGroupContent(item, groupContainer, query);
    });

    // 컨테이너에 자식이 없으면 제거
    if (!groupsContainer.hasChildNodes()) {
        container.removeChild(groupsContainer);
    }
};

// 선택된 탭(최상위 아이템)의 하위 목록 표시
const loadDescription = (container, searchQuery = '') => {
    searchQueryGlobal = searchQuery;
    const containerId = 'list-container';
    let listContainer = document.getElementById(containerId);

    if (!listContainer) {
        listContainer = document.createElement('div');
        listContainer.id = containerId;
        listContainer.className = 'list-container';
        container.appendChild(listContainer);
    }

    listContainer.innerHTML = '';

    // currentActiveIndex가 null이면 전체 목록 표시
    if (currentActiveIndex === null) {
        renderExamplesList(ExampleList, listContainer, searchQueryGlobal);
        return;
    }

    // 특정 탭이 선택된 경우 해당 탭 정보만 표시
    const selectedItem = ExampleList[currentActiveIndex];
    if (!selectedItem) return;

    if (matchesSearch(selectedItem, searchQuery) ||
        (selectedItem.list && selectedItem.list.some(item =>
            matchesSearch(item, searchQuery) ||
            (item.list && item.list.some(subItem => matchesSearch(subItem, searchQuery)))
        ))
    ) {
        const selectedItemsArray = [selectedItem];
        renderExamplesList(selectedItemsArray, listContainer, searchQueryGlobal);
    }
};

// 검색 바 추가
const addSearchBar = () => {
    const container = document.createElement('div');
    container.className = 'top_container';
    document.body.appendChild(container);

    const project_title = document.createElement('project_title');
    project_title.className = 'project_title';
    project_title.innerHTML = `<div>RedGPU Examples</div><span>JavaScript WebGPU library</span>`;
    container.appendChild(project_title);

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Search';

    // 저장된 검색어가 있으면 복원
    if (searchQueryGlobal) {
        inputField.value = searchQueryGlobal;
    }

    inputField.addEventListener('input', () => {
        const query = inputField.value.trim();
        searchQueryGlobal = query;
        loadDescription(container, query);
        saveState(); // 상태 저장
    });

    searchContainer.appendChild(inputField);
    project_title.appendChild(searchContainer);

    createTopLevelTabs(project_title);

    return container;
};

// 이미지 로드 대기 함수
const waitForImagesToLoad = (container) => {
    const images = container.querySelectorAll('img');
    return Promise.all(
        Array.from(images).map((img) => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }
            });
        })
    );
};

// 스크롤 위치 복원
const restoreScrollPosition = async (container, scrollPosition) => {
    if (scrollPosition && (scrollPosition.x !== 0 || scrollPosition.y !== 0)) {
        // 이미지 로드 대기
        await waitForImagesToLoad(container);
        // 이미지 로드 후 스크롤 복원
        container.scrollTo(scrollPosition.x, scrollPosition.y);
    }
};

const initialize = () => {
    // 먼저 상태 복원
    const savedState = restoreState();

    // 상단 검색바와 탭 추가
    const topContainer = addSearchBar();

    // 예제 컨테이너 생성
    const container = document.createElement('div');
    container.className = 'example_container';
    document.body.appendChild(container);

    // 저장된 검색어로 콘텐츠 로드
    loadDescription(container, searchQueryGlobal);

    // 하단 카피라이트 추가
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `<div class="footer_left"><a href="https://github.com/redcamel/RedGPU" target="_blank"><img src="/RedGPU/examples/assets/github.png" height="32"/></a><div>This project is maintained by <a href="https://github.com/redcamel/RedGPU" target="_blank">RedCamel</a></div></div>`;
    container.appendChild(footer);

    // 저장된 스크롤 위치가 있으면 복원
    if (savedState && savedState.scrollPosition) {
        restoreScrollPosition(container, savedState.scrollPosition);
    }
	addMetaTags()
    // 페이지 이탈 시 상태 저장 (브라우저 닫기 등)
    window.addEventListener('beforeunload', saveState);
};
// initialize 함수 내에 메타 태그 추가
const addMetaTags = () => {
	// 기본 메타 태그
	const metaTags = [
		{ name: 'description', content: 'RedGPU - collection of examples for the JavaScript WebGPU library. Explore 2D/3D graphics rendering samples.' },
		{ name: 'keywords', content: 'RedGPU, WebGPU, JavaScript, 3D, 2D, graphics, examples, library' },
		{ property: 'og:title', content: 'RedGPU Examples - JavaScript WebGPU Library' },
		{ property: 'og:description', content: 'Explore various examples and usage methods of the RedGPU JavaScript WebGPU library.' },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: window.location.href },
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: 'RedGPU Examples - JavaScript WebGPU Library' },
		{ name: 'twitter:description', content: 'RedGPU - Collection of examples for the JavaScript graphics library utilizing the latest WebGPU API' }
	];

	// 메타 태그 추가
	metaTags.forEach(tag => {
		const meta = document.createElement('meta');
		Object.keys(tag).forEach(key => {
			meta.setAttribute(key, tag[key]);
		});
		document.head.appendChild(meta);
	});
};

// initialize 함수 내에서 호출
addMetaTags();
// 초기화 실행
initialize();