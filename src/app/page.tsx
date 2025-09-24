"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import MarketplaceSearchBar from "./components/invesment/header";
import LandingPageNavBars from "./components/landingPage/page";
import LandingPagePropertyList from "./components/landingPage/landingPagePropertyList";
import LandingPageGuide from "./components/landingPage/guide";
import AboutUs from "./components/landingPage/aboutUs";
import FAQ from "./components/landingPage/FAQ";
import LogoLoop from "./components/landingPage/LogoLoop";

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    "What is the structure of the HARVEST FLOW service?",
    "How is HARVEST FLOW different from other lending services?",
    "Can I use HARVEST FLOW if I don’t own any crypto assets?",
    "Can I cancel the lending contract before the end of the term?",
    "How is the lending fee calculated?",
  ];
  const imageLogos = [
    {
      src: "/logo-Vikki.svg",
      alt: "Vikki",
      href: "https://company1.com",
    },
    {
      src: "/logo-Vietjet.svg",
      alt: "Vietjet",
      href: "https://company2.com",
    },
    {
      src: "/logo-Superteam.svg",
      alt: "Superteam",
      href: "https://company3.com",
    },
    {
      src: "/logo-SovicoGroup.svg",
      alt: "SovicoGroup",
      href: "https://company3.com",
    },
    {
      src: "/logo-NamiFoundation.svg",
      alt: "NamiFoundation",
      href: "https://company3.com",
    },
    {
      src: "/logo-HDBank.svg",
      alt: "HDBank",
      href: "https://company3.com",
    },
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
      <section className="px-6 sm:px-12 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured projects</h2>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View more
          </a>
        </div>
        <LandingPagePropertyList />
      </section>

      {/* About Us */}
      <AboutUs />

      {/* Guide */}
      <LandingPageGuide />

      {/* FAQ */}
      <FAQ />

      {/*Sponser */}
      <section className="px-6 sm:px-12 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-10 text-green font-bold">Sponsored By</h2>
        <LogoLoop
          logos={imageLogos}
          speed={120}
          direction="left"
          logoHeight={240} // match property card image height
          gap={60} // spacing between logos
          pauseOnHover={false}
          scaleOnHover={false}
          fadeOut={false}
          ariaLabel="Technology partners"
        />
      </section>
    </main>
  );
}
