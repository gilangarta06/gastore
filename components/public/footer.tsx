import React from "react";
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black py-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + Social */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              GA Store
            </h2>
            <div className="flex space-x-6 mt-4 text-gray-500 dark:text-gray-400">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Navigation & Legal */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8 text-gray-600 dark:text-gray-300 mt-8 md:mt-0">
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
                <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-gray-500 dark:text-gray-400">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
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
        <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} GA Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
