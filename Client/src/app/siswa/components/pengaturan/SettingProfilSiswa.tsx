"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import InfoProfil from "./InfoProfil";
import UbahPassword from "./UbahPassword";
import { useCurrentUser } from "@/lib/hooks/useUser";

export default function SettingProfilSiswa() {

  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="lg:text-3xl text-2xl font-bold flex items-center gap-2 text-gray-800">
        <Settings className="w-7 h-7" />
        Pengaturan Profil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoProfil 
          name={user.name} 
          nisn={user.nisn} 
          nohp={user.nohp || "-"} 
          photo={user.photo}
          rfid={user.rfid?.rfid}
          notifikasi={user.notif_aktif}
        />
        <UbahPassword />
      </div>
    </motion.div>
  );
}
