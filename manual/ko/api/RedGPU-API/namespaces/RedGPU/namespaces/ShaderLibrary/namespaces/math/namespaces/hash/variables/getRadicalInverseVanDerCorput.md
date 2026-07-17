[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [math](../../../README.md) / [hash](../README.md) / getRadicalInverseVanDerCorput

# Variable: getRadicalInverseVanDerCorput

> `const` **getRadicalInverseVanDerCorput**: `string` = `getRadicalInverseVanDerCorput_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:368](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L368)

입력된 정수의 비트 순서를 뒤집어 0~1 사이의 소수(Van der Corput 시퀀스)를 반환합니다.

//

## Param

입력 정수
//

## Returns

생성된 소수

```wgsl
fn getRadicalInverseVanDerCorput(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}
```
