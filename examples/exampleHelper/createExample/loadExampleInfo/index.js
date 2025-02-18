const codeSrc = 'index.js';
const prismCSS = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
const prismJS = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';

// Prism.js와 스타일 로드
const loadPrism = async () => {
	if (!document.querySelector(`link[href="${prismCSS}"]`)) { // 중복 로드 방지
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = prismCSS;
		document.head.appendChild(link);
	}

	if (!document.querySelector(`script[src="${prismJS}"]`)) { // 중복 로드 방지
		const script = document.createElement('script');
		script.src = prismJS;
		document.head.appendChild(script);

		// JS 로드 완료 대기
		await new Promise((resolve) => {
			script.onload = resolve;
		});
	}
};
const loadDescription = async () => {
	try {
		const currentFullPath = window.location.pathname;
		// console.log('Full Path:', currentFullPath);

		const mainCategory = getCategoryFromPath(currentFullPath);
		// console.log('Main Category:', mainCategory);

		const ExampleList = await import('../../exampleList/exampleList.js');
		const categoryData = ExampleList.default.find(category => category.name.toLowerCase() === mainCategory);

		if (!categoryData) {
			console.warn('No matching category found for the main category.');
			return;
		}

		let currentPath = currentFullPath.split('/examples/')[1];
		currentPath = normalizePath(currentPath);
		// console.log('Normalized Current Path:', currentPath);

		const titleBox = document.createElement('div');
		titleBox.className = 'title_box';
		document.body.appendChild(titleBox);

		// 중첩된 구조를 위한 탐색 함수
		const findExampleRecursively = (examples) => {
			for (const example of examples) {
				if (normalizePath(example.path) === currentPath) {
					return example; // 매칭된 예제 반환
				}
				if (example.list) {
					const found = findExampleRecursively(example.list); // 재귀 탐색
					if (found) return found;
				}
			}
			return null;
		};

		const matchedExample = findExampleRecursively(categoryData.list);

		if (matchedExample) {
			document.title = `RedGPU - ${matchedExample.name}`;
			const title = document.createElement('h1');
			title.innerHTML = matchedExample.name;
			titleBox.appendChild(title);

			const description = document.createElement('h2');
			description.innerHTML = matchedExample.description.en.replace(/\n/g, '<br/>');
			titleBox.appendChild(description);
			setTitleAndDescription(
				`${matchedExample.name} - RedGPU`,
				matchedExample.description.en
					.replace(/\n/g, '') // 줄바꿈 제거
					.replace(/\s+/g, ' ') // 공백 여러 개를 1개의 공백으로 변환
			);
		} else {
			console.warn('No matching createExample found for the normalized path.');
		}
	} catch (err) {
		console.error('Error loading data or matching createExample:', err);
	}
};

// 경로 정규화 함수
const normalizePath = (path) => {
	if (!path || path === '/') return ''; // 빈 경로나 루트 경로는 빈 문자열로 처리

	// `?` 이후 제거 (쿼리스트링 제거)
	path = path.split('?')[0];

	// '/index.html' 제거
	path = path.replace(/\/index\.html$/, '');

	// 앞뒤 '/' 제거 및 소문자로 변환
	return path.replace(/^\/|\/$/g, '').toLowerCase();
};
// 카테고리 추출 함수
const getCategoryFromPath = (path) => {
	// 'examples/' 이후 첫 번째 세그먼트를 가져옴 (예: '3d', '2d')
	const segments = path.split('/examples/')[1]?.split('/') || [];
	return segments[0] ? segments[0].toLowerCase() : ''; // 첫 번째 세그먼트를 반환
};
const setCanonicalLink = () => {
	const currentUrl = window.location.origin + window.location.pathname;

	// 'head'에 이미 canonical 태그가 존재하면 업데이트
	let canonicalLink = document.querySelector('link[rel="canonical"]');
	if (canonicalLink) {
		canonicalLink.href = currentUrl;
	} else {
		// canonical 태그가 없으면 새로 생성
		canonicalLink = document.createElement('link');
		canonicalLink.rel = 'canonical';
		canonicalLink.href = currentUrl;
		document.head.appendChild(canonicalLink);
	}
};
const setTitleAndDescription = (title, description) => {
	// Title 설정
	if (title) {
		document.title = title;

	}

	// Description 설정
	let metaDescription = document.querySelector('meta[name="description"]');
	if (metaDescription) {
		// 기존 meta description 태그가 있다면 업데이트
		metaDescription.content = description;
	} else {
		// meta description 태그가 없다면 새로 생성
		metaDescription = document.createElement('meta');
		metaDescription.name = 'description';
		metaDescription.content = description;
		document.head.appendChild(metaDescription);
	}

	// Keywords 설정
	const keywords = ['RedGPU',title.replace('- RedGPU','')]
	if (keywords) {
		let metaKeywords = document.querySelector('meta[name="keywords"]');
		if (metaKeywords) {
			// 기존 meta keywords 태그가 있다면 업데이트
			metaKeywords.content = keywords;
		} else {
			// meta keywords 태그가 없다면 새로 생성
			metaKeywords = document.createElement('meta');
			metaKeywords.name = 'keywords';
			metaKeywords.content = keywords;
			document.head.appendChild(metaKeywords);
		}
	}


};

