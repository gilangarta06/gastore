// components/public/footer.tsx
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-background pt-14 pb-12 relative overflow-hidden rounded-t-[3rem] border-t border-border">
      {/* Garis Biru Melengkung */}
      <div className="absolute top-0 left-0 w-full h-3 bg-[#0956C8] dark:bg-[#5EA8FF] rounded-t-[3rem]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + Instagram */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">GA Store</h2>
            <div className="flex mt-4 text-muted-foreground">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-[#E1306C] transition-colors duration-300"
              >
                <FaInstagram size={28} />
              </a>
            </div>
          </div>

          {/* Navigation & Legal */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8 text-muted-foreground mt-8 md:mt-0">
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
                title: "Legal",
                links: [
                  { label: "Terms of Service", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-muted-foreground">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="hover:text-[#0956C8] dark:hover:text-[#5EA8FF] transition-colors duration-300"
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

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} GA Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}