# BE-PBLIOT

Backend project menggunakan **Express.js** dengan **JavaScript** dan **Prisma** sebagai ORM.

---

## 🚀 Persiapan

1. **Clone repository**
   ```bash
   git clone git@github.com:aliffajriadi/BE-PBLIOT.git
   cd BE-PBLIOT
Copy file environment

Copy file .env dev menjadi .env

Isi value setiap variabel di .env sesuai kebutuhan (contoh: database URL, JWT secret, dll).

bash
Copy code
cp ".env dev" .env
Install dependencies

bash
Copy code
npm install
▶️ Menjalankan Project
Mode Development
bash
Copy code
npm run dev
Mode Production
bash
Copy code
npm start
📂 Struktur Folder
arduino
Copy code
BE/
│── prisma/           # schema & migrations prisma
│── src/
│   ├── config/       # konfigurasi database & lainnya
│   ├── middleware/   # middleware (JWT, role, validasi, dll)
│   ├── modules/      # modul-modul (auth, user, dll)
│   ├── utils/        # helper & external utils
│   └── server.js     # entrypoint aplikasi
│
├── .env              # file konfigurasi environment
├── package.json      # dependencies & scripts
└── README.md         # dokumentasi project
🛠️ Teknologi
Express.js — Web framework

Prisma — ORM untuk database

Node.js — Runtime JavaScript

👥 Catatan untuk Tim
Jangan commit file .env ke repo → pastikan sudah ada di .gitignore.

Setiap update schema Prisma, jalankan:

bash
Copy code
npx prisma migrate dev
Gunakan branch masing-masing saat develop, lalu merge via pull request.
testing