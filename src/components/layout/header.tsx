"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#o-que-e", label: "O que é" },
  { href: "#para-quem", label: "Para quem é" },
  { href: "#palestrante", label: "Palestrante" },
  { href: "#evento", label: "Data e Local" },
  { href: "#faq", label: "Dúvidas" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b",
        scrolled ? "border-navy-100 shadow-[0_6px_24px_-12px_rgba(1,33,74,0.15)]" : "border-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[4.5rem] flex items-center justify-between">
        <a href="#topo" onClick={(e) => scrollTo(e, "#topo")} aria-label="Academia RH - início">
          <BrandLogo className="h-8 md:h-9" />
        </a>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-sm font-semibold text-navy-700/80 hover:text-navy transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inscricao"
            onClick={(e) => scrollTo(e, "#inscricao")}
            className="btn-brand text-sm px-5 py-2.5"
          >
            Quero me inscrever
          </a>
        </div>

        <button
          className="md:hidden p-2 text-navy"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-navy-100 px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="text-navy-800 font-semibold py-2.5 px-2 rounded-lg hover:bg-mist"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#inscricao"
              onClick={(e) => scrollTo(e, "#inscricao")}
              className="btn-brand mt-2"
            >
              Quero me inscrever
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
