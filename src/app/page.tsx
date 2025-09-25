"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import MarketplaceSearchBar from "./components/invesment/header";
import LandingPageNavBars from "./components/landingPage/page";
import LandingPagePropertyList from "./components/landingPage/landingPagePropertyList";
import LandingPageGuide from "./components/landingPage/guide";
import AboutUs from "./components/landingPage/aboutUs";
import FAQ from "./components/landingPage/FAQ";
import LogoLoop from "./components/landingPage/LogoLoop";
import PropertyInfoContent from "./components/propertyInfo/PropertyInfoContent";
import { PropertyData } from "@/lib/hooks";

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const infoRef = useRef<HTMLElement | null>(null);

  const handleBuy = (property: PropertyData) => {
    setSelectedProperty(property);
  };

  const closeInfo = () => setSelectedProperty(null);

  // Prevent background scroll when modal open and handle ESC
  useEffect(() => {
    if (selectedProperty) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeInfo();
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [selectedProperty]);

  const imageLogos = [
    { src: "/logo-Vikki.svg", alt: "Vikki", href: "https://company1.com" },
    { src: "/logo-Vietjet.svg", alt: "Vietjet", href: "https://company2.com" },
    { src: "/logo-Superteam.svg", alt: "Superteam", href: "https://company3.com" },
    { src: "/logo-SovicoGroup.svg", alt: "SovicoGroup", href: "https://company3.com" },
    { src: "/logo-NamiFoundation.svg", alt: "NamiFoundation", href: "https://company3.com" },
    { src: "/logo-HDBank.svg", alt: "HDBank", href: "https://company3.com" },
  ];

  return (
    <main className="min-h-screen bg-beige-100 text-gray-900">
      <MarketplaceSearchBar />
      {/* Hero Section */}
      <section className="px-6 sm:px-12 py-16 flex flex-col lg:flex-row items-center justify-between gap-12 bg-darkGreen">
        {/* Left content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-beige-100">
            FROM <br /> SMALL FUNDS <br /> TO <br /> BIG PROPERTIES
          </h1>
          <p className="max-w-lg text-beige-100">
            We make it possible for anyone to invest in premium real estate with
            small amounts of capital. Through tokenization, you can own a
            fraction of global properties, earn rental yields, and benefit from
            appreciation—all starting with just a few dollars.
          </p>
          <button
            onClick={() => {
              window.location.href = "/marketPlace";
            }}
            className="px-6 py-3 bg-beige-100 rounded-lg font-medium shadow hover:bg-beige-300 text-black font-semibold"
          >
            View projects →
          </button>
        </div>

        {/* Right illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src="/image-heroSection.png"
            alt="Hero illustration"
            className="max-h-[400px]"
          />
        </div>
      </section>

      {/* Navigation Tabs */}
      <LandingPageNavBars />

      {/* Featured Projects */}
      <section id="projects" className="px-6 sm:px-12 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured projects</h2>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View more
          </a>
        </div>
        <LandingPagePropertyList onBuy={handleBuy} />
      </section>

      {/* About Us */}
      <section id="about-us">
        <AboutUs />
      </section>

      {/* Guide */}
      <section id="guide">
        <LandingPageGuide />
      </section>

      {/* FAQ */}
      <section id="faq">
        <FAQ />
      </section>

      {/* Property Info Modal */}
      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeInfo();
          }}
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full max-w-7xl mx-4 sm:mx-8 my-12 sm:my-0">
            <button
              onClick={closeInfo}
              className="absolute -top-10 right-0 sm:-top-12 sm:-right-12 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl bg-beige-100">
              <PropertyInfoContent property={selectedProperty} />
            </div>
          </div>
        </div>
      )}

      {/* Sponsor */}
      <section id="sponsor" className="px-6 sm:px-12 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-10 text-green font-bold">
          Sponsored By
        </h2>
        <LogoLoop
          logos={imageLogos}
          speed={120}
          direction="left"
          logoHeight={240}
          gap={60}
          pauseOnHover={false}
          scaleOnHover={false}
          fadeOut={false}
          ariaLabel="Technology partners"
        />
      </section>
    </main>
  );
}
