[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / Group2D

# Class: Group2D

Defined in: [src/display/group/Group2D.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L20)

Container class that hierarchically groups child objects and applies collective transformations (position, rotation, scale) in 2D space.

***

### Example
```typescript
const group = new RedGPU.Display.Group2D();
group.addChild(sprite1);
group.addChild(sprite2);
scene.addChild(group);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/2d/group2D/basic/" style="width:100%; height:500px;"></iframe>

## See

[Group2D basic example](https://redcamel.github.io/RedGPU/examples/2d/group2D/basic/)

## Extends

- [`Group3D`](Group3D.md)

## Constructors



***

### Constructor

> **new Group2D**(`name?`): `Group2D`

Defined in: [src/display/group/Group2D.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L36)

Creates a `Group2D` instance.

#### Example
```typescript
const group = new RedGPU.Display.Group2D('myGroup2D');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name?` | `string` | Group identification name (optional) |

#### Returns

`Group2D`

#### Overrides

[`Group3D`](Group3D.md).[`constructor`](Group3D.md#constructor)

## Properties



## Accessors



***

### rotation

#### Get Signature

> **get** **rotation**(): `number`

Defined in: [src/display/group/Group2D.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L50)

Gets or sets the 2D rotation angle (unit: Degree) of the group. Setting this internally maps to the Z-axis rotation (`rotationZ`).

##### Returns

`number`

2D rotation angle (Degree)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L55)

Returns the rotation angle array (`[rotationX, rotationY, rotationZ]`, unit: Degree) of the group.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

`[rotationX, rotationY, rotationZ]` rotation angle array (Degree)

#### Overrides

[`Group3D`](Group3D.md).[`rotation`](Group3D.md#rotation)

***

## Methods



***

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L98)

Sets the 2D position of the group. If `y` is omitted, it is set to the same value as `x`.

#### Example
```typescript
group.setPosition(100, 200);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X-axis coordinate |
| `y?` | `number` | Y-axis coordinate (optional, default: `x`) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setPosition`](Group3D.md#setposition)

***

***

### setRotation()

> **setRotation**(`value`): `void`

Defined in: [src/display/group/Group2D.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L117)

Sets the 2D rotation angle (unit: Degree) of the group.

#### Example
```typescript
group.setRotation(45);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation angle (unit: Degree) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setRotation`](Group3D.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`): `void`

Defined in: [src/display/group/Group2D.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group2D.ts#L76)

Sets the 2D scale of the group. If `y` is omitted, it is set to the same value as `x`.

#### Example
```typescript
group.setScale(2, 2);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Scale factor along the X-axis |
| `y?` | `number` | Scale factor along the Y-axis (optional, default: `x`) |

#### Returns

`void`

#### Overrides

[`Group3D`](Group3D.md).[`setScale`](Group3D.md#setscale)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L37)

Local transformation matrix (`mat4`) of the group

#### Inherited from

[`Group3D`](Group3D.md).[`localMatrix`](Group3D.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/group/Group3D.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L32)

World transformation matrix (`mat4`) of the group

#### Inherited from

[`Group3D`](Group3D.md).[`modelMatrix`](Group3D.md#modelmatrix)

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

[`Group3D`](Group3D.md).[`children`](Group3D.md#children)

***

***

### dirtyTransform

#### Get Signature

> **get** **dirtyTransform**(): `boolean`

Defined in: [src/display/group/Group3D.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L87)

Gets or sets whether the transformation matrix requires an update (dirty).

##### Returns

`boolean`

Whether the transformation matrix requires an update

#### Set Signature

> **set** **dirtyTransform**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`dirtyTransform`](Group3D.md#dirtytransform)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`Group3D`](Group3D.md).[`instanceId`](Group3D.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`name`](Group3D.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L58)

Returns the number of registered child objects.

##### Returns

`number`

Number of child objects

#### Inherited from

[`Group3D`](Group3D.md).[`numChildren`](Group3D.md#numchildren)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/group/Group3D.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L103)

Gets or sets the parent container (`Object3DContainer`) to which this group object belongs.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Parent container object

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L107)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`parent`](Group3D.md#parent)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/group/Group3D.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L119)

Gets or sets the X-axis pivot (center point) coordinate.

##### Returns

`number`

X-axis pivot coordinate

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:123](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L123)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotX`](Group3D.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/group/Group3D.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L136)

Gets or sets the Y-axis pivot (center point) coordinate.

##### Returns

`number`

