// mqttRoutes.js
// Sistem routing sederhana untuk MQTT, mirip Express Router.
// 
// Fitur utama:
// 1. mqttRoute(topic, handler) → seperti router.get() untuk menangani pesan masuk.
// 2. mqttPublish(topic, message) → seperti res.send() untuk mengirim pesan.
// 3. Listener global yang men-dispatch pesan berdasarkan topic.
//
// Cara pakai:
//    mqttRoute("device/status", (msg, topic) => { ... });
//    mqttPublish("device/status", "OK");
//
// File ini membantu menjaga struktur aplikasi tetap rapi
// dan memisahkan logic MQTT dari module lain.

import client from "./mqttClient.js";

// Menyimpan daftar route/topic dan handler-nya
const routes = {};

// -----------------------------------------------------------------------------
// Registrasi handler untuk topic tertentu (mirip router.get di Express)
// -----------------------------------------------------------------------------
export const mqttRoute = (topic, handler) => {
  routes[topic] = handler;

  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`📡 Subscribed: ${topic}`);
    } else {
      console.error(`❌ Subscribe failed ${topic}:`, err);
    }
  });
};

// -----------------------------------------------------------------------------
// Mengirim pesan ke MQTT broker (mirip res.send)
// -----------------------------------------------------------------------------
export const mqttPublish = (topic, message) => {
  client.publish(topic, message, {}, (err) => {
    if (err) {
      console.error("❌ Publish error:", err);
    }
  });
};

// -----------------------------------------------------------------------------
// Listener global MQTT → men-dispatch pesan ke handler yang sesuai
// -----------------------------------------------------------------------------
client.on("message", (topic, message) => {
  const handler = routes[topic];

  if (handler) {
    handler(message.toString(), topic);
  } else {
    console.log(`⚠️ No handler for topic: ${topic}`);
  }
});
