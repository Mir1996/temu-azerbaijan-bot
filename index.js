const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

let warns = {};

const OWNER = "994XXXXXXXXX@c.us";

const badWords = ["söyüş", "fuck", "idiot"];
const groupLinkRegex = /chat\.whatsapp\.com/i;

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("Bot hazırdır!");
});

function warn(user, chat) {
    if (!warns[user]) warns[user] = 0;
    warns[user]++;

    if (warns[user] === 1) chat.sendMessage("⚠️ Xəbərdarlıq 1");
    if (warns[user] === 2) chat.sendMessage("⚠️ Xəbərdarlıq 2");
    if (warns[user] === 3) chat.sendMessage("⛔ Son xəbərdarlıq");
    if (warns[user] >= 4) {
        chat.sendMessage("🚫 Qrupdan çıxarıldın");
        chat.removeParticipants([user]);
    }
}

client.on('message', async msg => {
    const chat = await msg.getChat();
    const sender = msg.author || msg.from;
    let text = msg.body.toLowerCase();

    if (text === "/admin") {
        chat.sendMessage("👑 Admin: Miri Ibrehimov");
    }

    if (text === "/link") {
        chat.sendMessage("🔗 Temu linki hələ əlavə edilməyib");
    }

    if (text === "/qaydalar") {
        chat.sendMessage("📌 Qaydalar: spam, söyüş, link qadağandır");
    }

    if (text === "/info") {
        chat.sendMessage("🤖 Temu Bot aktivdir");
    }

    if (badWords.some(w => text.includes(w))) {
        warn(sender, chat);
    }

    if (groupLinkRegex.test(text)) {
        warn(sender, chat);
    }
});

client.initialize();
