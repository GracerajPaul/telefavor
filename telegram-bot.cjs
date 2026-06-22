// Telefavor Telegram Verification Bot
// Run: node telegram-bot.js
// Requires: BOT_TOKEN env var (from @BotFather)
// Webhook: Your Next.js API at VERIFY_URL

const https = require("https");
const http = require("http");

const BOT_TOKEN = process.env.BOT_TOKEN;
const VERIFY_URL = process.env.VERIFY_URL;
const POLL_INTERVAL = 2000;
let lastUpdateId = 0;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN environment variable is required");
  process.exit(1);
}

if (!VERIFY_URL) {
  console.error("❌ VERIFY_URL environment variable is required");
  console.error("   Set it to your Vercel API URL, e.g.:");
  console.error("   https://telefavor.vercel.app/api/verification/verify");
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

function apiCall(method, payload, httpMethod) {
  return new Promise((resolve, reject) => {
    const data = payload ? JSON.stringify(payload) : "";
    const url = new URL(`${TELEGRAM_API}/${method}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: httpMethod || (data ? "POST" : "GET"),
      headers: { "Content-Type": "application/json" },
    };
    if (data) options.headers["Content-Length"] = Buffer.byteLength(data);
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); } catch { resolve(null); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function callVerifyApi(code, telegramId, telegramUsername) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ code, telegramId, telegramUsername });
    const url = new URL(VERIFY_URL);
    const mod = url.protocol === "https:" ? https : http;
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
    };
    const req = mod.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(body)); } catch { resolve(null); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function poll() {
  const result = await apiCall("getUpdates", { offset: lastUpdateId + 1, timeout: 30 });
  if (!result?.ok || !result.result) return;

  for (const update of result.result) {
    lastUpdateId = update.update_id;
    const msg = update.message;
    if (!msg?.text) continue;

    const text = msg.text.trim();
    if (text === "/start") {
      await apiCall("sendMessage", {
        chat_id: msg.chat.id,
        text: `🔐 Enter your 6-digit verification code from Telefavor.`,
      });
      continue;
    }
    const codeMatch = text.match(/^\d{6}$/);
    if (!codeMatch) continue;

    const from = msg.from;
    const telegramId = from.id;
    const telegramUsername = from.username || "";

    console.log(`📩 Code received: ${text} from @${telegramUsername} (ID: ${telegramId})`);

    try {
      const verifyResult = await callVerifyApi(text, telegramId, telegramUsername);

      if (verifyResult?.success) {
        await apiCall("sendMessage", {
          chat_id: msg.chat.id,
          text: `✅ Verification successful! Your Telefavor account is now verified.\n\nYou can close this chat.`,
        });
        console.log(`✅ Verified @${telegramUsername}`);
      } else {
        const errorMsg = verifyResult?.error || "Verification failed";
        await apiCall("sendMessage", {
          chat_id: msg.chat.id,
          text: `❌ ${errorMsg}\n\nMake sure you entered the exact code shown on Telefavor.`,
        });
        console.log(`❌ Failed for @${telegramUsername}: ${errorMsg}`);
        if (verifyResult) console.log(`🔍 Raw response:`, JSON.stringify(verifyResult));
      }
    } catch (err) {
      console.error(`🔴 API call error for @${telegramUsername}:`, err.message);
      await apiCall("sendMessage", {
        chat_id: msg.chat.id,
        text: `❌ Could not reach the verification server. Please try again later.`,
      });
    }
  }
}

const PORT = process.env.PORT || 3001;

function startHealthServer() {
  const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", bot: "TelefavorVerificationBot" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "not_found" }));
    }
  });
  server.listen(PORT, () => {
    console.log(`🌐 Health server listening on port ${PORT}`);
  });
}

async function main() {
  const me = await apiCall("getMe");
  if (me?.ok) {
    console.log(`🤖 Bot running: @${me.result.username}`);
    console.log(`🔗 Webhook URL: ${VERIFY_URL}`);
  } else {
    console.error("❌ Failed to connect to Telegram API. Check BOT_TOKEN.");
    process.exit(1);
  }

  startHealthServer();
  setInterval(poll, POLL_INTERVAL);
  console.log("👂 Listening for verification codes...");
}

main();
