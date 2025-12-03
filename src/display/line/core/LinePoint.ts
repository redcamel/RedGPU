class LinePoint {
    position: [number, number, number]
    colorRGBA: [number, number, number, number]

    constructor(
        x = 0, y = 0, z = 0,
        colorRGBA: [number, number, number, number]
    ) {
        this.position = [x, y, z]
        this.colorRGBA = colorRGBA
    }
}

export default LinePoint
