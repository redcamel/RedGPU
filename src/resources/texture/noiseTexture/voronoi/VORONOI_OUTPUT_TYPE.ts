const VORONOI_OUTPUT_TYPE = {
	F1: 0,        /* 첫 번째 가까운 점까지의 거리 */
	F2: 1,        /* 두 번째 가까운 점까지의 거리 */
	F2_MINUS_F1: 2, /* F2 - F1 (셀 경계 강조) */
	F1_PLUS_F2: 3,  /* F1 + F2 (부드러운 블렌딩) */
	CELL_ID: 4,
	CELL_ID_COLOR: 5,
} as const
Object.freeze(VORONOI_OUTPUT_TYPE)
export default VORONOI_OUTPUT_TYPE
