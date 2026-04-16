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

        if (text === "/info") {
            await sock.sendMessage(sender, { text: "🤖 Bot aktivdir" });
        }
    });
}

startBot();
