import {GLTF} from "../GLTF";
import GLTFLoader from "../GLTFLoader";

const getGLTFBuffersResources = (gltfLoader: GLTFLoader, gltfData: GLTF, callback) => {
    const {parsingResult} = gltfLoader
    const {uris} = parsingResult
    const bufferKey = 'buffers';
    const resultContainer = uris[bufferKey]
    const buffers = gltfData.buffers
    const totalBuffers = buffers.length;
    let loadedBuffers = 0;
    buffers.forEach((buffer, bufferIndex) => {
        buffer['_redURIkey'] = bufferKey;
        buffer['_redURIIndex'] = bufferIndex;
        if (buffer.uri instanceof ArrayBuffer) {
            const uriDataView = new DataView(buffer.uri);
            processArrayBuffer(uriDataView);
        } else processNonArrayBuffer(buffer.uri);

        function processArrayBuffer(uriDataView: DataView) {
            loadedBuffers++;
            resultContainer[bufferIndex] = uriDataView;
            checkLoadingStatus();
        }

        function processNonArrayBuffer(uri: string) {
            const tSrc = uri.startsWith('data:') ? uri : gltfLoader.filePath + uri;
            arrayBufferLoader(
                tSrc,
                function (request) {
                    loadedBuffers++;
                    resultContainer[bufferIndex] = new DataView(request);
                    checkLoadingStatus()
                },
                function (request, error) {
                    console.log(request, error);
                }
            );
        }

        function checkLoadingStatus() {
            if (loadedBuffers === totalBuffers) {
                // console.log(`redGLTFLoader['parsingResult']['uris']:`, uris);
                // console.log("uris 로딩현황", loadedBuffers, totalBuffers);
                if (callback) callback();
            }
        }
    });
};
export default getGLTFBuffersResources
const arrayBufferLoader = (url, onSuccess, onError) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            if (onSuccess) {
                onSuccess(data);
            }
        })
        .catch(error => {
            if (onError) {
                onError(error);
            }
        });
}
