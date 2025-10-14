class LinePoint {
    position;
    colorRGBA;
    constructor(x = 0, y = 0, z = 0, colorRGBA) {
        this.position = [x, y, z];
        this.colorRGBA = colorRGBA;
    }
}
export default LinePoint;
