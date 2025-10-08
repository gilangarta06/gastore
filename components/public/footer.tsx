// components/public/footer.tsx
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

export default function Footer() {
  const socialLinks = [
    { icon: FaInstagram, href: "#", label: "Instagram", hoverColor: "hover:text-pink-500" },
    { icon: FaWhatsapp, href: "#", label: "WhatsApp", hoverColor: "hover:text-green-500" },
    { icon: FaTiktok, href: "#", label: "TikTok", hoverColor: "hover:text-black dark:hover:text-white" },
    { icon: HiMail, href: "#", label: "Email", hoverColor: "hover:text-blue-500" },
  ];

  return (
    <footer className="bg-background relative">
      {/* Modern gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                GA Store
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Your one-stop destination for quality products and exceptional shopping experience.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`text-muted-foreground ${social.hoverColor} transition-all duration-300 hover:scale-110`}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Navigation",
                links: [
                  { label: "Home", href: "#" },
                  { label: "Products", href: "#" },
                  { label: "About Us", href: "#" },
                  { label: "Contact", href: "#" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "FAQ", href: "#" },
                  { label: "Shipping Info", href: "#" },
                  { label: "Returns", href: "#" },
                  { label: "Track Order", href: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Terms of Service", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Cookie Policy", href: "#" },
                ],
              },
            ].map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
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
          <div className="flex justify-center items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} GA Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}