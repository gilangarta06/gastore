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
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-zinc-950 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#005EE8]/10 mb-4">
            <HelpCircle className="w-8 h-8 text-[#005EE8]" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 dark:text-white"
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
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
            className="w-full divide-y divide-gray-200 dark:divide-zinc-800 border border-gray-200 dark:border-zinc-800 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm shadow-md"
          >
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="px-3 sm:px-6">
                <AccordionTrigger
                  className="text-left text-base sm:text-lg font-semibold py-4 text-gray-900 dark:text-gray-100
                  hover:text-[#005EE8] transition-colors"
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-400 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