Y-axis pivot coordinate

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:140](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L140)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotY`](Group3D.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/group/Group3D.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L153)

Gets or sets the Z-axis pivot (center point) coordinate.

##### Returns

`number`

Z-axis pivot coordinate

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:157](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L157)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`pivotZ`](Group3D.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/display/group/Group3D.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L221)

Returns the position coordinate array (`[x, y, z]`) of the group.

##### Returns

\[`number`, `number`, `number`\]

`[x, y, z]` position coordinate array

#### Inherited from

[`Group3D`](Group3D.md).[`position`](Group3D.md#position)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/group/Group3D.ts:296](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L296)

Gets or sets the rotation angle (unit: Degree) around the X-axis.

##### Returns

`number`

X-axis rotation angle (Degree)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:300](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L300)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationX`](Group3D.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/group/Group3D.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L313)

Gets or sets the rotation angle (unit: Degree) around the Y-axis.

##### Returns

`number`

Y-axis rotation angle (Degree)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:317](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L317)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationY`](Group3D.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/group/Group3D.ts:330](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L330)

Gets or sets the rotation angle (unit: Degree) around the Z-axis.

##### Returns

`number`

Z-axis rotation angle (Degree)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:334](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L334)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`rotationZ`](Group3D.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `number`[]

Defined in: [src/display/group/Group3D.ts:284](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L284)

Returns the scale factor array (`[scaleX, scaleY, scaleZ]`) of the group.

##### Returns

`number`[]

`[scaleX, scaleY, scaleZ]` scale array

#### Inherited from

[`Group3D`](Group3D.md).[`scale`](Group3D.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/group/Group3D.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L233)

Gets or sets the scale factor along the X-axis.

##### Returns

`number`

X-axis scale factor

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L237)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleX`](Group3D.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/group/Group3D.ts:250](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L250)

Gets or sets the scale factor along the Y-axis.

##### Returns

`number`

Y-axis scale factor

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:254](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L254)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleY`](Group3D.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/group/Group3D.ts:267](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L267)

Gets or sets the scale factor along the Z-axis.

##### Returns

`number`

Z-axis scale factor

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:271](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L271)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`scaleZ`](Group3D.md#scalez)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`Group3D`](Group3D.md).[`uuid`](Group3D.md#uuid)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/group/Group3D.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L170)

Gets or sets the X-axis position coordinate of the group.

##### Returns

`number`

X-axis position coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L174)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`x`](Group3D.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/group/Group3D.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L187)

Gets or sets the Y-axis position coordinate of the group.

##### Returns

`number`

Y-axis position coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L191)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`y`](Group3D.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/group/Group3D.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L204)

Gets or sets the Z-axis position coordinate of the group.

##### Returns

`number`

Z-axis position coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/group/Group3D.ts:208](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L208)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`z`](Group3D.md#z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |

#### Returns

[`Mesh`](Mesh.md)

Added child object (`null` on failure)

#### Inherited from

[`Group3D`](Group3D.md).[`addChild`](Group3D.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`Group2D`

Current container instance

#### Inherited from

[`Group3D`](Group3D.md).[`addChildAt`](Group3D.md#addchildat)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

[`Group3D`](Group3D.md).[`contains`](Group3D.md#contains)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:322](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L322)

Destroys all child objects in the container and removes them.

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`destroy`](Group3D.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

[`Group3D`](Group3D.md).[`getChildAt`](Group3D.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

[`Group3D`](Group3D.md).[`getChildIndex`](Group3D.md#getchildindex)

***

***

### removeAllChildren()

> **removeAllChildren**(): `Group2D`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`Group2D`

Current container instance

#### Inherited from

[`Group3D`](Group3D.md).[`removeAllChildren`](Group3D.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Inherited from

[`Group3D`](Group3D.md).[`removeChild`](Group3D.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L290)

Removes the child object at the specified index from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Throws

Throws Error if no child exists at the provided index

#### Inherited from

[`Group3D`](Group3D.md).[`removeChildAt`](Group3D.md#removechildat)

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/group/Group3D.ts:446](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/group/Group3D.ts#L446)

Updates the group's transformation matrix and traverses child objects to render them.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render state data of the current view |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`render`](Group3D.md#render)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`setChildIndex`](Group3D.md#setchildindex)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | First child object |
| `child2` | [`Mesh`](Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`swapChildren`](Group3D.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L239)

Swaps the child objects at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

[`Group3D`](Group3D.md).[`swapChildrenAt`](Group3D.md#swapchildrenat)

</details>
