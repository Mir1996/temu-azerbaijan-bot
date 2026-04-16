const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth");

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "22.04.4"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("QR READY:", qr);
        }

        if (connection === "open") {
            console.log("BOT ONLINE ✅");
        }

        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;

            console.log("CONNECTION CLOSED:", reason);

            if (reason !== DisconnectReason.loggedOut) {
                console.log("RECONNECTING...");
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

        if (text === "/admin") {
            await sock.sendMessage(sender, { text: "👑 Admin: Miri Ibrehimov" });
        }

        if (text === "/info") {
            await sock.sendMessage(sender, { text: "🤖 Bot işləyir" });
        }
    });
}

startBot();
