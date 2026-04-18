import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data management for chat sessions
  let chatSessions: Record<string, any[]> = {
    "default": [
      { role: 'model', content: '안녕하세요, 선생님. 백엔드 서버에서 관리되는 대화창입니다. 오늘 하루는 어떠셨나요?' }
    ]
  };
  
  let analysisData: Record<string, any> = {
    "default": null
  };

  // API Routes
  app.get("/api/chats", (req, res) => {
    res.json(chatSessions["default"]);
  });

  app.post("/api/chats", (req, res) => {
    const { messages, analysis } = req.body;
    if (Array.isArray(messages)) {
      chatSessions["default"] = messages;
      if (analysis) {
        analysisData["default"] = analysis;
      }
      return res.json({ success: true, messages: chatSessions["default"], analysis: analysisData["default"] });
    }
    res.status(400).json({ error: "Invalid messages format" });
  });

  app.get("/api/analysis", (req, res) => {
    res.json(analysisData["default"] || { categoryCounts: {}, summary: "아직 분석 데이터가 없습니다." });
  });

  app.delete("/api/chats", (req, res) => {
    chatSessions["default"] = [
      { role: 'model', content: '안녕하세요, 선생님. 새로 시작해볼까요? 데이터가 초기화되었습니다.' }
    ];
    analysisData["default"] = null;
    res.json({ success: true, messages: chatSessions["default"] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
