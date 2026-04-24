import {hdrImages} from './index.js?t=1770713934910';

/**
 * [KO] 스카이박스 예제 도우미 패널을 생성합니다.
 * [EN] Creates a helper panel for SkyBox examples.
 */
const createSkyBoxHelper = (pane, view, RedGPU) => {
    // 1. 상수 및 경로 초기 계산
    const pathSegments = window.location.pathname.split('/');
    const examplesIndex = pathSegments.indexOf('examples');
    const relativePrefix = '../'.repeat(Math.max(0, pathSegments.length - examplesIndex - 2));

    const settings = {
        useSkyBox: true,
        skyboxImage: hdrImages[0].path,
        blur: 0,
        intensity: 1,
        opacity: 1,
        nit: 20000
    };

    const pathInfo = { finalPath: '' };
    let sourceBinding, settingsFolder;

    // 2. 스카이박스 속성 동기화 함수
    const syncSkyBoxProperties = () => {
        const sb = view.skybox;
        if (!sb) return;
        Object.assign(sb, {
            blur: settings.blur,
            intensity: settings.intensity,
            opacity: settings.opacity,
            nit: settings.nit
        });
    };

    // 3. 스카이박스 생성 및 소스 정보 업데이트
    const updateSkyBox = (src) => {
        if (!settings.useSkyBox) return;

        // 소스 경로 텍스트 업데이트
        pathInfo.finalPath = Array.isArray(src) ? src.join('\n') : src;
        if (sourceBinding) sourceBinding.dispose();
        const rows = Math.max(1, Math.min(pathInfo.finalPath.split('\n').length, 10));
        sourceBinding = settingsFolder.addBinding(pathInfo, 'finalPath', {
            readonly: true,
            label: 'source',
            multiline: rows > 1,
            rows: rows
        });

        // 텍스처 생성
        const resolve = (p) => relativePrefix + p;
        const finalSrc = Array.isArray(src) ? src.map(resolve) : resolve(src);
        const isHDR = typeof src === 'string' && src.toLowerCase().endsWith('.hdr');
        
        const newTexture = isHDR 
            ? new RedGPU.Resource.IBL(view.redGPUContext, finalSrc).environmentTexture 
            : new RedGPU.Resource.CubeTexture(view.redGPUContext, finalSrc, true);

        if (view.skybox) view.skybox.skyboxTexture = newTexture;
        else view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, newTexture);

        syncSkyBoxProperties();
    };

    // 4. UI 구성
    const skyboxFolder = pane.addFolder({title: 'SkyBox', expanded: true});
    
    skyboxFolder.addBinding(settings, 'useSkyBox').on('change', (ev) => {
        if (ev.value) {
            updateSkyBox(settings.skyboxImage);
            settingsFolder.disabled = false;
        } else {
            view.skybox = null;
            settingsFolder.disabled = true;
            if (sourceBinding) { sourceBinding.dispose(); sourceBinding = null; }
        }
    });

    settingsFolder = skyboxFolder.addFolder({title: 'SkyBox Settings', expanded: true});

    // 텍스처 선택
    settingsFolder.addBinding(settings, 'skyboxImage', {
        options: hdrImages.reduce((acc, item) => ({ ...acc, [item.name]: item.path }), {}),
        label: 'texture'
    }).on('change', (ev) => updateSkyBox(ev.value));

    // 기본 슬라이더들 (blur, intensity, opacity)
    ['blur', 'intensity', 'opacity'].forEach(key => {
        settingsFolder.addBinding(settings, key, {
            min: 0, 
            max: key === 'intensity' ? 5 : 1, 
            step: 0.01
        }).on('change', () => { if (view.skybox) view.skybox[key] = settings[key]; });
    });

    // 물리 휘도 설정
    settingsFolder.addBinding(settings, 'nit', { min: 0, max: 100000, step: 10 })
        .on('change', () => { if (view.skybox) view.skybox.nit = settings.nit; });

    // 분석 결과 (직접 바인딩)
    settingsFolder.addBinding({
        get inherentLum() { return view.skybox ? view.skybox.inherentLuminance : 0; }
    }, 'inherentLum', { readonly: true, interval: 500 });

    // 5. 초기화 실행
    if (settings.useSkyBox) updateSkyBox(settings.skyboxImage);
    else settingsFolder.disabled = true;
};

export default createSkyBoxHelper;