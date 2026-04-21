import {hdrImages} from './index.js?t=1770713934910';
import createSkyBoxHelper from './createSkyBoxHelper.js?t=1770713934910';

const createIblHelper = (pane, view, RedGPU, option = {}) => {
    const folder = pane.addFolder({title: 'Lighting', expanded: true});
    const iblFolder = folder.addFolder({title: 'IBL Settings', expanded: true});

    const settings = {
        hdrImage: hdrImages[0].path,
        useLight: false,
        useIBL: true,
        iblIntensity: 1.0,
        skyBoxIntensity: 1.0,
        ...option
    };

    // 경로 정보를 위한 상태 객체 - finalPath는 항상 문자열로 유지
    const pathInfo = {
        currentURL: window.location.href,
        pathname: window.location.pathname,
        pathSegments: window.location.pathname.split('/').join(' / '),
        examplesIndex: window.location.pathname.split('/').indexOf('examples'),
        currentDepth: 0,
        relativePrefix: '',
        originalSrc: '',
        finalPath: '' // 항상 문자열
    };

    // 바인딩 변수
    let sourceBinding;

    // 경로 정보 계산 및 업데이트
    const updatePathInfo = (src) => {
        const pathSegments = window.location.pathname.split('/');
        const examplesIndex = pathSegments.indexOf('examples');
        const currentDepth = pathSegments.length - examplesIndex - 2;

        pathInfo.examplesIndex = examplesIndex;
        pathInfo.currentDepth = currentDepth;
        pathInfo.relativePrefix = '../'.repeat(currentDepth);
        pathInfo.originalSrc = Array.isArray(src) ? `[${src.length} files]` : src;

        // finalPath를 항상 문자열로 변환
        if (Array.isArray(src)) {
            pathInfo.finalPath = src
                .map(path => path)
                .join('\n');
        } else {
            pathInfo.finalPath = src;
        }

        // 기존 바인딩 제거 후 새로운 바인딩 생성
        if (sourceBinding) {
            sourceBinding.dispose();
        }

        // 줄 수 계산
        const lineCount = pathInfo.finalPath.split('\n').length;
        const rows = Math.max(1, Math.min(lineCount, 10)); // 최소 1줄, 최대 10줄
        const isMultiline = lineCount > 1;

        sourceBinding = iblFolder.addBinding(pathInfo, 'finalPath', {
            readonly: true,
            label: 'source',
            multiline: isMultiline,
            rows: rows
        });

    };

    const createIBL = (view, src) => {
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

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, relativePath);
        ibl.intensity = settings.iblIntensity;
        view.ibl = ibl;

    };

    const handleLightToggle = (enabled) => {
        if (enabled) {
            const directionalLight = new RedGPU.Light.DirectionalLight();
            view.scene.lightManager.addDirectionalLight(directionalLight);
        } else {
            view.scene.lightManager.removeAllLight();
        }
    };

    const handleIBLToggle = (enabled) => {
        if (enabled) {
            createIBL(view, settings.hdrImage);
            iblFolder.disabled = false;
        } else {
            view.ibl = null;
            iblFolder.disabled = true;
        }
    };

    const handleHDRImageChange = (imagePath) => {
        createIBL(view, imagePath);
    };

    const hdrImageOptions = hdrImages.reduce((acc, item) => {
        acc[item.name] = item.path;
        return acc;
    }, {});

    folder.addBinding(settings, 'useLight').on('change', (ev) => {
        handleLightToggle(ev.value);
    });

    folder.addBinding(settings, 'useIBL').on('change', (ev) => {
        handleIBLToggle(ev.value);
    });

    const hdrImageControl = iblFolder.addBinding(settings, 'hdrImage', {
        options: hdrImageOptions
    }).on('change', (ev) => {
        handleHDRImageChange(ev.value);
    });

    const iblIntensityControl = iblFolder.addBinding(settings, 'iblIntensity', {
        min: 0,
        max: 5,
        step: 0.1,
        label: 'IBL Intensity'
    }).on('change', (ev) => {
        if (view.ibl) {
            view.ibl.intensity = ev.value;
        }
    });

    const skyBoxIntensityControl = iblFolder.addBinding(settings, 'skyBoxIntensity', {
        min: 0,
        max: 5,
        step: 0.1,
        label: 'SkyBox Intensity'
    }).on('change', (ev) => {
        if (view.skybox) {
            view.skybox.intensity = ev.value;
        }
    });

    // 초기 경로 정보 설정 및 바인딩 생성
    updatePathInfo(hdrImages[0].path);

    if (settings.useIBL) createIBL(view, hdrImages[0].path);
    if (settings.useLight) handleLightToggle(settings.useLight);

    createSkyBoxHelper(pane, view, RedGPU)
};

export default createIblHelper;
