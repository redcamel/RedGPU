import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = Number(process.argv[2]) || 4173;
const rootDir = process.cwd();

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.hdr': 'application/octet-stream',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.bin': 'application/octet-stream',
    '.ktx2': 'image/ktx2',
    '.wgsl': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    let relativePath = decodeURIComponent(reqUrl.pathname);
    if (relativePath.endsWith('/')) {
        relativePath += 'index.html';
    }

    const filePath = path.resolve(rootDir, '.' + relativePath);
    if (!filePath.startsWith(rootDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        const targetPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
        const ext = path.extname(targetPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(targetPath, (readErr, data) => {
            if (readErr) {
                res.writeHead(404);
                res.end('Not Found');
                return;
            }
            res.writeHead(200, {'Content-Type': contentType});
            res.end(data);
        });
    });
});

server.listen(port, '127.0.0.1', () => {
    console.log(`[RedGPU E2E Static Server] Listening on http://127.0.0.1:${port}`);
});
