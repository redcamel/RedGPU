import setSingleSceneTest from "../scene/setSingleSceneTest.js?t=1767862292106";

const PERCENT_MAX = 200;
const PIXEL_MAX = 2048;

/**
 * Creates a single view test.
 *
 * @param {Pane} pane - The Pane instance where the view will be added.
 * @param {View} view - The view to be added in the pane.
 * @param {boolean} openYn - Indicates whether the view should be opened or not. Default is false.
 */
const setSingleViewTest = (pane, view, openYn = false, camera2DYn = false) => {
    const TEST_DATA = createTestData(view);
    const {scene, camera} = view
    if (camera2DYn) {

    } else {

        pane.addBinding(view, 'useFrustumCulling')
        pane.addBinding(view, 'useDistanceCulling')
        createBooleanController(TEST_DATA, 'axis', pane, view)
        createBooleanController(TEST_DATA, 'grid', pane, view)
        pane.addBinding(view, 'distanceCulling', {min: 0, max: 200, step: 1})
    }

    const controllerWidth = createWidthHeightController(TEST_DATA, 'width', pane, view);
    const controllerHeight = createWidthHeightController(TEST_DATA, 'height', pane, view);
    const controllerX = createWidthHeightController(TEST_DATA, 'x', pane, view);
    const controllerY = createWidthHeightController(TEST_DATA, 'y', pane, view);

    addDimensionBinding(pane, view, TEST_DATA, controllerWidth, 'width', 'widthUnit');
    addDimensionBinding(pane, view, TEST_DATA, controllerHeight, 'height', 'heightUnit');
    addDimensionBinding(pane, view, TEST_DATA, controllerX, 'x', 'xUnit');
    addDimensionBinding(pane, view, TEST_DATA, controllerY, 'y', 'yUnit');
    const sceneFolder = pane.addFolder({title: scene.name, expanded: true})
    setSingleSceneTest(sceneFolder, scene, openYn)

}

export default setSingleViewTest

function createTestData(view) {
    return {
        grid: !!view.grid,
        axis: !!view.axis,
        width: stripUnits(view.width),
        height: stripUnits(view.height),
        widthUnit: handleInputValue(view.width),
        heightUnit: handleInputValue(view.height),

        x: stripUnits(view.x),
        y: stripUnits(view.y),
        xUnit: handleInputValue(view.x),
        yUnit: handleInputValue(view.y),

    };
}

const isPercentMode = (view, dimensionKey) => typeof view[dimensionKey] === "number" ? false : view[dimensionKey].includes('%');

function calculateDimensionValue(view, TEST_DATA, dimensionKey, unit, isPercentMode) {
    const parentDomRect = view.redGPUContext.sizeManager.pixelRectObject;
    const dimensionValue = TEST_DATA[dimensionKey];

    if (unit === '%' && !isPercentMode) {
        let calculatedValue = dimensionValue / parentDomRect[dimensionKey] * 100;
        return Math.ceil(calculatedValue * window.devicePixelRatio);
    } else if (unit !== '%' && isPercentMode) {
        let calculatedValue = (dimensionValue / 100) * parentDomRect[dimensionKey];
        return Math.floor(calculatedValue / window.devicePixelRatio);
    }
    return undefined;
}

function addDimensionBinding(pane, view, TEST_DATA, controller, dimensionKey, unitKey) {
    pane.addBinding(TEST_DATA, unitKey, {
        options: {
            '%': '%', 'px': 'px', 'number': 'number'
        }
    }).on('change', (info) => {
        const unit = info.value;
        controller.max = unit === '%' ? PERCENT_MAX : PIXEL_MAX;
        const prevPercentMode = isPercentMode(view, dimensionKey);
        const newDimensionValue = calculateDimensionValue(view, TEST_DATA, dimensionKey, unit, prevPercentMode);
        if (newDimensionValue !== undefined) {
            TEST_DATA[dimensionKey] = newDimensionValue;
            view[dimensionKey] = unit === 'number' ? newDimensionValue : `${newDimensionValue}${unit}`;
            controller.refresh();
        }
    });
}

function createBooleanController(TEST_DATA, property, pane, view) {
    return pane.addBinding(TEST_DATA, property, {
        value: view[property],
    }).on('change', (info) => {
        view[property] = info.value
    });
}

function createWidthHeightController(TEST_DATA, property, pane, view) {
    return pane.addBinding(TEST_DATA, property, {
        min: 0, max: 200, step: 0.01
    }).on('change', (info) => {
        view[property] = `${info.value}${TEST_DATA[`${property}Unit`].replace('number', '')}`
    });
}

function stripUnits(value) {
    if (typeof value === 'number') {
        return value;
    }
    return +value.replace(/px|%|em|rem|pt/g, '');
}

function handleInputValue(input) {
    if (typeof input === 'number') {
        return 'number';
    }

    const units = ['px', '%'];
    let matchedUnit = '';
    units.some(unit => {
        if (input.endsWith(unit)) {
            matchedUnit = unit;
            return true;
        }
        return false;
    });

    return matchedUnit || input;
}
