// mqttRoutes.js
// File ini mendaftarkan semua route/topic MQTT yang digunakan aplikasi.
// Mirip seperti router Express, namun untuk MQTT.
//
// Cara kerja:
// 1. mqttRoute("topic", handler) → melakukan subscribe ke topic tersebut
// 2. Ketika ada pesan masuk, handler akan dijalankan
//
// File ini memetakan topic `pbliot/tap` ke controller tapAbsen.

import { mqttRoute } from "../mqttRouter.js";
import * as controller from "./mqttController.js";

// Route untuk menangani event tap RFID
mqttRoute(process.env.MQTT_ROUTE, controller.tapAbsen);
