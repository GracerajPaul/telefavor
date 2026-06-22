// Telefavor Telegram Verification Bot
// Run: node telegram-bot.js
// Requires: BOT_TOKEN env var (from @BotFather)
// Webhook: Your Next.js API at VERIFY_URL

const https = require("https");
const http = require("http");

const BOT_TOKEN = process.env.BOT_TOKEN;
const VERIFY_URL = process.env.VERIFY_URL || "http://localhost:3000/api/verification/verify";
const POLL_INTERVAL = 2000;
let lastUpdateId = 0;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN environment variable is required");
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

    const text = msg.text.trim().toUpperCase();
    const tfMatch = text.match(/^TF-[A-Z0-9]{6}$/);
    if (!tfMatch) continue;

    const from = msg.from;
    const telegramId = from.id;
    const telegramUsername = from.username || "";

    console.log(`📩 Code received: ${text} from @${telegramUsername} (ID: ${telegramId})`);

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
    }
  }
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

  setInterval(poll, POLL_INTERVAL);
  console.log("👂 Listening for verification codes...");
}

main();
