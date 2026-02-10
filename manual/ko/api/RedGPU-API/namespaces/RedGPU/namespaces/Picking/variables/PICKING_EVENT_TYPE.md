[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:14](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/PICKING_EVENT_TYPE.ts#L14)

피킹 이벤트 타입 정의 객체입니다.


### Example
```typescript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked!', e);
});
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-click"></a> `CLICK` | `"click"` | `'click'` | 마우스 클릭 (마우스 다운 후 동일 객체에서 업이 발생했을 때)
| <a id="property-down"></a> `DOWN` | `"down"` | `'down'` | 마우스 다운 (마우스 버튼을 눌렀을 때)
| <a id="property-move"></a> `MOVE` | `"move"` | `'move'` | 마우스 이동 (마우스가 객체 위에서 움직일 때)
| <a id="property-out"></a> `OUT` | `"out"` | `'out'` | 마우스 아웃 (마우스가 객체 영역 밖으로 나갔을 때)
| <a id="property-over"></a> `OVER` | `"over"` | `'over'` | 마우스 오버 (마우스가 객체 영역 안으로 들어왔을 때)
| <a id="property-up"></a> `UP` | `"up"` | `'up'` | 마우스 업 (마우스 버튼을 뗐을 때)
