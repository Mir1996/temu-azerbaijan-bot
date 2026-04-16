const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;

        if (!text) return;

        if (text === "/admin") {
            await sock.sendMessage(sender, { text: "👑 Admin: Miri Ibrehimov" });
        }

        if (text === "/link") {
            await sock.sendMessage(sender, { text: "🔗 Temu linki: https://your-link.com" });
        }

        if (text === "/qaydalar") {
            await sock.sendMessage(sender, {
                text: `📌 Qaydalar:
1. Spam qadağandır
2. Söyüş qadağandır
3. Link spam qadağandır`
            });
        }

        if (text === "/info") {
            await sock.sendMessage(sender, {
                text: "🤖 Temu Azerbaijan Bot aktivdir"
            });
        }
    });
}

startBot();
