import mqtt from "mqtt";
import readline from "readline";

const url = "mqtts://api.aliffajriadi.my.id:8883"; // pakai mqtts untuk SSL
const topicPublish = "pbliot/tap";
const topicSubscribe = "pbliot/tap/test";

// opsi koneksi
const options = {
  username: "alif", // ganti sesuai username broker kamu
  password: "123alif", // ganti sesuai password
  rejectUnauthorized: true, // sementara bypass SSL verify
};

// Connect ke broker
const client = mqtt.connect(url, options);

// CLI untuk input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Saat connect
client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  client.subscribe(topicSubscribe, (err) => {
    if (err) {
      console.log("❌ Gagal subscribe:", err);
    } else {
      console.log(`🔔 Subscribed ke "${topicSubscribe}"`);
    }
  });

  promptInput();
});

// Fungsi input
function promptInput() {
  rl.question("Ketik pesan untuk publish: ", (msg) => {
    if (msg.trim() === "") {
      console.log("⚠️ Pesan kosong, coba lagi");
      promptInput();
      return;
    }

    client.publish(topicPublish, JSON.stringify({ message: msg, ruangan: "A2" }), (err) => {
      if (err) {
        console.log("❌ Gagal publish:", err);
      } else {
        console.log(`📤 Pesan "${msg}" terkirim ke "${topicPublish}"`);
      }
      promptInput();
    });
  });
}

// Callback pesan masuk
client.on("message", (recvTopic, message) => {
  console.log(`📥 Pesan diterima di ${recvTopic}: "${message.toString()}"`);
});

client.on("error", (err) => {
  console.error("❌ Error MQTT:", err.message);
});


