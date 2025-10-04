"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          ❓ Frequently Asked Questions
        </h2>

        {/* Border container dengan garis pembatas antar item */}
        <Accordion
          type="single"
          collapsible
          className="w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`} className="px-3 sm:px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-gray-600 dark:text-gray-400 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
