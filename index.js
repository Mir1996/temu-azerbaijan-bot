const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("📱 QR CODE hazırdır (terminaldə görünəcək)");
        }

        if (connection === "open") {
            console.log("✅ BOT BAĞLANDI VƏ İŞLƏYİR");
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            console.log("❌ Bağlandı, yenidən qoşulur...");

            if (shouldReconnect) {
                startBot();
            }
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        const sender = msg.key.remoteJid;

        if (!text) return;

        const command = text.toLowerCase();

        if (command === "/admin") {
            await sock.sendMessage(sender, {
                text: "👑 Admin: Miri Ibrehimov"
            });
        }

        if (command === "/link") {
            await sock.sendMessage(sender, {
                text: "🔗 Temu linki hələ əlavə edilməyib"
            });
        }

        if (command === "/qaydalar") {
            await sock.sendMessage(sender, {
                text:
`📌 Qaydalar:
1. Söyüş qadağandır
2. Spam qadağandır
3. Link spam qadağandır
4. Qarşılıqlı dəstək məcburidir`
            });
        }

        if (command === "/info") {
            await sock.sendMessage(sender, {
                text: "🤖 Temu Azerbaijan Bot aktivdir"
            });
        }
    });
}

startBot();
