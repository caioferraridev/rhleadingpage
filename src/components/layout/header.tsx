"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#o-que-e", label: "O que é" },
  { href: "#para-quem", label: "Para quem é" },
  { href: "#palestrante", label: "Palestrante" },
  { href: "#evento", label: "Data e Local" },
  { href: "#inscricao", label: "Inscrição" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
        scrolled ? "shadow-md" : "shadow-sm"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="#topo" onClick={(e) => scrollTo(e, "#topo")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            Academia <span className="text-amber-500">RH</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inscricao"
            onClick={(e) => scrollTo(e, "#inscricao")}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-amber-500/25"
          >
            Quero me inscrever
          </a>
        </div>

        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="text-slate-600 font-medium py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#inscricao"
              onClick={(e) => scrollTo(e, "#inscricao")}
              className="bg-amber-500 text-white text-center font-bold px-5 py-3 rounded-lg"
            >
              Quero me inscrever
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
