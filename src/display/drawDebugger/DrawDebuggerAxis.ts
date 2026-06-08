import RedGPUContext from "../../context/RedGPUContext";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import Box from "../../primitive/Box";
import Cylinder from "../../primitive/Cylinder"; // 실린더 클래스
import Sphere from "../../primitive/Sphere";
import Mesh from "../mesh/Mesh";

/**
 * X, Y, Z 세 축의 방향과 위치를 직관적으로 시각화해 주는 3D 공간 디버깅용 축 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 각 축의 양(+)의 끝부분에는 원뿔 형태의 화살표가 배치되어 공간 방향성을 인지하기 좋습니다.
 * - X축은 빨간색(Red), Y축은 초록색(Green), Z축은 파란색(Blue)으로 대응되어 표현됩니다.
 * - 원점(0, 0, 0)을 명확하게 파악할 수 있도록 중심부에 지름 1 크기(반지름 0.5)의 Sphere 메시가 배치되어 있습니다.
 *
 * **[EN]**
 * - Renders coordinate axis indicators along with positive-direction cone tips to clarify alignment in 3D space.
 * - Color-codes the axes respectively: X-axis in Red, Y-axis in Green, and Z-axis in Blue.
 * - Places a center Sphere mesh (radius 0.5) at the origin to easily reference the default base position.
 *
 * @category Debugger
 */
class DrawDebuggerAxis extends Mesh {
    /**
     * `DrawDebuggerAxis` 인스턴스를 생성합니다.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
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

Object.freeze(DrawDebuggerAxis);
export default DrawDebuggerAxis;
