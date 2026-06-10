import React, {useEffect} from 'react';
import {hdrImages} from "../../data/hdrList";
import {resolveExamplePath} from "../../utils/guiUtils";
import {ExampleHelperState, useExampleHelperStore} from '../../store';

/**
 * [KO] 스카이박스 설정을 위한 Tweakpane GUI 헬퍼 컴포넌트입니다.
 * [EN] Tweakpane GUI helper component for SkyBox settings.
 */
interface GuiSkyBoxHelperProps {
    gui: any;
    view: any;
}

const GuiSkyBoxHelper: React.FC<GuiSkyBoxHelperProps> = ({gui, view}) => {
    const RedGPU = useExampleHelperStore((state: ExampleHelperState) => state.RedGPU);

    useEffect(() => {
        if (!view) return;

        const skyboxFolder = gui.addFolder({title: 'SkyBox', expanded: true});

        const settings = {
            useSkyBox: true,
            texture: hdrImages[0].name,
            blur: view.skybox?.blur || 0,
            intensityMultiplier: view.skybox?.intensityMultiplier || 1.0,
            opacity: view.skybox?.opacity || 1.0,
        };

        const pathInfo = {finalPath: ''};
        let sourceBinding: any;

        const updatePathInfo = (src: string | string[]) => {
            const getFileName = (path: string) => path.split('/').pop() || path;
            pathInfo.finalPath = Array.isArray(src) ? src.map(getFileName).join('\n') : getFileName(src);
            if (sourceBinding) sourceBinding.refresh();
        };

        const updateSkyBox = (name: string) => {
            if (!settings.useSkyBox) return;

            const imageInfo = hdrImages.find(item => item.name === name);
            if (!imageInfo) return;
            const src = imageInfo.path;

            updatePathInfo(src);

            const finalSrc = resolveExamplePath(src);
            const luminance = imageInfo.nit || 20000;

            if (RedGPU) {
                const isHDR = typeof src === 'string' && src.toLowerCase().endsWith('.hdr');
                const newTexture = isHDR
                    ? new RedGPU.Resource.IBL(view.redGPUContext, finalSrc, luminance).environmentTexture
                    : new RedGPU.Resource.CubeTexture(view.redGPUContext, finalSrc, true);

                if (view.skybox) {
                    view.skybox.texture = newTexture;
                    view.skybox.luminance = luminance;
                } else {
                    view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, newTexture, luminance);
                }

                // Sync properties
                view.skybox.blur = settings.blur;
                view.skybox.intensityMultiplier = settings.intensityMultiplier;
                view.skybox.opacity = settings.opacity;
            }

            gui.refresh();
        };

        skyboxFolder.addBinding(settings, 'useSkyBox').on('change', (ev: any) => {
            if (ev.value) {
                updateSkyBox(settings.texture);
                settingsFolder.disabled = false;
            } else {
                view.skybox = null;
                settingsFolder.disabled = true;
            }
        });

        const settingsFolder = skyboxFolder.addFolder({title: 'SkyBox Settings', expanded: true});

        settingsFolder.addBinding(settings, 'texture', {
            options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {}),
        }).on('change', (ev: any) => updateSkyBox(ev.value));

        settingsFolder.addBinding(settings, 'blur', {min: 0, max: 1, step: 0.01})
            .on('change', (ev: any) => {
                if (view.skybox) view.skybox.blur = ev.value;
            });

        settingsFolder.addBinding(settings, 'intensityMultiplier', {min: 0, max: 5, step: 0.1})
            .on('change', (ev: any) => {
                if (view.skybox) view.skybox.intensityMultiplier = ev.value;
            });

        settingsFolder.addBinding(settings, 'opacity', {min: 0, max: 1, step: 0.01})
            .on('change', (ev: any) => {
                if (view.skybox) view.skybox.opacity = ev.value;
            });

        settingsFolder.addBinding({
            get luminance() {
                return view.skybox ? view.skybox.luminance : 0;
            },
            set luminance(v) {
                if (view.skybox) view.skybox.luminance = v;
            },
        }, 'luminance', {min: 0, max: 100000, step: 100});

        sourceBinding = settingsFolder.addBinding(pathInfo, 'finalPath', {
            readonly: true,
            label: 'source',
            multiline: true,
            rows: 2
        });

        // Initial setup
        if (settings.useSkyBox) {
            updateSkyBox(settings.texture);
        } else {
            settingsFolder.disabled = true;
        }

        return () => {
            skyboxFolder.dispose();
        };
    }, [gui, view, RedGPU]);

    return null;
};

export default GuiSkyBoxHelper;
