/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */
import UniformBuffer from "../buffer/UniformBuffer.js";
import DisplayContainer from "./DisplayContainer.js";
import PipelineBasic from "./pipeline/PipelineBasic.js";
import UniformBufferDescriptor from "../buffer/UniformBufferDescriptor.js";
import TypeSize from "../resources/TypeSize.js";
import ShareGLSL from "./ShareGLSL.js";
import View from "../View.js";
import UTIL from "../util/UTIL.js";
import MouseEventChecker from "../renderer/system/MouseEventChecker.js";
import glMatrix from "../base/gl-matrix-min.js";
import Render from "../renderer/Render.js";

const MESH_UNIFORM_TABLE = [];
let MESH_UNIFORM_POOL_index = 0;
let MESH_UNIFORM_POOL_tableIndex = 0;
let float1_Float32Array = new Float32Array(1);
const uniformBufferDescriptor_mesh = new UniformBufferDescriptor(
  [
    {size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'matrix'},
    {size: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM, valueName: 'normalMatrix'}
  ]
);
let MOUSE_UUID = 0;
const getPool = function (redGPUContext, targetMesh) {
  let uniformBuffer_meshMatrix;
  if (!MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex]) {
    uniformBuffer_meshMatrix = new UniformBuffer(redGPUContext);
    uniformBuffer_meshMatrix.setBuffer(uniformBufferDescriptor_mesh);
    MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex] = uniformBuffer_meshMatrix;
  }
  uniformBuffer_meshMatrix = MESH_UNIFORM_TABLE[MESH_UNIFORM_POOL_tableIndex];
  let result = {
    float32Array: uniformBuffer_meshMatrix.float32Array,
    uniformBuffer_meshMatrix: uniformBuffer_meshMatrix,
    offsetMatrix: TypeSize.mat4 * MESH_UNIFORM_POOL_index,
    offsetNormalMatrix: TypeSize.mat4 * ShareGLSL.MESH_UNIFORM_POOL_NUM + (TypeSize.mat4 * MESH_UNIFORM_POOL_index),
    uniformIndex: MESH_UNIFORM_POOL_index
  };
  MESH_UNIFORM_POOL_index++;
  if (MESH_UNIFORM_POOL_index == ShareGLSL.MESH_UNIFORM_POOL_NUM) {
    MESH_UNIFORM_POOL_tableIndex++;
    MESH_UNIFORM_POOL_index = 0;
  }
  // console.log('MESH_UNIFORM_TABLE',MESH_UNIFORM_TABLE)
  return result;
};
export default class BaseObject3D extends DisplayContainer {
  static uniformsBindGroupLayoutDescriptor_mesh = {
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: 'uniform',
        },
      }
    ]
  };
  static uniformBufferDescriptor_meshIndex = new UniformBufferDescriptor(
    [
      {size: TypeSize.float32, valueName: 'meshUniformIndex'},
      {size: TypeSize.float32, valueName: 'mouseColorID'},
      {size: TypeSize.float32, valueName: 'sumOpacity'}
    ]
  );
  dirtyTransform = true;
  dirtyPipeline = true;
  _redGPUContext;
  pipeline;
  #entries;
  //FIXME - 유일키가 될수있도록 변경
  #mouseColorID = 0;
  localToWorld = (_ => {
    //TODO - 값 확인해봐야함
    let tMTX;
    tMTX = glMatrix.mat4.create();
    return function (x = 0, y = 0, z = 0) {
      typeof x == 'number' || UTIL.throwFunc('BaseObject3D - localToWorld : x - number만 허용함', '입력값 : ', x);
      typeof y == 'number' || UTIL.throwFunc('BaseObject3D - localToWorld : y - number만 허용함', '입력값 : ', y);
      typeof z == 'number' || UTIL.throwFunc('BaseObject3D - localToWorld : z - number만 허용함', '입력값 : ', z);
      tMTX[0] = 1, tMTX[1] = 0, tMTX[2] = 0, tMTX[3] = 0;
      tMTX[4] = 0, tMTX[5] = 1, tMTX[6] = 0, tMTX[7] = 0;
      tMTX[8] = 0, tMTX[9] = 0, tMTX[10] = 1, tMTX[11] = 0;
      tMTX[12] = x, tMTX[13] = y, tMTX[14] = z, tMTX[15] = 1;
      glMatrix.mat4.multiply(tMTX, this.matrix, tMTX);
      return [tMTX[12], tMTX[13], tMTX[14]];
    };
  })();
  worldToLocal = (_ => {
    let tMTX, resultMTX;
    tMTX = glMatrix.mat4.create();
    resultMTX = glMatrix.mat4.create();
    return function (x = 0, y = 0, z = 0) {
      typeof x == 'number' || UTIL.throwFunc('BaseObject3D - worldToLocal : x - number만 허용함', '입력값 : ', x);
      typeof y == 'number' || UTIL.throwFunc('BaseObject3D - worldToLocal : y - number만 허용함', '입력값 : ', y);
      typeof z == 'number' || UTIL.throwFunc('BaseObject3D - worldToLocal : z - number만 허용함', '입력값 : ', z);
      glMatrix.mat4.invert(tMTX, this.matrix);
      glMatrix.mat4.transpose(tMTX, tMTX);
      glMatrix.mat4.multiply(resultMTX, tMTX, this.matrix);
      return [
        resultMTX[0] * x + resultMTX[1] * y + resultMTX[2] * z + resultMTX[3],
        resultMTX[4] * x + resultMTX[5] * y + resultMTX[6] * z + resultMTX[7],
        resultMTX[8] * x + resultMTX[9] * y + resultMTX[10] * z + resultMTX[11]
      ];
    };
  })();
  getScreenPoint = (_ => {
    //TODO - 값 확인해봐야함
    let tMTX = glMatrix.mat4.create();
    let tPositionMTX = glMatrix.mat4.create();
    let tCamera, tViewRect;
    let resultPosition;
    resultPosition = {x: 0, y: 0, z: 0, w: 0};
    return function (redView, localX = 0, localY = 0, localZ = 0) {
      let worldPosition = this.localToWorld(localX, localY, localZ);
      tPositionMTX[0] = 1, tPositionMTX[1] = 0, tPositionMTX[2] = 0, tPositionMTX[3] = 0;
      tPositionMTX[4] = 0, tPositionMTX[5] = 1, tPositionMTX[6] = 0, tPositionMTX[7] = 0;
      tPositionMTX[8] = 0, tPositionMTX[9] = 0, tPositionMTX[10] = 1, tPositionMTX[11] = 0;
      tPositionMTX[12] = worldPosition[0], tPositionMTX[13] = worldPosition[1], tPositionMTX[14] = worldPosition[2], tPositionMTX[15] = 1;
      redView instanceof View || UTIL.throwFunc('BaseObject3D - getScreenPoint : redView - RedView Instance 만 허용함', '입력값 : ', redView);
      tCamera = redView.camera;
      tViewRect = redView.viewRect;
      glMatrix.mat4.multiply(tMTX, redView.projectionMatrix, tCamera.matrix);
      glMatrix.mat4.multiply(tMTX, tMTX, tPositionMTX);
      resultPosition.x = tMTX[12];
      resultPosition.y = tMTX[13];
      resultPosition.z = tMTX[14];
      resultPosition.w = tMTX[15];
      resultPosition.x = resultPosition.x * 0.5 / resultPosition.w + 0.5;
      resultPosition.y = resultPosition.y * 0.5 / resultPosition.w + 0.5;
      return [
        (tViewRect[0] + resultPosition.x * tViewRect[2]) / window.devicePixelRatio,
        (tViewRect[1] + (1 - resultPosition.y) * tViewRect[3]) / window.devicePixelRatio
      ];
    };
  })();

  constructor(redGPUContext) {
    super();
    this._redGPUContext = redGPUContext;
    let bufferData = getPool(redGPUContext, this);
    this.uniformBuffer_meshMatrix = bufferData.uniformBuffer_meshMatrix;
    this.uniformBuffer_meshMatrix.meshFloat32Array = bufferData.float32Array;
    this.offsetMatrix = bufferData.offsetMatrix;
    this.offsetNormalMatrix = bufferData.offsetNormalMatrix;
    // MOUSE_UUID++;
    MOUSE_UUID++;
    this.#mouseColorID = MOUSE_UUID;
    this.uniformBuffer_mesh = new UniformBuffer(redGPUContext);
    this.uniformBuffer_mesh.setBuffer(BaseObject3D.uniformBufferDescriptor_meshIndex);
    // this.uniformBuffer_mesh.GPUBuffer.setSubData(0, new Float32Array([bufferData.uniformIndex]));
    redGPUContext.device.queue.writeBuffer(this.uniformBuffer_mesh.GPUBuffer, 0, new Float32Array([bufferData.uniformIndex]));
    // this.uniformBuffer_mesh.GPUBuffer.setSubData(TypeSize.float32, new Float32Array([this.#mouseColorID]));
    redGPUContext.device.queue.writeBuffer(this.uniformBuffer_mesh.GPUBuffer, TypeSize.float32, new Float32Array([this.#mouseColorID]));
    this.sumOpacity = 1;
    this.#entries = [
      {
        binding: 0,
        resource: {
          buffer: this.uniformBuffer_meshMatrix.GPUBuffer,
          offset: 0,
          size: this.uniformBuffer_meshMatrix.uniformBufferDescriptor.size
        }
      },
      {
        binding: 1,
        resource: {
          buffer: this.uniformBuffer_mesh.GPUBuffer,
          offset: 0,
          size: this.uniformBuffer_mesh.uniformBufferDescriptor.size
        }
      }
    ];
    this.GPUBindGroupLayout = redGPUContext.device.createBindGroupLayout(BaseObject3D.uniformsBindGroupLayoutDescriptor_mesh);
    this.GPUBindGroup = this._redGPUContext.device.createBindGroup({
      layout: this.GPUBindGroupLayout,
      entries: this.#entries
    });
    this.pipeline = new PipelineBasic(redGPUContext, this);
    this.normalMatrix = glMatrix.mat4.create();
    this.matrix = glMatrix.mat4.create();
    this.localMatrix = glMatrix.mat4.create();
  }

  _x = 0;

  /////////////////////////////////////////////////////////
  get x() {
    return this._x;
  }

  set x(v) {
    this._x = v;
    this.dirtyTransform = true;
  }

  _y = 0;

  get y() {
    return this._y;
  }

  set y(v) {
    this._y = v;
    this.dirtyTransform = true;
  }

  _z = 0;

  get z() {
    return this._z;
  }

  set z(v) {
    this._z = v;
    this.dirtyTransform = true;
  }

  _pivotX = 0;

  get pivotX() {
    return this._pivotX;
  }

  set pivotX(value) {
    this._pivotX = value;
    this.dirtyTransform = true;
  }

  _pivotY = 0;

  get pivotY() {
    return this._pivotY;
  }

  set pivotY(value) {
    this._pivotY = value;
    this.dirtyTransform = true;
  }

  _pivotZ = 0;

  /////////////////////////////////////////////////////////
  get pivotZ() {
    return this._pivotZ;
  }

  set pivotZ(value) {
    this._pivotZ = value;
    this.dirtyTransform = true;
  }

  _rotationX = 0;

  /////////////////////////////////////////////////////////
  get rotationX() {
    return this._rotationX;
  }

  set rotationX(v) {
    this._rotationX = v;
    this.dirtyTransform = true;
  }

  _rotationY = 0;

  get rotationY() {
    return this._rotationY;
  }

  set rotationY(v) {
    this._rotationY = v;
    this.dirtyTransform = true;
  }

  _rotationZ = 0;

  get rotationZ() {
    return this._rotationZ;
  }

  set rotationZ(v) {
    this._rotationZ = v;
    this.dirtyTransform = true;
  }

  targetTo = (_ => {
    let up = new Float32Array([0, 1, 0]);
    let tPosition = [];
    let tRotation = [];
    let tMTX = glMatrix.mat4.create();
    return function (x, y, z) {
      tPosition[0] = x;
      tPosition[1] = y;
      tPosition[2] = z;
      //out, eye, center, up
      glMatrix.mat4.identity(tMTX);
      glMatrix.mat4.targetTo(tMTX, [this._x, this._y, this._z], tPosition, up);
      tRotation = UTIL.mat4ToEuler(tMTX, []);
      this._rotationX = -tRotation[0] * 180 / Math.PI;
      this._rotationY = -tRotation[1] * 180 / Math.PI;
      this._rotationZ = -tRotation[2] * 180 / Math.PI;
      this.dirtyTransform = true;
    };
  })();

  _scaleX = 1;

  /////////////////////////////////////////////////////////
  get scaleX() {
    return this._scaleX;
  }

  set scaleX(v) {
    this._scaleX = v;
    this.dirtyTransform = true;
  }

  _scaleY = 1;

  get scaleY() {
    return this._scaleY;
  }

  set scaleY(v) {
    this._scaleY = v;
    this.dirtyTransform = true;
  }

  _scaleZ = 1;

  get scaleZ() {
    return this._scaleZ;
  }

  set scaleZ(v) {
    this._scaleZ = v;
    this.dirtyTransform = true;
  }

  //
  _material;

  get material() {
    return this._material;
  }

  set material(v) {
    this._material = v;
    this.dirtyPipeline = true;/* this.dirtyTransform = true*/
  }

  _geometry;

  /////////////////////////////////////////////////////////
  get geometry() {
    return this._geometry;
  }

  set geometry(v) {
    this._geometry = v;
    this.dirtyPipeline = true;/* this.dirtyTransform = true*/
  }

  //
  _depthWriteEnabled = true;

  get depthWriteEnabled() {
    return this._depthWriteEnabled;
  }

  set depthWriteEnabled(value) {
    this.dirtyPipeline = true;
    this._depthWriteEnabled = value;
  }

  _depthCompare = 'less-equal';

  get depthCompare() {
    return this._depthCompare;
  }

  set depthCompare(value) {
    this.dirtyPipeline = true;
    this._depthCompare = value;
  }

  _cullMode = 'back';

  get cullMode() {
    return this._cullMode;
  }

  set cullMode(value) {
    this.dirtyPipeline = true;
    this._cullMode = value;
  }

  _primitiveTopology = "triangle-list";

  get primitiveTopology() {
    return this._primitiveTopology;
  }

  set primitiveTopology(value) {
    this.dirtyPipeline = true;
    this._primitiveTopology = value;
  }

  _blendColorSrc = 'src-alpha';

  get blendColorSrc() {
    return this._blendColorSrc;
  }

  set blendColorSrc(value) {
    this._blendColorSrc = value;
    this.dirtyPipeline = true;
  }

  _blendColorDst = 'one-minus-src-alpha';

  get blendColorDst() {
    return this._blendColorDst;
  }

  set blendColorDst(value) {
    this._blendColorDst = value;
    this.dirtyPipeline = true;
  }

  _blendAlphaSrc = 'one';

  get blendAlphaSrc() {
    return this._blendAlphaSrc;
  }

  set blendAlphaSrc(value) {
    this._blendAlphaSrc = value;
    this.dirtyPipeline = true;
  }

  _blendAlphaDst = 'one-minus-src-alpha';

  get blendAlphaDst() {
    return this._blendAlphaDst;
  }

  set blendAlphaDst(value) {
    this._blendAlphaDst = value;
    this.dirtyPipeline = true;
  }

  _renderDrawLayerIndex = Render.DRAW_LAYER_INDEX0;

  get renderDrawLayerIndex() {
    return this._renderDrawLayerIndex;
  }

  set renderDrawLayerIndex(value) {
    this._renderDrawLayerIndex = value;
  }

  _sumOpacity = 1;

  get sumOpacity() {
    return this._sumOpacity;
  }

  set sumOpacity(value) {
    this._sumOpacity = value;
    float1_Float32Array[0] = this._sumOpacity;
    // this.uniformBuffer_mesh.GPUBuffer.setSubData(TypeSize.float32x2, float1_Float32Array)
    this._redGPUContext.device.queue.writeBuffer(this.uniformBuffer_mesh.GPUBuffer, TypeSize.float32x2, float1_Float32Array);
  }

  _opacity = 1;

  get opacity() {
    return this._opacity;
  }

  set opacity(value) {
    this._opacity = value;
  }

  getPosition() {
    return [this._x, this._y, this._z];
  }

  setPosition(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
    this.dirtyTransform = true;
  }

  getPivotPosition() {
    return [this._pivotX, this._pivotY, this._pivotZ];
  }

  setPivotPosition(x, y, z) {
    this._pivotX = x;
    this._pivotY = y;
    this._pivotZ = z;
    this.dirtyTransform = true;
  }

  getRotation() {
    return [this._rotationX, this._rotationY, this._rotationZ];
  }

  setRotation(rX, rY, rZ) {
    this._rotationX = rX;
    this._rotationY = rY;
    this._rotationZ = rZ;
    this.dirtyTransform = true;
  }

  getScale() {
    return [this._scaleX, this._scaleY, this._scaleZ];
  }

  setScale(sX, sY, sZ) {
    this._scaleX = sX;
    this._scaleY = sY;
    this._scaleZ = sZ;
    this.dirtyTransform = true;
  }

  /////////////////////////////////////////////////////////
  addEventListener(type, handler) {
    if (!MouseEventChecker.mouseMAP[this.#mouseColorID]) {
      MouseEventChecker.mouseMAP[this.#mouseColorID] = {target: this};
    }
    MouseEventChecker.mouseMAP[this.#mouseColorID][type] = handler;
    // console.log(MouseEventChecker.mouseMAP)
  }

  removeEventListener(type) {
    if (MouseEventChecker.mouseMAP[this.#mouseColorID]) {
      MouseEventChecker.mouseMAP[this.#mouseColorID][type] = null;
    }
  }
}
