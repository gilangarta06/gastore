// components/public/payment.tsx
"use client";

import { CreditCard, Wallet } from "lucide-react";

const banks = [
  { id: 'bca', name: 'BCA', src: 'https://www.bca.co.id/images/logo/bca_logo.png' },
  { id: 'bni', name: 'BNI', src: 'https://www.bni.co.id/assets/img/logo-bni.svg' },
  { id: 'mandiri', name: 'Mandiri', src: 'https://www.mandiri.co.id/assets/mandiri/images/logo/mandiri_logo.svg' },
  { id: 'gopay', name: 'GoPay', src: 'https://gopay.com/images/gopay-logo.svg' },
  { id: 'ovo', name: 'OVO', src: 'https://ovo.id/images/ovo-logo.svg' },
  { id: 'dana', name: 'DANA', src: 'https://www.dana.id/images/dana-logo.svg' },
  { id: 'shopeepay', name: 'ShopeePay', src: 'https://shopeepay.com/images/shopeepay-logo.svg' },
];

export default function PaymentPage() {
  return (
    <section className="w-full relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pembayaran Aman</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
            Metode Pembayaran
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih metode pembayaran favorit Anda untuk pengalaman berbelanja yang mudah dan aman
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          {/* Scroll Atas - Bank */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Transfer Bank</h3>
            </div>
            
            <div className="relative w-full overflow-hidden">
              <div className="flex w-max animate-scroll-left gap-4">
                {[...banks.slice(0, 3), ...banks.slice(0, 3)].map((bank, index) => (
                  <div
                    key={`bank-${index}`}
                    className="group flex flex-col items-center justify-center min-w-[140px] h-28 glass-card rounded-xl border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-20 h-12 mb-2">
                      <img
                        src={bank.src}
                        alt={bank.name}
                        className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class="text-2xl font-bold text-primary">${bank.name}</div>`;
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {bank.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Scroll Bawah - E-Wallet */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Wallet className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">E-Wallet</h3>
            </div>
            
            <div className="relative w-full overflow-hidden">
              <div className="flex w-max animate-scroll-right gap-4">
                {[...banks.slice(3), ...banks.slice(3)].map((bank, index) => (
                  <div
                    key={`wallet-${index}`}
                    className="group flex flex-col items-center justify-center min-w-[140px] h-28 glass-card rounded-xl border-border/40 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-20 h-12 mb-2">
                      <img
                        src={bank.src}
                        alt={bank.name}
                        className="object-contain w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class="text-2xl font-bold text-blue-500">${bank.name}</div>`;
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      {bank.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-left {
          animation: scroll-left 20s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 20s linear infinite;
        }
      `}</style>
    </section>
  );
}