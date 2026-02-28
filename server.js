import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: "1mb" }));
app.use(express.static("dist"));

app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: "Failed to reach Anthropic API" });
  }
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "dist" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
