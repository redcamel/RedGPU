import React, {useEffect} from 'react';
import GUI from 'lil-gui';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";

/**
 * [KO] RedGPUContext 관련 설정을 lil-gui에 추가하는 컴포넌트입니다.
 * [EN] A component that adds RedGPUContext-related settings to lil-gui.
 */
interface GuiRedGPUContextProps {
    gui: GUI;
    redGPUContext: RedGPUContext;
}

const GuiRedGPUContext: React.FC<GuiRedGPUContextProps> = ({gui, redGPUContext}) => {
    useEffect(() => {
        const contextFolder = gui.addFolder('RedGPUContext');

        // Render Scale
        contextFolder.add(redGPUContext, 'renderScale', 0.01, 1, 0.01);

        // Background Color
        if (redGPUContext.backgroundColor) {
            const bg = redGPUContext.backgroundColor;
            const colorProxy = {
                get backgroundColor() {
                    return bg.hex;
                },
                set backgroundColor(v: string) {
                    bg.setColorByHEX(v);
                }
            };
            contextFolder.addColor(colorProxy, 'backgroundColor').name('BG Color').listen();
            contextFolder.add(bg, 'a', 0, 1, 0.01).name('BG Alpha').listen();
        }


        // Alpha Mode
        contextFolder.add(redGPUContext, 'alphaMode', ['opaque', 'premultiplied']);

        // Size Management
        const parseSize = (value: string | number) => {
            if (typeof value === 'number') return { value, unit: 'number' };
            if (value.endsWith('%')) return { value: parseFloat(value), unit: '%' };
            if (value.endsWith('px')) return { value: parseFloat(value), unit: 'px' };
            return { value: parseFloat(value), unit: 'px' };
        };

        const initialWidth = parseSize(redGPUContext.width);
        const initialHeight = parseSize(redGPUContext.height);

        const SIZE_DATA = {
            width: initialWidth.value,
            widthUnit: initialWidth.unit,
            height: initialHeight.value,
            heightUnit: initialHeight.unit,
        };

        const sizeFolder = contextFolder.addFolder('Size');
        
        const updateWidth = () => {
            redGPUContext.width = SIZE_DATA.widthUnit === 'number' ? SIZE_DATA.width : `${SIZE_DATA.width}${SIZE_DATA.widthUnit}`;
        };
        const widthController = sizeFolder.add(SIZE_DATA, 'width', 0, initialWidth.unit === '%' ? 200 : 4096, 0.01).onChange(updateWidth);
        sizeFolder.add(SIZE_DATA, 'widthUnit', ['%', 'px', 'number']).onChange((unit: string) => {
            widthController.max(unit === '%' ? 200 : 4096);
            updateWidth();
        });

        const updateHeight = () => {
            redGPUContext.height = SIZE_DATA.heightUnit === 'number' ? SIZE_DATA.height : `${SIZE_DATA.height}${SIZE_DATA.heightUnit}`;
        };
        const heightController = sizeFolder.add(SIZE_DATA, 'height', 0, initialHeight.unit === '%' ? 200 : 4096, 0.01).onChange(updateHeight);
        sizeFolder.add(SIZE_DATA, 'heightUnit', ['%', 'px', 'number']).onChange((unit: string) => {
            heightController.max(unit === '%' ? 200 : 4096);
            updateHeight();
        });

        // setSize method test
        const setSizeFolder = contextFolder.addFolder('setSize method test').close();
        const TEST_SET_SIZE_DATA = [['300', '300'], ['600', '300'], ['50%', '300'], ['300', '50%'], ['100%', '100%']];
        TEST_SET_SIZE_DATA.forEach(([w, h]) => {
            const label = `setSize(${w}, ${h})`;
            const btnObj = { [label]: () => redGPUContext.setSize(w, h) };
            setSizeFolder.add(btnObj, label);
        });

        // Rect Info (Read-only)
        const rectFolder = contextFolder.addFolder('Rect Info');

        const DPR_DATA = {
            get devicePixelRatio() { return window.devicePixelRatio; }
        };
        rectFolder.add(DPR_DATA, 'devicePixelRatio').name('devicePixelRatio').listen().disable();

        const screenFolder = rectFolder.addFolder('Screen Rect');
        const SCREEN_DATA = {
            get x() { return +redGPUContext.screenRectObject.x.toFixed(2); },
            get y() { return +redGPUContext.screenRectObject.y.toFixed(2); },
            get width() { return +redGPUContext.screenRectObject.width.toFixed(2); },
            get height() { return +redGPUContext.screenRectObject.height.toFixed(2); }
        };
        screenFolder.add(SCREEN_DATA, 'x').name('x').listen().disable();
        screenFolder.add(SCREEN_DATA, 'y').name('y').listen().disable();
        screenFolder.add(SCREEN_DATA, 'width').name('width').listen().disable();
        screenFolder.add(SCREEN_DATA, 'height').name('height').listen().disable();

        const pixelFolder = rectFolder.addFolder('Pixel Rect');
        const PIXEL_DATA = {
            get x() { return redGPUContext.pixelRectObject.x; },
            get y() { return redGPUContext.pixelRectObject.y; },
            get width() { return redGPUContext.pixelRectObject.width; },
            get height() { return redGPUContext.pixelRectObject.height; }
        };
        pixelFolder.add(PIXEL_DATA, 'x').name('x').listen().disable();
        pixelFolder.add(PIXEL_DATA, 'y').name('y').listen().disable();
        pixelFolder.add(PIXEL_DATA, 'width').name('width').listen().disable();
        pixelFolder.add(PIXEL_DATA, 'height').name('height').listen().disable();


        return () => {
            contextFolder.destroy();
        };
    }, [gui, redGPUContext]);

    return null;
};

export default GuiRedGPUContext;
