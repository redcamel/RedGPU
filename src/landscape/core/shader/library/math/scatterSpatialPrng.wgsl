fn computeScatterGridSeed(gridX: i32, gridZ: i32, typeId: u32) -> u32 {
    let seed = ((u32(gridX) * 73856093u) ^ (u32(gridZ) * 19349663u) ^ (typeId * 83492791u));
    return select(seed, 0x9e3779b9u, seed == 0u);
}

fn splitMix32(state: ptr<function, u32>) -> f32 {
    *state = (*state + 0x6D2B79F5u);
    var t = (*state ^ (*state >> 15u)) * (1u | *state);
    t = (t + ((t ^ (t >> 7u)) * (61u | t))) ^ t;
    return f32((t ^ (t >> 14u)) & 0xFFFFFFFFu) / 4294967296.0;
}
