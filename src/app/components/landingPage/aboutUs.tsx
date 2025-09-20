"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="bg-[#2B342B] text-white py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center md:text-left">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-12">About us</h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          {/* Left side - Image */}
          <div className="flex justify-center">
            <Image
              src="/image-aboutUs.png" // replace with your image path
              alt="LandZen NFT"
              width={500}
              height={500}
              className="rounded-lg object-contain"
            />
          </div>

          {/* Right side - Text */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold leading-snug">
              Invest with Confidence <br />
              <span className="text-[#E0E0E0]">
                Your Gateway to Secure Real Estate Profits
              </span>
            </h3>
            <p className="mt-6 text-gray-300 leading-relaxed">
              At LandZen, we were founded on a simple belief: the wealth-building
              power of real estate should be accessible to everyone, not just a
              select few. We saw a world of ambitious individuals locked out of
              one of the most stable investment classes. Our mission is to tear
              down those barriers, providing a platform that is not only
              accessible but fundamentally profitable and secure.
            </p>
            <p className="mt-4 text-gray-300 leading-relaxed">
              We are more than a technology platform; we are your partner in
              building long-term wealth on a foundation of trust and tangible
              value.
            </p>

            <button className="mt-8 bg-white text-[#1B231B] px-6 py-3 rounded-md font-semibold shadow-md hover:bg-gray-200 transition">
              Explore now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
