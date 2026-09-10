
const FOLIAGE_TYPE = {

    FOLIAGE: 'foliage',

    GRASS: 'grass',

    BASIC: 'basic',
} as const;

type FOLIAGE_TYPE = typeof FOLIAGE_TYPE[keyof typeof FOLIAGE_TYPE];
Object.freeze(FOLIAGE_TYPE);

export default FOLIAGE_TYPE;
