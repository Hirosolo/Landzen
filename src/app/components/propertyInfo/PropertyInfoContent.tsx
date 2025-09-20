import Image from "next/image";

export default function VinhomesGrandPark() {
  const raised = 800000;
  const goal = 1000000;
  const progress = (raised / goal) * 100;

  return (
    <div className="min-h-screen bg-beige-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="col-span-2 space-y-4">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/image-property.png"
              alt="Vinhomes Grand Park"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative w-full h-28 rounded-xl overflow-hidden shadow"
              >
                <Image
                  src={`/image-property.png`}
                  alt={`Thumbnail ${i}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>

          {/* Property Details */}
          <div className="bg-beigi-100 rounded-2xl shadow p-4 space-y-4 text-moss-600">
            <h2 className="text-xl font-semibold">Properties Details</h2>
            <p className="flex items-center space-x-2 text-moss-600">
              <span>📍</span>
              <span>Ho Chi Minh</span>
            </p>
            <div className="flex space-x-3">
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                Residential Home
              </span>
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                3 Bedrooms
              </span>
              <span className="px-3 py-1 bg-moss-600 rounded-full text-sm font-medium text-beige-100">
                2 Bathrooms
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              The Vinhomes Grand Park project in District 9 (Thu Duc City) is a
              mega-urban park of the investor Vingroup owns a prime location at
              Nguyen Xien & Phuoc Thien arterial streets of Long Thanh My ward –
              District 9 – Thu Duc City – Ho Chi Minh City. Along with hundreds
              of perfect utilities with a selling price of only 1.9 billion –
              7.9 billion/apartment, supporting 80% loan with principal grace
              and 0% interest rate, the project has been attracting thousands of
              first-time residents. private and live. The total area of ​​the
              super project is up to 271.8 hectares, providing the market with
              thousands of high-end apartments arranged in 71 high-rise
              apartment towers, with a total of more than 43,500 apartments +
              1600 low-rise houses. floors of the type of townhouses and villas.
              Since the investor had information to launch the market, the
              Vinhome urban area in District 9 – Thu Duc has been highly
              appreciated, receiving the attention of a large number of
              customers as well as investors to find a new product. New products
              for settlement – stable profitable investment. With a large area
              but low construction density, most of the area of ​​the project is
              for green living landscape, utilities and services that meet the
              standard “ALL IN ONE – city in the heart of the city”.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Project Raised */}
          <div className="bg-moss-500 p-4 rounded-2xl shadow space-y-3">
            <h3 className="font-semibold text-lg">Project Raised</h3>
            <div className="w-full bg-[#78787833] rounded-full h-2.5">
              <div
                className="bg-moss-700 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-100">
              {raised.toLocaleString()}/{goal.toLocaleString()}
            </p>
          </div>

          {/* Financial Returns */}
          <div className="bg-moss-500 p-6 rounded-2xl shadow space-y-6">
            <h3 className="font-semibold text-xl text-moss-900">Financial Returns</h3>
            <div className="flex items-center space-x-2">
              <div className="flex w-full rounded-xl overflow-hidden border border-moss-700">
                <input
                  type="number"
                  defaultValue={1}
                  className="w-full p-3 text-lg font-semibold bg-beige-100 focus:outline-none text-moss-700"
                />
                <span className="flex items-center px-4 font-bold text-moss-700 bg-beige-100">
                  NFT
                </span>
              </div>
              <button className="bg-moss-700 text-beige-100 px-6 py-3 rounded-xl font-semibold">
                INVEST
              </button>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-beige-100 text-base">
              <p className="font-semibold">Total Paid</p>
              <p className="text-right">$1,000</p>
              <p className="font-semibold">Monthly Earned</p>
              <p className="text-right">$1,000</p>
              <p className="font-semibold">Annually Earned</p>
              <p className="text-right">$1,000</p>
              <p className="font-semibold">Start Date</p>
              <p className="text-right">TBA</p>
              <p className="font-semibold">End Date</p>
              <p className="text-right">TBA</p>
              <p className="font-semibold">Total Profit</p>
              <p className="text-right">$1,000</p>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-moss-500 p-4 rounded-2xl shadow space-y-4">
            <h3 className="font-semibold text-lg">Investment Details</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">$1,000</p>
                <p className="text-xs text-moss-700">Property Value</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">20</p>
                <p className="text-xs text-moss-700">Total Supply</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">$500</p>
                <p className="text-xs text-moss-700">NFT Price</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">9.32%</p>
                <p className="text-xs text-moss-700">Rental Yield</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">10.36%</p>
                <p className="text-xs text-moss-700">Annual Return</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="font-bold text-moss-700">90 days</p>
                <p className="text-xs text-moss-700">Project Length</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}