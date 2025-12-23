import RedGPUContext from "../../context/RedGPUContext";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import Box from "../../primitive/Box";
import Cylinder from "../../primitive/Cylinder"; // 실린더 클래스
import Sphere from "../../primitive/Sphere";
import Mesh from "../mesh/Mesh";

/**
 * Represents the DrawDebuggerAxis class with larger cone-like indicators at the ends of each axis.
 * @extends Mesh
 */
class DrawDebuggerAxis extends Mesh {
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, null, null);
        // Add central sphere
        const centerMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 0.5), new ColorMaterial(redGPUContext));
        this.addChild(centerMesh);
        const geometry = new Box(redGPUContext);
        // Add X-axis
        this.addChild(this.#createAxis(geometry, '#ff0000', [5, 0.1, 0.1], [2.5, 0, 0]));
        this.addChild(this.#createConeLikeTip(redGPUContext, '#ff0000', [0.5, 1.25], [5.5, 0, 0], [0, 0, 90]));
        // Add Y-axis
        this.addChild(this.#createAxis(geometry, '#00ff00', [0.1, 5, 0.1], [0, 2.5, 0]));
        this.addChild(this.#createConeLikeTip(redGPUContext, '#00ff00', [0.5, 1.25], [0, 5.5, 0], [180, 0, 0]));
        // Add Z-axis
        this.addChild(this.#createAxis(geometry, '#0000ff', [0.1, 0.1, 5], [0, 0, 2.5]));
        this.addChild(this.#createConeLikeTip(redGPUContext, '#0000ff', [0.5, 1.25], [0, 0, 5.5], [-90, 0, 0]));
    }

    /**
     * Creates a box-based axis.
     * @private
     */
    #createAxis(geometry: Box, color: string, scale: [number, number, number], position: [number, number, number]): Mesh {
        const {redGPUContext} = this;
        const axis = new Mesh(redGPUContext, geometry, new ColorMaterial(redGPUContext, color));
        axis.setScale(...scale);
        axis.setPosition(...position);
        return axis;
    }

    /**
     * Creates a cone-like tip using a cylinder with a very tiny top radius.
     * The cone points towards the + direction of each axis.
     * @private
     */
    #createConeLikeTip(
        redGPUContext: RedGPUContext,
        color: string,
        scale: [number, number], // [radius, height]
        position: [number, number, number],
        rotation: [number, number, number]
    ): Mesh {
        const coneTip = new Mesh(
            redGPUContext,
            new Cylinder(redGPUContext, scale[0], 0.001, scale[1], 32, 1), // 윗면 반지름을 매우 작은 값으로 설정하여 원뿔 구현
            new ColorMaterial(redGPUContext, color)
        );
        coneTip.setScale(scale[0], scale[1], scale[0]); // 축 끝에 적합한 크기로 스케일 조정
        coneTip.setPosition(...position);
        coneTip.setRotation(...rotation);
        return coneTip;
    }
}

export default DrawDebuggerAxis;
