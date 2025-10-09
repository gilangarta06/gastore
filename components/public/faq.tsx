"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Headphones } from "lucide-react";

const reasons = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-[#0956C8] dark:text-[#5EA8FF]" />,
    title: "Aman & Terpercaya",
    desc: "Data Anda aman dengan sistem keamanan berlapis yang terjamin.",
  },
  {
    icon: <Zap className="w-8 h-8 text-[#0956C8] dark:text-[#5EA8FF]" />,
    title: "Proses Cepat & Otomatis",
    desc: "Transaksi diproses otomatis dan instan, tanpa menunggu lama.",
  },
  {
    icon: <Headphones className="w-8 h-8 text-[#0956C8] dark:text-[#5EA8FF]" />,
    title: "Dukungan 24 Jam",
    desc: "Tim kami siap membantu Anda kapan pun dibutuhkan.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-3 text-foreground"
          >
            Mengapa Memilih Kami
          </motion.h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Alasan mengapa pelanggan mempercayai layanan digital kami.
          </p>
        </div>

        {/* 3 Cards in a Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-8 bg-card/70 backdrop-blur-sm border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full md:w-1/3"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0956C8]/10 mb-4">
                {reason.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
