/**
 * [KO] IBL 및 스카이박스에서 공용으로 사용하는 HDR 이미지 리스트입니다.
 * [EN] A list of HDR images used commonly in IBL and Skyboxes.
 */
export const hdrImages = [
    {name: '2K - the sky is on fire', path: 'assets/hdr/2k/the_sky_is_on_fire_2k.hdr', luminance: 20000, sunLux: 60000},
    {name: 'Cannon_Exterior', path: 'assets/hdr/Cannon_Exterior.hdr', luminance: 25000, sunLux: 100000},
    {name: 'field', path: 'assets/hdr/field.hdr', luminance: 15000, sunLux: 60000},
    {name: 'neutral.37290948', path: 'assets/hdr/neutral.37290948.hdr', luminance: 20000, sunLux: 80000},
    {name: 'pisa', path: 'assets/hdr/pisa.hdr', luminance: 10000, sunLux: 30000},
    {
        name: '6 cube face asset', path: [
            "assets/skybox/px.jpg",
            "assets/skybox/nx.jpg",
            "assets/skybox/py.jpg",
            "assets/skybox/ny.jpg",
            "assets/skybox/pz.jpg",
            "assets/skybox/nz.jpg",
        ],
        luminance: 100,
        sunLux: 400
    },
];
