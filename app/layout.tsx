// // app/layout.tsx - TANPA ThemeProvider
// import './globals.css';

// export default function RootLayout({ 
//   children 
// }: { 
//   children: React.ReactNode 
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         {children}
//       </body>
//     </html>
//   );
// }

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "GA Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
