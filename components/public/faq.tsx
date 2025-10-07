// components/public/faq.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Apa itu layanan ini?",
    answer:
      "Kami menyediakan berbagai layanan digital seperti AI, musik, streaming, dan lainnya dengan harga terjangkau.",
  },
  {
    question: "Bagaimana cara membeli produk?",
    answer:
      "Pilih produk yang ingin dibeli, lalu ikuti instruksi checkout. Anda bisa melakukan pembayaran melalui metode yang tersedia.",
  },
  {
    question: "Apakah akun bisa dipakai lebih dari satu orang?",
    answer:
      "Tergantung jenis produk. Beberapa layanan bisa digunakan bersama, namun sebagian lain hanya untuk 1 user.",
  },
  {
    question: "Bagaimana jika stok habis?",
    answer:
      "Jika stok habis, produk tidak bisa dibeli sementara waktu. Silakan tunggu hingga stok tersedia kembali.",
  },
];

export default function FAQ() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0956C8]/10 mb-4">
              <HelpCircle className="w-8 h-8 text-[#0956C8] dark:text-[#5EA8FF]" />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold mb-3 text-foreground"
            >
              Frequently Asked Questions
            </motion.h2>
            <p className="text-muted-foreground max-w-md">
              Jawaban cepat untuk pertanyaan yang paling sering ditanyakan pelanggan kami.
            </p>
          </div>

          {/* Accordion Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Accordion
              type="single"
              collapsible
              className="w-full divide-y divide-border border border-border rounded-2xl bg-card/70 backdrop-blur-sm shadow-md"
            >
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="px-6">
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold py-4 text-foreground hover:text-[#0956C8] dark:hover:text-[#5EA8FF] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}