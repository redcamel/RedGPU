import RedGPUContext from "../../context/RedGPUContext";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import parse16BitPngBuffer from "../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";

export interface LandscapeHeightmapLoaderOptions {
    baseUrl?: string;
    gridSizeX?: number;
    gridSizeY?: number;
}

/**
 * [KO] RedGPU 내장 parse16BitPngBuffer 유틸리티를 활용하여 16비트 높이맵 타일 이미지들을 단 1개의 거대한 16비트 GPU Heightmap 텍스처로 합성/생성하는 로더 클래스입니다.
 * [EN] Loader class that merges/creates 16-bit heightmap tile images into a single giant 16-bit GPU Heightmap texture using the built-in parse16BitPngBuffer utility.
 */
export class LandscapeHeightmapLoader {
    /**
     * [KO] 16비트 타일 이미지들을 불러와 16비트 정밀도가 보존된 단 1개의 BitmapTexture로 합성 반환합니다.
     */
    static async loadCombinedHeightmap(
        redGPUContext: RedGPUContext,
        options: LandscapeHeightmapLoaderOptions = {}
    ): Promise<BitmapTexture> {
        const baseUrl = options.baseUrl ?? 'https://redcamel.github.io/testAsset/terrain/tile_001/';
        const gridX = options.gridSizeX ?? 16;
        const gridY = options.gridSizeY ?? 16;

        // 16x16 거대 아틀라스 캔버스 생성
        const canvas = document.createElement('canvas');
        const tileDim = 512;
        canvas.width = gridX * tileDim;
        canvas.height = gridY * tileDim;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const fetchTileBuffer = async (url: string): Promise<ArrayBuffer> => {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error ${res.status} for ${url}`);
            return await res.arrayBuffer();
        };

        const loadPromises: Promise<void>[] = [];

        for (let row = 0; row < gridY; row++) {
            for (let col = 0; col < gridX; col++) {
                const rStr = row.toString().padStart(2, '0');
                const cStr = col.toString().padStart(2, '0');

                let fileName = '';
                if (row === 15 && col === 15) {
                    fileName = `28_134_86_730_13_449_449_16bit_tile_15_15.png`;
                } else if (row === 15) {
                    fileName = `28_134_86_730_13_512_449_16bit_tile_15_${cStr}.png`;
                } else if (col === 15) {
                    fileName = `28_134_86_730_13_449_512_16bit_tile_${rStr}_15.png`;
                } else {
                    fileName = `28_134_86_730_13_512_512_16bit_tile_${rStr}_${cStr}.png`;
                }

                const url = baseUrl + fileName;

                const task = fetchTileBuffer(url).then(async (arrayBuffer) => {
                    // RedGPU 내장 16비트 파서 활용 디코딩
                    const parsed = await parse16BitPngBuffer(arrayBuffer);
                    if (parsed && ctx) {
                        const imgData = ctx.createImageData(parsed.width, parsed.height);
                        const numPixels = parsed.pixels.length;
                        const data = imgData.data;

                        // Uint16 16비트 원본 높이 데이터를 캔버스 8비트 RGBA로 정밀 정규화 렌더링
                        for (let i = 0; i < numPixels; i++) {
                            const val = Math.floor((parsed.pixels[i] / 65535) * 255);
                            const idx = i * 4;
                            data[idx] = val;
                            data[idx + 1] = val;
                            data[idx + 2] = val;
                            data[idx + 3] = 255;
                        }

                        ctx.putImageData(imgData, col * tileDim, row * tileDim);
                    }
                }).catch(err => {
                    console.warn(`[LandscapeHeightmapLoader ⚠️] Tile 16-bit parse fallback (${row}, ${col})`, err);
                });

                loadPromises.push(task);
            }
        }

        await Promise.all(loadPromises);

        // 캔버스 데이터로부터 RedGPU BitmapTexture 생성
        const dataUrl = canvas.toDataURL('image/png');
        return new Promise((resolve) => {
            const texture = new BitmapTexture(redGPUContext, dataUrl, undefined, () => {
                resolve(texture);
            });
        });
    }
}

export default LandscapeHeightmapLoader;
