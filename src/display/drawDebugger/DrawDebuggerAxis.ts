import RedGPUContext from "../../context/RedGPUContext";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import Box from "../../primitive/Box";
import Cylinder from "../../primitive/Cylinder";
import Sphere from "../../primitive/Sphere";
import Mesh from "../mesh/Mesh";

/**
 * [KO] 3D 공간의 X(빨강), Y(초록), Z(파랑) 3축 방향과 원점 위치를 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the X (Red), Y (Green), and Z (Blue) axis directions and origin position in 3D space.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 axis 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the axis property of View3D.
 * view.axis = true;
 * ```
 *
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
class DrawDebuggerAxis extends Mesh {
    /**
     * [KO] `DrawDebuggerAxis` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerAxis` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, null, null);
        const centerMesh = new Mesh(redGPUContext, new Sphere(redGPUContext, 0.5), new ColorMaterial(redGPUContext));
        this.addChild(centerMesh);
        const geometry = new Box(redGPUContext);
        this.addChild(this.#createAxis(geometry, '#ff0000', [5, 0.1, 0.1], [2.5, 0, 0]));
        this.addChild(this.#createConeLikeTip(redGPUContext, '#ff0000', [0.5, 1.25], [5.5, 0, 0], [0, 0, 90]));
        this.addChild(this.#createAxis(geometry, '#00ff00', [0.1, 5, 0.1], [0, 2.5, 0]));
        this.addChild(this.#createConeLikeTip(redGPUContext, '#00ff00', [0.5, 1.25], [0, 5.5, 0], [180, 0, 0]));
        this.addChild(this.#createAxis(geometry, '#0000ff', [0.1, 0.1, 5], [0, 0, 2.5]));
        this.addChild(this.#createConeLikeTip(redGPUContext, '#0000ff', [0.5, 1.25], [0, 0, 5.5], [-90, 0, 0]));
    }

    #createAxis(geometry: Box, color: string, scale: [number, number, number], position: [number, number, number]): Mesh {
        const {redGPUContext} = this;
        const axis = new Mesh(redGPUContext, geometry, new ColorMaterial(redGPUContext, color));
        axis.setScale(...scale);
        axis.setPosition(...position);
        return axis;
    }

    #createConeLikeTip(
        redGPUContext: RedGPUContext,
        color: string,
        scale: [number, number],
        position: [number, number, number],
        rotation: [number, number, number]
    ): Mesh {
        const coneTip = new Mesh(
            redGPUContext,
            new Cylinder(redGPUContext, scale[0], 0.001, scale[1], 32, 1),
            new ColorMaterial(redGPUContext, color)
        );
        coneTip.setScale(scale[0], scale[1], scale[0]);
        coneTip.setPosition(...position);
        coneTip.setRotation(...rotation);
        return coneTip;
    }
}

Object.freeze(DrawDebuggerAxis);
export default DrawDebuggerAxis;