const index = async () => {
	await loadPrism();
	await loadDescription();
	setCanonicalLink();

	// 소스 보기 버튼 생성
	const sourceViewButton = document.createElement('button');
	sourceViewButton.className = 'helperSourceView';
	sourceViewButton.innerText = 'Source View';
	document.body.appendChild(sourceViewButton);

	// 플로팅 코드 보기 창 생성
	const helperSourceViewFloatingCode = document.createElement('div');
	helperSourceViewFloatingCode.className = 'helperSourceViewFloatingCode';
	document.body.appendChild(helperSourceViewFloatingCode);

	// 상단 영역 생성 (타이틀 + 닫기 버튼)
	const topBar = document.createElement('div');
	topBar.className = 'helperSourceViewTopBar';
	helperSourceViewFloatingCode.appendChild(topBar);

	// 타이틀 생성
	const title = document.createElement('span');
	title.className = 'helperSourceViewTitle';
	title.innerText = 'Source View';
	topBar.appendChild(title);

	// 닫기 버튼 생성
	const closeButton = document.createElement('button');
	closeButton.className = 'helperSourceViewCloseButton';
	closeButton.innerText = 'Close';
	topBar.appendChild(closeButton);

	// 코드 하이라이트를 위한 'pre'와 'code' 태그 생성
	const codeContainer = document.createElement('pre');
	const codeContent = document.createElement('code');
	codeContent.className = 'language-javascript';
	codeContainer.appendChild(codeContent);
	helperSourceViewFloatingCode.appendChild(codeContainer);

	// 닫기 버튼 동작 정의
	closeButton.addEventListener('click', () => {
		helperSourceViewFloatingCode.style.display = 'none';
	});

	// 소스 보기 버튼 클릭 이벤트 정의
	sourceViewButton.addEventListener('click', async () => {
		try {
			// Prism.js 로드 확인
			if (typeof Prism === 'undefined') await loadPrism();

			// 파일 로드
			const response = await fetch(codeSrc);
			if (!response.ok) throw new Error('파일을 로드할 수 없습니다.');

			const codeText = await response.text();
			codeContent.textContent = codeText; // 코드 텍스트 설정
			Prism.highlightElement(codeContent); // 하이라이트 처리

			helperSourceViewFloatingCode.style.display = 'block'; // 플로팅 창 표시
		} catch (error) {
			alert(error.message); // 에러 메시지 표시
		}
	});

	const footer = document.createElement('footer');
	footer.className = 'footer';
	footer.innerHTML = `<div class="footer_left"><a href="https://github.com/redcamel/RedGPU" target="_blank"><img src="/RedGPUHelper/examples/assets/github.png" height="32"/></a><div>This project is maintained by <a href="https://github.com/redcamel/RedGPU" target="_blank">RedCamel</a></div></div>`;
	document.body.appendChild(footer);
};
index()
