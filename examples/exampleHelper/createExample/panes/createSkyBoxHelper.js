import {hdrImages} from './index.js?t=1770713934910';

const createSkyBoxHelper = (pane, view, RedGPU) => {
    const skyboxFolder = pane.addFolder({title: 'SkyBox', expanded: true});
    const settings = {
        skyboxImage: hdrImages[0].path,
        blur: 0,
        intensity: 1,
        opacity: 1,
    };

    // 경로 정보를 위한 상태 객체
    const pathInfo = {
        currentDepth: 0,
        relativePrefix: '',
        originalSrc: '',
        finalPath: ''
    };

    // 바인딩 변수
    let sourceBinding;

    // 경로 정보 계산 및 업데이트
    const updatePathInfo = (src) => {
        const pathSegments = window.location.pathname.split('/');
        const examplesIndex = pathSegments.indexOf('examples');
        const currentDepth = pathSegments.length - examplesIndex - 2;

        pathInfo.currentDepth = currentDepth;
        pathInfo.relativePrefix = '../'.repeat(currentDepth);
        pathInfo.originalSrc = Array.isArray(src) ? `[${src.length} files]` : src;

        if (Array.isArray(src)) {
            pathInfo.finalPath = src.join('\n');
        } else {
            pathInfo.finalPath = src;
        }

        if (sourceBinding) sourceBinding.dispose();

        const lineCount = pathInfo.finalPath.split('\n').length;
        const rows = Math.max(1, Math.min(lineCount, 10));
        const isMultiline = lineCount > 1;

        sourceBinding = skyboxFolder.addBinding(pathInfo, 'finalPath', {
            readonly: true,
            label: 'source',
            multiline: isMultiline,
            rows: rows
        });
    };

    const createSkyBox = (view, src) => {
        updatePathInfo(src);

        const pathSegments = window.location.pathname.split('/');
        const examplesIndex = pathSegments.indexOf('examples');
        const currentDepth = pathSegments.length - examplesIndex - 2;

        let relativePath;
        if (Array.isArray(src)) {
            relativePath = src.map(path => '../'.repeat(currentDepth) + path);
        } else {
            relativePath = '../'.repeat(currentDepth) + src;
        }

        let newTexture;
        if (typeof src === 'string' && src.toLowerCase().endsWith('.hdr')) {
            const ibl = new RedGPU.Resource.IBL(view.redGPUContext, relativePath);
            newTexture = ibl.environmentTexture;
        } else {
            newTexture = new RedGPU.Resource.CubeTexture(view.redGPUContext, relativePath, true);
        }

        if (view.skybox) {
            view.skybox.skyboxTexture = newTexture;
        } else {
            view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, newTexture);
        }

        // 현재 설정값 적용
        view.skybox.blur = settings.blur;
        view.skybox.intensity = settings.intensity;
        view.skybox.opacity = settings.opacity;
    };

    skyboxFolder.addBinding(settings, 'skyboxImage', {
        options: hdrImages.reduce((acc, item) => {
            acc[item.name] = item.path;
            return acc;
        }, {}),
        label: 'texture'
    }).on('change', (ev) => {
        createSkyBox(view, ev.value);
    });

    skyboxFolder.addBinding(settings, 'blur', {
        min: 0, max: 1, step: 0.01
    }).on("change", (ev) => {
        if (view.skybox) view.skybox.blur = ev.value;
    });

    skyboxFolder.addBinding(settings, 'intensity', {
        min: 0, max: 5, step: 0.01
    }).on("change", (ev) => {
        if (view.skybox) view.skybox.intensity = ev.value;
    });

    skyboxFolder.addBinding(settings, 'opacity', {
        min: 0, max: 1, step: 0.01
    }).on("change", (ev) => {
        if (view.skybox) view.skybox.opacity = ev.value;
    });

    // 초기 실행 및 생성
    createSkyBox(view, settings.skyboxImage);
};

export default createSkyBoxHelper;
