// TAA CAS uniform buffer layout (16-byte aligned)
struct Uniforms {
    sharpness: f32,
    pad0: f32, // 16-byte tail alignment
    pad1: f32, // 16-byte tail alignment
    pad2: f32, // 16-byte tail alignment
};
