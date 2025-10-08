// 'use client';

// import Image from 'next/image';

// const banks = [
//   { id: 'bca', name: 'BCA', src: 'https://www.bca.co.id/images/logo/bca_logo.png' },
//   { id: 'bni', name: 'BNI', src: 'https://www.bni.co.id/assets/img/logo-bni.svg' },
//   { id: 'mandiri', name: 'Mandiri', src: 'https://www.mandiri.co.id/assets/mandiri/images/logo/mandiri_logo.svg' },
//   { id: 'gopay', name: 'GoPay', src: 'https://gopay.com/images/gopay-logo.svg' },
//   { id: 'ovo', name: 'OVO', src: 'https://ovo.id/images/ovo-logo.svg' },
//   { id: 'dana', name: 'DANA', src: 'https://www.dana.id/images/dana-logo.svg' },
//   { id: 'shopeepay', name: 'ShopeePay', src: 'https://shopeepay.com/images/shopeepay-logo.svg' },
// ];


// export default function PaymentPage() {
//   return (
//     <section className="w-full py-16 flex flex-col items-center bg-white dark:bg-black transition-colors duration-700">
//       {/* Heading */}
//       <div className="text-center mb-12 px-4">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
//           Metode Pembayaran
//         </h1>
//         <p className="text-gray-500 dark:text-gray-400 mt-2">
//           Pilih bank atau e-wallet favoritmu
//         </p>
//       </div>

//       {/* Horizontal Infinite Scroll */}
//       <div className="relative w-full h-[140px] overflow-hidden">
//         <div className="absolute flex flex-row gap-6 animate-scroll-full-screen">
//           {/* Original banks */}
//           {banks.map((bank) => (
//             <div
//               key={bank.id}
//               className="flex flex-col items-center justify-center w-40 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500"
//             >
//               <div className="relative w-24 h-14">
//                 <Image
//                   src={bank.src}
//                   alt={bank.name}
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
//                 {bank.name}
//               </span>
//             </div>
//           ))}

//           {/* Duplicate banks for seamless loop */}
//           {banks.map((bank) => (
//             <div
//               key={bank.id + '-copy'}
//               className="flex flex-col items-center justify-center w-40 h-24 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500"
//             >
//               <div className="relative w-24 h-14">
//                 <Image
//                   src={bank.src}
//                   alt={bank.name}
//                   fill
//                   className="object-contain"
//                 />
//               </div>
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
//                 {bank.name}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes scroll-full-screen {
//           0% {
//             transform: translateX(-100vw);
//           }
//           100% {
//             transform: translateX(-${banks.length * 110 * 2}px);
//           }
//         }

//         .animate-scroll-full-screen {
//           animation: scroll-full-screen 25s linear infinite;
//         }
//       `}</style>
//     </section>
//   );
// }
