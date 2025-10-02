import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Mesh from "../../mesh/Mesh";
/**
 * Sprite3D의 빌보드 관련 속성을 정의하는 인터페이스
 */
interface Sprite3D {
    /** 빌보드 원근감 적용 여부 */
    useBillboardPerspective: boolean;
    /** 빌보드 모드 사용 여부 */
    useBillboard: boolean;
    /**
     * 빌보드 고정 크기 배율
     *
     * useBillboardPerspective가 false일때만 적용됩니다.*/
    billboardFixedScale: number;
}
/**
 *
 * 3D 공간에서 항상 카메라를 향하는 2D 스프라이트 객체
 *
 * Sprite3D는 Mesh 클래스를 상속받아 빌보드 기능을 제공하는 클래스입니다.
 * 빌보드는 3D 공간에 배치되지만 항상 카메라 방향을 바라보는 평면 객체로,
 * UI 요소, 파티클, 텍스트, 아이콘 등을 3D 씬에 표시할 때 유용합니다.
 *
 * <iframe src="/RedGPU/examples/3d/sprite/sprite3D/"></iframe>
 *
 * 아래는 Sprite3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Sprite3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/sprite3D/)
 *
 * @category Sprite
 */
declare class Sprite3D extends Mesh {
    /**
     * 새로운 Sprite3D 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     * @param material - 스프라이트에 적용할 머티리얼 (옵션)
     * @param geometry - 스프라이트의 지오메트리 (기본값: 새로운 Plane 인스턴스)
     */
    constructor(redGPUContext: RedGPUContext, material?: any, geometry?: Geometry | Primitive);
    /**
     * Sprite3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     * 이 메서드는 빌보드 기능을 지원하는 전용 버텍스 셰이더를 생성합니다.
     * 일반 메시와 달리 카메라 방향에 따라 정점 위치를 동적으로 계산하는
     * 셰이더 로직이 포함되어 있습니다.
     *
     * @returns 생성된 버텍스 셰이더 모듈 정보
     *
     */
    createCustomMeshVertexShaderModule(): GPUShaderModule;
}
export default Sprite3D;
