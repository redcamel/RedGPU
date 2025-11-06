import { mat4 } from "gl-matrix";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * 그룹의 기본 동작과 변환(위치, 회전, 스케일, 피벗 등)을 제공하는 3D/2D 공통 베이스 클래스입니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.

 */
declare abstract class GroupBase extends Object3DContainer {
    #private;
    /** 모델 변환 행렬 */
    modelMatrix: mat4;
    /** 로컬 변환 행렬 */
    localMatrix: mat4;
    /**
     * 그룹을 생성합니다.
     * @param name 그룹 이름(선택)
     */
    constructor(name?: string);
    /**
     * 변환 행렬 갱신 필요 여부 반환
     */
    get dirtyTransform(): boolean;
    /**
     * 변환 행렬 갱신 필요 여부 설정
     */
    set dirtyTransform(value: boolean);
    /**
     * 그룹 이름 반환
     */
    get name(): string;
    /**
     * 그룹 이름 설정
     */
    set name(value: string);
    /**
     * 설정된 부모 객체 반환
     */
    get parent(): Object3DContainer;
    /**
     * 부모 객체 설정
     * @param value 부모 객체
     */
    set parent(value: Object3DContainer);
    /**
     * 피벗 X 반환
     */
    get pivotX(): number;
    /**
     * 피벗 X 설정
     */
    set pivotX(value: number);
    /**
     * 피벗 Y 반환
     */
    get pivotY(): number;
    /**
     * 피벗 Y 설정
     */
    set pivotY(value: number);
    /**
     * 피벗 Z 반환
     */
    get pivotZ(): number;
    /**
     * 피벗 Z 설정
     */
    set pivotZ(value: number);
    /**
     * X 좌표 반환
     */
    get x(): number;
    /**
     * X 좌표 설정
     */
    set x(value: number);
    /**
     * Y 좌표 반환
     */
    get y(): number;
    /**
     * Y 좌표 설정
     */
    set y(value: number);
    /**
     * Z 좌표 반환
     */
    get z(): number;
    /**
     * Z 좌표 설정
     */
    set z(value: number);
    /**
     * 위치 배열 반환 [x, y, z]
     */
    get position(): [number, number, number];
    /**
     * X 스케일 반환
     */
    get scaleX(): number;
    /**
     * X 스케일 설정
     */
    set scaleX(value: number);
    /**
     * Y 스케일 반환
     */
    get scaleY(): number;
    /**
     * Y 스케일 설정
     */
    set scaleY(value: number);
    /**
     * Z 스케일 반환
     */
    get scaleZ(): number;
    /**
     * Z 스케일 설정
     */
    set scaleZ(value: number);
    /**
     * 스케일 배열 반환 [x, y, z]
     */
    get scale(): number[];
    /**
     * X축 회전 반환 (deg)
     */
    get rotationX(): number;
    /**
     * X축 회전 설정 (deg)
     */
    set rotationX(value: number);
    /**
     * Y축 회전 반환 (deg)
     */
    get rotationY(): number;
    /**
     * Y축 회전 설정 (deg)
     */
    set rotationY(value: number);
    /**
     * Z축 회전 반환 (deg)
     */
    get rotationZ(): number;
    /**
     * Z축 회전 설정 (deg)
     */
    set rotationZ(value: number);
    /**
     * 회전 배열 반환 [x, y, z] (deg)
     */
    get rotation(): number[];
    /**
     * 스케일을 설정합니다.
     * @param x X 스케일
     * @param y Y 스케일(생략 시 x와 동일)
     * @param z Z 스케일(생략 시 x와 동일)
     */
    setScale(x: number, y?: number, z?: number): void;
    /**
     * 위치를 설정합니다.
     * @param x X 좌표
     * @param y Y 좌표(생략 시 x와 동일)
     * @param z Z 좌표(생략 시 x와 동일)
     */
    setPosition(x: number, y?: number, z?: number): void;
    /**
     * 회전을 설정합니다.
     * @param rotationX X축 회전(도)
     * @param rotationY Y축 회전(도, 생략 시 rotationX와 동일)
     * @param rotationZ Z축 회전(도, 생략 시 rotationX와 동일)
     */
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    /**
     * 렌더링 및 변환 행렬 계산을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default GroupBase;
