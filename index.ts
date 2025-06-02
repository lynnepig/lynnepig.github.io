import { readFile } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { bundle } from 'lightningcss';

const hostname = '127.0.0.1';
const port = 3000;

const fileExtensionToContentType: { [key: string]: string } = {
  css: 'text/css',
  js: 'application/javascript',
  html: 'text/html',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  json: 'application/json',
  txt: 'text/plain',
  ico: 'image/x-icon',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  pdf: 'application/pdf',
  zip: 'application/zip',
  xml: 'application/xml',
  webm: 'video/webm',
  avif: 'image/avif',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  eot: 'application/vnd.ms-fontobject',
  mpeg: 'video/mpeg',
  flv: 'video/x-flv',
  ogg: 'audio/ogg',
  ogv: 'video/ogg',
  webmanifest: 'application/manifest+json',
  csv: 'text/csv',
  less: 'text/css',
  scss: 'text/css',
  sass: 'text/css',
  markdown: 'text/markdown',
  yaml: 'application/x-yaml'
};

function getFilePath(fileName: string): {
  filePath: string;
  contentType: string;
} {
  const parsed = path.parse(fileName);
  const { dir, name, ext } = parsed;

  const finalExtension = (ext || 'html').replace(/^\./, '').toLowerCase();
  const contentType =
    fileExtensionToContentType[finalExtension] ?? 'application/octet-stream';

  return {
    filePath: path.join('src', dir, `${name}.${finalExtension}`),
    contentType
  };
}

const server = http.createServer(async (req, res) => {
  function returnFile(fileName: string): void {
    const { filePath, contentType } = getFilePath(fileName);

    readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error loading ${filePath}: ${err.message}`);
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(data);
      return;
    });
  }
  if (req.url === '/' || req.url === '') {
    returnFile('index.html');
  } else if (req.url === '/styles/styles.css') {
    const { code } = bundle({
      filename: 'src/styles/styles.css',
      minify: true
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/css');
    res.end(code);
  } else if (req.url) {
    const fileName = req.url.slice(1); // Remove leading slash for file name
    returnFile(fileName);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
