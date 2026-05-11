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
        contextFolder.add(redGPUContext, 'renderScale', 0.01, 1, 0.01).name('Render Scale');

        // Background Color
        if (redGPUContext.backgroundColor) {
            const colorProxy = {
                get color() {
                    const c = redGPUContext.backgroundColor;
                    return [c.r * 255, c.g * 255, c.b * 255];
                },
                set color(v: number[]) {
                    redGPUContext.backgroundColor.r = v[0] / 255;
                    redGPUContext.backgroundColor.g = v[1] / 255;
                    redGPUContext.backgroundColor.b = v[2] / 255;
                },
                get alpha() {
                    return redGPUContext.backgroundColor.a;
                },
                set alpha(v: number) {
                    redGPUContext.backgroundColor.a = v;
                }
            };
            contextFolder.addColor(colorProxy, 'color').name('BG Color');
            contextFolder.add(colorProxy, 'alpha', 0, 1, 0.01).name('BG Alpha');
        }

        // Alpha Mode
        contextFolder.add(redGPUContext, 'alphaMode', ['opaque', 'premultiplied']).name('Alpha Mode');

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
        const widthController = sizeFolder.add(SIZE_DATA, 'width', 0, initialWidth.unit === '%' ? 200 : 4096, 0.01).name('Width').onChange(updateWidth);
        sizeFolder.add(SIZE_DATA, 'widthUnit', ['%', 'px', 'number']).name('Width Unit').onChange((unit: string) => {
            widthController.max(unit === '%' ? 200 : 4096);
            updateWidth();
        });

        const updateHeight = () => {
            redGPUContext.height = SIZE_DATA.heightUnit === 'number' ? SIZE_DATA.height : `${SIZE_DATA.height}${SIZE_DATA.heightUnit}`;
        };
        const heightController = sizeFolder.add(SIZE_DATA, 'height', 0, initialHeight.unit === '%' ? 200 : 4096, 0.01).name('Height').onChange(updateHeight);
        sizeFolder.add(SIZE_DATA, 'heightUnit', ['%', 'px', 'number']).name('Height Unit').onChange((unit: string) => {
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

        // Debug Info
        const debugFolder = contextFolder.addFolder('Debug').close();
        const DEBUG_DATA = {
            renderScale: '',
            width: '',
            height: '',
            pixelRectArray: '',
            pixelRectObject: '',
            parentDomRect: ''
        };
        
        const debugControllers = [
            debugFolder.add(DEBUG_DATA, 'renderScale').name('renderScale').disable(),
            debugFolder.add(DEBUG_DATA, 'width').name('width').disable(),
            debugFolder.add(DEBUG_DATA, 'height').name('height').disable(),
            debugFolder.add(DEBUG_DATA, 'pixelRectArray').name('pixelRectArray').disable(),
            debugFolder.add(DEBUG_DATA, 'pixelRectObject').name('pixelRectObject').disable(),
            debugFolder.add(DEBUG_DATA, 'parentDomRect').name('parentDomRect').disable()
        ];

        const updateDebug = () => {
            DEBUG_DATA.renderScale = String(redGPUContext.renderScale);
            DEBUG_DATA.width = String(redGPUContext.width);
            DEBUG_DATA.height = String(redGPUContext.height);
            DEBUG_DATA.pixelRectArray = `[${redGPUContext.sizeManager.pixelRectArray.join(', ')}]`;
            DEBUG_DATA.pixelRectObject = JSON.stringify(redGPUContext.pixelRectObject);
            DEBUG_DATA.parentDomRect = JSON.stringify(redGPUContext.sizeManager.parentDomRect);
            debugControllers.forEach(c => c.updateDisplay());
        };

        gui.onChange(updateDebug);
        updateDebug();

        return () => {
            contextFolder.destroy();
        };
    }, [gui, redGPUContext]);

    return null;
};

export default GuiRedGPUContext;
