const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DB_PATH = path.join(ROOT_DIR, "data", "db.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { blessingCount: 108, wishes: [], rsvps: [] };
  }
}

function writeDb(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  if (urlPath === "/api/wishes" && req.method === "GET") {
    const db = readDb();
    const approved = (db.wishes || []).filter((w) => w.approved !== false);
    return sendJson(res, 200, { wishes: approved });
  }

  if (urlPath === "/api/wishes" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const name = String(body.name || "").trim().slice(0, 80);
      const message = String(body.message || "").trim().slice(0, 500);
      if (!name || !message) {
        return sendJson(res, 400, { error: "Please provide both your name and a blessing message." });
      }
      const db = readDb();
      const entry = {
        id: "wish-" + Date.now(),
        name,
        message,
        createdAt: new Date().toISOString(),
        approved: true
      };
      db.wishes = [entry, ...(db.wishes || [])];
      writeDb(db);
      return sendJson(res, 201, { wish: entry });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  if (urlPath === "/api/blessings" && req.method === "GET") {
    const db = readDb();
    return sendJson(res, 200, { blessingCount: db.blessingCount || 108 });
  }

  if (urlPath === "/api/blessings" && req.method === "POST") {
    const db = readDb();
    db.blessingCount = (db.blessingCount || 108) + 1;
    writeDb(db);
    return sendJson(res, 200, { blessingCount: db.blessingCount });
  }

  if (urlPath === "/api/rsvp" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const attending = body.attending === true || body.attending === "yes";
      const name = String(body.name || "").trim().slice(0, 100);
      const guests = Math.max(1, Math.min(10, parseInt(body.guests, 10) || 1));
      const contact = String(body.contact || "").trim().slice(0, 120);
      const message = String(body.message || "").trim().slice(0, 500);

      if (!name) {
        return sendJson(res, 400, { error: "Please enter your full name." });
      }
      if (!contact) {
        return sendJson(res, 400, { error: "Please provide an email or phone number." });
      }

      const db = readDb();
      const entry = {
        id: "rsvp-" + Date.now(),
        attending,
        name,
        guests: attending ? guests : 0,
        contact,
        message,
        createdAt: new Date().toISOString()
      };
      db.rsvps = [entry, ...(db.rsvps || [])];
      writeDb(db);
      return sendJson(res, 201, { rsvp: entry });
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }

  let safePath = path.normalize(urlPath === "/" ? "/index.html" : urlPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(ROOT_DIR, safePath);

  if (!fullPath.startsWith(ROOT_DIR) || safePath.includes("data" + path.sep + "db.json")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      return res.end(err.code === "ENOENT" ? "Not found" : "Server error");
    }
    const ext = path.extname(fullPath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Royal Wedding E-Invitation running at http://localhost:${PORT}`);
});
