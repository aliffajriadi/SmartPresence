"use client"

import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Clock,
  Clipboard,
  Bell,
  Users,
  CheckCircle,
  Calculator,
  MapPin,
  ArrowRight,
  ArrowUp,
  Star,
  Mail,
  Phone,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#about", label: "About" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Image
            src="/LOGO.png"
            alt="SmartPresence Logo"
            width={160}
            height={40}
            className="cursor-pointer h-10 w-auto"
            onClick={() => router.push("/")}
          />

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
          href="/login"
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            Login
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border">
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => router.push("/login")}
                className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold"
              >
                Login
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Hero Section
const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-primary/5 to-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Sistem Absensi Pintar
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              <span className="italic text-primary">Discipline</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">with </span>
              <span className="text-primary">SmartPresence</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">everyday</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">
              Smart System for School Attendance Needs. Solusi modern untuk manajemen kehadiran sekolah yang efisien.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all hover:shadow-xl hover:shadow-primary/25 flex items-center justify-center gap-2">
                Mulai Sekarang
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all">
                Pelajari Lebih
              </button>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="relative">
            <div className="bg-background/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-border">
              <div className="space-y-4">
                {/* Status Card */}
                <div className="flex items-center gap-4 bg-muted/50 rounded-2xl p-4">
                  <div className="bg-primary rounded-xl p-3">
                    <Clipboard className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="h-2.5 bg-muted rounded-full w-3/4 mb-2" />
                    <div className="h-2 bg-muted rounded-full w-1/2" />
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>

                {/* Mini Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-2xl p-4 text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">08:00</div>
                    <div className="text-xs text-muted-foreground">Check-in Time</div>
                  </div>
                  <div className="bg-muted/50 rounded-2xl p-4 text-center">
                    <Calculator className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">245</div>
                    <div className="text-xs text-muted-foreground">Total Siswa</div>
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">Attendance Rate</span>
                    <span className="text-2xl font-bold">98%</span>
                  </div>
                  <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-foreground rounded-full w-[98%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              Live Sync
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  )
}

// Features Section
const Features = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Visi Pendidikan Cerdas",
      description: "Simbol branding produk smart presence dalam dunia pendidikan modern dan inovatif.",
    },
    {
      icon: <Clipboard className="w-8 h-8" />,
      title: "Sistem Absensi Digital",
      description: "Mengubah absensi manual menjadi sistem digital yang efisien dan terintegrasi.",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifikasi Otomatis",
      description: "Notifikasi otomatis kepada orang tua, memberikan ketenangan pikiran dan kenyamanan.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">Smart Presence</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">For your easier Attendance Solution</p>
        </div>

        {/* Visual Connector */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="bg-background rounded-xl p-4 shadow-xl">
              <Clipboard className="w-10 h-10 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-primary-foreground/50" />
              <div className="w-3 h-3 bg-primary-foreground rounded-full animate-pulse" />
              <div className="w-12 h-0.5 bg-primary-foreground/50" />
            </div>
            <div className="bg-background rounded-xl p-4 shadow-xl">
              <Bell className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-background rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 rounded-xl p-4 inline-block mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Section
const About = () => {
  const benefits = [
    { icon: <CheckCircle className="w-5 h-5" />, label: "Akurat" },
    { icon: <Zap className="w-5 h-5" />, label: "Efisien" },
    { icon: <Shield className="w-5 h-5" />, label: "Terintegrasi" },
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <BarChart3 className="w-4 h-4" />
              Tentang Kami
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Apa itu SmartPresence?</h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Kami menyediakan platform absensi terpadu yang fleksibel. Dengan teknologi kami, observasi siswa terekam
              dengan akurat, mempermudah monitoring untuk orang tua, dan efisiensi waktu untuk guru.
            </p>

            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  {benefit.icon}
                  <span>{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Card */}
          <div className="bg-gradient-to-br from-muted to-background rounded-3xl p-8 border border-border shadow-xl">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="bg-background rounded-2xl p-6 shadow-lg text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Guru</p>
              </div>

              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                </div>
                <div className="absolute inset-0 w-12 h-12 bg-primary/50 rounded-full animate-ping" />
              </div>

              <div className="bg-background rounded-2xl p-6 shadow-lg text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Orang Tua</p>
              </div>
            </div>

            <div className="bg-background rounded-2xl p-6 text-center shadow-lg">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-3">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="font-bold text-foreground text-lg">Kolaborasi Aktif</p>
              <p className="text-muted-foreground text-sm mt-1">Mendukung Pembelajaran Anak</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Daftar Sekolah",
      description: "Daftarkan sekolah Anda dengan mudah dan cepat.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "02",
      title: "Setup Sistem",
      description: "Konfigurasi sesuai kebutuhan sekolah Anda.",
      icon: <Clipboard className="w-6 h-6" />,
    },
    {
      number: "03",
      title: "Mulai Absensi",
      description: "Guru langsung melakukan absensi digital.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      number: "04",
      title: "Pantau & Lapor",
      description: "Notifikasi real-time untuk orang tua.",
      icon: <Bell className="w-6 h-6" />,
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Bagaimana Cara Kerja <span className="text-primary">SmartPresence?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proses yang sederhana dan intuitif untuk memulai sistem absensi digital
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-6 z-0" />
              )}

              <div className="bg-background rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all h-full relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                  <div className="bg-primary rounded-lg p-2.5 text-primary-foreground group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all hover:shadow-xl hover:shadow-primary/25 flex items-center gap-2">
            Mulai Sekarang
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const Testimonials = () => {
  const testimonials = [
    {
      name: "Ibu Siti Nurhaliza",
      role: "Kepala Sekolah",
      school: "SD Negeri 01 Jakarta",
      content:
        "SmartPresence telah mengubah cara kami mengelola absensi. Sistem ini sangat efisien dan mudah digunakan.",
      rating: 5,
    },
    {
      name: "Bapak Ahmad Wijaya",
      role: "Guru Kelas",
      school: "SMP Negeri 05 Bandung",
      content:
        "Notifikasi otomatis kepada orang tua sangat membantu meningkatkan transparansi antara sekolah dan keluarga.",
      rating: 5,
    },
    {
      name: "Ibu Dewi Lestari",
      role: "Orang Tua",
      school: "Pengguna dari Surabaya",
      content:
        "Saya bisa memantau kehadiran anak saya secara real-time. Sangat membantu untuk memastikan anak hadir di sekolah.",
      rating: 5,
    },
  ]

  const stats = [
    { value: "500+", label: "Sekolah Terdaftar" },
    { value: "50K+", label: "Siswa Terpantau" },
    { value: "98%", label: "Kepuasan Pengguna" },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Apa Kata Pengguna Kami?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ribuan sekolah telah mempercayai SmartPresence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic leading-relaxed">&quot;
{testimonial.content}&quot;
</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-primary rounded-2xl p-8 text-center text-primary-foreground hover:opacity-95 transition-all"
            >
              <div className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</div>
              <p className="text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer Component
const Footer = () => {
  const footerLinks = {
    Produk: ["Fitur Absensi", "Notifikasi", "Laporan"],
    Perusahaan: ["Tentang Kami", "Blog", "Karir"],
    Legal: ["Privasi", "Syarat & Ketentuan", "Kontak"],
  }

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <Image src="/logo_darkmode.png" alt="SmartPresence Logo" width={160} height={40} className="h-10 w-auto" />
            <p className="text-primary-foreground/80 text-lg max-w-md">Smart System for School Attendance Needs</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <MapPin className="w-5 h-5" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@smartpresence.id</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
                <span>+62 812 3456 7890</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Lokasi Kami</h3>
            <div className="w-full h-48 bg-primary-foreground/10 rounded-2xl overflow-hidden border border-primary-foreground/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0577989797284!2d104.04588167319703!3d1.1187258622788472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98921856ddfab%3A0xf9d9fc65ca00c9d!2sPoliteknik%20Negeri%20Batam!5e0!3m2!1sid!2sid!4v1761019956028!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-bold mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center pt-8 border-t border-primary-foreground/20">
            <p className="text-sm text-primary-foreground/70">© 2025 SmartPresence. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Scroll to Top Button
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300)
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

// Main Component
export default function SmartPresenceHomepage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <Testimonials />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
