const setSingleSceneTest = (pane, scene, openYn = false) => {
    const TEST_DATA = {
        backgroundColor: {
            r: scene.backgroundColor.r,
            g: scene.backgroundColor.g,
            b: scene.backgroundColor.b,
            a: scene.backgroundColor.a,
        },
    }
    pane.addBinding(scene, 'useBackgroundColor');
    pane.addBinding(TEST_DATA, 'backgroundColor', {
        picker: 'inline',
        expanded: true,
        color: {
            alpha: true,
        },
    }).on('change', v => {
        const color = v.value;
        scene.backgroundColor.r = Math.floor(color.r)
        scene.backgroundColor.g = Math.floor(color.g)
        scene.backgroundColor.b = Math.floor(color.b)
        scene.backgroundColor.a = color.a
        console.log(scene.backgroundColor)
    })
}

export default setSingleSceneTest
