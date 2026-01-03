#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// --- PROTOTIPE FUNGSI ---
void setup_wifi();
void callback(char *topic, byte *payload, unsigned int length);
void reconnect();
void scrollText(int row, String message, int delayTime, int lcdColumns);

// Konfigurasi WiFi & MQTT
const char *ssid = "Polibatam-GU-L7";
const char *password = "";
const char *mqtt_server = "mqtt.aliffajriadi.my.id";
const int mqtt_port = 8883;
const char *mqtt_user = "alif";
const char *mqtt_pass = "123alif";
const char *topicPublish = "pbliot/tap";
const char *topicSubscribe = "pbliot/tap/test";
const char *ruangan = "Lab Fisika";

// Pin Hardware
#define SS_PIN 5
#define RST_PIN 4
#define BUZZER_PIN 16

MFRC522 mfrc522(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);
WiFiClientSecure espClient;
PubSubClient client(espClient);

// Variabel Kontrol Tampilan
unsigned long lastResponseTime = 0;
bool showingResponse = false;
String currentStatus = "";

void setup()
{
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  lcd.print("System Booting");

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  SPI.begin(18, 19, 13, 5);
  mfrc522.PCD_Init();

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setBufferSize(512);
}

void setup_wifi()
{
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  lcd.clear();
  lcd.print("WiFi: OK");
}

void callback(char *topic, byte *payload, unsigned int length)
{
  String message = "";
  for (int i = 0; i < length; i++)
  {
    message += (char)payload[i];
  }

  Serial.println("MQTT In: " + message);

  // Set status untuk ditampilkan
  currentStatus = message;
  showingResponse = true;
  lastResponseTime = millis(); // Mulai hitung waktu tunggu balik ke awal

  digitalWrite(BUZZER_PIN, HIGH);
  delay(150);
  digitalWrite(BUZZER_PIN, LOW);
}

// Fungsi untuk teks berjalan jika lebih dari 16 karakter
void scrollText(int row, String message, int delayTime, int lcdColumns)
{
  if (message.length() <= lcdColumns)
  {
    lcd.setCursor(0, row);
    lcd.print(message);
    // Bersihkan sisa karakter di belakang jika ada
    for (int i = message.length(); i < lcdColumns; i++)
      lcd.print(" ");
  }
  else
  {
    // Logika Scroll
    static unsigned long lastScroll = 0;
    static int pos = 0;
    if (millis() - lastScroll > delayTime)
    {
      String displayStr = message + "   "; // Tambah spasi di akhir
      lcd.setCursor(0, row);
      lcd.print(displayStr.substring(pos, pos + lcdColumns));
      pos++;
      if (pos > displayStr.length() - lcdColumns)
        pos = 0;
      lastScroll = millis();
    }
  }
}

void reconnect()
{
  while (!client.connected())
  {
    String clientId = "ESP32-RFID-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_user, mqtt_pass))
    {
      client.subscribe(topicSubscribe);
      lcd.clear();
      lcd.print("Ready...");
    }
    else
    {
      delay(5000);
    }
  }
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  // Logika tampilan LCD
  if (showingResponse)
  {
    lcd.setCursor(0, 0);
    lcd.print("Status Server:  ");
    scrollText(1, currentStatus, 300, 16);

    // Jika sudah lewat 5 detik, balik ke tampilan awal
    if (millis() - lastResponseTime > 5000)
    {
      showingResponse = false;
      lcd.clear();
    }
  }
  else
  {
    lcd.setCursor(0, 0);
    lcd.print("  SILAHKAN TAP  ");
    lcd.setCursor(0, 1);
    lcd.print("  KARTU ANDA    ");
  }

  // Cek RFID
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial())
  {
    return;
  }

  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidString.toUpperCase();

  // Cara menggabungkan variabel ke dalam string JSON
  String jsonPayload = "{\"message\":\"" + uidString + "\", \"ruangan\":\"" + String(ruangan) + "\"}";

  lcd.clear();
  lcd.print("Memproses...");
  client.publish(topicPublish, jsonPayload.c_str());

  delay(1000);
}