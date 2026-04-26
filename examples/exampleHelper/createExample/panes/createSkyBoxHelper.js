import {hdrImages} from './index.js?t=1770713934910';
import {resolveExamplePath} from './pathUtils.js?t=1770713934910';

/**
 * [KO] 스카이박스 예제 도우미 패널을 생성합니다.
 * [EN] Creates a helper panel for SkyBox examples.
 */
const createSkyBoxHelper = (pane, view, RedGPU) => {
    const settings = {
        useSkyBox: true,
        skyboxImage: hdrImages[0].name, // 이름 기반 저장
        blur: 0,
        intensityMultiplier: 1,
        opacity: 1
    };

    const pathInfo = { finalPath: '' };
    let sourceBinding, settingsFolder;

    // 2. 스카이박스 속성 동기화 함수
    const syncSkyBoxProperties = () => {
        const sb = view.skybox;
        if (!sb) return;
        Object.assign(sb, {
            blur: settings.blur,
            intensityMultiplier: settings.intensityMultiplier,
            opacity: settings.opacity
        });
    };

    // 3. 스카이박스 생성 및 소스 정보 업데이트
    const updateSkyBox = (name) => {
        if (!settings.useSkyBox) return;

        // 이름으로 정보 찾기
        const imageInfo = hdrImages.find(item => item.name === name);
        if (!imageInfo) return;
        const src = imageInfo.path;

        // 소스 경로 텍스트 업데이트
        pathInfo.finalPath = Array.isArray(src) ? src.join('\n') : src;
        if (sourceBinding) sourceBinding.dispose();
        
        const lineCount = pathInfo.finalPath.split('\n').length;
        const rows = Math.max(1, Math.min(lineCount, 10));
        sourceBinding = settingsFolder.addBinding(pathInfo, 'finalPath', {
            readonly: true,
            label: 'source',
            multiline: lineCount > 1,
            rows: rows
        });

        // 경로 해결 (유틸리티 사용)
        const finalSrc = resolveExamplePath(src);
        const isHDR = typeof src === 'string' && src.toLowerCase().endsWith('.hdr');
        const luminance = imageInfo.nit || 20000;
        
        const newTexture = isHDR 
            ? new RedGPU.Resource.IBL(view.redGPUContext, finalSrc, luminance).environmentTexture 
            : new RedGPU.Resource.CubeTexture(view.redGPUContext, finalSrc, true);

        if (view.skybox) view.skybox.texture = newTexture;
        else view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, newTexture);

        // 물리 휘도 직접 적용
        view.skybox.luminance = luminance;

        syncSkyBoxProperties();
        pane.refresh(); // UI 강제 갱신
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

    // 텍스처 선택 (Value를 Name으로 사용)
    settingsFolder.addBinding(settings, 'skyboxImage', {
        options: hdrImages.reduce((acc, item) => ({ ...acc, [item.name]: item.name }), {}),
    }).on('change', (ev) => updateSkyBox(ev.value));

    // 기본 슬라이더들
    ['blur', 'intensityMultiplier', 'opacity'].forEach(key => {
        settingsFolder.addBinding(settings, key, {
            min: 0, 
            max: key === 'intensityMultiplier' ? 5 : 1, 
            step: 0.01
        }).on('change', () => { if (view.skybox) view.skybox[key] = settings[key]; });
    });

    // 물리 휘도 설정 (직접 바인딩)
    settingsFolder.addBinding({
        get luminance() { return view.skybox ? view.skybox.luminance : 20000; },
        set luminance(v) { if (view.skybox) view.skybox.luminance = v; }
    }, 'luminance', { min: 0, max: 100000, step: 10, interval: 500 });

    // 분석 결과 (직접 바인딩)
    settingsFolder.addBinding({
        get baseLuminance() { return view.skybox ? view.skybox.baseLuminance : 0; }
    }, 'baseLuminance', { readonly: true, interval: 500 });

    // 5. 초기화 실행
    if (settings.useSkyBox) updateSkyBox(settings.skyboxImage);
    else settingsFolder.disabled = true;
};

export default createSkyBoxHelper;
