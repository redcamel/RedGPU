import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import InstancingMesh from "../InstancingMesh";
/**
 * Represents an instance of a 3D mesh object with instancing capabilities.
 */
declare class InstancingMeshObject3D {
    #private;
    modelMatrix: mat4;
    localMatrix: mat4;
    normalModelMatrix: mat4;
    inited: boolean;
    /**
     *
     * @param {RedGPUContext} redGPUContext - The RedGPUContext of the instance.
     * @param {number} location - The location of the instance.
     * @param {InstancingMesh} instancingMesh - The InstancingMesh of the instance.
     */
    constructor(redGPUContext: RedGPUContext, location: number, instancingMesh: InstancingMesh);
    get opacity(): number;
    set opacity(value: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get position(): number[];
    set position(value: number);
    get scaleX(): number;
    set scaleX(value: number);
    get scaleY(): number;
    set scaleY(value: number);
    get scaleZ(): number;
    set scaleZ(value: number);
    get scale(): number[];
    set scale(value: number);
    get rotationX(): number;
    set rotationX(value: number);
    get rotationY(): number;
    set rotationY(value: number);
    get rotationZ(): number;
    set rotationZ(value: number);
    get rotation(): number[];
    set rotation(value: number);
    /**
     * Set the scale of the object along the x, y, and z axes.
     * If only the x parameter is provided, the object is uniformly scaled along all axes.
     *
     * @param {number} x - The scale factor along the x-axis.
     * @param {number} [y] - The scale factor along the y-axis. Defaults to the value of x.
     * @param {number} [z] - The scale factor along the z-axis. Defaults to the value of x.
     */
    setScale(x: number, y?: number, z?: number): void;
    /**
     * Sets the position of the object.
     *
     * @param {number} x - The x coordinate of the position.
     * @param {number} [y=x] - The y coordinate of the position, defaults to x if not provided.
     * @param {number} [z=x] - The z coordinate of the position, defaults to x if not provided.
     *
     * @return {void}
     */
    setPosition(x: number, y?: number, z?: number): void;
    /**
     * Sets the rotation of an object in three-dimensional space.
     *
     * @param {number} rotationX - The rotation around the x-axis, in degrees.
     * @param {number} [rotationY] - The rotation around the y-axis, in degrees. Defaults to rotationX if not provided.
     * @param {number} [rotationZ] - The rotation around the z-axis, in degrees. Defaults to rotationX if not provided.
     */
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
}
export default InstancingMeshObject3D;
