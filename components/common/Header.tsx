"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { colors } from "@/config/theme";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/career", label: "Career" },
  { href: "/events", label: "Events" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .nav-link:hover span {
            color: ${colors.textPrimary} !important;
          }
        `
      }} />
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/B-F-IMPACT.png"
              alt="IMPACT & Solutions Logo"
              width={150}
              height={50}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group nav-link"
                >
                  <span
                    className="text-sm font-medium transition-colors duration-200"
                    style={{
                      color: active ? colors.textPrimary : "#374151",
                    }}
                  >
                    {link.label}
                  </span>
                  {/* Active underline */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ${
                      active
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                    }`}
                    style={{
                      backgroundColor: colors.primary,
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            style={{
              color: isOpen ? colors.textPrimary : undefined,
            }}
          >
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-100 transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-4"
          }`}
          style={{
            maxHeight: isOpen ? "calc(100vh - 4rem)" : "0",
            overflow: "hidden",
          }}
        >
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-md text-base font-medium transition-all duration-200 text-gray-700 hover:bg-gray-50"
                  style={{
                    color: active ? colors.textPrimary : undefined,
                    backgroundColor: active ? "rgba(0, 10, 45, 0.05)" : undefined,
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <span>{link.label}</span>
                    {active && (
                      <span
                        className="ml-2 h-1 w-1 rounded-full"
                        style={{
                          backgroundColor: colors.primary,
                        }}
                      />
                    )}
                  </div>
                  {active && (
                    <div
                      className="mt-2 h-0.5 rounded-full"
                      style={{
                        backgroundColor: colors.primary,
                        width: "100%",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
    </>
  );
}

