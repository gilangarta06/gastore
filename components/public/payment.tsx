'use client';

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
    <section className="w-full py-16 flex flex-col items-center bg-white dark:bg-black transition-colors duration-700">
      {/* Heading */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          Metode Pembayaran
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Pilih bank atau e-wallet favoritmu
        </p>
      </div>

      {/* Infinite Scroll Atas */}
      <div className="relative w-full overflow-hidden mb-8">
        <div className="flex w-max animate-scroll-left gap-6">
          {[...banks, ...banks].map((bank, index) => (
            <div
              key={`top-${index}`}
              className="flex flex-col items-center justify-center w-40 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-center justify-center w-24 h-14">
                <img
                  src={bank.src}
                  alt={bank.name}
                  className="object-contain w-full h-full"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                {bank.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Bawah (arah berlawanan) */}
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-scroll-right gap-6">
          {[...banks, ...banks].map((bank, index) => (
            <div
              key={`bottom-${index}`}
              className="flex flex-col items-center justify-center w-40 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-center justify-center w-24 h-14">
                <img
                  src={bank.src}
                  alt={bank.name}
                  className="object-contain w-full h-full"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                {bank.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 25s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
