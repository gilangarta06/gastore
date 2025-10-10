// components/public/footer.tsx
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { 
      icon: FaInstagram, 
      href: "#", 
      label: "Instagram", 
      hoverColor: "hover:text-pink-500",
      bgHover: "hover:bg-pink-500/10"
    },
    { 
      icon: FaWhatsapp, 
      href: "#", 
      label: "WhatsApp", 
      hoverColor: "hover:text-green-500",
      bgHover: "hover:bg-green-500/10"
    },
    { 
      icon: FaTiktok, 
      href: "#", 
      label: "TikTok", 
      hoverColor: "hover:text-foreground",
      bgHover: "hover:bg-foreground/10"
    },
    { 
      icon: HiMail, 
      href: "#", 
      label: "Email", 
      hoverColor: "hover:text-blue-500",
      bgHover: "hover:bg-blue-500/10"
    },
  ];

  return (
    <footer className="bg-card/50 backdrop-blur-sm relative border-t border-border/40">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  GA Store
                </h2>
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Platform terpercaya untuk produk digital berkualitas dengan layanan terbaik dan harga kompetitif.
              </p>
            </div>
            
            {/* Social Links */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Ikuti Kami</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 text-muted-foreground ${social.hoverColor} ${social.bgHover} border border-border/40 hover:border-primary/40 transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Navigasi",
                links: [
                  { label: "Beranda", href: "#" },
                  { label: "Produk", href: "#" },
                  { label: "Tentang Kami", href: "#" },
                  { label: "Kontak", href: "#" },
                ],
              },
              {
                title: "Bantuan",
                links: [
                  { label: "FAQ", href: "#" },
                  { label: "Cara Pembelian", href: "#" },
                  { label: "Pengembalian", href: "#" },
                  { label: "Lacak Pesanan", href: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Syarat & Ketentuan", href: "#" },
                  { label: "Kebijakan Privasi", href: "#" },
                  { label: "Kebijakan Cookie", href: "#" },
                ],
              },
            ].map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-primary to-blue-500 rounded-full" />
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group"
                      >
                        <span className="w-0 h-[2px] bg-primary group-hover:w-3 transition-all duration-300" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              © {new Date().getFullYear()} GA Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}