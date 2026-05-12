import React, {useEffect} from 'react';
import {hdrImages} from "../../data/assets";
import {resolveExamplePath} from "../../utils/guiUtils";
import IBL from "@redgpu/src/resources/texture/ibl/IBL";
import CubeTexture from "@redgpu/src/resources/texture/CubeTexture";
import SkyBox from "@redgpu/src/display/skyboxs/skyBox/SkyBox";
import RedGPUContext from "@redgpu/src/context/RedGPUContext";

/**
 * [KO] 스카이박스 관련 설정을 tweakpane에 추가하는 컴포넌트입니다.
 * [EN] A component that adds SkyBox-related settings to tweakpane.
 */
interface GuiSkyboxProps {
    gui: any;
    redGPUContext: RedGPUContext;
    view: any;
}

const GuiSkybox: React.FC<GuiSkyboxProps> = ({gui, redGPUContext, view}) => {
    useEffect(() => {
        if (!view) return;

        const settings = {
            useSkyBox: !!view.skybox,
            skyboxImage: hdrImages[0].name,
            blur: view.skybox?.blur || 0,
            intensityMultiplier: view.skybox?.intensityMultiplier || 1,
            opacity: view.skybox?.opacity || 1
        };

        const pathInfo = {finalPath: ''};
        let sourceBinding: any = null;
        let settingsFolder: any = null;

        const syncSkyBoxProperties = () => {
            const sb = view.skybox;
            if (!sb) return;
            sb.blur = settings.blur;
            sb.intensityMultiplier = settings.intensityMultiplier;
            sb.opacity = settings.opacity;
        };

        const updateSkyBox = (name: string) => {
            if (!settings.useSkyBox) return;

            const imageInfo = hdrImages.find(item => item.name === name);
            if (!imageInfo) return;
            const src = imageInfo.path;

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

            const finalSrc = resolveExamplePath(src);
            const isHDR = typeof src === 'string' && src.toLowerCase().endsWith('.hdr');
            const luminance = imageInfo.nit || 20000;

            const newTexture = isHDR
                ? new IBL(redGPUContext, finalSrc as string, luminance).environmentTexture
                : new CubeTexture(redGPUContext, finalSrc as string[], true);

            if (view.skybox) view.skybox.texture = newTexture;
            else view.skybox = new SkyBox(redGPUContext, newTexture);

            view.skybox.luminance = luminance;

            syncSkyBoxProperties();
            gui.refresh();
        };

        const skyboxFolder = gui.addFolder({title: 'SkyBox', expanded: true});

        skyboxFolder.addBinding(settings, 'useSkyBox').on('change', (ev: any) => {
            if (ev.value) {
                updateSkyBox(settings.skyboxImage);
                if (settingsFolder) settingsFolder.disabled = false;
            } else {
                view.skybox = null;
                if (settingsFolder) settingsFolder.disabled = true;
                if (sourceBinding) {
                    sourceBinding.dispose();
                    sourceBinding = null;
                }
            }
        });

        settingsFolder = skyboxFolder.addFolder({title: 'SkyBox Settings', expanded: true});

        settingsFolder.addBinding(settings, 'skyboxImage', {
            options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {}),
        }).on('change', (ev: any) => updateSkyBox(ev.value));

        ['blur', 'intensityMultiplier', 'opacity'].forEach(key => {
            settingsFolder.addBinding(settings, key, {
                min: 0,
                max: key === 'intensityMultiplier' ? 5 : 1,
                step: 0.01
            }).on('change', (ev: any) => {
                if (view.skybox) (view.skybox as any)[key] = ev.value;
            });
        });

        settingsFolder.addBinding({
            get luminance() {
                return view.skybox ? view.skybox.luminance : 0;
            },
            set luminance(v) {
                if (view.skybox) view.skybox.luminance = v;
            },
        }, 'luminance', {min: 0, max: 100000, step: 100});

        if (settings.useSkyBox) updateSkyBox(settings.skyboxImage);
        else settingsFolder.disabled = true;

        return () => {
            skyboxFolder.dispose();
        };
    }, [gui, redGPUContext, view]);

    return null;
};

export default GuiSkybox;
