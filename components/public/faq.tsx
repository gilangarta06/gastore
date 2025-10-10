// components/public/faq.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Headphones, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Aman & Terpercaya",
    desc: "Data Anda aman dengan sistem keamanan berlapis yang terjamin.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Proses Cepat & Otomatis",
    desc: "Transaksi diproses otomatis dan instan, tanpa menunggu lama.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Headphones,
    title: "Dukungan 24 Jam",
    desc: "Tim kami siap membantu Anda kapan pun dibutuhkan.",
    gradient: "from-primary to-blue-500",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Keunggulan Kami</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            Mengapa Memilih Kami?
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Alasan mengapa ribuan pelanggan mempercayai layanan digital kami
          </p>
        </motion.div>

        {/* 3 Cards in a Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="group h-full glass-card border-border/40 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
                <CardContent className="p-6 sm:p-8 space-y-4 text-center relative overflow-hidden">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon container */}
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} p-[2px] group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                        <reason.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.desc}
                  </p>

                  {/* Decorative line */}
                  <div className="pt-4">
                    <div className={`h-1 w-0 group-hover:w-full mx-auto rounded-full bg-gradient-to-r ${reason.gradient} transition-all duration-500`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}