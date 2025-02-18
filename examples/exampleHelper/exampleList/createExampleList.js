import ExampleList from './exampleList.js';

// 최상위 탭과 하위 내용을 보여줄 컨테이너
let currentActiveIndex = null; // 처음에는 null로 설정
let searchQueryGlobal = '';

// 최상위 탭 생성
const createTopLevelTabs = (container) => {
	const tabsContainer = document.createElement('div');
	tabsContainer.className = 'tabs-container';

	ExampleList.forEach((item, index) => {
		const tabButton = document.createElement('button');
		tabButton.textContent = item.name;
		tabButton.classList.add('tab-button'); // 공통 스타일용 클래스

		if (item.name === '2D') {
			tabButton.classList.add('twod');
		} else if (item.name === '3D') {
			tabButton.classList.add('threed');
		}

		tabButton.addEventListener('click', () => {
			// 이미 활성화된 탭인 경우, 활성 해제 후 전체 해제 처리
			if (tabButton.classList.contains('active')) {
				tabButton.classList.remove('active');
				currentActiveIndex = null;
				loadDescription(container, searchQueryGlobal);
			} else {
				// 먼저 모든 탭의 활성 상태 제거
				const allTabButtons = document.querySelectorAll('.tabs-container .tab-button');
				allTabButtons.forEach((btn) => btn.classList.remove('active'));

				// 현재 버튼만 활성화
				tabButton.classList.add('active');

				// 선택한 탭 인덱스로 설정 후 컨텐츠 로드
				currentActiveIndex = index;
				loadDescription(container, searchQueryGlobal);
			}
		});

		tabsContainer.appendChild(tabButton);
	});

	container.appendChild(tabsContainer);
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
// 리스트 렌더링 수정
const renderList = (items, parent, query) => {
	items.forEach(item => {
		if (matchesSearch(item, query)) {
			const li = document.createElement('li');
			parent.appendChild(li);

			if (item.path) {
				// 링크 표현
				const link = document.createElement('a');
				link.href = item.path;
				link.innerHTML = `<div>· ${item.name}</div>`;
				li.appendChild(link);

				// **example_container 스크롤 위치 저장**
				link.addEventListener('click', (event) => {
					event.preventDefault(); // 기본 링크 이동 방지
					saveScrollPosition(); // 스크롤 위치 저장
					window.location.href = link.href; // 링크로 이동
				});

				// 썸네일 처리
				if (item.description && item.thumb) {
					const descriptionUl = document.createElement('ul');
					descriptionUl.className = 'descriptionUl';
					li.appendChild(descriptionUl);

					if (Array.isArray(item.thumb)) {
						const thumbContainer = document.createElement('div');
						Object.assign(thumbContainer.style, {
							display: 'flex', gap: '4px', flexWrap: 'wrap', width: '170px',
						});
						item.thumb.forEach(thumbUrl => {
							const thumb = document.createElement('img');
							thumb.src = thumbUrl || 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/VertexColorTest/screenshot/screenshot-x150.png?raw=true';
							Object.assign(thumb.style, {
								width: 'calc(50% - 4px)',
								height: 'auto',
								flexShrink: '0',
							});
							thumbContainer.appendChild(thumb);
						});
						link.appendChild(thumbContainer);
					} else {
						const thumb = document.createElement('img');
						thumb.src =
							item.thumb ||
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/VertexColorTest/screenshot/screenshot-x150.png?raw=true';
						Object.assign(thumb.style, {marginTop: '4px', width: '170px'});
						link.appendChild(thumb);
					}
				}
			} else {
				// 링크가 없는 경우 텍스트만
				li.textContent = item.name;
				parent.style.color = '#fff';
				parent.style.textOverflow = 'ellipsis';
				parent.style.overflow = 'hidden';
			}

			// 하위 목록 재귀
			if (item.list && Array.isArray(item.list)) {
				const childUl = document.createElement('ul');
				renderList(item.list, childUl, query);
				li.appendChild(childUl);
			}
		} else if (item.list && Array.isArray(item.list)) {
			// 상위가 검색어에 안 맞아도, 하위에 검색 결과가 있을 수 있음
			const childUl = document.createElement('ul');
			renderList(item.list, childUl, query);
			if (childUl.hasChildNodes()) {
				parent.appendChild(childUl);
			}
		}
	});
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
		const ul = document.createElement('ul');
		listContainer.appendChild(ul);
		renderList(ExampleList, ul, searchQueryGlobal);
		return;
	}

	// 특정 탭이 선택된 경우 해당 탭 정보만 표시
	const selectedItem = ExampleList[currentActiveIndex];
	if (!selectedItem) return;

	const ul = document.createElement('ul');
	listContainer.appendChild(ul);

	if (matchesSearch(selectedItem, searchQuery)) {
		const li = document.createElement('li');
		ul.appendChild(li);

		if (selectedItem.path) {
			const link = document.createElement('a');
			link.href = selectedItem.path;
			link.textContent = selectedItem.name;
			li.appendChild(link);
		} else {
			li.textContent = selectedItem.name;
			ul.style.color = '#fff';
		}

		// 하위 목록 표시
		if (selectedItem.list && Array.isArray(selectedItem.list)) {
			const childUl = document.createElement('ul');
			renderList(selectedItem.list, childUl, searchQuery);
			li.appendChild(childUl);
		}
	} else if (selectedItem.list && Array.isArray(selectedItem.list)) {
		// 최상위가 검색어와 일치하지 않아도, 하위에서 검색 가능
		renderList(selectedItem.list, ul, searchQuery);
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

	inputField.addEventListener('input', () => {
		loadDescription(container, inputField.value.trim());
	});

	searchContainer.appendChild(inputField);
	project_title.appendChild(searchContainer);

	createTopLevelTabs(project_title);

};

// example_container에서 스크롤 위치 저장
const saveScrollPosition = () => {
	const container = document.querySelector('.example_container');
	if (container) {
		const scrollPosition = {
			x: container.scrollLeft,
			y: container.scrollTop,
		};
		localStorage.setItem('scrollPosition', JSON.stringify(scrollPosition));
	}
};

// example_container에서 스크롤 위치 복원
const waitForImagesToLoad = (container) => {
	const images = container.querySelectorAll('img');
	return Promise.all(
		Array.from(images).map((img) => {
			return new Promise((resolve) => {
				if (img.complete) {
					// 이미지가 이미 로드된 경우
					resolve();
				} else {
					// 이미지 로드 이벤트를 기다림
					img.addEventListener('load', resolve);
					img.addEventListener('error', resolve); // 에러 처리
				}
			});
		})
	);
};

const restoreScrollPosition = async () => {
	const savedScrollPosition = localStorage.getItem('scrollPosition');
	if (savedScrollPosition) {
		const {x, y} = JSON.parse(savedScrollPosition);
		const container = document.querySelector('.example_container');
		if (container) {
			// 이미지 로드 대기
			await waitForImagesToLoad(container);
			// 이미지 로드 후 스크롤 복원
			container.scrollTo(x, y);
			// 스크롤 복원 후, 저장된 위치 초기화 (옵션)
			localStorage.removeItem('scrollPosition');
		}
	}
};
const initialize = () => {

	addSearchBar();
	const container = document.createElement('div');
	container.className = 'example_container';
	document.body.appendChild(container);

	// 처음 로드시 currentActiveIndex가 null이므로 전체 아이템 표시
	loadDescription(container);

	// 스크롤 위치 복원
	restoreScrollPosition();

	// 하단 카피라이트 추가
	const footer = document.createElement('footer');
	footer.className = 'footer';
	footer.innerHTML = `<div class="footer_left"><a href="https://github.com/redcamel/RedGPU" target="_blank"><img src="/RedGPUHelper/examples/assets/github.png" height="32"/></a><div>This project is maintained by <a href="https://github.com/redcamel/RedGPU" target="_blank">RedCamel</a></div></div>`;
	container.appendChild(footer);

};

initialize();
