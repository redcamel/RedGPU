import RedGPUContext from "../../../../context/RedGPUContext";
import {Mesh} from "../../../../object3d";
import Geometry from "../../../../resource/geometry/Geometry";
import InterleaveInfo from "../../../../resource/buffers/interleaveInfo/InterleaveInfo";
import InterleaveUnit from "../../../../resource/buffers/interleaveInfo/InterleaveUnit";
import GridMaterial from "./GridMaterial";
import hexadecimalToRgb from "../../../../util/color/hexadecimalToRgb";


class Grid extends Mesh {
    #size = 100;
    get size(): number {
        return this.#size;
    }

    set size(value: number) {
        this.#size = value;
        this.#update()
    }

    #divisions = 100;
    get divisions(): number {
        return this.#divisions;
    }

    set divisions(value: number) {
        this.#divisions = value;
        this.#update()
    }

    #centerColor: number = 0xcccccc;
    get centerColor(): number {
        return this.#centerColor;
    }

    set centerColor(value: number) {
        this.#centerColor = value;
        this.#update()
    }

    #color: number = 0x666666;
    get color(): number {
        return this.#color;
    }

    set color(value: number) {
        this.#color = value;
        this.#update()
    }

    constructor(
        redGPUContext: RedGPUContext,
        size: number = 100,
        divisions: number = 100,
        centerColor = 0xcccccc,
        color = 0x666666
    ) {
        super(redGPUContext)
        this.#size = size
        this.#divisions = divisions
        this.#centerColor = centerColor
        this.#color = color
        this.topology = 'line-list'
        this.#update()
    }

    #update() {
        let redGPUContext = this.redGPUContext;
        let center, step, halfSize;
        let i, k, tColor;
        let interleaveData = [];
        center = this.divisions / 2;
        step = this.size / this.divisions;
        halfSize = this.size / 2;
        for (i = 0, k = -halfSize; i <= this.divisions; i++ , k += step) {
            tColor = i === center ? hexadecimalToRgb(this.centerColor) : hexadecimalToRgb(this.color);
            interleaveData.push(
                -halfSize, 0, k, tColor.r, tColor.g, tColor.b, 1,
                halfSize, 0, k, tColor.r, tColor.g, tColor.b, 1,
                k, 0, -halfSize, tColor.r, tColor.g, tColor.b, 1,
                k, 0, halfSize, tColor.r, tColor.g, tColor.b, 1
            );
        }
        this.geometry = new Geometry(
            redGPUContext,
            new Float32Array(interleaveData),
            new InterleaveInfo([
                new InterleaveUnit(InterleaveUnit.VERTEX_POSITION, 'float32x3'),
                new InterleaveUnit(InterleaveUnit.VERTEX_COLOR, 'float32x4')
            ])
        )
        this.material = new GridMaterial(redGPUContext)
    }
}

export default Grid
