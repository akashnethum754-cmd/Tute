const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
};

const BLOCKED = new Set(["server.js", "package.json", "package-lock.json"]);

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    const filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT) || BLOCKED.has(path.basename(filePath))) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("<h1>404 - Page not found</h1><a href='/'>Go home</a>");
      }
      const type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      fs.createReadStream(filePath).pipe(res);
    });
  })
  .listen(PORT, "0.0.0.0", () => console.log("Server running on port " + PORT));
