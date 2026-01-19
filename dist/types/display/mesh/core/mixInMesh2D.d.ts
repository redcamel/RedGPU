import BLEND_MODE from "../../../material/BLEND_MODE";
interface Mesh2DBase {
    rotationZ: number;
    setScale(x: number, y: number): void;
    setPosition(x: number, y: number): void;
}
/**
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 */
declare function mixInMesh2D<TBase extends new (...args: any[]) => Mesh2DBase>(Base: TBase): {
    new (...args: any[]): {
        "__#117@#rotation": number;
        "__#117@#blendMode": number;
        get blendMode(): string;
        set blendMode(value: BLEND_MODE | keyof typeof BLEND_MODE);
        rotation: number;
        setScale(x: number, y?: number): void;
        setPosition(x: number, y?: number): void;
        setRotation(value: number): void;
        "__#117@#setBlendFactor"(mode: number): void;
        rotationZ: number;
    };
} & TBase;
export { mixInMesh2D };
