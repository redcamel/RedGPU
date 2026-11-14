/**
 * [KO] IBL 및 스카이박스에서 공용으로 사용하는 HDR 이미지 리스트입니다.
 * [EN] A list of HDR images used commonly in IBL and Skyboxes.
 */
export const hdrImages = [
    {
        name: '2K - the sky is on fire',
        path: 'assets/hdr/2k/the_sky_is_on_fire_2k.hdr',
        luminance: 30000,
        sunLux: 30000,
        elevation: 3.4,
        azimuth: 147.5,
        color: '#ffa973',
    },
    {
        name: 'Cannon_Exterior',
        path: 'assets/hdr/Cannon_Exterior.hdr',
        luminance: 35000,
        sunLux: 35000,
        elevation: 42.7,
        azimuth: 65.7,
        color: '#f0f7ff',
    },
    {
        name: 'field',
        path: 'assets/hdr/field.hdr',
        luminance: 30000,
        sunLux: 30000,
        elevation: 61.4,
        azimuth: 97.7,
        color: '#f9fffc',
    },
    {
        name: 'neutral.37290948',
        path: 'assets/hdr/neutral.37290948.hdr',
        luminance: 30000,
        sunLux: 30000,
        elevation: 26.6,
        azimuth: 134.4,
        color: '#ffffff',
    },
    {
        name: 'pisa',
        path: 'assets/hdr/pisa.hdr',
        luminance: 25000,
        sunLux: 25000,
        elevation: 30.8,
        azimuth: 68.2,
        color: '#ffe3dc',
    },
    {
        name: '6 cube face asset',
        path: [
            "assets/skybox/px.jpg",
            "assets/skybox/nx.jpg",
            "assets/skybox/py.jpg",
            "assets/skybox/ny.jpg",
            "assets/skybox/pz.jpg",
            "assets/skybox/nz.jpg",
        ],
        luminance: 5000,
        sunLux: 5000,
        elevation: 13.9,
        azimuth: -91.9,
        color: '#ffecbd',
    },
];
