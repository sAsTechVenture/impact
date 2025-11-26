import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { colors } from "@/config/theme";
import { Separator } from "@/components/ui/separator";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/career", label: "Career" },
];

const services = [
  "Annual Maintenance Support",
  "Calibration & Validation",
  "Operation & Maintenance",
  "Breakdown Response Teams",
  "Technical Training Programs",
  "Spare Parts & Consumables",
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer
      className="w-full py-4 sm:py-6 lg:py-8"
      style={{ backgroundColor: colors.black }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Top CTA Bar */}
        <div
          className="w-full py-8 px-4 sm:px-6 lg:px-8 rounded-2xl"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 xl:gap-8">
            {/* Left: Have more questions? */}
            <div className="w-full xl:w-auto xl:flex-shrink-0">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Have more questions?
              </h3>
            </div>

            {/* Center: Phone and Email */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 xl:gap-8 xl:flex-1 xl:justify-center">
              <div className="flex items-center gap-2.5 text-white">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  Call on <span className="font-semibold">+91 9999999999</span>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-white">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  Mail us at <span className="font-semibold">connect@impactsolutions.in</span>
                </span>
              </div>
            </div>

            {/* Right: Feedback Email */}
            <div className="w-full xl:w-auto xl:flex-shrink-0 flex items-start xl:items-center gap-2.5 text-white">
              <Mail className="h-5 w-5 flex-shrink-0 mt-0.5 xl:mt-0" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm leading-relaxed">
                  For dedicated partner support, email us at
                </span>
                <span className="text-sm sm:text-base font-semibold mt-0.5">support@impactsolutions.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Section */}
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{ backgroundColor: colors.gray }}
        >
          <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 xl:gap-12">
              {/* Column 1: Company Info */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col gap-4">
                  {/* Logo Box */}
                  <div className="w-fit">
                    <div className="">
                      <Image
                        src="/logo-redraw-white.png"
                        alt="IMPACT & Solutions Logo"
                        width={160}
                        height={60}
                        className="h-10 sm:h-12 w-auto"
                        priority
                      />
                    </div>
                  </div>
                  {/* <h4 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white mt-2">
                    Impact & Solutions
                  </h4> */}
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-sm">
                    Exclusive distributor for India delivering water-system critical products, clean
                    utility solutions, and end-to-end engineering services with uncompromising quality.
                  </p>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h5 className="text-base sm:text-lg font-semibold text-white mb-5 sm:mb-6">Quick Links</h5>
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm sm:text-base text-white/90 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Our Services */}
              <div>
                <h5 className="text-base sm:text-lg font-semibold text-white mb-5 sm:mb-6">Our Services</h5>
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {services.map((service) => (
                    <li
                      key={service}
                      className="text-sm sm:text-base text-white/90"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Contact Us */}
              <div>
                <h5 className="text-base sm:text-lg font-semibold text-white mb-5 sm:mb-6">Contact Us:</h5>
                <div className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-base text-white/90">
                  <p className="leading-relaxed">
                    Navi Mumbai (Panvel), Maharashtra<br />
                    Serving pharmaceutical, biotech & industrial hubs across India.
                  </p>
                  <p>+91 99999 99999</p>
                  <p>connect@impactsolutions.in</p>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={social.label}
                        href={social.href}
                        className="text-white hover:opacity-70 transition-opacity duration-200"
                        aria-label={social.label}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-5 px-4 sm:px-6 lg:px-8">
            <Separator className="mb-5 bg-white/30" />
            <div className="flex justify-center">
              <p className="text-sm sm:text-base text-white">
                Impact & Solutions · Clean Utility & Water-System Experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

