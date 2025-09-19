"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    "What is the structure of the HARVEST FLOW service?",
    "How is HARVEST FLOW different from other lending services?",
    "Can I use HARVEST FLOW if I don’t own any crypto assets?",
    "Can I cancel the lending contract before the end of the term?",
    "How is the lending fee calculated?",
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="px-6 sm:px-12 py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            FROM <br /> SMALL FUNDS <br /> TO <br /> BIG PROPERTIES
          </h1>
          <p className="text-gray-600 max-w-lg">
            We make it possible for anyone to invest in premium real estate with
            small amounts of capital. Through tokenization, you can own a
            fraction of global properties, earn rental yields, and benefit from
            appreciation—all starting with just a few dollars.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700">
            View projects →
          </button>
        </div>

        {/* Right illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src="/image-header.png"
            alt="Hero illustration"
            className="max-h-[400px]"
          />
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="flex justify-center py-6">
        <div className="flex bg-gray-100 rounded-full overflow-hidden">
          {["Projects", "About", "How to start", "FAQs"].map((tab) => (
            <button
              key={tab}
              className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-6 sm:px-12 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured projects</h2>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View more
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden border"
            >
              <img
                src="/project-sample.jpg"
                alt="Project"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2">
                <p className="text-sm text-gray-600">Ho Chi Minh</p>
                <h3 className="text-lg font-bold">VINHOMES GRAND PARK</h3>
                <span className="inline-block text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Residential Home
                </span>
                <div className="grid grid-cols-3 text-sm mt-3">
                  <div>
                    <p className="text-gray-400">Value</p>
                    <p>$1,000</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Yield</p>
                    <p>9.32%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Return</p>
                    <p>10.36%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-500">Available</p>
                  <button className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="px-6 sm:px-12 py-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">About us</h2>
          <p className="text-gray-600">
            Engage in Social Action with an 8% Interest. Connecting with the
            world through cryptocurrency lending.
          </p>
          <p className="text-gray-600">
            HARVEST FLOW is a service that enables social contribution by
            lending cryptocurrency to businesses dedicated to improving the
            world, thereby earning stable income gains while supporting
            impactful initiatives...
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700">
            View projects →
          </button>
        </div>
        <div>
          <img
            src="/project-sample.jpg"
            alt="About us project"
            className="rounded-xl shadow"
          />
        </div>
      </section>

      {/* 3 Steps */}
      <section className="bg-gray-900 text-white px-6 sm:px-12 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Effortless Property Investment in 3 Steps
        </h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Unlock the world of property investment with ease through Landshare
          and RWA tokens. Our simple, 3-step process lets you invest in real
          estate without the complexities of traditional methods.
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { title: "Sign up", desc: "Verify now" },
            { title: "Purchase Tokens", desc: "View details" },
            { title: "Hold & Earn", desc: "Learn more" },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-green-600 rounded-xl p-6 text-black shadow-lg"
            >
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 sm:px-12 py-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="divide-y divide-gray-200 border rounded-lg">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4">
              <button
                onClick={() =>
                  setOpenFAQ(openFAQ === idx ? null : idx)
                }
                className="w-full flex justify-between items-center text-left"
              >
                <span>{faq}</span>
                {openFAQ === idx ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {openFAQ === idx && (
                <p className="mt-2 text-gray-600 text-sm">
                  This is a placeholder answer for: {faq}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
