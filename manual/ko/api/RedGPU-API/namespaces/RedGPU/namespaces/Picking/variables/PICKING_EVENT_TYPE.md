[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L20)

마우스 피킹 이벤트 타입 상수를 정의한 객체입니다.

### Example
```typescript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
// 클릭 피킹 이벤트 리스너 등록
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked!', e);
});
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-click"></a> `CLICK` | `"click"` | `'click'` | 객체 위에서 마우스 다운 후 동일 객체에서 업이 발생했을 때의 이벤트 타입 (`'click'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L50) |
| <a id="property-down"></a> `DOWN` | `"down"` | `'down'` | 객체 위에서 마우스 버튼을 눌렀을 때 발생하는 이벤트 타입 (`'down'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L30) |
| <a id="property-move"></a> `MOVE` | `"move"` | `'move'` | 마우스가 객체 위에서 이동할 때 발생하는 이벤트 타입 (`'move'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L25) |
| <a id="property-out"></a> `OUT` | `"out"` | `'out'` | 마우스가 객체 영역 밖으로 벗어났을 때 발생하는 이벤트 타입 (`'out'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L45) |
| <a id="property-over"></a> `OVER` | `"over"` | `'over'` | 마우스가 객체 영역 안으로 진입했을 때 발생하는 이벤트 타입 (`'over'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L40) |
| <a id="property-up"></a> `UP` | `"up"` | `'up'` | 객체 위에서 마우스 버튼을 뗐을 때 발생하는 이벤트 타입 (`'up'`) | [src/picking/PICKING\_EVENT\_TYPE.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/PICKING_EVENT_TYPE.ts#L35) |

## See

 - [MouseEvent (Mesh) example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/mesh/)
 - [MouseEvent (Raycasting) example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
 - [MouseEvent (Sprite2D) example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)
