[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:14](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/picking/PICKING_EVENT_TYPE.ts#L14)

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
| <a id="click"></a> `CLICK` | `"click"` | `'click'` | 마우스 클릭 (마우스 다운 후 동일 객체에서 업이 발생했을 때)
| <a id="down"></a> `DOWN` | `"down"` | `'down'` | 마우스 다운 (마우스 버튼을 눌렀을 때)
| <a id="move"></a> `MOVE` | `"move"` | `'move'` | 마우스 이동 (마우스가 객체 위에서 움직일 때)
| <a id="out"></a> `OUT` | `"out"` | `'out'` | 마우스 아웃 (마우스가 객체 영역 밖으로 나갔을 때)
| <a id="over"></a> `OVER` | `"over"` | `'over'` | 마우스 오버 (마우스가 객체 영역 안으로 들어왔을 때)
| <a id="up"></a> `UP` | `"up"` | `'up'` | 마우스 업 (마우스 버튼을 뗐을 때)
