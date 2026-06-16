import http from "http";
import fs from "fs";
import path from "path";
import url from "url";

const WIDGETS_PATH =
  "D:\\arcgis-experience-builder-1.20\\client\\your-extensions\\widgets";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = url.parse(req.url, true);

  // POST /write-file
  if (req.method === "POST" && parsed.pathname === "/write-file") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { widgetName, filePath, content } = JSON.parse(body);
        const fullPath = path.join(WIDGETS_PATH, widgetName, filePath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `✅ Saved: ${fullPath}` }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // GET /read-file?widgetName=X&filePath=Y
  if (req.method === "GET" && parsed.pathname === "/read-file") {
    try {
      const { widgetName, filePath } = parsed.query;
      const fullPath = path.join(WIDGETS_PATH, widgetName, filePath);
      if (!fs.existsSync(fullPath)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `File not found: ${fullPath}` }));
        return;
      }
      const content = fs.readFileSync(fullPath, "utf-8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ content }));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(3333, () => {
  console.log("✅ File server running at http://localhost:3333");
});