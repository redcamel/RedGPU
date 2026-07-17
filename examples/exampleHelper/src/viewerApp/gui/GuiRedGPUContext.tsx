import React, {useEffect} from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {addColorAlphaInputs, parseSize} from "../../utils/guiUtils";

/**
 * [KO] RedGPUContext 관련 설정을 tweakpane에 추가하는 컴포넌트입니다.
 * [EN] A component that adds RedGPUContext-related settings to tweakpane.
 */
interface GuiRedGPUContextProps {
    gui: any;
    redGPUContext: RedGPUContext;
}

const GuiRedGPUContext: React.FC<GuiRedGPUContextProps> = ({gui, redGPUContext}) => {
    useEffect(() => {
        const contextFolder = gui.addFolder({title: 'RedGPUContext'});

        // Render Scale
        contextFolder.addBinding(redGPUContext, 'renderScale', {min: 0.01, max: 1, step: 0.01});

        contextFolder.addBlade({view: 'separator'});

        // Background Color
        if (redGPUContext.backgroundColor) {
            addColorAlphaInputs(contextFolder, redGPUContext.backgroundColor);
            contextFolder.addBlade({view: 'separator'});
        }

        // Alpha Mode
        contextFolder.addBinding(redGPUContext, 'alphaMode', {
            options: {
                opaque: 'opaque',
                premultiplied: 'premultiplied'
            }
        });

        contextFolder.addBlade({view: 'separator'});

        // Size Management
        const initialWidth = parseSize(redGPUContext.width);
        const initialHeight = parseSize(redGPUContext.height);

        const SIZE_DATA = {
            width: initialWidth.value,
            widthUnit: initialWidth.unit,
            height: initialHeight.value,
            heightUnit: initialHeight.unit,
        };

        const sizeFolder = contextFolder.addFolder({title: 'Size'});

        const updateWidth = () => {
            redGPUContext.width = SIZE_DATA.widthUnit === 'number' ? SIZE_DATA.width : `${SIZE_DATA.width}${SIZE_DATA.widthUnit}`;
        };
        const widthController = sizeFolder.addBinding(SIZE_DATA, 'width', {
            min: 0,
            max: initialWidth.unit === '%' ? 200 : 4096,
            step: 0.01
        });
        widthController.on('change', updateWidth);

        sizeFolder.addBinding(SIZE_DATA, 'widthUnit', {
            options: {'%': '%', 'px': 'px', 'number': 'number'}
        }).on('change', (ev) => {
            // Tweakpane 3.x doesn't support dynamic max change easily on input, 
            // but we can at least update the value.
            updateWidth();
        });

        const updateHeight = () => {
            redGPUContext.height = SIZE_DATA.heightUnit === 'number' ? SIZE_DATA.height : `${SIZE_DATA.height}${SIZE_DATA.heightUnit}`;
        };
        const heightController = sizeFolder.addBinding(SIZE_DATA, 'height', {
            min: 0,
            max: initialHeight.unit === '%' ? 200 : 4096,
            step: 0.01
        });
        heightController.on('change', updateHeight);

        sizeFolder.addBinding(SIZE_DATA, 'heightUnit', {
            options: {'%': '%', 'px': 'px', 'number': 'number'}
        }).on('change', () => {
            updateHeight();
        });

        // setSize method test
        const setSizeFolder = contextFolder.addFolder({title: 'setSize method test', expanded: false});
        const TEST_SET_SIZE_DATA = [['300', '300'], ['600', '300'], ['50%', '300'], ['300', '50%'], ['100%', '100%']];
        TEST_SET_SIZE_DATA.forEach(([w, h]) => {
            const label = `setSize(${w}, ${h})`;
            setSizeFolder.addButton({title: label}).on('click', () => redGPUContext.setSize(w, h));
        });

        contextFolder.addBlade({view: 'separator'});

        // Rect Info (Folder)
        const rectFolder = contextFolder.addFolder({title: 'Rect Info', expanded: true});

        const DPR_DATA = {
            get dpr() {
                return window.devicePixelRatio;
            }
        };
        rectFolder.addBinding(DPR_DATA, 'dpr', {readonly: true, label: 'DPR', interval: 500});

        const RECT_DATA = {
            get screen() {
                if (redGPUContext.destroyed) return 'RedGPUContext is destroyed';
                const s = redGPUContext.screenRectObject;
                return `x: ${s.x.toFixed(2)}, y: ${s.y.toFixed(2)}\nw: ${s.width.toFixed(2)}, h: ${s.height.toFixed(2)}`;
            },
            get pixel() {
                if (redGPUContext.destroyed) return 'RedGPUContext is destroyed';
                const p = redGPUContext.pixelRectObject;
                return `x: ${p.x}, y: ${p.y}\nw: ${p.width}, h: ${p.height}`;
            }
        };

        rectFolder.addBinding(RECT_DATA, 'screen', {
            readonly: true,
            label: 'Screen Rect',
            multiline: true,
            rows: 2,
            interval: 32
        });

        rectFolder.addBinding(RECT_DATA, 'pixel', {
            readonly: true,
            label: 'Pixel Rect',
            multiline: true,
            rows: 2,
            interval: 32
        });

        return () => {
            contextFolder.dispose();
        };
    }, [gui, redGPUContext]);

    return null;
};

export default GuiRedGPUContext;
