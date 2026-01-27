[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PICKING\_EVENT\_TYPE

# Variable: PICKING\_EVENT\_TYPE

> `const` **PICKING\_EVENT\_TYPE**: `object`

Defined in: [src/picking/PICKING\_EVENT\_TYPE.ts:13](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/picking/PICKING_EVENT_TYPE.ts#L13)

피킹 이벤트 타입 정의 객체입니다.

* ### Example
```typescript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
    console.log('Clicked!', e);
});
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="click"></a> `CLICK` | `"click"` | `'click'` | 마우스 클릭
| <a id="down"></a> `DOWN` | `"down"` | `'down'` | 마우스 다운
| <a id="move"></a> `MOVE` | `"move"` | `'move'` | 마우스 이동
| <a id="out"></a> `OUT` | `"out"` | `'out'` | 마우스 아웃
| <a id="over"></a> `OVER` | `"over"` | `'over'` | 마우스 오버
| <a id="up"></a> `UP` | `"up"` | `'up'` | 마우스 업
