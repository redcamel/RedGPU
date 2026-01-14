const createGridTest = (pane, grid, openYn = false) => {
    const TEST_DATA = {
        lineColor: {
            r: grid.lineColor.r,
            g: grid.lineColor.g,
            b: grid.lineColor.b,
            a: grid.lineColor.a,
        },
    }
    const folder = pane.addFolder({
        title: grid.name,
        expanded: openYn
    })
    folder.addBinding(grid, 'size', {min: 80, max: 100, step: 1})
    folder.addBinding(grid, 'lineWidth', {min: 0, max: 10})
    folder.addBinding(TEST_DATA, 'lineColor', {
        picker: 'inline',
        expanded: true,
        color: {
            alpha: true,
        },
    }).on('change', v => {
        const color = v.value;
        grid.lineColor.r = Math.floor(color.r)
        grid.lineColor.g = Math.floor(color.g)
        grid.lineColor.b = Math.floor(color.b)
        grid.lineColor.a = color.a
        console.log(grid.lineColor)
    })
}

export default createGridTest
