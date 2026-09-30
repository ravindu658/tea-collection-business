import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const FILE_PATH = path.resolve('app.html');

const server = http.createServer((req, res) => {
  fs.readFile(FILE_PATH, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading application');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Tea Collection System live at http://127.0.0.1:${PORT}`);
});
