const codeSrc = 'index.js?t=1769586122100';
const prismCSS = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
const prismJS = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js?t=1769586122100';

const loadPrism = async () => {
    if (!document.querySelector(`link[href="${prismCSS}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = prismCSS;
        document.head.appendChild(link);
    }

    if (!document.querySelector(`script[src="${prismJS}"]`)) {
        const script = document.createElement('script');
        script.src = prismJS;
        document.head.appendChild(script);

        await new Promise((resolve) => {
            script.onload = resolve;
        });
    }
};

const loadDescription = async () => {
    try {
        const currentFullPath = window.location.pathname;

        const mainCategory = getCategoryFromPath(currentFullPath);

        const ExampleList = await import('../../exampleList/exampleList.js?t=1769586122100');
        const categoryData = ExampleList.default.find(category => category.name.toLowerCase() === mainCategory);

        if (!categoryData) {
            console.warn('No matching category found for the main category.');
            return;
        }

        let currentPath = currentFullPath.split('/examples/')[1];
        currentPath = normalizePath(currentPath);

        const titleBox = document.createElement('div');
        titleBox.className = 'title_box';
        document.body.appendChild(titleBox);

        const navbar = createNavigationBar(mainCategory);
        titleBox.appendChild(navbar);

        const findExampleRecursively = (examples) => {
            for (const example of examples) {
                if (normalizePath(example.path) === currentPath) {
                    return example;
                }
                if (example.list) {
                    const found = findExampleRecursively(example.list);
                    if (found) return found;
                }
            }
            return null;
        };

        const matchedExample = findExampleRecursively(categoryData.list);

        if (matchedExample) {
            const title = document.createElement('h1');
            title.innerHTML = matchedExample.name;
            if (matchedExample.experimental) {

                title.innerHTML += '<span class="experimental">EXPERIMENTAL</span>'
            }
            title.className = 'item-title'
            document.querySelector('.navigation-bar').appendChild(title);

            const description = document.createElement('h2');
            const descriptionText = matchedExample.description.en || `${matchedExample.name} | RedGPU Examples`;
            description.innerHTML = descriptionText.replace(/\n/g, '<br/>');
            description.className = 'item-description'
            document.querySelector('.navigation-bar').appendChild(description);
            setDomTitleAndDescription(
                `${matchedExample.name} | RedGPU`,
                descriptionText
                    .replace(/\n/g, '')
                    .replace(/\s+/g, ' ')
            );
        } else {
            console.warn('No matching createExample found for the normalized path.');
        }
    } catch (err) {
        console.error('Error loading data or matching createExample:', err);
    }
};

const createNavigationBar = (mainCategory) => {

    const navbar = document.createElement('div');
    navbar.className = 'navigation-bar';

    const homeButton = document.createElement('a');
    homeButton.className = 'nav-button home-button';
    homeButton.href = '/RedGPU/examples';
    homeButton.alt = 'Home';
    homeButton.target = (window?.self !== window?.top) ? '_blank' : '_self';
    // homeButton.innerHTML = '<span>Home</span>';
    homeButton.innerHTML = '<img src="/RedGPU/examples/assets/icons/home.svg" width="20"/>';
    navbar.appendChild(homeButton);

    if (window?.self !== window?.top) {
        const openInNewTabButton = document.createElement('a');
        openInNewTabButton.className = 'nav-button open-in-new-tab-button';
        openInNewTabButton.href = window.location.href;
        openInNewTabButton.target = '_blank';
        openInNewTabButton.innerHTML = '<img src="/RedGPU/examples/assets/icons/outLink.svg" width="20"/>';
        navbar.appendChild(openInNewTabButton);
    }

    return navbar;
};

const normalizePath = (path) => {
    if (!path || path === '/') return '';

    path = path.split('?')[0];

    path = path.replace(/\/index\.html$/, '');

    return path.replace(/^\/|\/$/g, '').toLowerCase();
};

const getCategoryFromPath = (path) => {
    const segments = path.split('/examples/')[1]?.split('/') || [];
    return segments[0] ? segments[0].toLowerCase() : '';
};

const setCanonicalLink = () => {
    const currentUrl = window.location.origin + window.location.pathname;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.href = currentUrl;
    } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = currentUrl;
        document.head.appendChild(canonicalLink);
    }
};

const setDomTitleAndDescription = (title, description) => {
    if (title) {
        document.title = title;
    }

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = description;
    } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = description;
        document.head.appendChild(metaDescription);
    }

    const keywords = ['RedGPU', 'WebGPU', title.replace(' | RedGPU', '')]
    if (keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = keywords;
        } else {
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

    const helperButtonContainer = document.createElement('div');
    helperButtonContainer.className = 'helperButtonContainer';
    document.body.appendChild(helperButtonContainer);

    const sourceViewButton = document.createElement('button');
    sourceViewButton.className = 'helperSourceView';
    sourceViewButton.innerText = 'Source';
    helperButtonContainer.appendChild(sourceViewButton);

    const helperSourceViewFloatingCode = document.createElement('div');
    helperSourceViewFloatingCode.className = 'helperSourceViewFloatingCode';
    document.body.appendChild(helperSourceViewFloatingCode);

    const topBar = document.createElement('div');
    topBar.className = 'helperSourceViewTopBar';
    helperSourceViewFloatingCode.appendChild(topBar);

    const title = document.createElement('span');
    title.className = 'helperSourceViewTitle';
    title.innerText = 'Source View';
    topBar.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.className = 'helperSourceViewCloseButton';
    closeButton.innerText = 'Close';
    topBar.appendChild(closeButton);

    const codeContainer = document.createElement('pre');
    const codeContent = document.createElement('code');
    codeContent.className = 'language-javascript';
    codeContainer.appendChild(codeContent);
    helperSourceViewFloatingCode.appendChild(codeContainer);

    closeButton.addEventListener('click', () => {
        helperSourceViewFloatingCode.style.display = 'none';
    });

    sourceViewButton.addEventListener('click', async () => {
        try {
            if (typeof Prism === 'undefined') await loadPrism();

            const response = await fetch(codeSrc);
            if (!response.ok) throw new Error('파일을 로드할 수 없습니다.');

            const codeText = await response.text();
            codeContent.textContent = codeText;
            Prism.highlightElement(codeContent);

            helperSourceViewFloatingCode.style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    });

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `<div class="footer_left"><a href="https://github.com/redcamel/RedGPU" target="_blank"><img src="/RedGPU/examples/assets/github.png" height="26"/></a><div>This project is maintained by <a href="https://github.com/redcamel/RedGPU" target="_blank">RedCamel</a></div></div>`;
    document.body.appendChild(footer);
};
index();
