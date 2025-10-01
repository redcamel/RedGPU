import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Plane from "../../../primitive/Plane";
import DefineForVertex from "../../../resources/defineProperty/DefineForVertex";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import ATextField from "../core/ATextField";
import vertexModuleSource from "./shader/textField3DVertex.wgsl";

interface TextField3D {
	useBillboardPerspective: boolean;
	useBillboard: boolean
}

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_TEXT_FIELD_3D'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * TextField3D 클래스는 3D 공간에서 텍스트를 표현하는 객체입니다.
 *
 * 내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다.
 * Billboard 기능을 지원하며, 텍스트 크기에 따라 transform을 자동으로 갱신합니다.
 *
 * @remarks
 * geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.
 *
 * <iframe src="/RedGPU/examples/3d/textField3D/"></iframe>
 *
 * 아래는 TextField3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [TextField3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/textField3D/)
 *
 * @category TextField
 */
class TextField3D extends ATextField {
	/**
	 * 렌더링된 텍스트 텍스처의 너비 (정규화된 값)
	 */
	#renderTextureWidth: number = 1;
	/**
	 * 렌더링된 텍스트 텍스처의 높이 (정규화된 값)
	 */
	#renderTextureHeight: number = 1;

	/**
	 * TextField3D 생성자입니다.
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param text - 초기 텍스트 문자열
	 */
	constructor(redGPUContext: RedGPUContext, text?: string) {
		super(redGPUContext, (width: number, height: number) => {
			const prevWidth = this.#renderTextureWidth;
			const prevHeight = this.#renderTextureHeight;
			this.#renderTextureWidth = width / 1024;
			this.#renderTextureHeight = height / 1024;
			if (prevWidth !== this.#renderTextureWidth || prevHeight !== this.#renderTextureHeight) {
				this.dirtyTransform = true;
			}
		});
		this._geometry = new Plane(redGPUContext);
		if (text) this.text = text;
	}

	/**
	 * 텍스트가 출력되는 지오메트리입니다. Plane으로 고정됩니다.
	 * @returns {Geometry | Primitive}
	 */
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	/**
	 * geometry는 외부에서 변경할 수 없습니다.
	 */
	set geometry(value: Geometry | Primitive) {
		console.error('TextField3D can not change geometry');
	}

	/**
	 * 텍스트에 사용되는 머티리얼입니다.
	 * @returns 머티리얼 객체
	 */
	get material() {
		return this._material;
	}

	/**
	 * material은 외부에서 변경할 수 없습니다.
	 */
	set material(value) {
		console.error('TextField3D can not change material');
	}

	/**
	 * 렌더링된 텍스트 텍스처의 너비 (정규화된 값)
	 * @returns {number}
	 */
	get renderTextureWidth(): number {
		return this.#renderTextureWidth;
	}

	/**
	 * 렌더링된 텍스트 텍스처의 높이 (정규화된 값)
	 * @returns {number}
	 */
	get renderTextureHeight(): number {
		return this.#renderTextureHeight;
	}

	/**
	 * TextField3D 전용 버텍스 셰이더 모듈을 생성합니다.
	 * @returns {GPUShaderModule}
	 */
	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(
			VERTEX_SHADER_MODULE_NAME,
			SHADER_INFO,
			UNIFORM_STRUCT,
			vertexModuleSource
		);
	}
}

// 버텍스 셰이더에서 사용할 프리셋 정의
DefineForVertex.defineByPreset(TextField3D, [
	[DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD_PERSPECTIVE, true],
	DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD,
]);
Object.freeze(TextField3D);
export default TextField3D;
