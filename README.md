# 🎓 SmartPresence

**RFID-Based Smart Student Access System with Web Monitoring and Daily Activity Tracking**

![Preview Aplikasi](poster.png)

---

## 👥 Team Information

**Project Code:** IFPagi3C-2

**Project Leader:** Muhamad Yuki (3312401023)

**Team Members:**
- **Muhamad Yuki** - Activity Diagram, RPP, Report, Frontend
- **Alif Fajriadi** - ERD, RPP, Report, Backend
- **Naylah Amirah Az Zikra** - Use Case, Sequence Diagram, Frontend, Presentation
- **Muhammad Raihan Fauzan** - Wireframe, RPP, Report, Presentation, Frontend, IoT

**Institution:** Politeknik Negeri Batam - Informatics Engineering Study Program

**Project Supervisor:** Muchamad Fajri Amirul Nasrullah, S.ST., M.Sc

**Advisors:**
- Nur Cahyono Kushardianto, S.Si., M.T., M.Sc (Agile Innovation Project & IoT Elective)
- Hajrul Khaira, S.Tr.Kom (IoT Elective)
- Nadya Satya Handayani, M.Kom (Software Engineering & Human-Computer Interaction)
- Yeni Rokhayati, S.Si., M.Sc (Statistics)
- Sri Rahayu, M.Pd (Civic Education)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Background](#background)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Hardware Requirements](#hardware-requirements)
- [Functional Requirements](#functional-requirements)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

SmartPresence is an innovative RFID-based attendance and access control system specifically designed for educational institutions. This comprehensive solution integrates IoT hardware with modern web technologies to provide real-time monitoring of student presence, automated access control, and comprehensive daily activity tracking.

The system transforms traditional manual attendance processes into an automated, transparent, and efficient digital solution that benefits schools, teachers, students, and parents alike.

### Problem Statement

Traditional manual attendance systems face several critical challenges:
- Time-consuming manual recording processes
- Prone to data manipulation and human error
- Difficult to perform real-time recapitulation
- Lack of transparency for parents
- No systematic tracking of daily student activities
- Delayed reporting (weekly or monthly compilation)

### Our Solution

SmartPresence addresses these challenges through:
- **Automated RFID-based attendance** - Students tap RFID cards for instant recording
- **Real-time web monitoring** - Live dashboard accessible by all stakeholders
- **WhatsApp notifications** - Instant alerts sent to parents
- **Comprehensive activity tracking** - Entry/exit times automatically logged
- **Multi-role access** - Separate interfaces for Admin, Teachers, and Students
- **Detailed reporting** - Export capabilities in PDF and Excel formats

---

## 📖 Background

Student attendance recording is a critical administrative activity in schools. However, many educational institutions still rely on manual processes using signature sheets or manual recording by duty teachers. This method has various weaknesses including data manipulation risks, lengthy recapitulation times, and difficulty in real-time access by school officials and parents.

With the advancement of Internet of Things (IoT) technology, RFID-based access control systems are being implemented across various fields, including education. RFID technology enables automatic individual identification through radio waves without requiring physical contact. By leveraging RFID, attendance recording can be faster, more accurate, and more efficient.

Beyond attendance recording, schools and parents also need daily student activity monitoring systems to ensure discipline and safety. Through integration between RFID-based Smart Access devices and Web Monitoring, attendance and activity data can be accessed in real-time, making student supervision more transparent and measurable.

---

## ✨ Key Features

### 🔐 RFID-Based Access Control
- Automatic student identification via RFID cards
- Each student has a unique RFID UID
- Fast and contactless attendance recording
- Automated validation and data logging

### 📊 Real-Time Web Monitoring Dashboard
- **Admin Dashboard:**
  - Manage student, teacher, and class data
  - View comprehensive attendance reports
  - Generate PDF and Excel exports
  - System-wide monitoring and control
  
- **Teacher Dashboard:**
  - Open attendance sessions using RFID
  - View real-time student attendance lists
  - Access attendance history by period
  - Monitor class-specific statistics

- **Student Dashboard:**
  - View personal attendance history
  - Track attendance status (Present/Late/Absent)
  - Access profile settings
  - Review activity logs

### 📱 WhatsApp Integration
- Automatic notifications sent to parents
- Real-time attendance alerts
- Customizable notification settings
- Instant communication channel

### 📈 Comprehensive Reporting
- Daily, weekly, and monthly attendance reports
- Attendance statistics and analytics
- Punctuality analysis
- Export functionality (PDF, Excel)
- Customizable report periods

### 🎯 Activity Tracking
- Entry and exit time logging
- Attendance status determination based on time rules
- Complete activity history
- Transparent monitoring for all stakeholders

### 🔒 Security & Authentication
- Secure login system with OTP verification
- Password recovery mechanism
- Role-based access control (Admin, Teacher, Student)
- Activity logging for accountability

---

## 🏗 System Architecture

The SmartPresence system consists of several integrated components working together to provide seamless attendance management:

```
┌─────────────────────────────────────────────────────────────┐
│                      STUDENT WITH RFID CARD                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  RFID Reader  │
                 │    RC522      │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │     ESP32     │
                 │  Microcontrl  │
                 └───────┬───────┘
                         │ WiFi
                         ▼
        ┌────────────────────────────────┐
        │       API Server               │
        │     (Express.js/Node.js)       │
        └────────┬───────────────┬───────┘
                 │               │
                 ▼               ▼
         ┌───────────┐   ┌──────────────┐
         │  MySQL    │   │  WhatsApp    │
         │ Database  │   │    API       │
         └─────┬─────┘   └──────────────┘
               │
               ▼
     ┌─────────────────────┐
     │   Web Dashboard     │
     │  (Nextjs)           │
     └─────────────────────┘
               │
     ┌─────────┴──────────┬──────────┐
     │                    │          │
     ▼                    ▼          ▼
┌─────────┐        ┌──────────┐  ┌────────┐
│  Admin  │        │ Teacher  │  │Student │
│Dashboard│        │Dashboard │  │Dashboard│
└─────────┘        └──────────┘  └────────┘
```

### System Flow

1. **Student arrives** and taps RFID card on the reader
2. **RFID Reader (RC522)** reads the unique UID from the card
3. **ESP32 microcontroller** receives the UID and sends data to server via WiFi
4. **API Server** validates the UID and records attendance in database
5. **System** determines attendance status (Present/Late) based on time rules
6. **WhatsApp notification** is automatically sent to parents
7. **Dashboard** updates in real-time showing current attendance
8. **Data** is stored for reporting and historical analysis

---

## 🛠 Technologies Used

### Hardware Components
- **RFID Reader:** RC522 Module (13.56MHz)
- **Microcontroller:** ESP32 (WiFi-enabled)
- **RFID Cards/Tags:** 13.56MHz passive tags
- **Power Supply:** 5V/3.3V power adapter
- **Additional Components:** Buzzer, LED indicators, Jumper wires

### Software Stack

**Backend:**
- Node.js (Runtime environment)
- Express.js (Web framework)
- MySQL (Database management)
- JWT (Authentication)
- Bcrypt (Password hashing)

**Frontend:**
- HTML5, CSS3, JavaScript
- React.js (Optional framework)
- Responsive design principles
- Chart.js (Data visualization)

**IoT Communication:**
- WiFi connectivity (ESP32)
- HTTP/HTTPS protocols
- RESTful API architecture

**External Services:**
- WhatsApp Business API (Notifications)
- SMTP (Email notifications)

### Development Tools
- Arduino IDE (ESP32 programming)
- Visual Studio Code (Code editor)
- Postman (API testing)
- Git (Version control)

---

## 🔧 Hardware Requirements

### Component List

| Component | Specification | Quantity | Purpose |
|-----------|--------------|----------|---------|
| RFID Reader Module | RC522 13.56MHz | 1 | Read RFID card UIDs |
| ESP32 Development Board | WiFi-enabled | 1 | IoT controller and WiFi communication |
| RFID Cards/Tags | 13.56MHz Passive | As needed | Student identification |
| Buzzer | 5V Active | 1 | Audio feedback |
| LED Indicators | 5mm (Red, Green) | 2 | Visual feedback |
| Breadboard | Standard size | 1 | Component assembly |
| Jumper Wires | Male-to-Male/Female | Set | Connections |
| Power Supply | 5V 2A USB | 1 | Power the ESP32 |
| Resistors | 220Ω | 2 | LED current limiting |

### Wiring Diagram

```
RFID RC522 → ESP32
------------------------
SDA  → GPIO 5
SCK  → GPIO 18
MOSI → GPIO 23
MISO → GPIO 19
IRQ  → Not connected
GND  → GND
RST  → GPIO 22
3.3V → 3.3V

Additional Components:
- Buzzer → GPIO 4
- Green LED → GPIO 2
- Red LED → GPIO 15
```

---

## 📋 Functional Requirements

| Code | Description |
|------|-------------|
| FR-01 | User login to the system |
| FR-02 | User logout from the system |
| FR-03 | Password recovery with OTP verification |
| FR-04 | Admin manages teacher data (add, edit, delete) |
| FR-05 | Admin manages student data (add, edit, delete) |
| FR-06 | Admin changes account password via settings |
| FR-07 | Teacher opens class attendance session using RFID |
| FR-08 | Student performs attendance using RFID card |
| FR-09 | System reads and validates RFID card UID |
| FR-10 | System automatically records student attendance time |
| FR-11 | System determines attendance status based on time |
| FR-12 | System sends attendance notification via WhatsApp |
| FR-13 | User views attendance data and reports by period |
| FR-14 | User exports attendance data to PDF and Excel |
| FR-15 | User views account activity logs |
| FR-16 | Teacher and Student manage profile settings |

---

## 📥 Installation Guide

### Prerequisites

```bash
# Required software
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Arduino IDE (v1.8 or higher)
- Git
```

### Step 1: Hardware Setup

1. Connect RFID RC522 module to ESP32 following the wiring diagram
2. Connect buzzer and LED indicators to designated GPIO pins
3. Upload firmware to ESP32:
   ```bash
   # Open Arduino IDE
   # Install ESP32 board support
   # Install RFID library (MFRC522)
   # Open firmware file from /hardware/firmware/
   # Configure WiFi credentials
   # Upload to ESP32
   ```

### Step 2: Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE smartpresence;

# Import schema
mysql -u root -p smartpresence < database/schema.sql

# Create database user (optional)
CREATE USER 'smartpresence'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON smartpresence.* TO 'smartpresence'@'localhost';
FLUSH PRIVILEGES;
```

### Step 3: Backend Installation

```bash
# Clone repository
git clone https://github.com/yourusername/smartpresence.git
cd smartpresence

# Install backend dependencies
cd backend
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your configurations:
# - Database credentials
# - JWT secret key
# - WhatsApp API credentials
# - Server port

# Run database migrations
npm run migrate

# Start backend server
npm start
# or for development
npm run dev
```

### Step 4: Frontend Installation

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Configure API endpoint
# Edit src/config/api.js with your backend URL

# Start development server
npm start

# Build for production
npm run build
```

### Step 5: WhatsApp Integration

1. Register for WhatsApp Business API
2. Obtain API credentials
3. Configure webhook URL in .env file
4. Test notification sending

---

## 🚀 Usage

### For Administrators

**Initial Setup:**
1. Login to admin dashboard at `http://localhost:3000/admin`
2. Configure system settings:
   - Set school time rules (start time, late threshold)
   - Configure notification templates
   - Set up school calendar
3. Add teacher accounts and assign roles
4. Add student data and link RFID cards
5. Create class groups and assign students

**Daily Operations:**
- Monitor real-time attendance dashboard
- View current day statistics
- Check late arrivals and absences
- Respond to system alerts
- Generate and export reports

**Data Management:**
- Update student/teacher information
- Manage RFID card assignments
- Archive graduated student data
- Backup database regularly

### For Teachers

**Starting the Day:**
1. Login to teacher dashboard
2. Open attendance session for your class
3. Verify RFID reader is active
4. Monitor students as they tap their cards

**During School Hours:**
- View real-time attendance list
- Check for absent students
- Mark manual attendance if needed
- Review student statistics

**End of Day:**
- Close attendance session
- Export class attendance report
- Review any attendance issues

### For Students

**Daily Attendance:**
1. Approach RFID reader at school entrance
2. Tap your RFID card on the reader
3. Wait for confirmation:
   - Green LED + beep = Successfully recorded
   - Red LED + error beep = Card not recognized
4. Proceed to class

**Using Dashboard:**
1. Login to student portal
2. View your attendance history
3. Check attendance percentage
4. Update profile information
5. View notifications and announcements

### For Parents

**Monitoring:**
1. Receive WhatsApp notifications when:
   - Child arrives at school
   - Child leaves school
   - Child is marked late
   - Child is absent
2. Login to parent portal (if available)
3. View child's attendance history
4. Download attendance reports

---

## 📁 Project Structure

```
smartpresence/
├── hardware/
│   ├── firmware/
│   │   ├── smartpresence.ino        # ESP32 main firmware
│   │   ├── config.h                 # WiFi and API configuration
│   │   └── rfid_handler.h           # RFID reading functions
│   ├── schematics/
│   │   ├── wiring_diagram.png
│   │   └── circuit_design.fzz
│   └── README.md
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── attendanceController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Attendance.js
│   │   └── Class.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── attendance.js
│   │   ├── students.js
│   │   └── reports.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── whatsappService.js
│   │   └── notificationService.js
│   ├── config/
│   │   └── database.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Teacher/
│   │   │   ├── Student/
│   │   │   └── Common/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AttendanceReport.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_students.sql
│   │   └── 003_create_attendance.sql
│   └── seeds/
│       └── sample_data.sql
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── HARDWARE_SETUP.md
│   ├── USER_MANUAL.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── images/
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

---

## 🧪 Testing

### Black Box Testing

System functionality testing was performed to ensure all features work as expected:

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| User login with valid credentials | Successfully logged in | ✅ Pass |
| User login with invalid credentials | Error message displayed | ✅ Pass |
| RFID card scan | Attendance recorded in database | ✅ Pass |
| WhatsApp notification | Message sent to parent | ✅ Pass |
| Export to PDF | Report downloaded | ✅ Pass |
| Export to Excel | Spreadsheet downloaded | ✅ Pass |

### Usability Testing

User satisfaction testing was conducted with:
- 5 administrators
- 10 teachers
- 30 students

**Results:**
- Average satisfaction score: 4.5/5
- System ease of use: 4.6/5
- Feature completeness: 4.3/5

---

## 🎯 Project Deliverables

1. ✅ Complete source code (Hardware & Software)
2. ✅ Comprehensive documentation
3. ✅ User manual and video tutorials
4. ✅ System testing reports
5. ✅ Presentation materials
6. ✅ Intellectual Property registration documents
7. ✅ Final project report

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

**Team Leader:** Muhamad Yuki (3312401023)

**Project Supervisor:** Muchamad Fajri Amirul Nasrullah, S.ST., M.Sc

**Institution:** Politeknik Negeri Batam  
Informatics Engineering Study Program  
Batam, Riau Islands, Indonesia

**Project Repository:** [GitHub](https://github.com/yourusername/smartpresence)  
**Documentation:** [Wiki](https://github.com/yourusername/smartpresence/wiki)  
**Issue Tracker:** [Issues](https://github.com/yourusername/smartpresence/issues)

---

## 🙏 Acknowledgments

We would like to express our gratitude to:

- **Politeknik Negeri Batam** - For providing facilities and support
- **All advisors and lecturers** - For guidance and valuable feedback
- **Partner schools** - For cooperation in system implementation
- **Parents and students** - For participation in testing phase
- **Open-source community** - For valuable tools and libraries

---

## 📚 References

- Arifin et al. (2020). RFID-Based Student Attendance System Using Arduino Uno
- Sari & Nugroho (2021). Employee Attendance Monitoring System Based on RFID and SMS Gateway
- Prasetyo et al. (2022). Smart Attendance System Using ESP32 and Firebase
- Al-Saqqa et al. (2020). Agile Software Development Methodologies

---

<div align="center">

**Made with ❤️ by Team IFPagi3C-2**

**Politeknik Negeri Batam - 2025**

⭐ Star this repository if you find it helpful!

</div>